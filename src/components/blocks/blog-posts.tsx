import React, { useState, useMemo, useEffect } from 'react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { slugify } from '@/utils/slugs';
import { TOPIC_METADATA } from '@/lib/topics';
import { 
  Search, 
  X, 
  Bookmark, 
  BookmarkCheck, 
  Clock, 
  ArrowRight, 
  SlidersHorizontal,
  BookOpen, 
  Sparkles, 
  Code2, 
  Send,
  CheckCircle2
} from 'lucide-react';
import { TechnicalBlueprintCover } from '@/components/ui/TechnicalBlueprintCover';

// Helper function to format topic slug into a human-readable name
const formatSlug = (slug: string) => {
  if (TOPIC_METADATA[slug]) {
    return TOPIC_METADATA[slug].label;
  }
  return slug
    .replace(/-/g, ' ')
    .split(' ')
    .map(s => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ');
};

// Helper function to normalize free-form tag text into a URL slug
const normalizeTagSlug = (tag: string) =>
  tag.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, '');

interface Post {
  id: string;
  slug: string;
  collection?: string;
  data: {
    title: string;
    description: string;
    pubDate: Date | string;
    updatedDate?: Date | string;
    readTime?: number;
    image?: string;
    authorImage?: string;
    authorName?: string;
    topics?: string[];
    tags?: string[];
    featured?: boolean;
  };
}

interface BlogPostsProps {
  posts: Post[];
}

