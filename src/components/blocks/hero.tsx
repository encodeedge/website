import {
  ArrowRight,
  Blend,
  ChartNoAxesColumn,
  CircleDot,
  Diamond,
} from "lucide-react";

import { DashedLine } from "@/components/dashed-line";
import { Button } from "@/components/ui/button";
import { GITHUB_URL, SITE_TITLE, SITE_DESCRIPTION } from "@/consts";

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

export const Hero = () => {
  return (
    <section className="py-28 lg:py-32 lg:pt-44">
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
              <a href="/social">Follow Us on Socials</a>
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

      <div className="mt-12 max-lg:ml-6 max-lg:h-[550px] max-lg:overflow-hidden md:mt-20 lg:container lg:mt-24">
        <div className="relative h-[793px] w-full">
          <img
            src="/hero.webp"
            alt="hero"
            className="w-full rounded-2xl object-cover object-left-top shadow-lg max-lg:rounded-tr-none"
          />
        </div>
      </div>
    </section>
  );
};
