import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { 
  X, 
  Menu, 
  Github, 
  Twitter, 
  Linkedin, 
  Rss, 
  ChevronDown, 
  ArrowRight,
  ExternalLink,
  Sparkles,
  LayoutDashboard,
  FlaskConical,
  GraduationCap,
  Coffee
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { GITHUB_URL } from "@/consts";
import { cn } from "@/lib/utils";
import { GlobalSearch } from "@/components/ui/global-search";

export interface NavChildItem {
  label: string;
  href: string;
  description?: string;
  badge?: string;
  icon?: string;
  openInNewTab?: boolean;
}

export interface NavItem {
  label: string;
  href?: string;
  badge?: string;
  icon?: string;
  openInNewTab?: boolean;
  children?: NavChildItem[];
}

interface NavbarProps {
  navLinks?: NavItem[];
  enableSearch?: boolean;
  enableLive?: boolean;
  showSubscribeButton?: boolean;
  subscribeButtonText?: string;
  subscribeButtonUrl?: string;
  showCoffeeButton?: boolean;
  coffeeButtonText?: string;
  coffeeButtonUrl?: string;
}

const FALLBACK_NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Learn",
    href: "/courses",
    children: [
      {
        label: "Courses",
        href: "/courses",
        description: "Full-stack AI, ML, and Python curriculum with code walkthroughs",
        badge: "Popular"
      },
      {
        label: "System Design",
        href: "/system-design",
        description: "Interactive flight simulator, production reference architectures, and AWS blueprints",
        badge: "Interactive"
      },
      {
        label: "Live Classes",
        href: "/live-classes",
        description: "Interactive cohorts, hands-on workshops, and webinars",
        badge: "Live"
      },
      {
        label: "Roadmaps",
        href: "/roadmaps",
        description: "Visual career roadmaps and guided competency paths"
      },
      {
        label: "Topics",
        href: "/topics",
        description: "Browse all lessons, algorithms, and deep-dive concepts"
      }
    ]
  },
  {
    label: "Labs",
    href: "/labs",
    badge: "Interactive",
    children: [
      {
        label: "Interactive Simulators",
        href: "/labs",
        description: "Visual playgrounds for Attention, Convolutions, and Memory",
        badge: "New"
      },
      {
        label: "AIML System Design Lab",
        href: "/system-design",
        description: "AWS-style drag-and-drop ML pipeline builder and game",
        badge: "Game"
      },
      {
        label: "Math & AI Decoder",
        href: "/labs#math-decoder",
        description: "Glossary of neural network symbols, notation, and LaTeX"
      },
      {
        label: "Competitions",
        href: "/competitions",
        description: "Live Kaggle, HackerRank, and hackathon challenges tracker",
        badge: "Live"
      }
    ]
  },
  { label: "Dashboard", href: "/dashboard", badge: "LMS" },
  { label: "Blog", href: "/blog" },
  {
    label: "More",
    href: "/about",
    children: [
      {
        label: "About Us",
        href: "/about",
        description: "Our mission, team, and modern AI engineering education"
      },
      {
        label: "FAQs",
        href: "/faq",
        description: "Answers to commonly asked questions"
      },
      {
        label: "Contact",
        href: "/contact",
        description: "Get in touch with instructors and the community"
      },
      {
        label: "Verify Certificate",
        href: "/verify/demo",
        description: "Cryptographically verify student certificates and credentials"
      }
    ]
  }
];

