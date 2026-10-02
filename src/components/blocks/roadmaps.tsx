import React from "react";
import { ArrowUpRight, Compass, Layers, Sparkles } from "lucide-react";

const pastelColors = [
  "bg-[#E5E795]/40 text-[#303305] dark:bg-[#E5E795]/20 dark:text-[#E5E795]",
  "bg-[#A2D2FF]/40 text-[#0c2e4e] dark:bg-[#A2D2FF]/20 dark:text-[#A2D2FF]",
  "bg-[#FDA4AF]/40 text-[#54111c] dark:bg-[#FDA4AF]/20 dark:text-[#FDA4AF]",
  "bg-[#E9D5FF]/40 text-[#3a1560] dark:bg-[#E9D5FF]/20 dark:text-[#E9D5FF]",
  "bg-[#FED7AA]/40 text-[#522503] dark:bg-[#FED7AA]/20 dark:text-[#FED7AA]",
];

const Roadmaps = ({ roadmaps }: { roadmaps: any[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Custom Roadmap Creator Card */}
      <a
        href="/roadmaps/builder"
        className="group relative flex flex-col justify-between rounded-2xl border-2 border-dashed border-[#E5E795]/50 bg-gradient-to-br from-[#E5E795]/10 via-card to-card p-5 shadow-sm hover:shadow-lg hover:border-[#E5E795] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
      >
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E5E795] text-black">
              <Sparkles className="size-3.5" />
              Interactive Builder
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
              Self-Paced
            </span>
          </div>

          <h2 className="text-xl font-bold font-display text-foreground group-hover:text-primary transition-colors leading-snug mb-2">
            Build Your Own Custom Roadmap
          </h2>

          <p className="text-xs sm:text-sm text-muted-foreground font-body leading-relaxed">
            Design your personal engineering curriculum, organize milestones, track study progress, and save securely in your browser.
          </p>
        </div>

        <div className="mt-5 pt-3.5 border-t border-black-150 dark:border-black-800 flex items-center justify-between text-xs font-bold text-foreground group-hover:text-primary transition-colors">
          <span>Launch Roadmap Architect</span>
          <ArrowUpRight className="size-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </a>
      {roadmaps.map((roadmap, idx) => {
        const badgeColor = pastelColors[idx % pastelColors.length];
        const moduleCount = roadmap.data.nodes?.length ?? 0;
        
        return (
          <a
            key={roadmap.id}
            href={`/roadmaps/${roadmap.id}/`}
            className="group relative flex flex-col justify-between rounded-2xl border border-black-200 dark:border-black-800 bg-card p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${badgeColor}`}>
                  <Compass className="size-3.5" />
                  Roadmap
                </span>
                {moduleCount > 0 && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                    <Layers className="size-3.5" />
                    {moduleCount} Modules
                  </span>
                )}
              </div>

              <h2 className="text-xl font-bold font-display text-foreground group-hover:underline transition-colors leading-snug mb-2">
                {roadmap.data.title}
              </h2>

              <p className="text-xs sm:text-sm text-muted-foreground font-body line-clamp-2 leading-relaxed">
                {roadmap.data.description}
              </p>
            </div>

            <div className="mt-5 pt-3.5 border-t border-black-150 dark:border-black-800 flex items-center justify-between text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
              <span>Explore Interactive Path</span>
              <ArrowUpRight className="size-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </a>
        );
      })}
    </div>
  );
};

export { Roadmaps };