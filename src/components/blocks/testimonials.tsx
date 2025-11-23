import { ArrowRight, CheckCircle, Target, Zap, TrendingUp, Cpu, Code } from "lucide-react";
import { DashedLine } from "../dashed-line";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { useMemo } from 'react';

// Helper function to generate a consistent color based on a string
const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
};

// --- UPDATED: New AI/Pipeline/Agent SVG Designs ---
const SVG_DESIGNS = [
  // Design 1: AI/Neural Network (Node/Connection)
  (color: string) => `
    <circle cx="50" cy="50" r="10" fill="${color}"/>
    <line x1="10" y1="20" x2="50" y2="50" stroke="${color}" stroke-width="4" stroke-opacity="0.6" stroke-linecap="round"/>
    <line x1="90" y1="20" x2="50" y2="50" stroke="${color}" stroke-width="4" stroke-opacity="0.6" stroke-linecap="round"/>
    <line x1="50" y1="50" x2="50" y2="80" stroke="${color}" stroke-width="4" stroke-opacity="0.6" stroke-linecap="round"/>
    <circle cx="10" cy="20" r="5" fill="${color}" fill-opacity="0.8"/>
    <circle cx="90" cy="20" r="5" fill="${color}" fill-opacity="0.8"/>
    <circle cx="50" cy="80" r="5" fill="${color}" fill-opacity="0.8"/>
  `,
  // Design 2: Pipeline/Data Flow (Layers/Stream)
  (color: string) => `
    <rect x="20" y="20" width="60" height="15" rx="5" fill="${color}" fill-opacity="0.2" stroke="${color}" stroke-width="2"/>
    <rect x="20" y="45" width="60" height="15" rx="5" fill="${color}" fill-opacity="0.4" stroke="${color}" stroke-width="2"/>
    <rect x="20" y="70" width="60" height="15" rx="5" fill="${color}" fill-opacity="0.6" stroke="${color}" stroke-width="2"/>
    <path d="M 50 15 V 75" stroke="${color}" stroke-width="3" stroke-dasharray="6 3"/>
    <path d="M 50 10 V 20" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
  `,
  // Design 3: Agent/Automation (Stylized CPU/Chip)
  (color: string) => `
    <rect x="20" y="20" width="60" height="60" rx="8" fill="${color}" fill-opacity="0.3"/>
    <rect x="30" y="30" width="40" height="40" rx="5" fill="${color}"/>
    <line x1="20" y1="40" x2="10" y2="40" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
    <line x1="20" y1="60" x2="10" y2="60" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
    <line x1="80" y1="40" x2="90" y2="40" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
    <line x1="80" y1="60" x2="90" y2="60" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
  `,
];

// Helper function to generate SVG avatar using abstract human shapes
const generateAvatarSvg = (name: string) => {
  const bgColor = stringToColor(name);
  const designIndex = name.length % SVG_DESIGNS.length;
  const svgContent = SVG_DESIGNS[designIndex](bgColor);

  return `
    <svg width="288" height="288" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <rect width="100%" height="100%" fill="#ffffff" fill-opacity="0.9"/>
      <g>
        ${svgContent}
      </g>
    </svg>
  `;
};

// --- UPDATED: Data now reflects outcomes and achievements ---
const items = [
  {
    title: "Deployment Speed: 1 Month to Production",
    achievements: [
      { text: "Successfully containerized and deployed 5 models.", icon: Zap },
      { text: "Reduced deployment cycle time by 65%.", icon: TrendingUp },
    ],
    author: "Elena Rostova",
    role: "ML Engineer",
    company: "Synapse AI",
  },
  {
    title: "Generative AI Mastery",
    achievements: [
      { text: "Built and fine-tuned a custom LLM for internal use.", icon: Cpu },
      { text: "Implemented advanced prompt engineering techniques.", icon: CheckCircle },
    ],
    author: "Aarav Singh",
    role: "Data Scientist",
    company: "Fintech Innovations",
  },
  {
    title: "Optimized Training Performance",
    achievements: [
      { text: "Achieved a 20% increase in model accuracy.", icon: Target },
      { text: "Refactored training code for parallel execution.", icon: Code },
    ],
    author: "Jasmine Chen",
    role: "Tech Lead",
    company: "Global SaaS Platform",
  },
  {
    title: "Robust MLOps Infrastructure",
    achievements: [
      { text: "Set up a reliable feature store pipeline (Feast).", icon: Database },
      { text: "Integrated automated model monitoring.", icon: Activity },
    ],
    author: "Leo Mendez",
    role: "MLOps Specialist",
    company: "Research Labs",
  },
  {
    title: "Code Quality and Scalability",
    achievements: [
      { text: "Standardized Python code across all data science projects.", icon: CheckCircle },
      { text: "Reduced technical debt in legacy prediction services.", icon: Code },
    ],
    author: "Kyra Davies",
    role: "Data Analyst",
    company: "E-commerce Scaleup",
  },
  {
    title: "Team Skill Advancement",
    achievements: [
      { text: "Used EncodeEdge roadmaps for team onboarding.", icon: UserPlus },
      { text: "Junior engineers contributed production code faster.", icon: TrendingUp },
    ],
    author: "Ben Carter",
    role: "Engineering Manager",
    company: "Cloud Services",
  },
];

