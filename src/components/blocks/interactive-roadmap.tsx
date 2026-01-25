
import React from 'react';

interface Node {
  id: string;
  title: string;
  description: string;
  url?: string;
  dependsOn?: string[];
}

interface InteractiveRoadmapProps {
  nodes: Node[];
}

const InteractiveRoadmap: React.FC<InteractiveRoadmapProps> = ({ nodes }) => {
  if (!nodes || nodes.length === 0) {
    return <p>No roadmap nodes to display.</p>;
  }

  const nodeMap = new Map(nodes.map(node => [node.id, node]));
  const nodePositions = new Map<string, { x: number; y: number }>();
  
  // Graph layout calculation
  const levels = new Map<string, number>();
  const adj = new Map<string, string[]>();
  nodes.forEach(node => {
    adj.set(node.id, []);
  });
  nodes.forEach(node => {
    if (node.dependsOn) {
      node.dependsOn.forEach(dep => {
        adj.get(dep)?.push(node.id);
      });
    }
  });

  const calculateLevels = (nodeId: string, level: number) => {
    const currentLevel = levels.get(nodeId) || 0;
    if (level > currentLevel) {
      levels.set(nodeId, level);
    }
    adj.get(nodeId)?.forEach(neighbor => {
      calculateLevels(neighbor, level + 1);
    });
  };

  nodes.forEach(node => {
    if (!node.dependsOn || node.dependsOn.length === 0) {
      calculateLevels(node.id, 0);
    }
  });

  const nodesByLevel: { [key: number]: string[] } = {};
  let maxLevel = 0;
  levels.forEach((level, nodeId) => {
    if (!nodesByLevel[level]) {
      nodesByLevel[level] = [];
    }
    nodesByLevel[level].push(nodeId);
    if (level > maxLevel) {
      maxLevel = level;
    }
  });

  const xSpacing = 300;
  const ySpacing = 120;
  let totalHeight = 0;

  for (let i = 0; i <= maxLevel; i++) {
    const levelNodes = nodesByLevel[i] || [];
    const levelHeight = levelNodes.length * ySpacing;
    if (levelHeight > totalHeight) {
      totalHeight = levelHeight;
    }
    levelNodes.forEach((nodeId, index) => {
      const x = i * xSpacing + 150;
      const y = (index + 0.5) * ySpacing;
      nodePositions.set(nodeId, { x, y });
    });
  }

  const edges = nodes
    .filter(node => node.dependsOn)
    .flatMap(node =>
      node.dependsOn!.map(depId => ({ from: depId, to: node.id }))
    );

  return (
    <div className="relative" style={{ height: `${totalHeight}px` }}>
      <svg className="absolute top-0 left-0 w-full h-full" style={{ zIndex: 0 }}>
        {edges.map(edge => {
          const fromPos = nodePositions.get(edge.from);
          const toPos = nodePositions.get(edge.to);
          if (!fromPos || !toPos) return null;

          const padding = 20;

          const M = `M ${fromPos.x} ${fromPos.y}`;
          const C = `C ${fromPos.x + xSpacing / 2} ${fromPos.y}, ${toPos.x - xSpacing / 2} ${toPos.y}, ${toPos.x} ${toPos.y}`;

          return (
            <path
              key={`${edge.from}-${edge.to}`}
              d={`${M} ${C}`}
              stroke="hsl(var(--muted-foreground))"
              strokeWidth="2"
              fill="none"
              markerEnd="url(#arrow)"
            />
          );
        })}
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="hsl(var(--muted-foreground))" />
          </marker>
        </defs>
      </svg>
      <div className="relative" style={{ zIndex: 1 }}>
        {nodes.map(node => {
          const pos = nodePositions.get(node.id);
          if (!pos) return null;

          return (
            <div
              key={node.id}
              className="absolute"
              style={{
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <a href={node.url} className="w-64 block">
                <div className="p-4 bg-card rounded-lg border shadow-md hover:shadow-lg transition-shadow text-center">
                  <h3 className="font-semibold text-card-foreground">{node.title}</h3>
                  <p className="text-sm text-muted-foreground">{node.description}</p>
                </div>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InteractiveRoadmap;
