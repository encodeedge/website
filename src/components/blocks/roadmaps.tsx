import { Sigma, Filter, Terminal, ArrowRight } from "lucide-react";
import { useMemo } from 'react'; 

// Define the colors from the Hero.jsx file for consistency
const PRIMARY_COLOR = "#3533cd";
const LIGHT_PRIMARY = "#eff0ff";
const LINE_COLOR = "#a5b4fc"; // A light blue-indigo for the connector line
const DOT_COLOR = "#3533cd"; // Primary color for the dot

// --- Type Definition for Roadmap Step ---
// Using React.ElementType for the icon since it comes from lucide-react
// @ts-ignore
type RoadmapStep = {
    title: string;
    icon: React.ElementType; 
    position: string;
    description: string;
}

const roadmapSteps: RoadmapStep[] = [
  { 
    title: "Python for Data Science", 
    icon: Terminal, 
    position: "self-start", 
    description: "Set the foundational environment, learn core data manipulation with Pandas and NumPy, and master visualization." 
  },
  { 
    title: "Math Fundamentals (Stats & Linear Algebra)", 
    icon: Sigma, 
    // Reduced spacing: lg:mt-16 -> lg:mt-8
    position: "self-center lg:mt-8", 
    description: "Understand the matrix mathematics, probability, and statistical testing that powers all modern ML models." 
  },
  { 
    title: "Feature Engineering & Preprocessing", 
    icon: Filter, 
    // Reduced spacing: lg:mt-32 -> lg:mt-16
    position: "self-end lg:mt-16", 
    description: "Master techniques to clean, transform, and select features, preparing data for complex model training." 
  },
];

/**
 * Component representing a single step in the learning roadmap.
 */
const RoadmapCard = ({ step }: { step: RoadmapStep }) => {
    const Icon = step.icon;
    return (
        <div 
            className={`z-10 flex w-full flex-col rounded-xl bg-white/70 p-4 shadow-lg ring-1 ring-white/5 backdrop-blur-sm md:p-5 lg:w-2/3 xl:w-1/2 ${step.position} transition-all duration-500`}
        >
            <div className="flex items-center gap-2">
                <Icon className="size-5 text-slate-600" />
                <p className="text-xs font-medium uppercase text-slate-500">
                    {step.title}
                </p>
            </div>
            <p className="mt-2 text-sm text-slate-700 font-medium"> 
                {step.description} 
            </p>
        </div>
    );
};

const LearningRoadmap = () => {
    
    // 1. Define Keyframes for the Stroke Dash Offset Animation
    const styleSheet = useMemo(() => `
      /* Keyframe for the Flowing Stroke effect (standard SVG path animation) */
      @keyframes line-flow {
        /* Simple transition: move the dash pattern from its starting offset to zero */
        to {
          stroke-dashoffset: 0;
        }
      }

      /* Apply to the SVG Path to make it look like energy is moving */
      .animate-path-flow {
        /* Smaller dash array and offset for a faster, more noticeable flow */
        stroke-dasharray: 10, 5; /* Dash length (10), Gap length (5) -> Total 15 */
        stroke-dashoffset: 15;    /* Start offset (dash + gap length) */
        animation: line-flow 3s linear infinite; /* Faster duration: 3s loop */
      }
    `, []);

    // Define the curved path using Bezier curves (M: move to, C: cubic bezier)
    // NEW PATH: Increased control point spread (e.g., X=20/80) for a deeper, more pronounced S-curve.
    // Starts at X=1 (far left), hits X=50 (center), ends at X=99 (far right).
    const curvedPathD = "M 1 0 C 20 15, 80 35, 50 50 C 20 65, 80 85, 99 100";


    return (
        <section className="mx-auto max-w-[85rem] px-4 py-10 sm:px-6 md:py-14 lg:px-8 lg:py-20">
            {/* Inline style block to inject keyframes */}
            <style>{styleSheet}</style> 
            
            <div 
                className="relative isolate overflow-hidden rounded-3xl px-6 pt-16 shadow-xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0" 
                style={{ backgroundColor: PRIMARY_COLOR }} // Use PRIMARY_COLOR for main container
            >
                {/* Background SVG Circle Gradient */}
                <svg viewBox="0 0 1024 1024" className="absolute left-1/2 top-1/2 -z-10 size-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0" aria-hidden="true">
                    <circle cx="512" cy="512" r="512" fill="url(#gradient_bg)" fillOpacity="0.7"></circle>
                    <defs>
                        <radialGradient id="gradient_bg">
                            {/* Inner stop is a slightly lighter version of primary */}
                            <stop offset="0" stopColor={LIGHT_PRIMARY}></stop> 
                            {/* Outer stop uses the primary color */}
                            <stop offset="1" stopColor={PRIMARY_COLOR}></stop> 
                        </radialGradient>
                    </defs>
                </svg>

                {/* Left side: Text and Button */}
                <div className="mx-auto my-auto max-w-md text-left sm:text-center lg:mx-0 lg:flex-auto lg:text-left">
                    <h2 className="text-balance text-2xl **font-bold** tracking-tight text-white md:text-3xl md:leading-tight"> 
                        Learning Roadmap: Your Guided Journey to Production AI 
                    </h2>
                    <p className="mt-6 text-pretty text-lg/8 text-indigo-100"> 
                        Start from the basics (Python & Math) and progress all the way to production-ready MLOps systems. Our roadmaps give you a structured, hands-on path to expertise. 
                    </p>
                    <div className="mt-10 flex items-center justify-start gap-x-6 sm:justify-center lg:justify-start">
                        <a 
                            href="/roadmaps" 
                            className="rounded-lg px-6 py-2.5 text-center font-medium transition-colors duration-300 focus:outline-hidden bg-white hover:bg-white/80 group inline-flex items-center justify-center gap-x-2 pl-5 pr-4 text-slate-700"
                        >
                            View Roadmaps
                            <ArrowRight className="size-4 shrink-0 transition duration-300 ease-in-out group-hover:translate-x-1" strokeWidth="2.5" />
                        </a>
                    </div>
                </div>

                {/* Right side: Roadmap Cards and Visual Line */}
                <div className="relative my-16 flex flex-col gap-y-4 lg:my-8 2xl:h-full w-full">
                    
                    {/* CONNECTOR: Use SVG for a smooth, animatable CURVED line on LG+ */}
                    <svg 
                         // SVG now covers the full width and height of the card container
                         className="absolute w-full h-full left-0 top-0 hidden lg:block" 
                         viewBox="0 0 100 100" // 100x100 for percentage-based coordinates
                         preserveAspectRatio="none" // Stretch to fit the dynamic height
                    >
                        {/* Background Path (Solid Line) */}
                        <path 
                            d={curvedPathD}
                            stroke={LINE_COLOR} 
                            strokeWidth="0.5" // Thinner for background
                            fill="none" 
                        />
                         {/* Animated Foreground Path (Dashed/Flowing Line) */}
                         <path 
                            d={curvedPathD}
                            stroke={DOT_COLOR} 
                            strokeWidth="2" // Thicker line for flow effect
                            fill="none"
                            strokeLinecap="round"
                            className="animate-path-flow"
                        />
                    </svg>

                    {roadmapSteps.map((step, index) => (
                        <RoadmapCard key={index} step={step} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LearningRoadmap;