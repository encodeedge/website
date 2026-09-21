import { GITHUB_URL } from "@/consts";

export function Footer() {
  const navigation = [
    { name: "Home", href: "/" },
    { name: "Roadmaps", href: "/roadmaps" },
    { name: "Topics", href: "/topics" },
    { name: "Blog", href: "/blog" },
    { name: "Courses", href: "/courses" },
    { name: "About", href: "/about" },
    { name: "FAQ", href: "/faq" },
    { name: "Subscribe", href: "/subscribe" },
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
  ];

  return (
    <footer className="bg-black-50/70 dark:bg-black-900 border-t border-black-150 dark:border-black-800 transition-colors mt-20">
      <div className="woords_container flex flex-col gap-y-8 justify-center items-center py-12">
        {/* Logo & Brand Name */}
        <a href="/" className="flex items-center gap-2 group">
          <img
            src="/logos/logo.png"
            alt="EncodeEdge"
            className="h-7 w-auto dark:invert transition-transform group-hover:scale-105"
          />
          <span className="font-display font-extrabold text-2xl tracking-tight text-foreground">
            Encode<span className="text-black/60 dark:text-white/60 font-medium">Edge</span>
          </span>
        </a>

        <p className="text-xs text-muted-foreground text-center max-w-md">
          Demystifying modern Python, Machine Learning, and algorithms with clear, code-backed blueprints.
        </p>

        {/* Footer Navigation */}
        <nav className="flex items-center justify-center">
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-muted-foreground">
            {navigation.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className="hover:text-foreground hover:underline transition-colors"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Copyright Bar */}
      <div className="text-xs text-muted-foreground flex items-center justify-center py-5 border-t border-black-150 dark:border-black-800/80 px-4 text-center">
        <div>
          &copy; {new Date().getFullYear()}{" "}
          <a href="/" className="font-semibold text-foreground hover:underline">
            EncodeEdge
          </a>
          . Crafted for curious engineers and builders.
        </div>
      </div>
    </footer>
  );
}