export const Navbar = ({
  navLinks,
  enableSearch = true,
  enableLive = true,
  showSubscribeButton = true,
  subscribeButtonText = "Subscribe",
  subscribeButtonUrl = "/subscribe",
  showCoffeeButton = true,
  coffeeButtonText = "Buy Me a Coffee",
  coffeeButtonUrl = "https://buymeacoffee.com/encodeedge",
}: NavbarProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [pathname, setPathname] = useState("");
  const [mounted, setMounted] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [expandedMobileMenus, setExpandedMobileMenus] = useState<Record<string, boolean>>({});
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Use provided nav links or fall back
  const baseItems = navLinks && navLinks.length > 0 ? navLinks : FALLBACK_NAV_ITEMS;

  // Filter out live classes if explicitly disabled by feature flag
  const filteredItems = baseItems.map(item => {
    if (item.children) {
      return {
        ...item,
        children: item.children.filter(child => {
          if (child.href === "/live-classes" && !enableLive) return false;
          return true;
        })
      };
    }
    if (item.href === "/live-classes" && !enableLive) return null;
    return item;
  }).filter(Boolean) as NavItem[];

  // Smart Desktop Auto-Overflow: If user configured more than 6 flat links, group the rest under "More"
  const formattedItems: NavItem[] = React.useMemo(() => {
    // If items already have dropdowns or length <= 6, keep as is
    if (filteredItems.length <= 6) return filteredItems;

    const visibleItems: NavItem[] = [];
    const overflowItems: NavChildItem[] = [];

    filteredItems.forEach((item, index) => {
      if (index < 5) {
        visibleItems.push(item);
      } else {
        if (item.children && item.children.length > 0) {
          overflowItems.push(...item.children);
        } else {
          overflowItems.push({
            label: item.label,
            href: item.href || "#",
            badge: item.badge,
            openInNewTab: item.openInNewTab
          });
        }
      }
    });

    if (overflowItems.length > 0) {
      visibleItems.push({
        label: "More",
        href: "#",
        children: overflowItems
      });
    }

    return visibleItems;
  }, [filteredItems]);

  useEffect(() => {
    setMounted(true);
    setPathname(window.location.pathname);
  }, []);

  // Close drawer on escape key & outside clicks
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsDrawerOpen(false);
        setActiveDropdown(null);
      }
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

  const isActive = (href?: string) => {
    if (!href || href === "#") return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const isParentActive = (item: NavItem) => {
    if (item.href && isActive(item.href)) return true;
    if (item.children && item.children.length > 0) {
      return item.children.some(c => isActive(c.href));
    }
    return false;
  };

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  const toggleMobileAccordion = (label: string) => {
    setExpandedMobileMenus(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const renderBadge = (badge?: string) => {
    if (!badge) return null;
    const b = badge.toLowerCase();
    const style = 
      b === "new" ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" :
      b === "live" ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 animate-pulse" :
      b === "popular" || b === "hot" ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30" :
      b === "lms" ? "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30" :
      "bg-primary/15 text-primary border-primary/30";

    return (
      <span className={cn("px-1.5 py-0.2 text-[9px] font-bold uppercase rounded-md tracking-wider border leading-none shrink-0 inline-flex items-center", style)}>
        {badge}
      </span>
    );
  };

  return (
    <>
      <header className="w-full bg-background/90 backdrop-blur-md sticky top-0 z-50 border-b border-black-150 dark:border-black-800 transition-colors">
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

        {/* Second Tier: Woords Navigation Bar */}
        <div className="py-2.5">
          <div className="woords_container flex items-center justify-between gap-3 2xl:gap-6">
            {/* Left Column: Social Links (Desktop) */}
            <div className="hidden xl:flex items-center space-x-2 2xl:space-x-2.5 text-muted-foreground shrink-0">
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
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                aria-label="Open menu"
                className="p-1.5 -ml-1 text-foreground hover:opacity-80 transition-opacity cursor-pointer rounded-lg hover:bg-black-100 dark:hover:bg-black-800"
              >
                <Menu className="size-5" />
              </button>
            </div>

            {/* Center Column: Navigation Links (Desktop) */}
            <nav className="hidden xl:flex items-center justify-center flex-1 min-w-0 px-1">
              <ul className="flex items-center space-x-0.5 2xl:space-x-1 font-medium text-sm">
                {formattedItems.map((item, index) => {
                  const hasChildren = item.children && item.children.length > 0;
                  const active = isParentActive(item);
                  const isDropdownOpen = activeDropdown === item.label;
                  const isLastOrMore = item.label === "More" || index >= formattedItems.length - 2;

                  if (hasChildren) {
                    return (
                      <li
                        key={item.label}
                        className="relative"
                        onMouseEnter={() => handleMouseEnter(item.label)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <button
                          type="button"
                          onClick={() => setActiveDropdown(isDropdownOpen ? null : item.label)}
                          aria-expanded={isDropdownOpen}
                          className={cn(
                            "px-3 py-1.5 2xl:px-3.5 rounded-full transition-all duration-150 relative inline-flex items-center gap-1.5 cursor-pointer select-none text-xs 2xl:text-sm",
                            active || isDropdownOpen
                              ? "font-semibold text-foreground bg-black-100 dark:bg-black-800"
                              : "text-muted-foreground hover:text-foreground hover:bg-black-50 dark:hover:bg-black-850",
                          )}
                        >
                          <span>{item.label}</span>
                          {renderBadge(item.badge)}
                          <ChevronDown className={cn(
                            "size-3.5 transition-transform duration-200 text-muted-foreground",
                            isDropdownOpen && "rotate-180 text-foreground"
                          )} />
                        </button>

                        {/* Dropdown Menu Flyout */}
                        {isDropdownOpen && (
                          <div 
                            className={cn(
                              "absolute top-full pt-2 z-[60] min-w-[280px] w-max max-w-[360px]",
                              isLastOrMore ? "right-0 left-auto translate-x-0" : "left-1/2 -translate-x-1/2"
                            )}
                            onMouseEnter={() => handleMouseEnter(item.label)}
                            onMouseLeave={handleMouseLeave}
                          >
                            <div className="p-2 rounded-2xl bg-card/95 backdrop-blur-xl border border-border shadow-xl ring-1 ring-black/5 dark:ring-white/10 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                              {item.children?.map((child) => {
                                const childActive = isActive(child.href);
                                return (
                                  <a
                                    key={child.href}
                                    href={child.href}
                                    target={child.openInNewTab ? "_blank" : undefined}
                                    rel={child.openInNewTab ? "noopener noreferrer" : undefined}
                                    onClick={() => setActiveDropdown(null)}
                                    className={cn(
                                      "flex items-start justify-between gap-3 p-2.5 rounded-xl transition-all duration-150 group/item",
                                      childActive
                                        ? "bg-primary/10 text-primary font-semibold"
                                        : "hover:bg-muted/80 text-foreground"
                                    )}
                                  >
                                    <div className="space-y-0.5 text-left">
                                      <div className="text-xs font-semibold flex items-center gap-1.5 group-hover/item:text-primary transition-colors">
                                        <span>{child.label}</span>
                                        {renderBadge(child.badge)}
                                      </div>
                                      {child.description && (
                                        <p className="text-[11px] text-muted-foreground line-clamp-2 font-normal leading-relaxed">
                                          {child.description}
                                        </p>
                                      )}
                                    </div>
                                    <ArrowRight className="size-3.5 text-muted-foreground/40 group-hover/item:text-primary group-hover/item:translate-x-0.5 transition-all mt-0.5 shrink-0" />
                                  </a>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </li>
                    );
                  }

                  return (
                    <li key={item.label}>
                      <a
                        href={item.href || "#"}
                        target={item.openInNewTab ? "_blank" : undefined}
                        rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                        className={cn(
                          "px-3.5 py-1.5 rounded-full transition-all duration-150 relative inline-flex items-center gap-1.5",
                          active
                            ? "font-semibold text-foreground bg-black-100 dark:bg-black-800"
                            : "text-muted-foreground hover:text-foreground hover:bg-black-50 dark:hover:bg-black-850",
                        )}
                      >
                        <span>{item.label}</span>
                        {renderBadge(item.badge)}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Right Column: Actions (Search, Subscribe & Theme Toggle) */}
            <div className="flex items-center justify-end space-x-2 sm:space-x-2.5 shrink-0">
              {enableSearch && <GlobalSearch />}

              {showCoffeeButton && (
                <a
                  href={coffeeButtonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#FFDD00] hover:bg-[#FFDD00]/90 text-slate-950 transition-all shadow-xs shrink-0 cursor-pointer font-sans"
                  title="Buy Me a Coffee"
                >
                  <Coffee className="size-3.5 fill-black/20" />
                  <span>{coffeeButtonText}</span>
                </a>
              )}

              {showSubscribeButton && (
                <a
                  href={subscribeButtonUrl}
                  className="woords_btn shadow-xs text-xs font-semibold shrink-0"
                >
                  <span>{subscribeButtonText}</span>
                </a>
              )}

              <div className="pl-1 border-l border-border/60">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Portal (Mounts directly into body to prevent backdrop-filter stacking context bugs) */}
      {mounted &&
        createPortal(
          <>
            {/* Mobile Drawer Overlay */}
            <div
              onClick={() => setIsDrawerOpen(false)}
              className={cn(
                "fixed inset-0 bg-black/70 backdrop-blur-xs z-[9999] transition-opacity duration-300 xl:hidden",
                isDrawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
              )}
            />

            {/* Mobile Drawer (Woords Style) */}
            <div
              className={cn(
                "fixed top-0 left-0 h-full w-[85%] max-w-[360px] bg-background border-r border-border shadow-2xl z-[10000] transform transition-transform duration-300 ease-in-out xl:hidden flex flex-col justify-between p-6 overflow-y-auto",
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
                    type="button"
                    onClick={() => setIsDrawerOpen(false)}
                    aria-label="Close menu"
                    className="p-1 rounded-full text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                {/* Drawer Navigation */}
                <nav className="mt-6">
                  <ul className="space-y-1.5">
                    {filteredItems.map((item) => {
                      const hasChildren = item.children && item.children.length > 0;
                      const active = isParentActive(item);
                      const isExpanded = expandedMobileMenus[item.label] ?? active;

                      if (hasChildren) {
                        return (
                          <li key={item.label} className="rounded-xl overflow-hidden">
                            <button
                              type="button"
                              onClick={() => toggleMobileAccordion(item.label)}
                              className={cn(
                                "w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-base font-medium transition-colors cursor-pointer",
                                active
                                  ? "bg-black-100 dark:bg-black-800 text-foreground font-semibold"
                                  : "text-muted-foreground hover:text-foreground hover:bg-black-50 dark:hover:bg-black-850",
                              )}
                            >
                              <div className="flex items-center gap-2">
                                <span>{item.label}</span>
                                {renderBadge(item.badge)}
                              </div>
                              <ChevronDown className={cn(
                                "size-4 text-muted-foreground transition-transform duration-200",
                                isExpanded && "rotate-180"
                              )} />
                            </button>

                            {/* Mobile Accordion Sub-links */}
                            {isExpanded && (
                              <ul className="mt-1 ml-3 pl-3 border-l-2 border-border/80 space-y-1 py-1">
                                {item.children?.map((child) => {
                                  const childActive = isActive(child.href);
                                  return (
                                    <li key={child.href}>
                                      <a
                                        href={child.href}
                                        target={child.openInNewTab ? "_blank" : undefined}
                                        rel={child.openInNewTab ? "noopener noreferrer" : undefined}
                                        onClick={() => setIsDrawerOpen(false)}
                                        className={cn(
                                          "block px-3 py-2 rounded-lg text-sm transition-colors",
                                          childActive
                                            ? "bg-primary/10 text-primary font-semibold"
                                            : "text-muted-foreground hover:text-foreground hover:bg-black-50 dark:hover:bg-black-850"
                                        )}
                                      >
                                        <div className="flex items-center justify-between">
                                          <span>{child.label}</span>
                                          {renderBadge(child.badge)}
                                        </div>
                                        {child.description && (
                                          <p className="text-[11px] text-muted-foreground/80 mt-0.5 line-clamp-1 font-normal">
                                            {child.description}
                                          </p>
                                        )}
                                      </a>
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </li>
                        );
                      }

                      return (
                        <li key={item.label}>
                          <a
                            href={item.href || "#"}
                            target={item.openInNewTab ? "_blank" : undefined}
                            rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                            onClick={() => setIsDrawerOpen(false)}
                            className={cn(
                              "flex items-center justify-between px-4 py-2.5 rounded-xl text-base font-medium transition-colors",
                              active
                                ? "bg-black-100 dark:bg-black-800 text-foreground font-semibold"
                                : "text-muted-foreground hover:text-foreground hover:bg-black-50 dark:hover:bg-black-850",
                            )}
                          >
                            <span>{item.label}</span>
                            {renderBadge(item.badge)}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </div>

              {/* Drawer Footer with Socials */}
              <div className="pt-6 border-t border-border mt-6">
                <div className="flex items-center justify-between text-muted-foreground">
                  <div className="flex items-center space-x-3">
                    <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground" aria-label="GitHub">
                      <Github className="size-4" />
                    </a>
                    <a href="https://x.com/encodeedge" target="_blank" rel="noopener noreferrer" className="hover:text-foreground" aria-label="X / Twitter">
                      <Twitter className="size-4" />
                    </a>
                    <a href="https://www.linkedin.com/company/encodeedge" target="_blank" rel="noopener noreferrer" className="hover:text-foreground" aria-label="LinkedIn">
                      <Linkedin className="size-4" />
                    </a>
                    <a href="/rss.xml" className="hover:text-foreground" aria-label="RSS Feed">
                      <Rss className="size-4" />
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    {showCoffeeButton && (
                      <a
                        href={coffeeButtonUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FFDD00] text-slate-950 shadow-xs"
                      >
                        <Coffee className="size-3.5 fill-black/20" />
                        <span>Coffee</span>
                      </a>
                    )}
                    {showSubscribeButton && (
                      <a href={subscribeButtonUrl} className="text-xs font-semibold text-foreground underline">
                        {subscribeButtonText}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>,
          document.body,
        )}
    </>
  );
};

export default Navbar;