import React, { useState } from 'react';
import { Sparkles, Sliders, Activity, RotateCcw } from 'lucide-react';

type ActivationType = 'relu' | 'sigmoid' | 'tanh' | 'gelu' | 'leaky_relu' | 'linear';

export const NeuralPlayground: React.FC = () => {
  const [x1, setX1] = useState<number>(1.0);
  const [x2, setX2] = useState<number>(-0.5);
  const [w1, setW1] = useState<number>(1.5);
  const [w2, setW2] = useState<number>(-2.0);
  const [bias, setBias] = useState<number>(0.2);
  const [activation, setActivation] = useState<ActivationType>('relu');

  // Compute weighted sum z = w1*x1 + w2*x2 + bias
  const z = (w1 * x1) + (w2 * x2) + bias;

  // Compute activation output a = f(z)
  const computeActivation = (val: number, act: ActivationType): number => {
    switch (act) {
      case 'relu':
        return Math.max(0, val);
      case 'sigmoid':
        return 1 / (1 + Math.exp(-val));
      case 'tanh':
        return Math.tanh(val);
      case 'gelu':
        return 0.5 * val * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (val + 0.044715 * Math.pow(val, 3))));
      case 'leaky_relu':
        return val >= 0 ? val : 0.1 * val;
      case 'linear':
      default:
        return val;
    }
  };

  const a = computeActivation(z, activation);

  const applyPreset = (preset: string) => {
    if (preset === 'and') {
      setX1(1.0); setX2(1.0); setW1(1.0); setW2(1.0); setBias(-1.5); setActivation('relu');
    } else if (preset === 'or') {
      setX1(1.0); setX2(0.0); setW1(1.2); setW2(1.2); setBias(-0.5); setActivation('relu');
    } else if (preset === 'inhibitory') {
      setX1(1.5); setX2(1.0); setW1(1.0); setW2(-2.5); setBias(0.0); setActivation('sigmoid');
    } else if (preset === 'reset') {
      setX1(1.0); setX2(-0.5); setW1(1.5); setW2(-2.0); setBias(0.2); setActivation('relu');
    }
  };

  // Helper for synapse line thickness & color
  const getSynapseStyle = (weight: number) => {
    const strokeWidth = Math.min(8, Math.max(1.5, Math.abs(weight) * 2.5));
    const strokeColor = weight >= 0 ? '#3B82F6' : '#EF4444'; // Blue for positive, Red for negative
    return { strokeWidth, strokeColor };
  };

  const syn1 = getSynapseStyle(w1);
  const syn2 = getSynapseStyle(w2);

  return (
    <div className="rounded-3xl border border-border/80 bg-card p-6 md:p-8 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              Interactive Lab
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1 font-semibold">
              <Activity className="w-3.5 h-3.5 text-amber-500" />
              Real-Time Feedforward
            </span>
          </div>
          <h3 className="text-xl font-bold font-display text-foreground mt-1">
            Artificial Neuron &amp; Activation Simulator
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Adjust inputs, synaptic weights, and activation functions to see how a single biological-inspired node processes signals.
          </p>
        </div>

        {/* Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-muted-foreground font-semibold mr-1">Presets:</span>
          <button 
            onClick={() => applyPreset('and')} 
            className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-muted hover:bg-muted/80 text-foreground transition-colors"
          >
            Logical AND
          </button>
          <button 
            onClick={() => applyPreset('or')} 
            className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-muted hover:bg-muted/80 text-foreground transition-colors"
          >
            Logical OR
          </button>
          <button 
            onClick={() => applyPreset('inhibitory')} 
            className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-muted hover:bg-muted/80 text-foreground transition-colors"
          >
            Inhibitory Synapse
          </button>
          <button 
            onClick={() => applyPreset('reset')} 
            className="text-[11px] p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" 
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Grid: Visual SVG Diagram on top, Controls below */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Visual Graph View (7 cols) */}
        <div className="lg:col-span-7 bg-muted/20 border border-border/60 rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center">
          <svg viewBox="0 0 540 280" className="w-full h-auto max-w-md">
            {/* Synapse Lines */}
            <line 
              x1="90" y1="80" x2="270" y2="140" 
              stroke={syn1.strokeColor} 
              strokeWidth={syn1.strokeWidth} 
              strokeOpacity="0.8" 
            />
            <line 
              x1="90" y1="200" x2="270" y2="140" 
              stroke={syn2.strokeColor} 
              strokeWidth={syn2.strokeWidth} 
              strokeOpacity="0.8" 
            />
            {/* Connection from Sum to Activation */}
            <line x1="270" y1="140" x2="450" y2="140" stroke="#10B981" strokeWidth="3" />

            {/* Input Node 1 */}
            <g transform="translate(90, 80)">
              <circle r="30" fill="#3B82F6" fillOpacity="0.15" stroke="#3B82F6" strokeWidth="2" />
              <text y="-5" textAnchor="middle" fill="currentColor" fontSize="12" fontWeight="700">x₁</text>
              <text y="14" textAnchor="middle" fill="#3B82F6" fontSize="11" fontWeight="700">{x1.toFixed(2)}</text>
            </g>

            {/* Input Node 2 */}
            <g transform="translate(90, 200)">
              <circle r="30" fill="#3B82F6" fillOpacity="0.15" stroke="#3B82F6" strokeWidth="2" />
              <text y="-5" textAnchor="middle" fill="currentColor" fontSize="12" fontWeight="700">x₂</text>
              <text y="14" textAnchor="middle" fill="#3B82F6" fontSize="11" fontWeight="700">{x2.toFixed(2)}</text>
            </g>

            {/* Weight Badges on Synapses */}
            <g transform="translate(170, 95)">
              <rect x="-24" y="-10" width="48" height="20" rx="6" fill="#1E293B" />
              <text y="4" textAnchor="middle" fill="#94A3B8" fontSize="10" fontWeight="600">w₁={w1.toFixed(2)}</text>
            </g>

            <g transform="translate(170, 185)">
              <rect x="-24" y="-10" width="48" height="20" rx="6" fill="#1E293B" />
              <text y="4" textAnchor="middle" fill="#94A3B8" fontSize="10" fontWeight="600">w₂={w2.toFixed(2)}</text>
            </g>

            {/* Summation Node Σ + b */}
            <g transform="translate(270, 140)">
              <circle r="38" fill="#6366F1" fillOpacity="0.15" stroke="#6366F1" strokeWidth="2.5" />
              <text y="-8" textAnchor="middle" fill="currentColor" fontSize="12" fontWeight="700">Σ (z)</text>
              <text y="12" textAnchor="middle" fill="#6366F1" fontSize="12" fontWeight="800">{z.toFixed(2)}</text>
              {/* Bias pill */}
              <rect x="-28" y="42" width="56" height="18" rx="5" fill="#E0E7FF" dark:fill="#312E81" />
              <text y="54" textAnchor="middle" fill="#4338CA" fontSize="10" fontWeight="700">b={bias.toFixed(2)}</text>
            </g>

            {/* Activation Transfer Node f(z) */}
            <g transform="translate(450, 140)">
              <circle r="36" fill="#10B981" fillOpacity="0.15" stroke="#10B981" strokeWidth="2.5" />
              <text y="-8" textAnchor="middle" fill="currentColor" fontSize="11" fontWeight="700">{activation.toUpperCase()}</text>
              <text y="14" textAnchor="middle" fill="#10B981" fontSize="14" fontWeight="800">{a.toFixed(3)}</text>
              <text y="50" textAnchor="middle" fill="#10B981" fontSize="10" fontWeight="700">Output (a)</text>
            </g>
          </svg>

          {/* Mathematical Step Equation */}
          <div className="w-full mt-4 p-3 rounded-xl bg-card border border-border/80 text-xs font-mono text-center space-y-1">
            <div className="text-muted-foreground">
              z = ({w1.toFixed(2)} × {x1.toFixed(2)}) + ({w2.toFixed(2)} × {x2.toFixed(2)}) + {bias.toFixed(2)} = <strong className="text-indigo-600 dark:text-indigo-400">{z.toFixed(3)}</strong>
            </div>
            <div className="text-foreground font-bold">
              a = {activation}({z.toFixed(3)}) = <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">{a.toFixed(4)}</span>
            </div>
          </div>
        </div>

        {/* Controls Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Activation Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider">
              Activation Function σ(z)
            </label>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              {(['relu', 'sigmoid', 'tanh', 'gelu', 'leaky_relu', 'linear'] as ActivationType[]).map((act) => (
                <button
                  key={act}
                  onClick={() => setActivation(act)}
                  className={`py-1.5 px-2 rounded-lg font-semibold uppercase text-[10.5px] transition-all border ${
                    activation === act
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                      : 'bg-muted/40 hover:bg-muted text-muted-foreground border-transparent'
                  }`}
                >
                  {act.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Sliders: Inputs */}
          <div className="space-y-3 pt-2 border-t border-border/60">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-foreground">Input x₁</span>
              <span className="font-mono text-primary font-bold">{x1.toFixed(2)}</span>
            </div>
            <input 
              type="range" min="-2.0" max="2.0" step="0.1" value={x1} 
              onChange={(e) => setX1(parseFloat(e.target.value))}
              className="w-full accent-primary cursor-pointer" 
            />

            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-foreground">Input x₂</span>
              <span className="font-mono text-primary font-bold">{x2.toFixed(2)}</span>
            </div>
            <input 
              type="range" min="-2.0" max="2.0" step="0.1" value={x2} 
              onChange={(e) => setX2(parseFloat(e.target.value))}
              className="w-full accent-primary cursor-pointer" 
            />
          </div>

          {/* Sliders: Weights & Bias */}
          <div className="space-y-3 pt-2 border-t border-border/60">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-foreground">Weight w₁</span>
              <span className={`font-mono font-bold ${w1 >= 0 ? 'text-blue-500' : 'text-red-500'}`}>
                {w1.toFixed(2)}
              </span>
            </div>
            <input 
              type="range" min="-3.0" max="3.0" step="0.1" value={w1} 
              onChange={(e) => setW1(parseFloat(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer" 
            />

            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-foreground">Weight w₂</span>
              <span className={`font-mono font-bold ${w2 >= 0 ? 'text-blue-500' : 'text-red-500'}`}>
                {w2.toFixed(2)}
              </span>
            </div>
            <input 
              type="range" min="-3.0" max="3.0" step="0.1" value={w2} 
              onChange={(e) => setW2(parseFloat(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer" 
            />

            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-foreground">Bias b</span>
              <span className="font-mono text-indigo-500 font-bold">{bias.toFixed(2)}</span>
            </div>
            <input 
              type="range" min="-2.0" max="2.0" step="0.1" value={bias} 
              onChange={(e) => setBias(parseFloat(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer" 
            />
          </div>
        </div>

      </div>
    </div>
  );
};

