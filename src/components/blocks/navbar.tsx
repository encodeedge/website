import { useState, useEffect } from "react";

import { ChevronRight, Github } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { GITHUB_URL } from "@/consts";
import { cn } from "@/lib/utils";

// --- New Structured Topic Data for Horizontal Display ---
const TOPIC_DROPDOWN_STRUCTURE = [
  {
    category: "Foundation",
    items: [
      { title: "Python for Machine Learning", href: "/topics/python", description: "Basics of Python" },
    ],
  },
  {
    category: "Machine Learning",
    items: [
      { title: "Machine Learning Tutorials", href: "/topics/machine-learning", description: "Practical Machine Learning tutorials" },
    ],
  },
];

const ITEMS = [
  { label: "Get Started", href: "/start-here" },
  {
    label: "Topics",
    href: "#topics",
    dropdownStructure: TOPIC_DROPDOWN_STRUCTURE,
  },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [pathname, setPathname] = useState("");
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  useEffect(() => {
    // percentage of the total scrollable height after which navbar hides
    const HIDE_AFTER_PERCENT = 20; // change this value to taste (0-100)

    function onScroll() {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) {
        setIsHidden(false);
        return;
      }
      const threshold = (HIDE_AFTER_PERCENT / 100) * scrollable;
      setIsHidden(scrollTop > threshold);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    // evaluate once on mount
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      className={cn(
        "bg-background/70 fixed left-1/2 z-50 w-[min(90%,700px)] -translate-x-1/2 rounded-4xl border backdrop-blur-md transition-all duration-300",
        // hide with a negative translate-y so it slides up smoothly
        isHidden ? "-translate-y-28 opacity-0 pointer-events-none" : "translate-y-0 opacity-100",
        "top-5 lg:top-12",
      )}
    >
      <div className="flex items-center justify-between px-6 py-3">
        <a href="/" className="flex shrink-0 items-center gap-2">
          <img
            src="/logos/logo.png"
            alt="logo"
            width={94}
            height={18}
            className="dark:invert"
          />
        </a>

        {/* Desktop Navigation */}
        <NavigationMenu className="max-lg:hidden">
          <NavigationMenuList>
            {ITEMS.map((link) =>
              link.dropdownStructure ? ( // Check for new structure property
                <NavigationMenuItem key={link.label} className="">
                  <NavigationMenuTrigger className="data-[state=open]:bg-accent/50 bg-transparent! px-1.5">
                    {link.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="left-0"> {/* ADDED left-0 HERE */}
                    {/* Updated rendering for 4-column horizontal layout */}
                    <div className="grid w-[800px] grid-cols-4 gap-6 p-4"> {/* CHANGED w-[600px] to w-[800px] AND grid-cols-3 to grid-cols-4 */}
                      {link.dropdownStructure.map((category, categoryIndex) => (
                        <div key={categoryIndex} className="space-y-3">
                          <h4 className="text-primary text-sm font-bold tracking-wider uppercase border-b pb-1 mb-2">
                            {category.category}
                          </h4>
                          <ul className="space-y-1">
                            {category.items.map((item) => (
                              <li key={item.title}>
                                <a
                                  href={item.href}
                                  className="group block rounded-md p-2 transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                >
                                  <div className="space-y-0.5 transition-transform duration-300 group-hover:translate-x-0.5">
                                    <div className="text-sm leading-none font-medium">
                                      {item.title}
                                    </div>
                                    <p className="text-muted-foreground line-clamp-2 text-xs leading-snug">
                                      {item.description}
                                    </p>
                                  </div>
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem key={link.label} className="">
                  <a
                    href={link.href}
                    className={cn(
                      "relative bg-transparent px-1.5 text-sm font-medium transition-opacity hover:opacity-75",
                      pathname === link.href && "text-muted-foreground",
                    )}
                  >
                    {link.label}
                  </a>
                </NavigationMenuItem>
              ),
            )}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Auth Buttons */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <a href="/subscribe" className="max-lg:hidden">
            <Button variant="outline">
              <span className="relative z-10">Subscribe</span>
            </Button>
          </a>
          <a
            href={GITHUB_URL}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="size-4" />
            <span className="sr-only">GitHub</span>
          </a>

          {/* Hamburger Menu Button (Mobile Only) */}
          <button
            className="text-muted-foreground relative flex size-8 lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            <div className="absolute top-1/2 left-1/2 block w-[18px] -translate-x-1/2 -translate-y-1/2">
              <span
                aria-hidden="true"
                className={`absolute block h-0.5 w-full rounded-full bg-current transition duration-500 ease-in-out ${isMenuOpen ? "rotate-45" : "-translate-y-1.5"}`}
              ></span>
              <span
                aria-hidden="true"
                className={`absolute block h-0.5 w-full rounded-full bg-current transition duration-500 ease-in-out ${isMenuOpen ? "opacity-0" : ""}`}
              ></span>
              <span
                aria-hidden="true"
                className={`absolute block h-0.5 w-full rounded-full bg-current transition duration-500 ease-in-out ${isMenuOpen ? "-rotate-45" : "translate-y-1.5"}`}
              ></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Navigation (Using old single column, can be updated later) */}
      <div
        className={cn(
          "bg-background fixed inset-x-0 top-[calc(100%+1rem)] flex flex-col rounded-2xl border p-6 transition-all duration-300 ease-in-out lg:hidden",
          isMenuOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-4 opacity-0",
        )}
      >
        <nav className="divide-border flex flex-1 flex-col divide-y">
          {ITEMS.map((link) =>
            link.dropdownStructure ? ( // Check for new structure property
              <div key={link.label} className="py-4 first:pt-0 last:pb-0">
                <button
                  onClick={() =>
                    setOpenDropdown(
                      openDropdown === link.label ? null : link.label,
                    )
                  }
                  className="text-foreground flex w-full items-center justify-between text-base font-medium"
                >
                  {link.label}
                  <ChevronRight
                    className={cn(
                      "size-4 transition-transform duration-200",
                      openDropdown === link.label ? "rotate-90" : "",
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300",
                    openDropdown === link.label
                      ? "mt-4 max-h-[1000px] opacity-100"
                      : "max-h-0 opacity-0",
                  )}
                >
                  <div className="bg-muted/50 space-y-3 rounded-lg p-4">
                    {/* Mobile menu rendering remains a single list for simplicity */}
                    {link.dropdownStructure.flatMap(category => category.items).map((item) => (
                      <a
                        key={item.title}
                        href={item.href}
                        className="hover:bg-accent group block rounded-md p-2 transition-colors"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setOpenDropdown(null);
                        }}
                      >
                        <div className="transition-transform duration-200 group-hover:translate-x-1">
                          <div className="text-primary font-medium">
                            {item.title}
                          </div>

                          <p className="text-muted-foreground mt-1 text-sm">
                            {item.description}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className={cn(
                  "text-foreground hover:text-foreground/80 py-4 text-base font-medium transition-colors first:pt-0 last:pb-0",
                  pathname === link.href && "text-muted-foreground",
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </a>
            ),
          )}
        </nav>
      </div>
    </section>
  );
};