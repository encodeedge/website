import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GITHUB_URL } from "@/consts";

export function Footer() {
  const navigation = [
    { name: "Product", href: "/#feature-modern-teams" },
    { name: "About Us", href: "/about" },
    { name: "Pricing", href: "/pricing" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact", href: "/contact" },
  ];

  const social = [
    { name: "Twitter", href: "https://x.com/encodeedge" },
    { name: "LinkedIn", href: "https://www.linkedin.com/company/encodeedge" },
  ];

  const legal = [{ name: "Privacy Policy", href: "/privacy" }];

  return (
    <footer className="flex flex-col items-center gap-14 pt-28 lg:pt-32">
      <div className="container space-y-3 text-center">
        <h2 className="text-2xl tracking-tight md:text-4xl lg:text-5xl">
          Start your free trial today
        </h2>
        <p className="text-muted-foreground mx-auto max-w-xl leading-snug text-balance">
          Mainline is the fit-for-purpose tool for planning and building modern
          software products.
        </p>
        <div>
          <Button size="lg" className="mt-4" asChild>
            <a href={GITHUB_URL}>Get template</a>
          </Button>
        </div>
      </div>

      <nav className="container flex flex-col items-center gap-4">
        <ul className="flex flex-wrap items-center justify-center gap-6">
          {navigation.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className="font-medium transition-opacity hover:opacity-75"
              >
                {item.name}
              </a>
            </li>
          ))}
          {social.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className="flex items-center gap-0.5 font-medium transition-opacity hover:opacity-75"
              >
                {item.name} <ArrowUpRight className="size-4" />
              </a>
            </li>
          ))}
        </ul>
        <ul className="flex flex-wrap items-center justify-center gap-6">
          {legal.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className="text-muted-foreground text-sm transition-opacity hover:opacity-75"
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="text-primary mt-10 w-full md:mt-14 lg:mt-20">
        <svg width="1570" height="293" viewBox="0 0 1570 293" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
  <defs>
    <linearGradient id="textGradient" x1="785" y1="0" x2="785" y2="293" gradientUnits="userSpaceOnUse">
      <stop stopColor="currentColor"></stop>
      <stop offset="1" stopColor="#F8F8F8" stopOpacity="0.41"></stop>
    </linearGradient>
  </defs>
  <text x="50%" y="220" textAnchor="middle"
        fontFamily="Inter, system-ui, sans-serif" 
        fontSize="250" 
        fontWeight="800"
        letterSpacing="-10" 
        fill="url(#textGradient)">
    encodeedge
  </text>
</svg>
      </div>
    </footer>
  );
}