export const BlogPosts: React.FC<BlogPostsProps> = ({ posts }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'quickest'>('newest');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('encodeedge_blog_bookmarks');
      if (saved) {
        setBookmarkedIds(JSON.parse(saved));
      }
    } catch (e) {
      // Ignore localStorage errors
    }
  }, []);

  // Toggle bookmark handler
  const toggleBookmark = (e: React.MouseEvent, postId: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      let updated: string[];
      if (bookmarkedIds.includes(postId)) {
        updated = bookmarkedIds.filter(id => id !== postId);
      } else {
        updated = [...bookmarkedIds, postId];
      }
      setBookmarkedIds(updated);
      localStorage.setItem('encodeedge_blog_bookmarks', JSON.stringify(updated));
    } catch (err) {
      // Ignore
    }
  };

  // Extract unique topics present across all posts
  const availableTopics = useMemo(() => {
    const topicSet = new Set<string>();
    posts.forEach(p => {
      (p.data.topics || []).forEach(t => topicSet.add(t));
    });
    return Array.from(topicSet);
  }, [posts]);

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    return posts
      .filter(post => {
        // Topic filter
        if (selectedTopic === 'notebooks') {
          if (post.collection !== 'notebooks') return false;
        } else if (selectedTopic === 'bookmarks') {
          if (!bookmarkedIds.includes(post.id)) return false;
        } else if (selectedTopic !== 'all') {
          const postTopics = post.data.topics || [];
          if (!postTopics.includes(selectedTopic)) return false;
        }

        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = post.data.title.toLowerCase().includes(q);
          const matchDesc = (post.data.description || '').toLowerCase().includes(q);
          const matchAuthor = (post.data.authorName || '').toLowerCase().includes(q);
          const matchTags = (post.data.tags || []).some(t => t.toLowerCase().includes(q));
          const matchTopics = (post.data.topics || []).some(t => t.toLowerCase().includes(q));
          if (!matchTitle && !matchDesc && !matchAuthor && !matchTags && !matchTopics) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.data.pubDate).getTime() - new Date(b.data.pubDate).getTime();
        }
        if (sortBy === 'quickest') {
          return (a.data.readTime || 8) - (b.data.readTime || 8);
        }
        return 0;
      });
  }, [posts, selectedTopic, searchQuery, sortBy, bookmarkedIds]);

  // Lead Featured post (first post in list if unfiltered, or first matching post if matches)
  const isDefaultView = selectedTopic === 'all' && searchQuery.trim() === '';
  const leadPost = isDefaultView && filteredPosts.length > 0 ? filteredPosts[0] : null;
  const leadTopic = (leadPost?.data.topics || [])[0] || 'python';
  const leadTopicMeta = TOPIC_METADATA[leadTopic];
  const gridPosts = isDefaultView ? filteredPosts.slice(1) : filteredPosts;

  const totalNotebooks = posts.filter(p => p.collection === 'notebooks').length;
  const totalArticles = posts.filter(p => p.collection !== 'notebooks').length;

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;
    setNewsletterSubscribed(true);
    setNewsletterEmail('');
  };

  return (
    <div className="w-full">
      {/* Editorial Header */}
      <header className="woords_container_small text-center space-y-4 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black-100 dark:bg-black-800 text-[11px] font-semibold tracking-wider uppercase text-muted-foreground">
          <Sparkles className="size-3.5 text-primary" />
          The AI & Engineering Journal
        </div>

        <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight text-foreground">
          Articles, Research & Blueprints
        </h1>

        <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Code-backed comprehensive guides into machine learning algorithms, deep neural architectures, Python systems foundations, and reproducible AI models.
        </p>

        {/* Quick Stats Row */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-xs font-medium text-foreground">
            <BookOpen className="size-3.5 text-muted-foreground" />
            <strong className="font-bold">{totalArticles}</strong> Guides
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-xs font-medium text-foreground">
            <Code2 className="size-3.5 text-amber-500" />
            <strong className="font-bold">{totalNotebooks}</strong> Interactive Notebooks
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-xs font-medium text-foreground">
            <Clock className="size-3.5 text-muted-foreground" />
            Weekly Updates
          </span>
          {bookmarkedIds.length > 0 && (
            <button
              onClick={() => setSelectedTopic(selectedTopic === 'bookmarks' ? 'all' : 'bookmarks')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                selectedTopic === 'bookmarks'
                  ? 'bg-amber-500 text-black font-semibold'
                  : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25'
              }`}
            >
              <Bookmark className="size-3.5 fill-current" />
              {bookmarkedIds.length} Saved
            </button>
          )}
        </div>
      </header>

      {/* Main Editorial Container */}
      <div className="woords_container_small space-y-10">
        
        {/* Interactive Filter & Search Toolbar */}
        <div className="rounded-2xl border border-black-150 dark:border-black-800 bg-card p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Real-time Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles by title, topic, or keyword (e.g. Python, Regression)..."
                className="w-full pl-10 pr-9 py-2 text-sm rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 self-end md:self-auto">
              <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <SlidersHorizontal className="size-3.5" /> Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs font-semibold rounded-lg border border-input bg-background text-foreground px-2.5 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="newest">Latest Published</option>
                <option value="oldest">Oldest First</option>
                <option value="quickest">Quick Reads (&lt; 8 min)</option>
              </select>
            </div>
          </div>

          {/* Topic Pills Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
            <button
              onClick={() => setSelectedTopic('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedTopic === 'all'
                  ? 'bg-foreground text-background shadow-xs'
                  : 'bg-black-100 dark:bg-black-800 text-muted-foreground hover:text-foreground hover:bg-black-150 dark:hover:bg-black-700'
              }`}
            >
              All Topics ({posts.length})
            </button>

            {availableTopics.map((topic) => {
              const meta = TOPIC_METADATA[topic];
              const isSelected = selectedTopic === topic;
              return (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(isSelected ? 'all' : topic)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-black text-white dark:bg-white dark:text-black font-semibold shadow-xs'
                      : 'bg-black-100 dark:bg-black-800 text-muted-foreground hover:text-foreground hover:bg-black-150 dark:hover:bg-black-700'
                  }`}
                >
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: meta?.color || '#3533cd' }}
                  />
                  {formatSlug(topic)}
                </button>
              );
            })}

            {/* Dedicated Notebooks Filter */}
            <button
              onClick={() => setSelectedTopic(selectedTopic === 'notebooks' ? 'all' : 'notebooks')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedTopic === 'notebooks'
                  ? 'bg-amber-500 text-black shadow-xs'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20'
              }`}
            >
              ⚡ Notebooks ({totalNotebooks})
            </button>
          </div>

          {/* Results Summary Bar */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/40">
            <div>
              Showing <strong className="text-foreground">{filteredPosts.length}</strong> of {posts.length} blueprints
              {selectedTopic !== 'all' && (
                <span className="ml-1.5 font-medium">
                  in <span className="text-foreground font-semibold">"{selectedTopic === 'notebooks' ? 'Interactive Notebooks' : selectedTopic === 'bookmarks' ? 'Saved' : formatSlug(selectedTopic)}"</span>
                </span>
              )}
              {searchQuery && (
                <span className="ml-1.5">
                  matching "<span className="text-foreground font-semibold">{searchQuery}</span>"
                </span>
              )}
            </div>

            {(selectedTopic !== 'all' || searchQuery.trim()) && (
              <button
                onClick={() => {
                  setSelectedTopic('all');
                  setSearchQuery('');
                }}
                className="text-xs font-semibold text-primary hover:underline cursor-pointer"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>

        {/* Lead Editorial Feature (Spotlight Card) */}
        {leadPost && (
          <div className="rounded-3xl border border-black-150 dark:border-black-800 bg-background overflow-hidden hover:shadow-xl transition-all duration-300 group">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
              {/* Technical Blueprint Section */}
              <div className="lg:col-span-7 relative overflow-hidden bg-black-50 dark:bg-black-900 min-h-[280px] lg:min-h-[380px]">
                <a href={leadPost.collection === 'notebooks' ? `/notebooks/${leadPost.id}/` : `/blog/${leadPost.id}/`} className="block w-full h-full relative overflow-hidden">
                  <TechnicalBlueprintCover
                    title={leadPost.data.title}
                    topics={leadPost.data.topics}
                    readTime={leadPost.data.readTime}
                    catalogId={leadPost.id}
                    variant="lead"
                    className="h-full rounded-none border-0"
                    showTitle={false}
                  />
                </a>
                <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none z-20">
                  <span className="woords_tag_secondary_small font-bold shadow-xs">
                    ★ Editorial Lead
                  </span>
                  {leadPost.collection === 'notebooks' && (
                    <span className="px-2.5 py-0.5 rounded-full bg-black/75 text-white backdrop-blur-sm text-[11px] font-semibold">
                      ⚡ Interactive Notebook
                    </span>
                  )}
                </div>
              </div>

              {/* Text Section */}
              <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  {/* Topic & Read Time */}
                  <div className="flex flex-wrap items-center gap-2">
                    {(leadPost.data.topics || []).map((topic: string) => {
                      const meta = TOPIC_METADATA[topic];
                      return (
                        <span
                          key={topic}
                          className="px-2.5 py-1 rounded-full text-xs font-semibold border"
                          style={{
                            backgroundColor: `${meta?.color || '#FDA4AF'}20`,
                            borderColor: `${meta?.color || '#FDA4AF'}60`,
                            color: 'inherit',
                          }}
                        >
                          {formatSlug(topic)}
                        </span>
                      );
                    })}
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="size-3" />
                      {leadPost.data.readTime || 8} min read
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="font-display font-bold text-2xl sm:text-3xl text-foreground leading-snug group-hover:text-primary transition-colors">
                    <a href={leadPost.collection === 'notebooks' ? `/notebooks/${leadPost.id}/` : `/blog/${leadPost.id}/`}>
                      {leadPost.data.title}
                    </a>
                  </h2>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed line-clamp-3 font-body">
                    {leadPost.data.description}
                  </p>
                </div>

                {/* Footer Meta & Read CTA */}
                <div className="pt-6 border-t border-border/60 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <Avatar className="size-8 border">
                      <AvatarImage src={leadPost.data.authorImage} alt={leadPost.data.authorName} />
                      <AvatarFallback className="text-[11px]">
                        {leadPost.data.authorName ? leadPost.data.authorName.charAt(0) : 'E'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <a
                        href={`/authors/${slugify(leadPost.data.authorName || 'Atul Jha')}`}
                        className="text-xs font-semibold text-foreground hover:underline block leading-tight"
                      >
                        {leadPost.data.authorName || 'Atul Jha'}
                      </a>
                      <div className="text-[11px] text-muted-foreground">
                        {format(new Date(leadPost.data.pubDate), 'dd MMM yyyy')}
                      </div>
                    </div>
                  </div>

                  <a
                    href={leadPost.collection === 'notebooks' ? `/notebooks/${leadPost.id}/` : `/blog/${leadPost.id}/`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-opacity"
                  >
                    Read Blueprint
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3-Column Editorial Grid */}
        {gridPosts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gridPosts.map((post) => {
              const postUrl = post.collection === 'notebooks' ? `/notebooks/${post.id}/` : `/blog/${post.id}/`;
              const pubDate = post.data.pubDate ? new Date(post.data.pubDate) : new Date();
              const isBookmarked = bookmarkedIds.includes(post.id);
              const primaryTopic = (post.data.topics || [])[0] || 'machine-learning';
              const topicMeta = TOPIC_METADATA[primaryTopic];

              return (
                <article
                  key={post.id}
                  className="flex flex-col rounded-2xl border border-black-150 dark:border-black-800 bg-background hover:shadow-lg transition-all duration-200 group overflow-hidden"
                >
                  {/* Technical Blueprint Cover Container */}
                  <div className="relative overflow-hidden border-b border-border/40">
                    <a href={postUrl} className="block w-full">
                      <TechnicalBlueprintCover
                        title={post.data.title}
                        topics={post.data.topics}
                        readTime={post.data.readTime}
                        catalogId={post.id}
                        variant="card"
                        className="rounded-none border-0"
                        showTitle={true}
                      />
                    </a>

                    {/* Format Badge Overlay for Notebooks */}
                    {post.collection === 'notebooks' && (
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 z-20 pointer-events-none">
                        <span className="px-2 py-0.5 rounded-full bg-black/80 text-white backdrop-blur-xs text-[10px] font-bold">
                          ⚡ Notebook
                        </span>
                      </div>
                    )}

                    {/* Bookmark Action Button */}
                    <button
                      onClick={(e) => toggleBookmark(e, post.id)}
                      className="absolute top-3 right-3 size-8 rounded-full bg-background/85 hover:bg-background backdrop-blur-xs flex items-center justify-center text-foreground transition-all cursor-pointer shadow-xs"
                      title={isBookmarked ? 'Remove bookmark' : 'Bookmark this article'}
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="size-4 text-amber-500 fill-amber-500" />
                      ) : (
                        <Bookmark className="size-4 text-muted-foreground hover:text-foreground" />
                      )}
                    </button>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex flex-col flex-1 gap-y-3">
                    {/* Tags / Meta */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {(post.data.tags || []).slice(0, 2).map((tag: string) => (
                        <a
                          key={tag}
                          href={`/tags/${normalizeTagSlug(tag)}`}
                          className="text-[11px] font-medium text-muted-foreground hover:text-foreground hover:underline"
                        >
                          #{tag}
                        </a>
                      ))}
                      <span className="text-[11px] text-muted-foreground ml-auto flex items-center gap-1">
                        <Clock className="size-3" />
                        {post.data.readTime || 6} min
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold font-display text-lg sm:text-xl text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      <a href={postUrl}>{post.data.title}</a>
                    </h3>

                    {/* Description */}
                    {post.data.description && (
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed font-body">
                        {post.data.description}
                      </p>
                    )}

                    {/* Author & Read Footer */}
                    <div className="flex items-center justify-between border-t border-border/60 pt-3 mt-auto">
                      <div className="flex items-center gap-2">
                        <Avatar className="size-6 border">
                          <AvatarImage src={post.data.authorImage} alt={post.data.authorName} />
                          <AvatarFallback className="text-[10px]">
                            {post.data.authorName ? post.data.authorName.charAt(0) : 'E'}
                          </AvatarFallback>
                        </Avatar>
                        <a
                          href={`/authors/${slugify(post.data.authorName || 'Atul Jha')}`}
                          className="text-xs font-semibold text-foreground hover:underline truncate max-w-[100px]"
                        >
                          {post.data.authorName || 'Atul Jha'}
                        </a>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-[11px] text-muted-foreground">
                          {format(pubDate, 'dd MMM yyyy')}
                        </span>
                        <a
                          href={postUrl}
                          className="size-7 rounded-full bg-secondary flex items-center justify-center text-foreground group-hover:bg-foreground group-hover:text-background transition-colors"
                          aria-label={`Read ${post.data.title}`}
                        >
                          <ArrowRight className="size-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* Empty Search State */
          <div className="rounded-2xl border border-dashed border-border py-16 px-6 text-center space-y-4">
            <div className="size-12 rounded-full bg-secondary flex items-center justify-center mx-auto text-muted-foreground">
              <Search className="size-6" />
            </div>
            <h3 className="font-display font-bold text-xl text-foreground">
              No matching blueprints found
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              We couldn't find any articles matching your search criteria. Try adjusting your query or resetting filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTopic('all');
              }}
              className="px-4 py-2 rounded-full bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer inline-flex items-center gap-2"
            >
              <X className="size-3.5" /> Reset all filters
            </button>
          </div>
        )}

        {/* Editorial Newsletter Subscription Banner */}
        <div className="mt-14 rounded-3xl border border-black-150 dark:border-black-800 bg-linear-to-br from-background via-black-50 dark:via-black-900 to-background p-8 sm:p-10 shadow-xs">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <span className="woords_tag_secondary_small font-bold">
              Weekly Dispatch
            </span>
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-foreground tracking-tight">
              Get practical AI blueprints delivered every Sunday.
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Never miss a new guide. We break down production machine learning algorithms, PyTorch architectures, and systems blueprints with clean, reproducible code.
            </p>

            {newsletterSubscribed ? (
              <div className="inline-flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                <CheckCircle2 className="size-5" />
                Thank you for subscribing! Check your inbox for the welcome dispatch.
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row items-center gap-2 max-w-md mx-auto pt-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  required
                  className="w-full sm:flex-1 px-4 py-2.5 text-sm rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Send className="size-4" /> Subscribe Free
                </button>
              </form>
            )}

            <div className="text-[11px] text-muted-foreground">
              Zero spam. Unsubscribe with 1-click anytime.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};