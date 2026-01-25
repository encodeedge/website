import {
  ArrowRight,
  Blend,
  BookOpen,
  ChartNoAxesColumn,
  CircleDot,
  Diamond,
  FileCode,
  Mail,
  Monitor,
} from "lucide-react";

import { DashedLine } from "@/components/dashed-line";
import { Button } from "@/components/ui/button";
// Note: Assuming these imports are correct based on the original code
// import { GITHUB_URL, SITE_TITLE, SITE_DESCRIPTION } from "@/consts";

// Define the new color palette constants for clarity within the SVG context
const PRIMARY_COLOR = "#3533cd"; // The new primary color
const HOVER_COLOR = "#2723a1"; // A darker indigo for the hover effect
const LIGHT_PRIMARY = "#eff0ff"; // Very light stop for gradients/strokes
const LIGHTER_PRIMARY = "#e9e9ff"; // Slightly darker stop for gradients

const features = [
  {
    title: "Algorithms & Data Structures",
    description:
      "Clear, example-driven walkthroughs of classic algorithms and data structures with code and visualizations.",
    icon: Diamond,
  },
  {
    title: "Machine Learning Projects",
    description:
      "Hands-on ML projects that take you from data preprocessing to model evaluation and deployment.",
    icon: ChartNoAxesColumn,
  },
  {
    title: "Deep Learning & Neural Nets",
    description:
      "Practical guides to neural network architectures, training techniques, and real-world applications.",
    icon: Blend,
  },
  {
    title: "Statistics & Evaluation",
    description:
      "Statistical concepts and model evaluation techniques to make your ML work robust and reproducible.",
    icon: CircleDot,
  },
];

const heroCards = [
  {
    title: "Tutorials & Deep Dives",
    description: "Project-based, step-by-step walkthroughs with runnable code and visuals.",
    href: "/topics",
    icon: Monitor,
  },
  {
    title: "Expert Blog Articles",
    description: "In-depth research explainers, trending tech and deep tech analysis.",
    href: "/blog",
    icon: BookOpen,
  },
  {
    title: "Interactive Notebooks",
    description: "Runnable Jupyter & Colab environments for every project and lesson.",
    href: "/notebooks",
    icon: FileCode,
  },
  {
    title: "Subscribe",
    description: "Weekly tips, deep dives, project updates, and live stream schedules.",
    href: "/subscribe",
    icon: Mail,
  },
];

export const Hero = () => {
  return (
    <section className="pt-28 pb-6 lg:pt-44 lg:pb-10">
      <div className="container flex flex-col justify-between gap-8 md:gap-14 lg:flex-row lg:gap-20">
        {/* Left side - Main content */}
        <div className="flex-1">
          <h1 className="text-foreground max-w-160 text-3xl tracking-tight md:text-4xl lg:text-5xl xl:whitespace-nowrap">
            Forge Real-World AI Careers
            <br />Build Skills That Ship
          </h1>

          <p className="text-muted-foreground text-1xl mt-5 md:text-3xl">
            Expert-led courses, deep technical articles, and
            community hackathons — practical pathways from idea to production.
          </p>

          <p className="text-muted-foreground mt-4 text-sm md:text-base max-w-2xl">
            Follow step-by-step guides, interactive notebooks, and real-world
            projects that take you from concept to production-ready results.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4 lg:flex-nowrap">
            <Button asChild>
              <a href="/social">Follow Us on Social</a>
            </Button>
            <Button
              variant="outline"
              className="from-background h-auto gap-2 bg-linear-to-r to-transparent shadow-md"
              asChild
            >
              <a
                href="/blog"
                className="max-w-56 truncate text-start md:max-w-none"
              >
                Explore tutorials 
                <ArrowRight className="stroke-3" />
              </a>
            </Button>
          </div>
        </div>

        {/* Right side - Features */}
        <div className="relative flex flex-1 flex-col justify-center space-y-5 max-lg:pt-10 lg:pl-10">
          <DashedLine
            orientation="vertical"
            className="absolute top-0 left-0 max-lg:hidden"
          />
          <DashedLine
            orientation="horizontal"
            className="absolute top-0 lg:hidden"
          />
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="flex gap-2.5 lg:gap-5">
                <Icon className="text-primary mt-1 size-4 shrink-0 lg:size-5" />
                <div>
                  <h2 className="font-text text-foreground font-semibold">
                    {feature.title}
                  </h2>
                  <p className="text-muted-foreground max-w-76 text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="container mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-24 lg:gap-6">
        {heroCards.map((card) => (
          <a
            key={card.title}
            href={card.href}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/50 bg-background/50 p-6 transition-all hover:border-primary/20 hover:bg-muted/30 hover:shadow-lg md:p-8"
          >
            <div className="mb-4 flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <card.icon className="size-6" />
              </div>
              <h3 className="font-bold text-xl">{card.title}</h3>
            </div>
            <p className="text-muted-foreground mb-6 text-base leading-relaxed">
              {card.description}
            </p>
            <div className="flex items-center text-sm font-semibold text-primary">
              Explore <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};