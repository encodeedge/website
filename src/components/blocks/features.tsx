import { ChevronRight, ArrowUpRight } from "lucide-react";
import { format } from "date-fns";

import { getCollection, type CollectionEntry } from 'astro:content';


const allPosts = await getCollection('blog');
    
    // Sort all posts by publication date (newest first)
const sortedPosts = allPosts.sort((a, b) => b.data.updatedDate.valueOf() - a.data.updatedDate.valueOf());

    // 1. Get featured posts, sorted by date (already sorted above) and take the top 3
const featuredPosts = sortedPosts
        .filter(post => post.data.featured)
        .slice(0, 3); // Return only the 3 newest featured posts

    // 2. Get the latest non-featured posts, sorted by date and take the top 3
    // Filter out posts that are already featured, then take the top 3.
const latestPosts = sortedPosts
        .filter(post => !post.data.featured)
        .slice(0, 3); // Return only the 3 newest non-featured posts


export const Features = () => {
  return (
    <section id="features" className="py-24 lg:py-32">
      <div className="container">
        
        {/* Featured Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Featured Insights</h2>
            <p className="text-muted-foreground text-lg">Deep dives and tutorials hand-picked for you.</p>
          </div>
          <a href="/blog" className="group flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
            View all posts <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>

        {/* Featured Grid */}
        <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
          {featuredPosts.map((item, i) => (
            <a 
              key={i} 
              href={`/blog/${item.id}`}
              className="group relative flex flex-col overflow-hidden rounded-3xl border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/20"
            >
              <div className="aspect-[16/10] overflow-hidden bg-muted">
                <img
                  src={item.data.image}
                  alt={item.data.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between p-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">Featured</span>
                    <span>•</span>
                    <span>{format(item.data.pubDate, "MMM d, yyyy")}</span>
                  </div>
                  <h3 className="font-bold text-xl leading-tight group-hover:text-primary transition-colors">
                    {item.data.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {item.data.description}
                  </p>
                </div>
                <div className="mt-6 flex items-center text-sm font-semibold text-primary">
                  Read Article <ChevronRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Latest Section Header */}
        <div className="mt-24 mb-10">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Latest Updates</h2>
        </div>

        {/* Latest Grid */}
        <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
          {latestPosts.map((item, i) => (
            <a 
              key={i} 
              href={`/blog/${item.id}`}
              className="group relative flex flex-col overflow-hidden rounded-3xl border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/20"
            >
              <div className="aspect-[16/10] overflow-hidden bg-muted">
                <img
                  src={item.data.image}
                  alt={item.data.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between p-6">
                <div className="space-y-3">
                  <div className="text-xs font-medium text-muted-foreground">
                    {format(item.data.pubDate, "MMM d, yyyy")}
                  </div>
                  <h3 className="font-bold text-xl leading-tight group-hover:text-primary transition-colors">
                    {item.data.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {item.data.description}
                  </p>
                </div>
                <div className="mt-6 flex items-center text-sm font-semibold text-primary">
                  Read Article <ChevronRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
};