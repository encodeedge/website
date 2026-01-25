import React from "react";
import { Button } from "@/components/ui/button";

const RoadmapTeaser = () => {
  return (
    <section className="py-20">
      <div className="container max-w-5xl space-y-4 text-center">
        <h2 className="text-3xl font-bold">Learning Roadmaps</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Explore our curated roadmaps to learn and master various topics in AI, Machine Learning, and more.
        </p>
        <Button asChild>
          <a href="/roadmaps">Explore Roadmaps</a>
        </Button>
      </div>
    </section>
  );
};

export { RoadmapTeaser };
