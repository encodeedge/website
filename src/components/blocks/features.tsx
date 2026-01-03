import { ChevronRight } from "lucide-react";

import { DashedLine } from "../dashed-line";

import { Card, CardContent } from "@/components/ui/card";
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
    <section id="feature-modern-teams" className="pb-28 lg:pb-32">
      <div className="container">
        {/* Top dashed line with text */}
        <div className="relative flex items-center justify-center">
          <DashedLine className="text-muted-foreground" />
          <span className="bg-muted text-muted-foreground absolute px-3 font-mono text-lg font-large tracking-wide max-md:hidden">
            <strong>Featured Posts</ strong>
          </span>
        </div>

        {/* Features Card */}
        <Card className="mt-8 rounded-3xl md:mt-12 lg:mt-20">
          <CardContent className="flex p-0 max-md:flex-col">
            {featuredPosts.map((item, i) => (
              <div key={i} className="flex flex-1 max-md:flex-col">
                <a
                  href={`/blog/${item.id}`}
                  className="flex-1 p-4 pe-0! md:p-6 block hover:bg-muted/30 transition rounded-2xl"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={item.data.image}
                      alt={`${item.data.title} interface`}
                      className="object-cover object-left-top ps-4 pt-2 max-w-[90%]"
                    />
                    <div className="from-background absolute inset-0 z-10 bg-linear-to-t via-transparent to-transparent" />
                  </div>
                  <div className="group flex items-center justify-between gap-4 pe-4 pt-4 md:pe-6 md:pt-6">
                    <h3 className="font-display max-w-60 text-2xl leading-tight font-bold tracking-tight">
                      {item.data.title}
                    </h3>
                    <div className="rounded-full border p-2">
                      <ChevronRight className="size-6 transition-transform group-hover:translate-x-1 lg:size-9" />
                    </div>
                  </div>
                </a>
                {i < featuredPosts.length - 1 && (
                  <div className="relative hidden md:block">
                    <DashedLine orientation="vertical" />
                  </div>
                )}
                {i < featuredPosts.length - 1 && (
                  <div className="relative block md:hidden">
                    <DashedLine orientation="horizontal" />
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="relative flex items-center justify-center">
          <DashedLine className="text-muted-foreground" />
          <span className="bg-muted text-muted-foreground absolute px-3 font-mono text-lg font-large tracking-wide max-md:hidden">
            <strong>Latest Posts</ strong>
          </span>
        </div>

        {/* Latest Card */}
        <Card className="mt-8 rounded-3xl md:mt-12 lg:mt-20">
          <CardContent className="flex p-0 max-md:flex-col">
            {latestPosts.map((item, i) => (
              <div key={i} className="flex flex-1 max-md:flex-col">
                <a
                  href={`/blog/${item.id}`}
                  className="flex-1 p-4 pe-0! md:p-6 block hover:bg-muted/30 transition rounded-2xl"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={item.data.image}
                      alt={`${item.data.title} interface`}
                      className="object-cover object-left-top ps-4 pt-2 max-w-[90%]"
                    />
                    <div className="from-background absolute inset-0 z-10 bg-linear-to-t via-transparent to-transparent" />
                  </div>
                  <div className="group flex items-center justify-between gap-4 pe-4 pt-4 md:pe-6 md:pt-6">
                    <h3 className="font-display max-w-60 text-2xl leading-tight font-bold tracking-tight">
                      {item.data.title}
                    </h3>
                    <div className="rounded-full border p-2">
                      <ChevronRight className="size-6 transition-transform group-hover:translate-x-1 lg:size-9" />
                    </div>
                  </div>
                </a>
                {i < latestPosts.length - 1 && (
                  <div className="relative hidden md:block">
                    <DashedLine orientation="vertical" />
                  </div>
                )}
                {i < latestPosts.length - 1 && (
                  <div className="relative block md:hidden">
                    <DashedLine orientation="horizontal" />
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
        <br />
        <br />
        
      </div>
    </section>
  );
};