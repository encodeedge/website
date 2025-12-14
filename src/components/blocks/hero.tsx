import {
  ArrowRight,
  Blend,
  ChartNoAxesColumn,
  CircleDot,
  Diamond,
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

      <div className="mt-12 max-lg:ml-6 max-lg:h-[550px] max-lg:overflow-hidden md:mt-20 lg:container lg:mt-24">
        <div className="relative w-full">
          {/* Clickable informative SVG with hotspots linking to site sections */}
          <svg
            viewBox="0 0 1000 420"
            preserveAspectRatio="xMidYMid meet"
            className="w-full rounded-2xl shadow-lg"
            role="img"
            aria-labelledby="heroSvgTitle heroSvgDesc"
          >
            <title id="heroSvgTitle">EncodeEdge highlights</title>
            <desc id="heroSvgDesc">Quick links: Tutorials, Blog, Notebooks, Newsletter</desc>

            <defs>
              {/* Gradient A: Light primary tone */}
              <linearGradient id="gA" x1="0" x2="1">
                <stop offset="0" stopColor={LIGHT_PRIMARY} />
                <stop offset="1" stopColor={LIGHTER_PRIMARY} />
              </linearGradient>
              {/* Gradient B: Complementary light tone (Slightly warmer off-white) */}
              <linearGradient id="gB" x1="0" x2="1">
                <stop offset="0" stopColor="#fdfcff" />
                <stop offset="1" stopColor="#f7faff" />
              </linearGradient>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="6" stdDeviation="12" floodColor="#0b0b0b" floodOpacity="0.08" />
              </filter>
              
              {/* Branded Arrow Icon (Call to Action) - Uses currentColor */}
              <g id="brandedArrow">
                <circle r="18" fill="currentColor" opacity="0.15"/>
                {/* Arrow path (simple right-facing arrow) */}
                <path d="M-6 0 L6 0 M2 -4 L6 0 L2 4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
              </g>

              {/* Card Icons (Uses currentColor) */}
              <g id="MonitorIcon" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="5" width="20" height="15" rx="2" />
                <path d="M7 23 L15 23 M11 20 L11 23" />
              </g>
              
              <g id="BookIcon" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 19 L4 7 C4 5.9 4.9 5 6 5 H20 V19 C20 20.1 19.1 21 18 21 H6 C4.9 21 4 20.1 4 19 Z M12 5 V21" />
              </g>
              
              <g id="NotebookIcon" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="2" width="18" height="20" rx="2" />
                <path d="M7 2 L7 22 M12 2 L12 22 M16 2 L16 22" />
              </g>
              
              <g id="MailIcon" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M2 4 L12 12 L22 4" />
              </g>

            </defs>

            {/* Background rectangle adjusted to fit the new grid dimensions (1000x420 viewBox) */}
            <rect x="0" y="0" width="1000" height="420" fill="#fbfbff" rx="18" />

            {/* Card Size: 450x170. */}

            {/* Card 1 - Tutorials - TOP LEFT */}
            <a href="/topics" aria-label="Go to Tutorials" className={`group text-[${PRIMARY_COLOR}] hover:text-[${HOVER_COLOR}] transition-colors duration-300`}>
              <g filter="url(#shadow)" transform="translate(90, 30)" 
                 className="transition-transform duration-300 ease-out group-hover:scale-[1.03] group-hover:-translate-y-2 cursor-pointer">
                <rect width="350" height="140" rx="12" fill="url(#gA)" />
                <use href="#MonitorIcon" transform="translate(30, 30)" />
                <text x="65" y="50" fontSize="20" fontWeight="700" fill="#0f172a">Tutorials & Deep Dives</text>
                
                {/* Description with manual line wrapping using tspan */}
                <text x="30" y="90" fontSize="12" fill="#334155" opacity="0.9">
                  <tspan x="30" dy="0">Project-based, step-by-step walkthroughs</tspan>
                  <tspan x="30" dy="16">with runnable code and visuals.</tspan>
                </text>

                {/* Icon positioned at the bottom right */}
                <use href="#brandedArrow" transform="translate(320, 110)" />
              </g>
            </a>

            {/* Card 2 - Blog - TOP RIGHT */}
            <a href="/blog" aria-label="Read the blog" className={`group text-[${PRIMARY_COLOR}] hover:text-[${HOVER_COLOR}] transition-colors duration-300`}>
              <g filter="url(#shadow)" transform="translate(520, 30)" 
                 className="transition-transform duration-300 ease-out group-hover:scale-[1.03] group-hover:-translate-y-2 cursor-pointer">
                <rect width="350" height="140" rx="12" fill="url(#gB)" />
                <use href="#BookIcon" transform="translate(30, 30)" />
                <text x="65" y="50" fontSize="20" fontWeight="700" fill="#0f172a">Expert Blog Articles</text>
                
                {/* Description with manual line wrapping using tspan */}
                <text x="30" y="90" fontSize="12" fill="#334155" opacity="0.9">
                  <tspan x="30" dy="0">In-depth research explainers, trending tech</tspan>
                  <tspan x="30" dy="16">and deep tech analysis.</tspan>
                </text>

                {/* Icon positioned at the bottom right */}
                <use href="#brandedArrow" transform="translate(320, 110)" />
              </g>
            </a>

            {/* Card 3 - Notebooks - BOTTOM LEFT */}
            <a href="https://github.com/atulkrjha/Machine-Learning/" aria-label="Open notebooks" className={`group text-[${PRIMARY_COLOR}] hover:text-[${HOVER_COLOR}] transition-colors duration-300`}>
              <g filter="url(#shadow)" transform="translate(90, 230)" 
                 className="transition-transform duration-300 ease-out group-hover:scale-[1.03] group-hover:-translate-y-2 cursor-pointer">
                <rect width="350" height="140" rx="12" fill="#ffffff" stroke={LIGHT_PRIMARY} />
                <use href="#NotebookIcon" transform="translate(30, 30)" />
                <text x="65" y="50" fontSize="20" fontWeight="700" fill="#0f172a">Interactive Notebooks</text>
                
                {/* Description with manual line wrapping using tspan */}
                <text x="30" y="90" fontSize="12" fill="#334155" opacity="0.9">
                  <tspan x="30" dy="0">Runnable Jupyter & Colab environments</tspan>
                  <tspan x="30" dy="16">for every project and lesson.</tspan>
                </text>

                {/* Icon positioned at the bottom right */}
                <use href="#brandedArrow" transform="translate(320, 110)" />
              </g>
            </a>

            {/* Card 4 - Newsletter - BOTTOM RIGHT */}
            <a href="/subscribe" aria-label="Join newsletter" className={`group text-[${PRIMARY_COLOR}] hover:text-[${HOVER_COLOR}] transition-colors duration-300`}>
              <g filter="url(#shadow)" transform="translate(520, 230)" 
                 className="transition-transform duration-300 ease-out group-hover:scale-[1.03] group-hover:-translate-y-2 cursor-pointer">
                <rect width="350" height="140" rx="12" fill="url(#gA)" stroke={LIGHT_PRIMARY} />
                <use href="#MailIcon" transform="translate(30, 30)" />
                <text x="65" y="50" fontSize="20" fontWeight="700" fill="#0f172a">Subscribe</text>
                
                {/* Description with manual line wrapping using tspan */}
                <text x="30" y="90" fontSize="12" fill="#334155" opacity="0.9">
                  <tspan x="30" dy="0">Weekly tips, deep dives, project updates,</tspan>
                  <tspan x="30" dy="16">and live stream schedules.</tspan>
                </text>

                {/* Icon positioned at the bottom right */}
                <use href="#brandedArrow" transform="translate(320, 110)" />
              </g>
            </a>
          </svg>
        </div>
      </div>
    </section>
  );
};