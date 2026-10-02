import React from 'react';
import { NeuralPlayground } from '@/components/interactive/NeuralPlayground';
import { GradientDescentLab } from '@/components/interactive/GradientDescentLab';
import { MemoryExplorer } from '@/components/interactive/MemoryExplorer';
import { PipelinePuzzleLab } from '@/components/interactive/PipelinePuzzleLab';
import { AttentionVisualizer } from '@/components/interactive/AttentionVisualizer';
import { ConvolutionVisualizer } from '@/components/interactive/ConvolutionVisualizer';
import { ModelRouterLab } from '@/components/interactive/ModelRouterLab';
import { MathDecoder } from '@/components/interactive/MathDecoder';

export type InteractiveLabType = 
  | 'neural-playground' 
  | 'gradient-descent' 
  | 'memory-explorer' 
  | 'pipeline-puzzle'
  | 'attention-visualizer'
  | 'convolution-visualizer'
  | 'model-router'
  | 'math-decoder';

interface InteractiveLabProps {
  type?: InteractiveLabType;
}

export const InteractiveLab: React.FC<InteractiveLabProps> = ({ type = 'neural-playground' }) => {
  return (
    <div className="my-8 not-prose">
      {type === 'neural-playground' && <NeuralPlayground />}
      {type === 'gradient-descent' && <GradientDescentLab />}
      {type === 'memory-explorer' && <MemoryExplorer />}
      {type === 'pipeline-puzzle' && <PipelinePuzzleLab />}
      {type === 'attention-visualizer' && <AttentionVisualizer />}
      {type === 'convolution-visualizer' && <ConvolutionVisualizer />}
      {type === 'model-router' && <ModelRouterLab />}
      {type === 'math-decoder' && <MathDecoder />}
    </div>
  );
};

