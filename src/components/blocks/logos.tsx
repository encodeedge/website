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
  Monitor, // Placeholder for a generic concept
} from "lucide-react";

import { cn } from "@/lib/utils";

// Define the icon type as a React component
type Company = {
  name: string;
  icon: React.ElementType; // Icon component from lucide-react
  width: number;
  height: number;
  href: string;
};

export const Logos = () => {
  // --- Thematic Icons representing key concepts/platforms ---
  const topRowCompanies: Company[] = [
    {
      name: "Algorithm Deep Dives", // Updated
      icon: Brain,
      width: 64, // Defines the badge size
      height: 64,
      href: "/topics/algorithms",
    },
    {
      name: "AI Agents", // Updated (Focus on MLOps)
      icon: GitBranch,
      width: 64,
      height: 64,
      href: "/topics/Agents",
    },
    {
      name: "Feature Engineering & Stores", // Updated
      icon: Database,
      width: 64,
      height: 64,
      href: "/topics/data-engineering",
    },
    {
      name: "Distributed Training", // Updated (Specific ML topic)
      icon: Cpu,
      width: 64,
      height: 64,
      href: "/topics/training",
    },
  ];

  const bottomRowCompanies: Company[] = [
    {
      name: "PyTorch & TensorFlow", // Updated (Specific frameworks)
      icon: Code,
      width: 64,
      height: 64,
      href: "/topics/frameworks",
    },
    {
      name: "Orchestration Tools (e.g., Kubeflow)", // Updated (Specific tools)
      icon: Layers,
      width: 64,
      height: 64,
      href: "/topics/mlops",
    },
    {
      name: "Model Deployment APIs", // Updated (Focus on serving)
      icon: Server,
      width: 64,
      height: 64,
      href: "/topics/deployment",
    },
    {
      name: "Model Drift & Monitoring", // Updated (Specific MLOps challenge)
      icon: Activity,
      width: 64,
      height: 64,
      href: "/topics/monitoring",
    },
    {
      name: "LLMs & Prompt Engineering", // Updated (Cutting-edge topic)
      icon: Sparkles,
      width: 64,
      height: 64,
      href: "/topics/generative-ai",
    },
  ];

  return (
    <section className="overflow-hidden">
      <div className="container space-y-10 lg:space-y-16">
        <div className="text-center">
          <h2 className="mb-4 text-xl text-balance md:text-2xl lg:text-3xl">
            The end-to-end knowledge hub for MLOps and Production AI.
            <br className="max-md:hidden" />
            <span className="text-muted-foreground">
              Master the concepts, tools, and systems required to ship AI models reliably.
            </span>
          </h2>
        </div>

        <div className="flex w-full flex-col items-center">
          {/* Top row - 4 logos */}
          <LogoRow companies={topRowCompanies} gridClassName="grid-cols-4" />

          {/* Bottom row - 5 logos */}
          <LogoRow
            companies={bottomRowCompanies}
            gridClassName="grid-cols-5"
            direction="right"
          />
        </div>
      </div>
    </section>
  );
};

type LogoRowProps = {
  companies: Company[];
  gridClassName: string;
  direction?: "left" | "right";
};

const LogoRow = ({ companies, gridClassName, direction }: LogoRowProps) => {
  return (
    <>
      {/* Desktop static version */}
      <div className="hidden md:block">
        <div
          className={cn(
            // Increased gap to accommodate hover scaling (p-4 + scale)
            "grid items-start justify-items-center gap-x-20 lg:gap-x-28", 
            gridClassName,
          )}
        >
          {companies.map((company, index) => {
            const Icon = company.icon;
            return (
              <a href={company.href} target="_blank" key={index} 
                 // The main interactive box with padding (p-4) and rounded edges (rounded-lg)
                 className="group flex flex-col items-center justify-start text-center p-4 rounded-lg 
                            transition-all duration-300 ease-in-out hover:scale-[1.15] hover:shadow-xl"
              >
                {/* Logo Badge Container */}
                <div 
                  className="p-4 rounded-full bg-gray-100 dark:bg-gray-800 shadow-md flex items-center justify-center mb-2"
                  style={{ width: company.width, height: company.height }}
                >
                  <Icon
                    // Explicitly setting stroke, fill, and hover states
                    className="h-8 w-8 transition-all duration-300 stroke-2 stroke-indigo-700 fill-none 
                                group-hover:stroke-indigo-900 group-hover:fill-indigo-200" // Brighter fill on hover
                  />
                </div>
                {/* Company Name - text-xs is smaller for a cleaner look */}
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 max-w-28 transition-colors duration-300 group-hover:text-indigo-800 dark:group-hover:text-indigo-300">
                    {company.name}
                </p>
              </a>
            );
          })}
        </div>
      </div>

      {/* Mobile marquee version */}
      <div className="md:hidden">
        <Marquee direction={direction} pauseOnHover>
          {companies.map((company, index) => {
            const Icon = company.icon;
            return (
              <a
                href={company.href}
                target="_blank"
                key={index}
                className="mx-4 inline-block transition-opacity hover:opacity-90 flex flex-col items-center justify-center text-center space-y-1"
              >
                <div 
                  className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 shadow-sm flex items-center justify-center mb-1"
                  style={{ width: company.width * 0.7, height: company.height * 0.7 }} // Smaller for mobile marquee
                >
                  <Icon
                    className="text-indigo-700 h-6 w-6 object-contain"
                  />
                </div>
                <p className="text-xs text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap">
                    {company.name}
                </p>
              </a>
            );
          })}
        </Marquee>
      </div>
    </>
  );
};