import { format } from "date-fns";
import React from "react";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import  PostComments from "@/components/ui/PostComments.tsx";

// 🚨 Define a basic type for post data to ensure type safety and include topics/tags
interface PostData {
  title: string;
  description: string;
  pubDate: Date;
  image?: string;
  authorImage?: string;
  authorName: string;
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
}

const BlogPost = ({
  post,
  children,
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
  } = post.data;

  // Helper function to format topic slug into a human-readable name
  const formatSlug = (slug: string) => 
    slug.replace(/-/g, ' ').split(' ').map(s => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');

  return (
    <section>
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
              <a href="#" className="font-semibold">
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
      <div className="container">
        <div className="prose dark:prose-invert mx-auto max-w-3xl">{children}</div>
        <PostComments />
      </div>
      
    </section>
  );
};

export { BlogPost };