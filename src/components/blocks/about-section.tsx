import { cn } from "@/lib/utils";

export const AboutSection = () => {
  return (
    <section className="container mt-12 flex max-w-5xl flex-col-reverse gap-8 md:gap-14 lg:flex-row lg:items-start">
      {/* Images Left - Text Right */}
      <div className="flex flex-col gap-8 lg:gap-12 flex-1">
        <ImageSection
          images={[
            { src: "/about/card-1.png", alt: "Data Science concepts visualization" },
            { src: "/about/card-2.png", alt: "Hands-on coding session" },
          ]}
        />

        <TextSection
          title="Our Story and Approach"
          paragraphs={[
            "This platform was launched in 2022 out of a need for <strong>clear, executable, and frustration-free ML content</strong>. We found that many resources either stayed too theoretical or provided incomplete code. We are built from the ground up to solve that: every tutorial is designed with a focus on <strong>mastery through implementation</strong>.",
            "We are committed to keeping the core educational content accessible and free. We operate leanly and are constantly focused on updating our library to reflect the rapid advancements in the AI landscape, particularly in areas like transformer models and ethical AI.",
            "If you share our passion for technical clarity and accessible ML education, we invite you to contribute or check out how you can join our team below.",
          ]}
          ctaButton={{
            href: "/contact",
            text: "Get in touch with our team",
          }}
        />
      </div>

      {/* Text Left - Images Right */}
      <div className="flex flex-col gap-8 lg:gap-12 flex-1">
        <TextSection
          title="Bridging Research & Practice"
          paragraphs={[
            "Our ultimate goal is to bridge the gap between complex research and practical application. We guide you from setting up your <strong>Python environment</strong> to deploying sophisticated models, always providing the 'why' alongside the executable 'how'. We break down dense topics like <strong>Linear Algebra</strong> and <strong>Deep Learning architectures</strong> into simple steps, ensuring true foundational understanding.",
            "We are community-driven—actively listening to which algorithms are trending, which frameworks are confusing, and what knowledge gaps exist. Our success is measured by the number of working models you build and the confidence you gain. When our readers succeed in their ML projects and careers, we know we've succeeded.",
          ]}
        />
        <ImageSection
          images={[
            { src: "/about/card-3.png", alt: "Code editor with Python ML code" },
            { src: "/about/card-4.png", alt: "Neural network diagram or model architecture" },
          ]}
          className="hidden lg:flex"
        />
      </div>
    </section>
  );
};

interface ImageSectionProps {
  images: { src: string; alt: string }[];
  className?: string;
}

export function ImageSection({ images, className }: ImageSectionProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {images.map((image, index) => (
        <div
          key={index}
          className="relative aspect-16/10 overflow-hidden rounded-2xl border border-black-150 dark:border-black-800 bg-black-100 dark:bg-black-900 shadow-xs"
        >
          <img
            src={image.src}
            alt={image.alt}
            className="size-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}

interface TextSectionProps {
  title?: string;
  paragraphs: string[];
  ctaButton?: {
    href: string;
    text: string;
  };
}

export function TextSection({
  title,
  paragraphs,
  ctaButton,
}: TextSectionProps) {
  return (
    <div className="flex-1 space-y-4">
      {title && (
        <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground tracking-tight">
          {title}
        </h2>
      )}
      <div className="text-muted-foreground space-y-3.5 text-sm sm:text-base font-body leading-relaxed">
        {paragraphs.map((paragraph, index) => (
          <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} /> 
        ))}
      </div>
      {ctaButton && (
        <div className="pt-3">
          <a 
            href={ctaButton.href}
            className="woords_btn inline-block !bg-ghost-accent !text-black font-semibold text-xs py-3 px-6"
          >
            {ctaButton.text} →
          </a>
        </div>
      )}
    </div>
  );
}