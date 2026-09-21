import { useState, useEffect } from "react";
import { X, Menu, Github, Twitter, Linkedin, Rss } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { GITHUB_URL } from "@/consts";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Roadmaps", href: "/roadmaps" },
  { label: "Topics", href: "/topics" },
  { label: "Blog", href: "/blog" },
  { label: "Courses", href: "/courses" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [pathname, setPathname] = useState("");

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  // Close drawer on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsDrawerOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="w-full bg-background/90 backdrop-blur-md sticky top-0 z-40 border-b border-black-150 dark:border-black-800 transition-colors">
      {/* Top Tier: Centered Publication Brand */}
      <div className="py-4 md:py-5 flex justify-center border-b border-black-100 dark:border-black-850">
        <a href="/" className="flex items-center gap-2 group">
          <img
            src="/logos/logo.png"
            alt="EncodeEdge Logo"
            className="h-7 w-auto dark:invert transition-transform group-hover:scale-105"
          />
          <span className="font-display font-extrabold text-2xl tracking-tight text-foreground">
            Encode<span className="text-black/60 dark:text-white/60 font-medium">Edge</span>
          </span>
        </a>
      </div>

      {/* Second Tier: Woords 3-Column Navigation Bar */}
      <div className="py-2.5">
        <div className="woords_container grid grid-cols-3 xl:grid-cols-[1fr_auto_1fr] items-center">
          {/* Left Column: Social Links (Desktop) */}
          <div className="hidden xl:flex items-center space-x-3 text-muted-foreground">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors p-1.5 rounded-full hover:bg-black-100 dark:hover:bg-black-800"
              aria-label="GitHub"
            >
              <Github className="size-4" />
            </a>
            <a
              href="https://x.com/encodeedge"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors p-1.5 rounded-full hover:bg-black-100 dark:hover:bg-black-800"
              aria-label="X / Twitter"
            >
              <Twitter className="size-4" />
            </a>
            <a
              href="https://www.linkedin.com/company/encodeedge"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors p-1.5 rounded-full hover:bg-black-100 dark:hover:bg-black-800"
              aria-label="LinkedIn"
            >
              <Linkedin className="size-4" />
            </a>
            <a
              href="/rss.xml"
              className="hover:text-foreground transition-colors p-1.5 rounded-full hover:bg-black-100 dark:hover:bg-black-800"
              aria-label="RSS Feed"
            >
              <Rss className="size-4" />
            </a>
          </div>

          {/* Mobile Left: Drawer Toggle */}
          <div className="flex items-center xl:hidden">
            <button
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Open menu"
              className="p-1.5 -ml-1 text-foreground hover:opacity-80 transition-opacity cursor-pointer"
            >
              <Menu className="size-5" />
            </button>
          </div>

          {/* Center Column: Navigation Links (Desktop) */}
          <nav className="hidden xl:flex items-center justify-center">
            <ul className="flex items-center space-x-1 font-medium text-sm">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className={cn(
                        "px-3.5 py-1.5 rounded-full transition-all duration-150 relative",
                        active
                          ? "font-semibold text-foreground bg-black-100 dark:bg-black-800"
                          : "text-muted-foreground hover:text-foreground hover:bg-black-50 dark:hover:bg-black-850",
                      )}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right Column: Actions (Subscribe, Search/Topics, Theme Toggle) */}
          <div className="flex items-center justify-end space-x-3 col-span-2 xl:col-span-1">
            <a
              href="/subscribe"
              className="woords_btn shadow-xs text-xs font-semibold shrink-0"
            >
              <span>Subscribe</span>
            </a>

            <div className="pl-1 border-l border-border/60">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <div
        onClick={() => setIsDrawerOpen(false)}
        className={cn(
          "fixed inset-0 bg-black/70 backdrop-blur-xs z-50 transition-opacity duration-300 xl:hidden",
          isDrawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
      />

      {/* Mobile Drawer (Woords Style) */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full w-[85%] max-w-[360px] bg-background border-r border-border shadow-2xl z-50 transform transition-transform duration-300 ease-in-out xl:hidden flex flex-col justify-between p-6",
          isDrawerOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div>
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-6 border-b border-border">
            <div className="flex items-center gap-2">
              <img src="/logos/logo.png" alt="EncodeEdge" className="h-6 w-auto dark:invert" />
              <span className="font-display font-bold text-lg">EncodeEdge</span>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              aria-label="Close menu"
              className="p-1 rounded-full text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Drawer Navigation */}
          <nav className="mt-6">
            <ul className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={() => setIsDrawerOpen(false)}
                      className={cn(
                        "block px-4 py-2.5 rounded-xl text-base font-medium transition-colors",
                        active
                          ? "bg-black-100 dark:bg-black-800 text-foreground font-semibold"
                          : "text-muted-foreground hover:text-foreground hover:bg-black-50 dark:hover:bg-black-850",
                      )}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Drawer Footer with Socials */}
        <div className="pt-6 border-t border-border">
          <div className="flex items-center justify-between text-muted-foreground">
            <div className="flex items-center space-x-3">
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                <Github className="size-4" />
              </a>
              <a href="https://x.com/encodeedge" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                <Twitter className="size-4" />
              </a>
              <a href="https://www.linkedin.com/company/encodeedge" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                <Linkedin className="size-4" />
              </a>
              <a href="/rss.xml" className="hover:text-foreground">
                <Rss className="size-4" />
              </a>
            </div>
            <a href="/subscribe" className="text-xs font-semibold text-foreground underline">
              Subscribe
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;