// Need these Lucide icons for the achievement list
import { Database, Activity, UserPlus } from "lucide-react";


export const Testimonials = ({
  className,
  dashedLineClassName,
}: {
  className?: string;
  dashedLineClassName?: string;
}) => {
  return (
    <>
      <section className={cn("overflow-hidden py-28 lg:py-32", className)}>
        <div className="container">
          <div className="space-y-4">
            <h2 className="text-2xl tracking-tight md:text-4xl lg:text-5xl">
              Real-World Impact: Achievements and Success Metrics
            </h2>
            <p className="text-muted-foreground max-w-md leading-snug">
              See the concrete results engineers and teams achieve when they apply the production-ready principles learned on EncodeEdge.
            </p>
            <Button variant="outline" className="shadow-md">
              Explore Case Studies <ArrowRight className="size-4" />
            </Button>
          </div>

          <div className="relative mt-8 -mr-[max(3rem,calc((100vw-80rem)/2+3rem))] md:mt-12 lg:mt-20">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="">
                {items.map((testimonial, index) => (
                  <CarouselItem
                    key={index}
                    className="xl:basis-1/3.5 grow basis-4/5 sm:basis-3/5 md:basis-2/5 lg:basis-[28%] 2xl:basis-[24%]"
                  >
                    <Card className="bg-muted h-full overflow-hidden border-none">
                      <CardContent className="flex h-full flex-col p-0">
                        <div className="relative h-[288px] lg:h-[328px] bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          {/* Dynamically render SVG avatar */}
                          <div 
                            className="size-full object-cover object-top"
                            // FIX: Removed internal scaling for proper container fit
                            dangerouslySetInnerHTML={{ __html: generateAvatarSvg(testimonial.author) }} 
                          />
                        </div>
                        <div className="flex flex-1 flex-col justify-between gap-6 p-6">
                            <h3 className="text-foreground text-xl font-bold border-b pb-2 border-gray-200">
                                {testimonial.title}
                            </h3>
                            <ul className="space-y-3 flex-1">
                                {testimonial.achievements.map((item, i) => {
                                    const Icon = item.icon;
                                    return (
                                        <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                            <Icon className="size-5 text-[#3533cd] mt-0.5 shrink-0" />
                                            {item.text}
                                        </li>
                                    );
                                })}
                            </ul>
                          <div className="space-y-0.5 pt-4 border-t border-gray-100">
                            <div className="text-foreground font-semibold">
                              {testimonial.author}, {testimonial.role}
                            </div>
                            <div className="text-muted-foreground text-sm">
                              {testimonial.company}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="mt-8 flex gap-3">
                <CarouselPrevious className="bg-muted hover:bg-muted/80 static size-14.5 translate-x-0 translate-y-0 transition-colors [&>svg]:size-6 lg:[&>svg]:size-8" />
                <CarouselNext className="bg-muted hover:bg-muted/80 static size-14.5 translate-x-0 translate-y-0 transition-colors [&>svg]:size-6 lg:[&>svg]:size-8" />
              </div>
            </Carousel>
          </div>
        </div>
      </section>
      <DashedLine
        orientation="horizontal"
        className={cn("mx-auto max-w-[80%]", dashedLineClassName)}
      />
    </>
  );
};