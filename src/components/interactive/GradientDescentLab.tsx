import React, { useState } from 'react';
import { Play, SkipForward, RotateCcw, AlertTriangle, CheckCircle2, TrendingDown } from 'lucide-react';

export const GradientDescentLab: React.FC = () => {
  const [learningRate, setLearningRate] = useState<number>(0.15);
  const [useMomentum, setUseMomentum] = useState<boolean>(false);
  const [w, setW] = useState<number>(2.4);
  const [velocity, setVelocity] = useState<number>(0);
  const [history, setHistory] = useState<number[]>([2.4]);
  const [status, setStatus] = useState<'optimizing' | 'converged' | 'diverged'>('optimizing');

  // Loss function: J(w) = w^2 + 0.5 * sin(3*w)
  const lossFn = (weight: number) => {
    return Math.pow(weight, 2) + 0.5 * Math.sin(3 * weight);
  };

  // Derivative dJ/dw = 2*w + 1.5 * cos(3*w)
  const gradFn = (weight: number) => {
    return 2 * weight + 1.5 * Math.cos(3 * weight);
  };

  const currentLoss = lossFn(w);
  const currentGrad = gradFn(w);

  const stepOptimizer = (currentW: number, currentVel: number) => {
    if (Math.abs(currentW) > 5.0) {
      setStatus('diverged');
      return { newW: currentW, newVel: currentVel };
    }

    const grad = gradFn(currentW);
    let newVel = 0;
    let newW = currentW;

    if (useMomentum) {
      newVel = 0.9 * currentVel + learningRate * grad;
      newW = currentW - newVel;
    } else {
      newW = currentW - learningRate * grad;
    }

    if (Math.abs(newW) > 5.0) {
      setStatus('diverged');
    } else if (Math.abs(grad) < 0.05) {
      setStatus('converged');
    } else {
      setStatus('optimizing');
    }

    return { newW, newVel };
  };

  const handleSingleStep = () => {
    if (status === 'diverged') return;
    const { newW, newVel } = stepOptimizer(w, velocity);
    setW(newW);
    setVelocity(newVel);
    setHistory(prev => [...prev, newW]);
  };

  const handleAutoRun = () => {
    let curW = w;
    let curVel = velocity;
    const newHist = [...history];

    for (let i = 0; i < 8; i++) {
      const res = stepOptimizer(curW, curVel);
      curW = res.newW;
      curVel = res.newVel;
      newHist.push(curW);
      if (Math.abs(curW) > 5.0 || Math.abs(gradFn(curW)) < 0.05) break;
    }

    setW(curW);
    setVelocity(curVel);
    setHistory(newHist);
  };

  const handleReset = (initW = 2.4) => {
    setW(initW);
    setVelocity(0);
    setHistory([initW]);
    setStatus('optimizing');
  };

  // Convert mathematical coordinates (w in [-3, 3], loss in [0, 10]) to SVG (x in [40, 500], y in [220, 20])
  const mapCoords = (weight: number, lossVal: number) => {
    const svgX = 270 + weight * 75;
    const svgY = 220 - Math.min(10, Math.max(0, lossVal)) * 18;
    return { svgX, svgY };
  };

  // Generate curve path string
  const points: string[] = [];
  for (let val = -3.0; val <= 3.0; val += 0.1) {
    const { svgX, svgY } = mapCoords(val, lossFn(val));
    points.push(`${svgX.toFixed(1)},${svgY.toFixed(1)}`);
  }
  const curvePath = `M ${points.join(' L ')}`;

  const currentPos = mapCoords(w, currentLoss);

  return (
    <div className="rounded-3xl border border-border/80 bg-card p-6 md:p-8 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Interactive Lab
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1 font-semibold">
              <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />
              Convex &amp; Non-Convex Optimization
            </span>
          </div>
          <h3 className="text-xl font-bold font-display text-foreground mt-1">
            Gradient Descent &amp; Learning Rate Simulator
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Visualize how the learning rate $\eta$ and momentum influence convergence toward the global minimum.
          </p>
        </div>

        {/* Status indicator */}
        <div>
          {status === 'converged' && (
            <span className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4" /> Converged to Minima!
            </span>
          )}
          {status === 'diverged' && (
            <span className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30">
              <AlertTriangle className="w-4 h-4" /> Diverged! (Learning rate too high)
            </span>
          )}
          {status === 'optimizing' && (
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-muted text-muted-foreground border border-border">
              Step {history.length - 1} of Iteration
            </span>
          )}
        </div>
      </div>

      {/* Main Grid: SVG Curve & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* SVG Canvas (7 cols) */}
        <div className="lg:col-span-7 bg-muted/20 border border-border/60 rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center">
          <svg viewBox="0 0 540 260" className="w-full h-auto max-w-md">
            {/* Coordinate Grid axes */}
            <line x1="30" y1="230" x2="510" y2="230" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1.5" />
            <line x1="270" y1="20" x2="270" y2="240" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1.5" />
            
            <text x="500" y="244" fill="currentColor" opacity="0.5" fontSize="10" fontWeight="600">Weight (w)</text>
            <text x="280" y="30" fill="currentColor" opacity="0.5" fontSize="10" fontWeight="600">Loss J(w)</text>

            {/* The Loss Function Curve */}
            <path d={curvePath} fill="none" stroke="#10B981" strokeWidth="2.5" />

            {/* History trajectory line */}
            {history.length > 1 && (
              <polyline 
                points={history.map(hw => {
                  const c = mapCoords(hw, lossFn(hw));
                  return `${c.svgX.toFixed(1)},${c.svgY.toFixed(1)}`;
                }).join(' ')}
                fill="none" 
                stroke="#F59E0B" 
                strokeWidth="1.5" 
                strokeDasharray="3,3"
                opacity="0.8"
              />
            )}

            {/* History markers */}
            {history.map((hw, idx) => {
              const c = mapCoords(hw, lossFn(hw));
              return (
                <circle 
                  key={idx} 
                  cx={c.svgX} 
                  cy={c.svgY} 
                  r={idx === history.length - 1 ? 7 : 3.5} 
                  fill={idx === history.length - 1 ? '#EF4444' : '#F59E0B'} 
                  stroke="#FFFFFF"
                  strokeWidth={idx === history.length - 1 ? 2 : 1}
                />
              );
            })}

            {/* Global Minimum indicator */}
            <text x="270" y="222" textAnchor="middle" fill="#10B981" fontSize="10" fontWeight="700">w* ≈ 0</text>
          </svg>

          {/* Telemetry readouts */}
          <div className="w-full mt-4 grid grid-cols-3 gap-2 text-center text-xs font-mono">
            <div className="p-2 rounded-xl bg-card border border-border/80">
              <span className="text-muted-foreground block text-[10px]">Weight (w)</span>
              <strong className="text-foreground">{w.toFixed(3)}</strong>
            </div>
            <div className="p-2 rounded-xl bg-card border border-border/80">
              <span className="text-muted-foreground block text-[10px]">Loss J(w)</span>
              <strong className="text-emerald-600 dark:text-emerald-400">{currentLoss.toFixed(3)}</strong>
            </div>
            <div className="p-2 rounded-xl bg-card border border-border/80">
              <span className="text-muted-foreground block text-[10px]">Gradient ∇J</span>
              <strong className="text-amber-600 dark:text-amber-400">{currentGrad.toFixed(3)}</strong>
            </div>
          </div>
        </div>

        {/* Controls Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleSingleStep}
              disabled={status === 'diverged'}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-opacity disabled:opacity-40 cursor-pointer"
            >
              <SkipForward className="w-3.5 h-3.5" />
              <span>Step Once</span>
            </button>

            <button
              onClick={handleAutoRun}
              disabled={status === 'diverged'}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-semibold text-xs transition-colors disabled:opacity-40 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Auto (8 Steps)</span>
            </button>

            <button
              onClick={() => handleReset(2.4)}
              className="p-2.5 rounded-xl border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Learning Rate Slider */}
          <div className="space-y-2 pt-2 border-t border-border/60">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-foreground">Learning Rate (η)</span>
              <span className={`font-mono font-bold ${learningRate > 0.6 ? 'text-rose-500' : 'text-primary'}`}>
                {learningRate.toFixed(2)}
              </span>
            </div>
            <input 
              type="range" min="0.02" max="0.95" step="0.02" value={learningRate} 
              onChange={(e) => setLearningRate(parseFloat(e.target.value))}
              className="w-full accent-primary cursor-pointer" 
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>0.02 (Slow)</span>
              <span>0.15 (Ideal)</span>
              <span>0.95 (Unstable / Exploding)</span>
            </div>
          </div>

          {/* Starting Position Slider */}
          <div className="space-y-2 pt-2 border-t border-border/60">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-foreground">Initial Starting Point (w₀)</span>
              <span className="font-mono font-bold text-foreground">{history[0].toFixed(2)}</span>
            </div>
            <input 
              type="range" min="-2.8" max="2.8" step="0.2" value={history[0]} 
              onChange={(e) => handleReset(parseFloat(e.target.value))}
              className="w-full accent-muted-foreground cursor-pointer" 
            />
          </div>

          {/* Momentum Checkbox */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/60 text-xs">
            <div>
              <span className="font-semibold text-foreground block">Momentum (β = 0.9)</span>
              <span className="text-[11px] text-muted-foreground">Helps escape plateaus and smooths oscillation</span>
            </div>
            <input 
              type="checkbox" 
              checked={useMomentum} 
              onChange={(e) => setUseMomentum(e.target.checked)}
              className="w-4 h-4 accent-primary cursor-pointer" 
            />
          </div>
        </div>

      </div>
    </div>
  );
};

