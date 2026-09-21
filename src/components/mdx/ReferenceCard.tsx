import React from "react";
import { ExternalLink, BookOpen, GraduationCap, Link2, FileText } from "lucide-react";

interface ReferenceCardProps {
  title: string;
  url: string;
  type?: "book" | "course" | "link" | "paper" | "documentation";
  description?: string;
  author?: string;
}

const typeIcons = {
  book: BookOpen,
  course: GraduationCap,
  link: Link2,
  paper: FileText,
  documentation: FileText,
};

export const ReferenceCard: React.FC<ReferenceCardProps> = ({
  title,
  url,
  type = "link",
  description,
  author,
}) => {
  const Icon = typeIcons[type] || Link2;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="my-4 block group rounded-2xl border border-black-200 dark:border-black-800 bg-black-50/70 dark:bg-black-900/60 p-5 not-prose hover:border-black-400 dark:hover:border-black-600 transition-all duration-200 shadow-xs"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-white dark:bg-black-800 border border-border shrink-0 text-foreground group-hover:scale-105 transition-transform">
            <Icon className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {type}
              </span>
              {author && (
                <span className="text-[11px] text-muted-foreground">
                  • by {author}
                </span>
              )}
            </div>
            <h5 className="font-bold text-base text-foreground group-hover:text-primary transition-colors leading-snug">
              {title}
            </h5>
            {description && (
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                {description}
              </p>
            )}
          </div>
        </div>
        <ExternalLink className="size-4 text-muted-foreground group-hover:text-foreground shrink-0 mt-1 transition-colors" />
      </div>
    </a>
  );
};
export default ReferenceCard;

