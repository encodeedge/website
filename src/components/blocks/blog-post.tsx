import { format } from "date-fns";
import React, { useEffect, useRef, useState } from "react";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import  PostComments from "@/components/ui/PostComments.tsx";
import { slugify } from '@/utils/slugs';
import FAQs from '@/components/blocks/faqs';
import References from '@/components/blocks/references';

// 🚨 Define a basic type for post data to ensure type safety and include topics/tags
interface PostData {
  title: string;
  description: string;
  pubDate: Date;
  image?: string;
  authorImage?: string;
  authorName: string;
  faqs?: { question: string; answer: string; category?: string }[];
  references?: { title: string; url: string; description?: string; type?: string; affiliate?: string }[];
  // Topics is an array of predefined slugs
  topics?: string[];
  // Tags is an array of free-form strings
  tags?: string[];
}

interface BlogPostProps {
  post: {
    data: PostData;
    // other properties like id, slug, etc. from Astro/Keystatic
    [key: string]: any; 
  };
  children: React.ReactNode;
  featured?: Array<any>;
}

const BlogPost = ({
  post,
  children,
  featured,
}: BlogPostProps) => {
  const { 
    title, 
    authorName, 
    image, 
    pubDate, 
    description, 
    authorImage,
    // 🚨 Destructure the new fields: topics and tags
    topics,
    tags,
    faqs,
    references,
  } = post.data;

  // Helper function to format topic slug into a human-readable name
  const formatSlug = (slug: string) => 
    slug.replace(/-/g, ' ').split(' ').map(s => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');

  // Left nav: extract headings from rendered content
  const contentRef = useRef<HTMLElement | null>(null);
  const [headings, setHeadings] = useState<Array<{ id: string; text: string; level: number }>>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

  const getInitials = (t?: string) => {
    if (!t) return '';
    return t
      .split(' ')
      .slice(0, 2)
      .map((s: string) => (s && s.length ? s.charAt(0) : ''))
      .join('');
  };

useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    
    // 1. Update selector to include h1 and h4
    const nodes = Array.from(el.querySelectorAll('h1, h2, h3')) as HTMLElement[];
    
    const items = nodes.map((node) => {
      let id = node.id;
      if (!id) {
        id = slugify(node.textContent || 'heading');
        node.id = id;
      }

      const level = parseInt(node.tagName.substring(1));

      return { id, text: node.textContent || '', level };
    });
    
    setHeadings(items);
  }, [children]);

  // Handle scroll progress and active section
  useEffect(() => {
    const handleScroll = () => {
      // Progress bar
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(scrollPercent);

      // Active section highlight
      const headingElements = headings.map((h) => document.getElementById(h.id)).filter(Boolean);
      if (headingElements.length === 0) return;

      let active = headings[0].id;
      for (const heading of headingElements) {
        if (!heading) continue;
        const rect = heading.getBoundingClientRect();
        if (rect.top < window.innerHeight / 3) {
          active = heading.id;
        }
      }
      setActiveId(active);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  // limit to max 5 featured items for display
  const displayedFeatured = (featured || []).slice(0, 5);

  return (
    <section>
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-muted z-50">
        <div
          className="h-full bg-gradient-to-r from-sidebar-primary via-sidebar-primary to-blue-500 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      <div className="container">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center">
          <h1 className="max-w-3xl text-4xl font-bold md:text-5xl">{title}</h1>
          <h3 className="text-muted-foreground max-w-4xl">{description}</h3>
          
          {/* Author and Date Information */}
          <div className="flex items-center gap-3 text-sm md:text-base">
            <Avatar className="h-8 w-8 border">
              <AvatarImage src={authorImage} />
              <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>
              <a href={`/authors/${slugify(authorName)}`} className="font-semibold">
                {authorName}
              </a>
              <span className="ml-1">on {format(pubDate, "MMMM d, yyyy")}</span>
            </span>
          </div>

          {/* 🚨 Topics and Tags Display Section */}
          <div className="flex flex-wrap justify-center gap-2 mt-4 mb-4">
            
            {/* Display Topics (Primary Categories) */}
            {topics && topics.map(topic => (
              <a 
                key={topic} 
                href={`/topics/${topic}`} 
                className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition"
              >
                {formatSlug(topic)}
              </a>
            ))}

            {/* Display Tags (Specific Keywords) */}
            {tags && tags.map(tag => (
              <a 
                key={tag} 
                // NOTE: Assuming you will create a dynamic page for tags, e.g., /tags/[tag].astro
                href={`/tags/${tag.toLowerCase().replace(/ /g, '-')}`} 
                className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300 transition"
              >
                {tag}
              </a>
            ))}
          </div>
          {/* End Topics and Tags Display */}

          <img
            src={image}
            alt={`Hero image for ${title}`}
            className="mt-0 mb-8 aspect-video w-full rounded-lg border object-cover"
          />
        </div>
      </div>
      <div className="w-full">
        <div className="grid w-full max-w-12xl mx-auto px-8 grid-cols-1 gap-8 lg:grid-cols-[14rem_minmax(0,100ch)_14rem] items-start justify-center">
          {/* Left side: section navigation */}
          <aside className="hidden lg:block sticky top-24 h-fit">
            <div className="bg-gradient-to-b from-muted/5 via-transparent to-background/60 border border-border rounded-xl p-4 shadow-lg max-h-[calc(100vh-6rem)] overflow-auto backdrop-blur-sm">
              <div className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">On this page</div>
              <ul className="space-y-1 list-none pl-0">
                {headings.length === 0 && (
                  <li className="text-sm text-muted-foreground">(No sections)</li>
                )}
                {headings.map((h) => (
                  <li key={h.id} className={h.level === 3 ? 'pl-3' : ''}>
                    <a
                      href={`#${h.id}`}
                      className={`block text-sm md:text-base rounded-lg px-3 py-2 transition-all duration-150 ${
                        activeId === h.id
                          ? 'bg-sidebar-primary/10 text-sidebar-primary font-semibold'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/5'
                      }`}
                    >
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Main content */}
          <main className="w-full" ref={contentRef}>
            <div className="prose dark:prose-invert mx-auto max-w-none w-full">{children}</div>
            {faqs && faqs.length > 0 && (
              <div className="mt-8">
                <FAQs items={faqs} />
              </div>
            )}
            {references && references.length > 0 && (
              <div className="mt-8">
                <References items={references} />
              </div>
            )}
            <PostComments />
          </main>

          {/* Right side: featured posts */}
          <aside className="hidden lg:block sticky top-24 h-fit">
            <div
              className="bg-gradient-to-b from-background/60 via-transparent to-muted/5 border border-border rounded-xl p-4 shadow-lg overflow-auto backdrop-blur-sm"
              style={{ maxHeight: 'min(calc(100vh - 6rem), 36rem)' }}
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">Featured</div>
              </div>
              <ul className="space-y-3 list-none">
                {displayedFeatured && displayedFeatured.length > 0 ? (
                  displayedFeatured.map((f: any) => (
                    <li key={f.id}>
                      <a
                        href={`/blog/${f.id}`}
                        className="flex items-start gap-3 rounded-lg p-3 hover:bg-muted/5 transition-shadow duration-150"
                      >
                        {f.data.image ? (
                          <img src={f.data.image} alt={f.data.title} className="h-12 w-14 rounded-md object-cover border shrink-0" />
                        ) : (
                          <div className="h-12 w-12 rounded-md bg-muted-foreground/10 flex items-center justify-center text-xs font-semibold text-muted-foreground shrink-0">{getInitials(f.data.title)}</div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-foreground line-clamp-2">{f.data.title}</div>
                          <div className="text-xs text-muted-foreground">{format(new Date(f.data.pubDate), 'MMM d, yyyy')}</div>
                        </div>
                      </a>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-muted-foreground">(No featured posts)</li>
                )}
              </ul>
            </div>
          </aside>
        </div>
      </div>
      
    </section>
  );
};

export { BlogPost };