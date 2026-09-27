/**
 * EncodeEdge Durable Storage Engine (IndexedDB + StorageManager API)
 * 
 * Solves the 5MB quota and "best-effort" silent eviction vulnerabilities of localStorage
 * by backing student progress, lesson notes, and quiz submissions with IndexedDB and 
 * requesting permanent, non-evictable storage via `navigator.storage.persist()`.
 */

const DB_NAME = 'encodeedge_storage_v1';
const STORE_NAME = 'keyval';
const DB_VERSION = 1;

// In-memory cache for instant synchronous access (prevents UI flicker)
const memCache = new Map<string, any>();
let dbPromise: Promise<IDBDatabase> | null = null;
let isInitialized = false;

/**
 * Open or initialize the IndexedDB instance
 */
function getDB(): Promise<IDBDatabase> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('IndexedDB is not available in SSR'));
  }

  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        console.warn('[Storage] IndexedDB failed to open, falling back to localStorage', request.error);
        reject(request.error);
      };
    } catch (e) {
      reject(e);
    }
  });

  return dbPromise;
}

/**
 * Check if the current origin has been granted durable, non-evictable persistence.
 */
export async function isPersistenceGranted(): Promise<boolean> {
  if (typeof window === 'undefined' || !navigator.storage || !navigator.storage.persisted) {
    return false;
  }
  try {
    return await navigator.storage.persisted();
  } catch {
    return false;
  }
}

/**
 * Request permanent storage from the browser to prevent eviction under disk pressure.
 */
export async function requestPersistence(): Promise<boolean> {
  if (typeof window === 'undefined' || !navigator.storage || !navigator.storage.persist) {
    return false;
  }
  try {
    const isPersisted = await navigator.storage.persist();
    if (isPersisted) {
      window.dispatchEvent(new CustomEvent('ee_storage_persisted', { detail: { isPersisted: true } }));
    }
    return isPersisted;
  } catch (err) {
    console.warn('[Storage] Failed to request persistent storage:', err);
    return false;
  }
}

/**
 * Query origin storage quota and usage estimates.
 */
export async function getStorageEstimate(): Promise<{
  usageMB: number;
  quotaMB: number;
  percentUsed: number;
  isPersisted: boolean;
}> {
  const isPersisted = await isPersistenceGranted();

  if (typeof window === 'undefined' || !navigator.storage || !navigator.storage.estimate) {
    return { usageMB: 0.1, quotaMB: 5, percentUsed: 2, isPersisted };
  }

  try {
    const estimate = await navigator.storage.estimate();
    const usageMB = parseFloat(((estimate.usage || 0) / (1024 * 1024)).toFixed(2));
    const quotaMB = parseFloat(((estimate.quota || 1024 * 1024 * 100) / (1024 * 1024)).toFixed(2));
    const percentUsed = quotaMB > 0 ? parseFloat(((usageMB / quotaMB) * 100).toFixed(2)) : 0;

    return { usageMB, quotaMB, percentUsed, isPersisted };
  } catch {
    return { usageMB: 0.1, quotaMB: 50, percentUsed: 0.2, isPersisted };
  }
}

/**
 * Automatically migrate all relevant keys from localStorage into IndexedDB.
 */
async function autoMigrateFromLocalStorage(): Promise<void> {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;

  try {
    const db = await getDB();
    const keysToMigrate: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (
        key.startsWith('lms_') ||
        key.startsWith('course_') ||
        key.startsWith('assignment_') ||
        key.startsWith('completedTopics_') ||
        key.startsWith('learningTopics_') ||
        key.startsWith('starredTopics_') ||
        key.startsWith('skippedTopics_') ||
        key.startsWith('roadmap_') ||
        key.startsWith('ee_')
      )) {
        keysToMigrate.push(key);
      }
    }

    if (keysToMigrate.length === 0) return;

    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    for (const key of keysToMigrate) {
      const raw = localStorage.getItem(key);
      if (raw !== null) {
        try {
          const parsed = JSON.parse(raw);
          store.put(parsed, key);
          memCache.set(key, parsed);
        } catch {
          store.put(raw, key);
          memCache.set(key, raw);
        }
      }
    }
  } catch (err) {
    console.warn('[Storage] Migration from localStorage skipped or failed:', err);
  }
}

/**
 * Initialize storage: preload cache, request persistence, and sync keys
 */
