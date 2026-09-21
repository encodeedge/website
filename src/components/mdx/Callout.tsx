import React from "react";
import { Info, Lightbulb, AlertTriangle, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalloutProps {
  kind?: "info" | "tip" | "warning" | "danger" | "success";
  type?: "info" | "tip" | "warning" | "danger" | "success";
  title?: string;
  children: React.ReactNode;
}

const variantStyles = {
  info: {
    border: "border-sky-300 dark:border-sky-800",
    bg: "bg-sky-50 dark:bg-sky-950/40",
    text: "text-sky-950 dark:text-sky-100",
    icon: Info,
    iconColor: "text-sky-600 dark:text-sky-400",
  },
  tip: {
    border: "border-emerald-300 dark:border-emerald-800",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-950 dark:text-emerald-100",
    icon: Lightbulb,
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  warning: {
    border: "border-amber-300 dark:border-amber-800",
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-950 dark:text-amber-100",
    icon: AlertTriangle,
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  danger: {
    border: "border-rose-300 dark:border-rose-800",
    bg: "bg-rose-50 dark:bg-rose-950/40",
    text: "text-rose-950 dark:text-rose-100",
    icon: AlertCircle,
    iconColor: "text-rose-600 dark:text-rose-400",
  },
  success: {
    border: "border-lime-300 dark:border-lime-800",
    bg: "bg-lime-50 dark:bg-lime-950/40",
    text: "text-lime-950 dark:text-lime-100",
    icon: CheckCircle,
    iconColor: "text-lime-600 dark:text-lime-400",
  },
};

export const Callout: React.FC<CalloutProps> = ({
  kind,
  type = "info",
  title,
  children,
}) => {
  const selectedKind = kind || type;
  const current = variantStyles[selectedKind] || variantStyles.info;
  const Icon = current.icon;

  return (
    <div
      className={cn(
        "my-6 rounded-2xl border p-5 transition-colors duration-200 not-prose",
        current.border,
        current.bg,
        current.text,
      )}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">
          <Icon className={cn("size-5", current.iconColor)} />
        </div>
        <div className="space-y-1.5 flex-1">
          {title && (
            <h5 className="font-semibold text-base leading-tight font-display tracking-tight">
              {title}
            </h5>
          )}
          <div className="text-sm leading-relaxed opacity-90 prose-p:my-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Callout;

