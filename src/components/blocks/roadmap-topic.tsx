// src/components/blocks/roadmap-topic.tsx
import React from 'react';

export interface Topic {
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  // I will add links and references here later
}

interface RoadmapTopicProps {
  topic: Topic | null;
}

export const RoadmapTopic: React.FC<RoadmapTopicProps> = ({ topic }) => {
  if (!topic) {
    return null;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-2">{topic.name}</h2>
      <p className="text-lg mb-4">{topic.description}</p>
      <div className={`badge badge-${topic.difficulty}`}>{topic.difficulty}</div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Links</h3>
        <p>No links available for this topic yet.</p>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">References</h3>
        <p>No references available for this topic yet.</p>
      </div>
    </div>
  );
};
