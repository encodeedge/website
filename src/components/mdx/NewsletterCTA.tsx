import React from "react";
import { Mail, Sparkles } from "lucide-react";

interface NewsletterCTAProps {
  title?: string;
  description?: string;
  buttonText?: string;
}

export const NewsletterCTA: React.FC<NewsletterCTAProps> = ({
  title = "Get practical AI & ML blueprints straight to your inbox",
  description = "Join ambitious developers and engineers mastering deep learning, Python algorithms, and production architectures.",
  buttonText = "Subscribe Free",
}) => {
  return (
    <div className="my-10 relative overflow-hidden rounded-3xl border border-black-200 dark:border-black-800 bg-gradient-to-br from-black-50 via-white to-black-100 dark:from-black-900 dark:via-black-900/90 dark:to-black-850 p-8 not-prose shadow-sm text-center">
      <div className="grid-bg absolute inset-0 opacity-40 pointer-events-none" />
      <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center gap-4">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-ghost-accent px-3 py-1 text-xs font-semibold text-black">
          <Sparkles className="size-3.5" />
          Weekly Newsletter
        </span>
        <h3 className="text-2xl md:text-3xl font-bold font-display tracking-tight text-foreground">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>

        <form
          action="/subscribe"
          method="GET"
          className="mt-2 flex w-full max-w-md flex-col gap-2.5 sm:flex-row items-center"
        >
          <div className="relative w-full">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="email"
              placeholder="Enter your email address..."
              required
              className="w-full h-11 rounded-full border border-black-200 dark:border-black-800 bg-background pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ghost-accent"
            />
          </div>
          <button
            type="submit"
            className="woords_btn h-11 shrink-0 px-6 font-semibold cursor-pointer w-full sm:w-auto"
          >
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
};
export default NewsletterCTA;

