import { DashedLine } from "@/components/dashed-line";

const stats = [
  {
    value: "100+",
    label: "Practical Tutorials",
  },
  {
    value: "10K+",
    label: "Community Coders",
  },
  {
    value: "Python",
    label: "Primary Language Focus",
  },
  {
    value: "Keras/PyTorch",
    label: "Core Frameworks",
  },
];

export function AboutHero() {
  return (
    <section className="py-28 lg:py-32">
      <div className="container flex max-w-5xl flex-col justify-between gap-8 md:gap-20 lg:flex-row lg:items-center lg:gap-24 xl:gap-24">
        <div className="flex-[1.5]">
          <h1 className="text-3xl tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            Democratizing Practical AI & ML Coding Skills
          </h1>

          <p className="text-muted-foreground mt-5 text-2xl md:text-3xl lg:text-4xl">
            We provide clear, hands-on, and accessible tutorials to build real-world models.
          </p>

          <p className="text-muted-foreground mt-8 hidden max-w-lg space-y-6 text-lg text-balance md:block lg:mt-12">
            At our core, we believe that <strong>coding expertise in Machine Learning</ strong> shouldn't be a gatekept secret. Our mission is to transform complex AI and ML theory into <strong>simple, actionable code recipes</ strong> that anyone can follow. We cut through the jargon and focus exclusively on the practical steps needed to build, evaluate, and optimize functional models.
            <br />
            <br />
            Our commitment is to be the resource we wish we had when we started: a place where you can find complete, working code examples for <strong>every major algorithm and framework</ strong>. Whether you're aiming for your first classification model or deploying a large language model, our goal is to give you the coding confidence and the <strong>direct path to ML mastery</ strong>
          </p>
        </div>

        <div
          className={`relative flex flex-1 flex-col justify-center gap-3 pt-10 lg:pt-0 lg:pl-10`}
        >
          <DashedLine
            orientation="vertical"
            className="absolute top-0 left-0 max-lg:hidden"
          />
          <DashedLine
            orientation="horizontal"
            className="absolute top-0 lg:hidden"
          />
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <div className="font-display text-4xl tracking-wide md:text-5xl">
                {stat.value}
              </div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}