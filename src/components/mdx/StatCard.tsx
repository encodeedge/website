import React from "react";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  statValue: string;
  label: string;
  description?: string;
  accent?: "lime" | "rose" | "blue" | "lavender" | "peach";
}

const accentBorders = {
  lime: "border-l-ghost-accent bg-lime-50/50 dark:bg-lime-950/20",
  rose: "border-l-tag-rose bg-rose-50/50 dark:bg-rose-950/20",
  blue: "border-l-tag-blue bg-sky-50/50 dark:bg-sky-950/20",
  lavender: "border-l-tag-lavender bg-purple-50/50 dark:bg-purple-950/20",
  peach: "border-l-tag-peach bg-amber-50/50 dark:bg-amber-950/20",
};

export const StatCard: React.FC<StatCardProps> = ({
  statValue,
  label,
  description,
  accent = "lime",
}) => {
  return (
    <div
      className={cn(
        "my-6 rounded-2xl border border-black-200 dark:border-black-800 border-l-4 p-6 not-prose shadow-xs",
        accentBorders[accent] || accentBorders.lime,
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-3xl md:text-4xl font-extrabold font-display tracking-tight text-foreground">
            {statValue}
          </div>
          <div className="mt-1 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </div>
          {description && (
            <p className="mt-2 text-sm text-foreground/80 leading-relaxed">
              {description}
            </p>
          )}
        </div>
        <TrendingUp className="size-5 text-muted-foreground shrink-0 mt-1" />
      </div>
    </div>
  );
};
export default StatCard;

