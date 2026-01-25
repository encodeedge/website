import Marquee from "react-fast-marquee";
import {
  Brain,
  GitBranch,
  Database,
  Cpu,
  Layers,
  Activity,
  Code,
  Sparkles,
  Server,
} from "lucide-react";

import { cn } from "@/lib/utils";

// Define the icon type as a React component
type Company = {
  name: string;
  icon: React.ElementType; // Icon component from lucide-react
  href: string;
};

export const Logos = () => {
  const topics: Company[] = [
    {
      name: "Algorithm Deep Dives",
      icon: Brain,
      href: "/topics/algorithms",
    },
    {
      name: "AI Agents",
      icon: GitBranch,
      href: "/topics/Agents",
    },
    {
      name: "Feature Engineering & Stores",
      icon: Database,
      href: "/topics/data-engineering",
    },
    {
      name: "Distributed Training",
      icon: Cpu,
      href: "/topics/training",
    },
    {
      name: "PyTorch & TensorFlow",
      icon: Code,
      href: "/topics/frameworks",
    },
    {
      name: "Orchestration Tools",
      icon: Layers,
      href: "/topics/mlops",
    },
    {
      name: "Model Deployment APIs",
      icon: Server,
      href: "/topics/deployment",
    },
    {
      name: "Model Drift & Monitoring",
      icon: Activity,
      href: "/topics/monitoring",
    },
    {
      name: "LLMs & Prompt Engineering",
      icon: Sparkles,
      href: "/topics/generative-ai",
    },
  ];

  return (
    <section className="py-24 lg:py-32">
      <div className="container">
        <div className="text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            The end-to-end knowledge hub for MLOps and Production AI.
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Master the concepts, tools, and systems required to ship AI models reliably.
          </p>
        </div>

        {/* Desktop Grid */}
        <div className="mt-16 hidden grid-cols-1 gap-6 md:grid md:grid-cols-3 lg:gap-8">
          {topics.map((topic, index) => {
            const Icon = topic.icon;
            return (
              <a
                key={index}
                href={topic.href}
                className="group relative flex items-center gap-4 rounded-2xl border border-border/50 bg-background/50 p-6 transition-all hover:border-primary/20 hover:bg-muted/30 hover:shadow-lg"
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-6" />
                </div>
                <span className="font-semibold text-foreground">{topic.name}</span>
              </a>
            );
          })}
        </div>

        {/* Mobile Marquee */}
        <div className="mt-12 md:hidden">
          <Marquee pauseOnHover className="[--gap:1rem]">
            {topics.map((topic, index) => {
              const Icon = topic.icon;
              return (
                <a
                  key={index}
                  href={topic.href}
                  className="mx-2 flex items-center gap-2 rounded-full border border-border/50 bg-background/50 px-4 py-2 transition-colors hover:bg-muted"
                >
                  <Icon className="size-4 text-primary" />
                  <span className="text-sm font-medium">{topic.name}</span>
                </a>
              );
            })}
          </Marquee>
        </div>
      </div>
    </section>
  );
};