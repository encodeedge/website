import React from "react";
import { Accordion } from "@/components/ui/accordion";
import FAQItem from "@/components/ui/FAQItem";

export const FAQs = ({
  items,
  title = "Frequently Asked Questions",
  intro,
}: {
  items: { question: string; answer: string; category?: string }[];
  title?: string;
  intro?: string;
}) => {
  const groups: Record<string, typeof items> = {};
  items.forEach((it) => {
    const key = it.category || "General";
    if (!groups[key]) groups[key] = [];
    groups[key].push(it);
  });

  return (
    <section className="py-8">
      <div className="container max-w-5xl">
        <div className="mx-auto">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold">{title}</h2>
            {intro && <p className="text-muted-foreground mt-2 max-w-xl mx-auto">{intro}</p>}
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {Object.entries(groups).map(([category, group], gi) => (
              <div
                key={category}
                className="bg-gradient-to-b from-muted/5 via-transparent to-background/60 border border-border rounded-xl p-4"
              >
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">{category}</h3>
                <Accordion type="single" collapsible className="w-full">
                  {group.map((it, i) => (
                    <FAQItem
                      key={i}
                      value={`${gi}-${i}`}
                      question={it.question}
                      answer={it.answer}
                    />
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQs;
