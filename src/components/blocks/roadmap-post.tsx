import React from "react";

interface RoadmapNode {
  title: string;
  description: string;
  url?: string;
}

interface RoadmapData {
  title: string;
  description: string;
  nodes?: RoadmapNode[];
}

interface RoadmapPostProps {
  roadmap: {
    data: RoadmapData;
    [key: string]: any;
  };
  children: React.ReactNode;
}

const RoadmapPost = ({ roadmap, children }: RoadmapPostProps) => {
  const { title, description, nodes } = roadmap.data;

  return (
    <section>
      <div className="container">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center">
          <h1 className="max-w-3xl text-4xl font-bold md:text-5xl">{title}</h1>
          <h3 className="text-muted-foreground max-w-4xl">{description}</h3>
        </div>
      </div>
      <div className="w-full">
        <div className="grid w-full max-w-4xl mx-auto px-8 grid-cols-1 gap-8 items-start justify-center">
          <main className="w-full">
            <div className="prose dark:prose-invert mx-auto max-w-none w-full">{children}</div>
            <div className="mt-8">
              {nodes && nodes.map((node, index) => (
                <div key={index} className="mb-8 p-4 border rounded-lg">
                  <h2 className="text-2xl font-bold">{node.title}</h2>
                  <p className="text-muted-foreground">{node.description}</p>
                  {node.url && (
                    <a href={node.url} className="text-blue-500 hover:underline">
                      Learn more
                    </a>
                  )}
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </section>
  );
};

export { RoadmapPost };
