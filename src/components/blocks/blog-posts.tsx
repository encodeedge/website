import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { slugify } from '@/utils/slugs';

// Helper function to format topic slug into a human-readable name
const formatSlug = (slug: string) => 
  slug.replace(/-/g, ' ').split(' ').map(s => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');

// Helper function to normalize free-form tag text into a URL slug
const normalizeTagSlug = (tag: string) =>
  tag.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, '');


const BlogPosts = ({ posts }: { posts: any[] }) => {
  return (
    <>
      <section className="container flex max-w-5xl flex-col-reverse gap-8 md:gap-14 lg:flex-row lg:items-end">
        <div className="container">
          <div className="mt-20 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              // The main post link wraps the card content except for the badges logic below.
              <div 
                key={post.id}
                className="rounded-xl border hover:shadow-lg transition-shadow duration-300 block"
              >
                <a 
                  href={`/blog/${post.id}/`}
                  className="block" // The link covers the main card area
                >
                  <div className="p-2">
                    <img
                      src={post.data.image}
                      alt={`Hero image for ${post.data.title}`}
                      className="aspect-video w-full rounded-lg object-cover"
                    />
                  </div>
                  <div className="px-3 pt-2 pb-4">
                    <h2 className="mb-1 font-semibold">{post.data.title}</h2>
                    <p className="text-muted-foreground line-clamp-2 text-sm">
                      {post.data.description}
                    </p>
                  </div>
                </a> 
                
                {/* 🚨 Topics and Tags Display Section (Separated from the main article link) */}
                <div className="px-3 pb-4 -mt-2"> {/* Positioning adjustment for visual flow */}
                  <div className="flex flex-wrap gap-1.5">
                    
                    {/* Topics (Primary Categories) */}
                    {(post.data.topics || []).slice(0, 2).map((topic: string) => (
                      <a 
                        key={topic} 
                        href={`/topics/${topic}`} // 👈 Link to the dynamic topic page
                        className="inline-block" // Ensure the link occupies space
                        // We put the Badge inside the anchor tag
                      >
                        <Badge 
                          variant="default"
                          className="text-xs bg-blue-500 hover:bg-blue-600 transition-colors cursor-pointer"
                        >
                          {formatSlug(topic)}
                        </Badge>
                      </a>
                    ))}

                    {/* Tags (Secondary Keywords) */}
                    {(post.data.tags || []).slice(0, 3).map((tag: string) => (
                      <a 
                        key={tag} 
                        href={`/tags/${normalizeTagSlug(tag)}`} // 👈 Link to the dynamic tag page
                        className="inline-block"
                      >
                        <Badge 
                          variant="secondary"
                          className="text-xs bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors cursor-pointer"
                        >
                          {tag}
                        </Badge>
                      </a>
                    ))}
                  </div>
                </div>
                {/* End Topics and Tags Display */}

                {/* Continue with the rest of the card content, ensuring it's not nested inside the anchor tags */}
                <div className="px-3 pb-4">
                    <Separator className="my-5" />
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                        <Avatar className="ring-input size-7 rounded-full ring-1">
                            <AvatarImage
                            src={post.data.authorImage}
                            alt={`${post.data.authorName}'s avatar`}
                            />
                            <AvatarFallback>
                            {post.data.authorName ? post.data.authorName.charAt(0) : 'CN'}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          <a href={`/authors/${slugify(post.data.authorName)}`} className="font-semibold">{post.data.authorName}</a>
                        </span>
                        </div>
                        <Badge variant="secondary" className="h-fit">
                        {post.data.readTime} Min Read
                        </Badge>
                    </div>
                </div>
              </div> // End of div that holds the entire card
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export { BlogPosts };