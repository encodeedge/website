import React from 'react';
import { NeuralPlayground } from '@/components/interactive/NeuralPlayground';
import { GradientDescentLab } from '@/components/interactive/GradientDescentLab';
import { MemoryExplorer } from '@/components/interactive/MemoryExplorer';

interface InteractiveLabProps {
  type?: 'neural-playground' | 'gradient-descent' | 'memory-explorer';
}

export const InteractiveLab: React.FC<InteractiveLabProps> = ({ type = 'neural-playground' }) => {
  return (
    <div className="my-8 not-prose">
      {type === 'neural-playground' && <NeuralPlayground />}
      {type === 'gradient-descent' && <GradientDescentLab />}
      {type === 'memory-explorer' && <MemoryExplorer />}
    </div>
  );
};

