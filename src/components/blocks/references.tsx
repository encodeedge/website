import React from "react";
import ReferenceItem from "@/components/ui/ReferenceItem";

export const References = ({ items, title = "References" }: { items: { title: string; url: string; description?: string; type?: string; affiliate?: string; image?: string }[]; title?: string; }) => {
  return (
    <section className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((it, i) => (
          <ReferenceItem
            key={i}
            title={it.title}
            url={it.url}
            description={it.description}
            type={it.type}
            affiliate={it.affiliate}
            image={it.image}
          />
        ))}
      </div>
    </section>
  );
};

export default References;
