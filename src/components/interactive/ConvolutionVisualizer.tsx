import React, { useState, useMemo } from 'react';
import { Eye, Sliders, Layers, Sparkles, RotateCcw, Calculator, ArrowRight, Grid3X3 } from 'lucide-react';

interface ConvolutionVisualizerProps {
  title?: string;
  description?: string;
}

const KERNEL_PRESETS: Record<string, { label: string; matrix: number[][]; bias: number; description: string }> = {
  sobel_v: {
    label: 'Sobel Vertical (Edges)',
    matrix: [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1]
    ],
    bias: 0,
    description: 'Calculates vertical luminance gradient; detects sharp vertical edges and boundaries.'
  },
  sobel_h: {
    label: 'Sobel Horizontal',
    matrix: [
      [-1, -2, -1],
      [ 0,  0,  0],
      [ 1,  2,  1]
    ],
    bias: 0,
    description: 'Highlights horizontal boundaries and transition horizons across pixels.'
  },
  sharpen: {
    label: 'Sharpen Filter',
    matrix: [
      [ 0, -1,  0],
      [-1,  5, -1],
      [ 0, -1,  0]
    ],
    bias: 0,
    description: 'Emphasizes high-frequency details by amplifying contrast with neighbors.'
  },
  blur: {
    label: 'Gaussian Blur (Normalized)',
    matrix: [
      [1/16, 2/16, 1/16],
      [2/16, 4/16, 2/16],
      [1/16, 2/16, 1/16]
    ],
    bias: 0,
    description: 'Attenuates high frequencies and smooths pixel transitions with a 2D Gaussian kernel.'
  },
  laplacian: {
    label: 'Laplacian Ridge',
    matrix: [
      [ 0,  1,  0],
      [ 1, -4,  1],
      [ 0,  1,  0]
    ],
    bias: 0,
    description: 'Second-order spatial derivative filter highlighting rapid intensity fluctuations.'
  }
};

// 6x6 sample grayscale input image (values 0 - 255)
const DEFAULT_IMAGE: number[][] = [
  [200, 200, 200,  30,  30,  30],
  [200, 200, 200,  30,  30,  30],
  [200, 200, 200,  30,  30,  30],
  [200, 200, 200,  30,  30,  30],
  [ 30,  30,  30, 200, 200, 200],
  [ 30,  30,  30, 200, 200, 200],
];