export async function initDurableStorage(): Promise<void> {
  if (isInitialized || typeof window === 'undefined') return;
  isInitialized = true;

  // 1. Preload from localStorage into memory cache immediately for fast sync access
  if (typeof localStorage !== 'undefined') {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k) {
        const val = localStorage.getItem(k);
        try {
          memCache.set(k, JSON.parse(val || ''));
        } catch {
          memCache.set(k, val);
        }
      }
    }
  }

  // 2. Request browser storage persistence in the background
  requestPersistence().catch(() => {});

  // 3. Hydrate & sync from IndexedDB
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const getAllReq = store.getAll();
    const getAllKeysReq = store.getAllKeys();

    await new Promise<void>((resolve) => {
      tx.oncomplete = () => {
        const keys = getAllKeysReq.result as string[];
        const values = getAllReq.result;
        keys.forEach((key, idx) => {
          memCache.set(key, values[idx]);
        });
        resolve();
      };
      tx.onerror = () => resolve();
    });

    // 4. Perform auto-migration
    await autoMigrateFromLocalStorage();
  } catch {
    // Graceful fallback to memCache/localStorage
  }
}

/**
 * Core Persistent Storage Object
 */
export const persistentStorage = {
  /**
   * Synchronous get (reads from in-memory cache, falls back to localStorage)
   */
  getSync<T = any>(key: string, defaultValue?: T): T | undefined {
    if (memCache.has(key)) {
      return memCache.get(key) as T;
    }
    if (typeof localStorage !== 'undefined') {
      try {
        const val = localStorage.getItem(key);
        if (val !== null) {
          try {
            const parsed = JSON.parse(val);
            memCache.set(key, parsed);
            return parsed;
          } catch {
            memCache.set(key, val);
            return val as unknown as T;
          }
        }
      } catch {
        // ignore
      }
    }
    return defaultValue;
  },

  /**
   * Asynchronous get from durable IndexedDB
   */
  async get<T = any>(key: string, defaultValue?: T): Promise<T | undefined> {
    if (memCache.has(key)) {
      return memCache.get(key) as T;
    }

    try {
      const db = await getDB();
      return new Promise<T | undefined>((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(key);

        req.onsuccess = () => {
          const val = req.result !== undefined ? req.result : defaultValue;
          if (req.result !== undefined) {
            memCache.set(key, req.result);
          }
          resolve(val);
        };
        req.onerror = () => resolve(persistentStorage.getSync(key, defaultValue));
      });
    } catch {
      return persistentStorage.getSync(key, defaultValue);
    }
  },

  /**
   * Set value in memory, localStorage, and IndexedDB
   */
  async set<T = any>(key: string, value: T): Promise<void> {
    // 1. Immediate memory cache
    memCache.set(key, value);

    // 2. Synchronous localStorage write for instant backward compatibility
    if (typeof localStorage !== 'undefined') {
      try {
        const serialized = typeof value === 'string' ? value : JSON.stringify(value);
        localStorage.setItem(key, serialized);
      } catch {
        // quota exceeded on localStorage is silently absorbed since IndexedDB will save it
      }
    }

    // 3. Durable IndexedDB write
    try {
      const db = await getDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.put(value, key);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn(`[Storage] Failed to write key "${key}" to IndexedDB`, err);
    }

    // 4. Dispatch unified event for reactive UI updates
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ee_storage_change', {
        detail: { key, value }
      }));
    }
  },

  /**
   * Remove item from all storage tiers
   */
  async remove(key: string): Promise<void> {
    memCache.delete(key);

    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.removeItem(key);
      } catch {
        // ignore
      }
    }

    try {
      const db = await getDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(key);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn(`[Storage] Failed to delete key "${key}" from IndexedDB`, err);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ee_storage_change', {
        detail: { key, value: null }
      }));
    }
  },

  /**
   * List all stored keys
   */
  async keys(): Promise<string[]> {
    try {
      const db = await getDB();
      return new Promise<string[]>((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAllKeys();
        req.onsuccess = () => resolve((req.result as string[]) || Array.from(memCache.keys()));
        req.onerror = () => resolve(Array.from(memCache.keys()));
      });
    } catch {
      return Array.from(memCache.keys());
    }
  },

  /**
   * Export entire learner data to a downloadable JSON string
   */
  async exportBackup(): Promise<string> {
    const keys = await this.keys();
    const backup: Record<string, any> = {};

    for (const key of keys) {
      backup[key] = await this.get(key);
    }

    return JSON.stringify({
      version: 1,
      timestamp: new Date().toISOString(),
      origin: typeof window !== 'undefined' ? window.location.origin : 'EncodeEdge',
      data: backup
    }, null, 2);
  },

  /**
   * Restore learner data from an exported JSON string
   */
  async importBackup(jsonString: string): Promise<{ success: boolean; importedCount: number }> {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || !parsed.data) {
        throw new Error('Invalid backup file format');
      }

      const entries = Object.entries(parsed.data);
      for (const [key, value] of entries) {
        await this.set(key, value);
      }

      return { success: true, importedCount: entries.length };
    } catch (err) {
      console.error('[Storage] Failed to import backup:', err);
      return { success: false, importedCount: 0 };
    }
  }
};

// Automatically run initialization on client load
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initDurableStorage());
  } else {
    initDurableStorage();
  }
}
