/**
 * Cryptographic Certificate Security & Verification Engine
 * 
 * Protects EncodeEdge credentials against URL tampering, spoofing, and forgery.
 * Uses SHA-256 HMAC tokens with a server-side private secret key.
 */

// Secret key for HMAC signing (uses server environment secret if defined, with application salt)
export const CERTIFICATE_SECRET = 
  (typeof process !== 'undefined' && process.env?.CERTIFICATE_SECRET) ||
  'ee_sec_cert_integrity_v1_8f9a2b4c7d1e0f3a6b5c8d2e4f7a1b9c';

export interface CertificateSigningPayload {
  certId: string;
  studentName: string;
  courseId: string;
  issueDate?: string;
  grade?: string;
}

/**
 * Normalize input string to prevent whitespace or case mismatches
 */
export function normalizeSecurityField(val: string): string {
  return (val || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Deterministic message builder for HMAC signing
 */
export function buildCertificateSigningMessage(payload: CertificateSigningPayload): string {
  const normId = normalizeSecurityField(payload.certId);
  const normStudent = normalizeSecurityField(payload.studentName);
  const normCourse = normalizeSecurityField(payload.courseId);
  const normDate = normalizeSecurityField(payload.issueDate || '');
  const normGrade = normalizeSecurityField(payload.grade || 'pass with distinction');

  return `ee:cert:v1:${normId}:${normStudent}:${normCourse}:${normDate}:${normGrade}`;
}

/**
 * Generate a cryptographic HMAC-SHA256 signature
 */
export async function signCertificatePayload(
  payload: CertificateSigningPayload,
  customSecret?: string
): Promise<string> {
  const secret = customSecret || CERTIFICATE_SECRET;
  const message = buildCertificateSigningMessage(payload);

  const encoder = new TextEncoder();
  const key = await globalThis.crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signatureBuffer = await globalThis.crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(message)
  );

  const hashArray = Array.from(new Uint8Array(signatureBuffer));
  // 32-character hex representation of HMAC
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 32);
}

/**
 * Verify if the provided signature matches the payload
 */
export async function verifyCertificateSignature(
  payload: CertificateSigningPayload,
  providedSignature?: string | null,
  customSecret?: string
): Promise<boolean> {
  if (!providedSignature || !payload.certId || !payload.studentName || !payload.courseId) {
    return false;
  }

  try {
    const expectedSig = await signCertificatePayload(payload, customSecret);
    return expectedSig.toLowerCase() === providedSignature.trim().toLowerCase();
  } catch (err) {
    console.error('[CertificateSecurity] Verification error:', err);
    return false;
  }
}

/**
 * Helper to construct the complete, tamper-proof verification URL
 */
export function buildVerifiedCertificateUrl(
  origin: string,
  payload: CertificateSigningPayload,
  signature: string
): string {
  const base = origin.replace(/\/+$/, '');
  const query = new URLSearchParams({
    student: payload.studentName.trim(),
    course: payload.courseId.trim(),
    date: (payload.issueDate || '').trim(),
    grade: (payload.grade || 'With Distinction').trim(),
    sig: signature,
  });

  return `${base}/verify/${encodeURIComponent(payload.certId)}?${query.toString()}`;
}