export const ConvolutionVisualizer: React.FC<ConvolutionVisualizerProps> = ({
  title = "2D Convolution Kernel & Feature Map Explorer",
  description = "Trace spatial receptive fields, compute kernel dot products, and visualize how CNNs extract edge features."
}) => {
  const [selectedKernelKey, setSelectedKernelKey] = useState<string>('sobel_v');
  const [activeWindowPos, setActiveWindowPos] = useState<{ r: number; c: number }>({ r: 0, c: 1 });
  const [applyRelu, setApplyRelu] = useState<boolean>(true);
  const [customKernel, setCustomKernel] = useState<number[][]>(KERNEL_PRESETS['sobel_v'].matrix);
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);

  const activeKernel = isCustomMode ? customKernel : (KERNEL_PRESETS[selectedKernelKey]?.matrix || KERNEL_PRESETS['sobel_v'].matrix);
  const activePreset = KERNEL_PRESETS[selectedKernelKey];

  const inRows = DEFAULT_IMAGE.length;
  const inCols = DEFAULT_IMAGE[0].length;
  const kSize = 3;
  const outRows = inRows - kSize + 1; // 4
  const outCols = inCols - kSize + 1; // 4

  // Compute 4x4 Output Feature Map
  const { featureMap, rawMap } = useMemo(() => {
    const raw: number[][] = Array(outRows).fill(0).map(() => Array(outCols).fill(0));
    const activated: number[][] = Array(outRows).fill(0).map(() => Array(outCols).fill(0));

    for (let r = 0; r < outRows; r++) {
      for (let c = 0; c < outCols; c++) {
        let sum = 0;
        for (let kr = 0; kr < kSize; kr++) {
          for (let kc = 0; kc < kSize; kc++) {
            sum += DEFAULT_IMAGE[r + kr][c + kc] * activeKernel[kr][kc];
          }
        }
        raw[r][c] = Math.round(sum);
        activated[r][c] = applyRelu ? Math.max(0, Math.round(sum)) : Math.round(sum);
      }
    }
    return { featureMap: activated, rawMap: raw };
  }, [activeKernel, applyRelu, outRows, outCols]);

  // Current receptive field calculation breakdown
  const currentCalc = useMemo(() => {
    const { r, c } = activeWindowPos;
    const terms: { inVal: number; kVal: number; prod: number }[] = [];
    let total = 0;

    for (let kr = 0; kr < kSize; kr++) {
      for (let kc = 0; kc < kSize; kc++) {
        const inVal = DEFAULT_IMAGE[r + kr][c + kc];
        const kVal = activeKernel[kr][kc];
        const prod = inVal * kVal;
        terms.push({ inVal, kVal, prod });
        total += prod;
      }
    }

    const finalVal = applyRelu ? Math.max(0, Math.round(total)) : Math.round(total);
    return { terms, rawTotal: Math.round(total), finalVal };
  }, [activeWindowPos, activeKernel, applyRelu]);

  return (
    <div className="rounded-3xl border border-border/80 bg-card overflow-hidden shadow-sm">
      {/* Header Bar */}
      <div className="bg-muted/40 border-b border-border/60 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0">
            <Grid3X3 className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold font-display text-base text-foreground">
                {title}
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                Computer Vision & CNNs
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-body line-clamp-1">
              {description}
            </p>
          </div>
        </div>

        {/* Options & ReLU Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setApplyRelu(!applyRelu)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
              applyRelu
                ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                : 'bg-muted/50 border-border/80 text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>ReLU Activation:</span>
            <strong className="uppercase">{applyRelu ? 'On (max(0, z))' : 'Off (Linear)'}</strong>
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* Preset Kernel Filter Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Sliders className="size-3.5 text-primary" /> Select Convolution Kernel Filter (3×3)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {Object.entries(KERNEL_PRESETS).map(([key, item]) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setSelectedKernelKey(key);
                  setIsCustomMode(false);
                }}
                className={`p-2.5 rounded-2xl text-left border transition-all cursor-pointer ${
                  !isCustomMode && selectedKernelKey === key
                    ? 'border-blue-500 bg-blue-500/10 text-foreground shadow-xs'
                    : 'border-border/60 bg-muted/20 hover:bg-muted/40 text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="font-bold text-xs text-foreground truncate">{item.label}</div>
                <div className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                  {key === 'sobel_v' ? 'Vertical boundary' : key === 'blur' ? 'Noise reduction' : 'Feature extraction'}
                </div>
              </button>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground italic">
            {activePreset.description}
          </p>
        </div>

        {/* Visualizer Interactive Grids Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* 1. Input Image 6x6 with highlighted 3x3 Window */}
          <div className="lg:col-span-5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-foreground">1. Input Image ($6 \times 6$)</span>
              <span className="text-[11px] text-muted-foreground">Click a position to slide kernel</span>
            </div>

            <div className="p-3 rounded-2xl bg-neutral-950 border border-border/80 flex flex-col items-center">
              <div className="grid grid-cols-6 gap-1 w-full max-w-[280px]">
                {DEFAULT_IMAGE.map((row, r) =>
                  row.map((val, c) => {
                    const isInsideWindow =
                      r >= activeWindowPos.r &&
                      r < activeWindowPos.r + kSize &&
                      c >= activeWindowPos.c &&
                      c < activeWindowPos.c + kSize;

                    // Can this cell be a top-left kernel anchor?
                    const isAnchor = r < outRows && c < outCols;

                    return (
                      <button
                        key={`${r}-${c}`}
                        type="button"
                        disabled={!isAnchor}
                        onClick={() => isAnchor && setActiveWindowPos({ r, c })}
                        className={`aspect-square rounded flex flex-col items-center justify-center font-mono text-[9px] transition-all cursor-pointer border ${
                          isInsideWindow
                            ? 'border-blue-400 ring-2 ring-blue-500/50 scale-105 z-10'
                            : 'border-white/10 opacity-70 hover:opacity-100'
                        }`}
                        style={{
                          backgroundColor: `rgb(${val}, ${val}, ${val})`,
                          color: val > 120 ? '#000000' : '#ffffff'
                        }}
                        title={`Pixel (${r}, ${c}): value ${val}${isAnchor ? ' - Click to position kernel here' : ''}`}
                      >
                        <span className="font-bold">{val}</span>
                      </button>
                    );
                  })
                )}
              </div>
              <div className="mt-2 text-[10px] text-slate-400 font-mono text-center">
                Highlighted 3×3 Receptive Field at row {activeWindowPos.r}, col {activeWindowPos.c}
              </div>
            </div>
          </div>

          {/* Operation Symbol */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center space-y-2 text-muted-foreground">
            <span className="text-xl font-bold font-mono">⊛</span>
            <div className="p-2 rounded-xl bg-muted/40 border border-border/60 text-center font-mono text-[10px]">
              Kernel: 3×3<br />Stride: 1<br />Pad: Valid
            </div>
            <ArrowRight className="size-4 text-primary hidden lg:block" />
          </div>

          {/* 2. Output Feature Map 4x4 */}
          <div className="lg:col-span-5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-foreground">2. Feature Map ($4 \times 4$)</span>
              <span className="text-[11px] text-muted-foreground">
                Output shape: $(H - K + 1) = 4$
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-neutral-950 border border-border/80 flex flex-col items-center">
              <div className="grid grid-cols-4 gap-1.5 w-full max-w-[240px]">
                {featureMap.map((row, r) =>
                  row.map((val, c) => {
                    const isSelected = r === activeWindowPos.r && c === activeWindowPos.c;
                    const maxVal = 500;
                    const intensity = Math.min(1, Math.abs(val) / maxVal);

                    return (
                      <button
                        key={`${r}-${c}`}
                        type="button"
                        onClick={() => setActiveWindowPos({ r, c })}
                        className={`aspect-square rounded-lg flex flex-col items-center justify-center font-mono text-[10px] transition-all cursor-pointer border ${
                          isSelected
                            ? 'border-emerald-400 ring-2 ring-emerald-500/50 scale-110 z-10 bg-emerald-500/20 text-white font-extrabold shadow-md'
                            : 'border-white/10 hover:border-white/30 text-slate-200'
                        }`}
                        style={{
                          backgroundColor: !isSelected
                            ? val > 0
                              ? `rgba(16, 185, 129, ${Math.max(0.1, intensity * 0.85)})`
                              : `rgba(239, 68, 68, ${Math.max(0.08, intensity * 0.7)})`
                            : undefined
                        }}
                        title={`Feature cell (${r}, ${c}): ${val}`}
                      >
                        <span>{val}</span>
                      </button>
                    );
                  })
                )}
              </div>
              <div className="mt-2 text-[10px] text-emerald-400 font-mono text-center">
                Current Output Value: <strong className="text-white text-xs">{currentCalc.finalVal}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Live Mathematical Dot-Product Accumulation Box */}
        <div className="p-4 rounded-2xl bg-muted/20 border border-border/60 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-foreground flex items-center gap-1.5">
              <Calculator className="size-3.5 text-primary" /> Step-by-Step Receptive Field Multiplication:
            </span>
            <span className="font-mono text-primary text-xs font-bold">
              {"\\sum (X_{ij} \\cdot K_{ij}) = "} {currentCalc.rawTotal}
              {applyRelu && ` → ReLU(${currentCalc.rawTotal}) = ${currentCalc.finalVal}`}
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-9 gap-1 text-[10px] font-mono text-center overflow-x-auto">
            {currentCalc.terms.map((t, idx) => (
              <div
                key={idx}
                className="p-1.5 rounded-lg bg-card border border-border/60 flex flex-col items-center justify-center"
              >
                <div className="text-muted-foreground">{t.inVal} × {t.kVal}</div>
                <div className={`font-bold mt-0.5 ${t.prod > 0 ? 'text-emerald-500' : t.prod < 0 ? 'text-red-500' : 'text-slate-400'}`}>
                  {t.prod > 0 ? `+${t.prod}` : t.prod}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
