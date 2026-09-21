"use client";

import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const currentlyDark = document.documentElement.classList.contains("dark");
    setIsDark(currentlyDark);
  }, []);

  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const currentlyDark = document.documentElement.classList.contains("dark");
    const nextDark = !currentlyDark;

    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    setIsDark(nextDark);
    window.dispatchEvent(new CustomEvent("theme-change", { detail: { theme: nextDark ? "dark" : "light" } }));
  };

  if (!mounted) {
    return (
      <button
        type="button"
        className="size-8 rounded-full border border-border bg-background flex items-center justify-center cursor-pointer"
        aria-label="Toggle theme"
      >
        <Sun className="size-4 text-foreground" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="size-8 rounded-full border border-border bg-background hover:bg-black-100 dark:hover:bg-black-800 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Moon className="size-4 text-[#E5E795] fill-[#E5E795]/20 transition-transform duration-200" />
      ) : (
        <Sun className="size-4 text-foreground transition-transform duration-200" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
};
