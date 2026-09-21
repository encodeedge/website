import { DashedLine } from "@/components/dashed-line";

const stats = [
  {
    value: "100+",
    label: "Practical Tutorials",
    accent: "bg-[#E5E795]/30 text-black dark:text-[#E5E795]",
  },
  {
    value: "10K+",
    label: "Community Coders",
    accent: "bg-[#E0E7FF] text-[#3730A3] dark:bg-[#312E81]/40 dark:text-[#C7D2FE]",
  },
  {
    value: "Python",
    label: "Primary Language Focus",
    accent: "bg-[#FEE2E2] text-[#991B1B] dark:bg-[#7F1D1D]/40 dark:text-[#FECACA]",
  },
  {
    value: "PyTorch & JAX",
    label: "Core Deep Learning",
    accent: "bg-[#F3E8FF] text-[#6B21A8] dark:bg-[#581C87]/40 dark:text-[#E9D5FF]",
  },
];

export function AboutHero() {
  return (
    <section className="mb-12">
      <div className="container flex max-w-5xl flex-col justify-between gap-8 md:gap-14 lg:flex-row lg:items-center lg:gap-16">
        <div className="flex-[1.5]">
          <span className="woords_tag_small mb-4 inline-block">Our Mission</span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight text-foreground leading-[1.12]">
            Democratizing Practical AI & ML Coding Skills
          </h1>

          <p className="text-muted-foreground mt-4 text-lg md:text-xl font-body leading-relaxed">
            We provide clear, hands-on, and accessible tutorials to build real-world machine learning systems.
          </p>

          <div className="text-muted-foreground mt-6 space-y-4 text-sm sm:text-base font-body leading-relaxed max-w-xl">
            <p>
              At our core, we believe that <strong className="text-foreground">coding expertise in Machine Learning</strong> shouldn't be a gatekept secret. Our mission is to transform complex AI and ML theory into <strong className="text-foreground">simple, actionable code recipes</strong> that anyone can follow. We cut through the jargon and focus exclusively on the practical steps needed to build, evaluate, and optimize functional models.
            </p>
            <p className="hidden md:block">
              Our commitment is to be the resource we wish we had when we started: a place where you can find complete, working code examples for <strong className="text-foreground">every major algorithm and framework</strong>. Whether you're aiming for your first classification model or deploying large language models, our goal is to give you coding confidence and the <strong className="text-foreground">direct path to ML mastery</strong>.
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3">
          {stats.map((stat) => (
            <div 
              key={stat.label} 
              className="rounded-2xl border border-black-150 dark:border-black-800 bg-card p-4.5 flex items-center justify-between gap-4 shadow-xs"
            >
              <div>
                <div className="font-display font-bold text-2xl sm:text-3xl text-foreground">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground font-medium mt-0.5">
                  {stat.label}
                </div>
              </div>
              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${stat.accent}`}>
                Verified
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}