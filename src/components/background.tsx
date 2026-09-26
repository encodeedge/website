import React from "react";

import { cn } from "@/lib/utils";

type BackgroundProps = {
  children: React.ReactNode;
  variant?: "top" | "bottom";
  className?: string;
};

export const Background = ({
  children,
  variant = "top",
  className,
}: BackgroundProps) => {
  return (
    <div
      className={cn(
        "relative mx-2.5 mt-2.5 lg:mx-4",
        variant === "top" &&
          "from-black-100/60 dark:from-black-900/40 via-background to-background rounded-t-4xl rounded-b-2xl bg-linear-to-b via-20%",
        variant === "bottom" &&
          "from-background via-background to-black-100/60 dark:to-black-900/40 rounded-t-2xl rounded-b-4xl bg-linear-to-b",
        className,
      )}
    >
      {children}
    </div>
  );
};
