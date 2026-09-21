import React, { useState } from 'react';
import { Cpu, ArrowRight, CornerDownRight, Check, AlertCircle, RefreshCw } from 'lucide-react';

type ScenarioType = 'interning' | 'mutable_default' | 'refcount';

export const MemoryExplorer: React.FC = () => {
  const [scenario, setScenario] = useState<ScenarioType>('interning');

  // Scenario 1 state
  const [intVal, setIntVal] = useState<number>(256);

  // Scenario 2 state
  const [defaultCalls, setDefaultCalls] = useState<number[]>([1]);

  // Scenario 3 state
  const [refVars, setRefVars] = useState<{ b: boolean; inList: boolean }>({ b: true, inList: false });

  const isInterned = intVal >= -5 && intVal <= 256;

  // Compute reference count for Scenario 3
  let refCount = 1; // base var 'a'
  if (refVars.b) refCount++;
  if (refVars.inList) refCount++;

  return (
    <div className="rounded-3xl border border-border/80 bg-card p-6 md:p-8 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              Systems Lab
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1 font-semibold">
              <Cpu className="w-3.5 h-3.5 text-amber-500" />
              CPython Memory Model
            </span>
          </div>
          <h3 className="text-xl font-bold font-display text-foreground mt-1">
            CPython Stack &amp; Heap Pointer Explorer
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Explore how CPython manages memory pointers, cached singletons, and reference counting.
          </p>
        </div>

        {/* Scenario Selector */}
        <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-xl border border-border/60">
          <button
            onClick={() => setScenario('interning')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
              scenario === 'interning' 
                ? 'bg-card text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Integer Interning
          </button>
          <button
            onClick={() => setScenario('mutable_default')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
              scenario === 'mutable_default' 
                ? 'bg-card text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Mutable Default Trap
          </button>
          <button
            onClick={() => setScenario('refcount')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
              scenario === 'refcount' 
                ? 'bg-card text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Reference Counting
          </button>
        </div>
      </div>

      {/* Scenario 1: Integer Interning */}
      {scenario === 'interning' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 p-4 rounded-2xl bg-muted/20 border border-border/60">
            <div className="space-y-1">
              <span className="text-xs font-bold text-foreground">Select an Integer value to evaluate:</span>
              <p className="text-[11px] text-muted-foreground">
                CPython pre-allocates an internal cache for integers between <code className="text-foreground">[-5, 256]</code>.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                {[10, 256, 257, 1000].map(num => (
                  <button
                    key={num}
                    onClick={() => setIntVal(num)}
                    className={`text-xs font-mono font-bold px-3 py-1.5 rounded-lg border transition-all ${
                      intVal === num 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'bg-card text-foreground border-border hover:bg-muted'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Visual Memory Representation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-muted/10 border border-border/80">
            {/* Stack Frame */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Stack (Namespace Pointers)
              </span>
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-card border border-border flex items-center justify-between font-mono text-xs">
                  <span className="font-bold text-primary">var a</span>
                  <span className="text-muted-foreground flex items-center gap-1">
                    0x{isInterned ? 'CAFE00' : 'A10048'} <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-card border border-border flex items-center justify-between font-mono text-xs">
                  <span className="font-bold text-primary">var b</span>
                  <span className="text-muted-foreground flex items-center gap-1">
                    0x{isInterned ? 'CAFE00' : 'B20092'} <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>

            {/* Heap Objects */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Heap (PyObject Allocations)
              </span>
              {isInterned ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1 font-mono text-xs">
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                    <span>PyLongObject (Shared Cached Singleton)</span>
                    <span>0xCAFE00</span>
                  </div>
                  <div className="text-muted-foreground">ob_refcnt: 184 (shared by runtime)</div>
                  <div className="text-foreground font-bold">ob_ival: {intVal}</div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 font-mono text-xs space-y-1">
                    <div className="flex justify-between text-amber-600 dark:text-amber-400 font-bold">
                      <span>PyLongObject #1</span>
                      <span>0xA10048</span>
                    </div>
                    <div className="text-foreground">ob_ival: {intVal}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 font-mono text-xs space-y-1">
                    <div className="flex justify-between text-amber-600 dark:text-amber-400 font-bold">
                      <span>PyLongObject #2</span>
                      <span>0xB20092</span>
                    </div>
                    <div className="text-foreground">ob_ival: {intVal}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Code Execution Truth Table */}
          <div className="p-4 rounded-xl bg-card border border-border/80 font-mono text-xs space-y-2">
            <div>a = {intVal}; b = {intVal}</div>
            <div className="flex items-center gap-6 pt-1">
              <span>a == b: <strong className="text-emerald-600 dark:text-emerald-400">True</strong> (Values are equal)</span>
              <span>
                a is b: <strong className={isInterned ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                  {isInterned ? 'True' : 'False'}
                </strong> ({isInterned ? 'Same memory address' : 'Distinct heap allocations'})
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Scenario 2: Mutable Default Argument Trap */}
      {scenario === 'mutable_default' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 p-4 rounded-2xl bg-muted/20 border border-border/60">
            <div className="space-y-1">
              <span className="text-xs font-bold text-foreground">Function Definition:</span>
              <pre className="text-xs font-mono text-primary font-bold">def add_item(val, target_list=[]): target_list.append(val)</pre>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setDefaultCalls(prev => [...prev, prev.length + 1])}
                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                + Call add_item()
              </button>
              <button
                onClick={() => setDefaultCalls([1])}
                className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-muted/10 border border-border/80 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Function Object `__defaults__` Tuple in Heap Memory (Address: 0x7FFF98)
            </div>

            <div className="p-4 rounded-xl bg-card border border-border space-y-2 font-mono text-xs">
              <div className="flex justify-between items-center text-muted-foreground">
                <span>PyListObject (Stored in function definition object)</span>
                <span className="text-rose-500 font-bold">{defaultCalls.length} items accumulated!</span>
              </div>
              <div className="text-base font-bold text-primary">
                [{defaultCalls.join(', ')}]
              </div>
            </div>

            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>The Trap:</strong> Default parameter expressions are evaluated only ONCE when the function definition is executed, NOT every time the function is invoked!
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Scenario 3: Reference Counting */}
      {scenario === 'refcount' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 p-4 rounded-2xl bg-muted/20 border border-border/60">
            <div className="space-y-1">
              <span className="text-xs font-bold text-foreground">Reference Toggles:</span>
              <p className="text-[11px] text-muted-foreground">Toggle variables pointing to the underlying object.</p>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer font-semibold">
                <input 
                  type="checkbox" 
                  checked={refVars.b} 
                  onChange={(e) => setRefVars(prev => ({ ...prev, b: e.target.checked }))}
                  className="w-4 h-4 accent-primary" 
                />
                <span>b = a</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer font-semibold">
                <input 
                  type="checkbox" 
                  checked={refVars.inList} 
                  onChange={(e) => setRefVars(prev => ({ ...prev, inList: e.target.checked }))}
                  className="w-4 h-4 accent-primary" 
                />
                <span>my_list = [a]</span>
              </label>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border/80 font-mono text-xs space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-bold text-foreground">Underlying PyObject Header:</span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                ob_refcnt = {refCount}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-muted/30 border border-border/60 space-y-2">
              <div className="text-muted-foreground">Type: &lt;class 'dict'&gt; | Address: 0x98AF30</div>
              <div className="text-foreground font-bold">payload: &#123;"user": "Atul", "role": "admin"&#125;</div>
            </div>

            <div className="text-muted-foreground text-[11px] leading-relaxed">
              When all references are removed (<code className="text-foreground">del a, b</code>), <code className="text-foreground">ob_refcnt == 0</code>, and CPython immediately reclaims the memory to its free list without waiting for garbage collection.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

