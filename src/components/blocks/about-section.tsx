import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const AboutSection = () => {
  return (
    <section className="container mt-10 flex max-w-5xl flex-col-reverse gap-8 md:mt-14 md:gap-14 lg:mt-20 lg:flex-row lg:items-end">
      {/* Images Left - Text Right */}
      <div className="flex flex-col gap-8 lg:gap-16 xl:gap-20">
        <ImageSection
          images={[
            { src: "/about/1.webp", alt: "Data Science concepts visualization" },
            { src: "/about/2.webp", alt: "Hands-on coding session" },
          ]}
          className="xl:-translate-x-10"
        />

        <TextSection
          title="Our Story and Approach"
          paragraphs={[
            "This platform was launched in 2022 out of a need for <strong>clear, executable, and frustration-free ML content</strong>. We found that many resources either stayed too theoretical or provided incomplete code. We are built from the ground up to solve that: every tutorial is designed with a focus on <strong>mastery through implementation</strong>.",
            "We are committed to keeping the core educational content accessible and free. We operate leanly and are constantly focused on updating our library to reflect the rapid advancements in the AI landscape, particularly in areas like transformer models and ethical AI.",
            "If you share our passion for technical clarity and accessible ML education, we invite you to contribute or check out how you can join our team below.",
          ]}
          ctaButton={{
            href: "/contribute",
            text: "Contribute to our library",
          }}
        />
      </div>

      {/* Text Left - Images Right */}
      <div className="flex flex-col gap-8 lg:gap-16 xl:gap-20">
        <TextSection
          paragraphs={[
            "Our ultimate goal is to bridge the gap between complex research and practical application. We guide you from setting up your <strong>Python environment</strong> to deploying sophisticated models, always providing the 'why' alongside the executable 'how'. We break down dense topics like <strong>Linear Algebra</strong> and <strong>Deep Learning architectures</strong> into simple steps, ensuring true foundational understanding.",
            "We are community-driven—actively listening to which algorithms are trending, which frameworks are confusing, and what knowledge gaps exist. Our success is measured by the number of working models you build and the confidence you gain. When our readers succeed in their ML projects and careers, we know we've succeeded.",
          ]}
        />
        <ImageSection
          images={[
            { src: "/about/3.webp", alt: "Code editor with Python ML code" },
            { src: "/about/4.webp", alt: "Neural network diagram or model architecture" },
          ]}
          className="hidden lg:flex xl:translate-x-10"
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
    <div className={cn("flex flex-col gap-6", className)}>
      {images.map((image, index) => (
        <div
          key={index}
          className="relative aspect-[2/1.5] overflow-hidden rounded-2xl"
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
    <div className="flex-1 space-y-4 text-lg font-medium md:space-y-6">
      {title && <h2 className="text-primary text-4xl font-medium">{title}</h2>}
      <div className="text-muted-foreground max-w-xl space-y-6">
        {paragraphs.map((paragraph, index) => (
          // In a real React/JSX environment, this HTML will render correctly
          <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} /> 
        ))}
      </div>
      {ctaButton && (
        <div className="mt-8">
          <a href={ctaButton.href}>
            <Button size="lg">{ctaButton.text}</Button>
          </a>
        </div>
      )}
    </div>
  );
}