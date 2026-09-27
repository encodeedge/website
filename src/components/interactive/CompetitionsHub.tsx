import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  Search, 
  Filter, 
  Clock, 
  Users, 
  ExternalLink, 
  Sparkles, 
  Flame, 
  DollarSign, 
  Check, 
  Share2, 
  Layers, 
  BarChart3, 
  RotateCcw,
  Zap,
  Globe,
  Award,
  ChevronRight
} from 'lucide-react';
import { 
  ACTIVE_COMPETITIONS, 
  PLATFORMS, 
  type Competition, 
  type PlatformId,
  getCompetitionsStats 
} from '@/lib/competitions';

const CATEGORIES = [
  'All Tracks',
  'NLP & LLMs',
  'Computer Vision',
  'Tabular & Predictive',
  'Reinforcement Learning',
  'Multimodal',
  'Audio & Speech',
] as const;

const DIFFICULTIES = ['All Difficulties', 'Beginner', 'Intermediate', 'Advanced', 'Expert'] as const;

const REWARD_TYPES = [
  { label: 'All Rewards', value: 'all' },
  { label: '💰 Cash Prizes', value: 'cash' },
  { label: '⚡ Compute & Credits', value: 'credits' },
  { label: '🏅 Medals & Knowledge', value: 'knowledge' },
] as const;

type SortOption = 'deadline' | 'prize' | 'teams' | 'title';

export const CompetitionsHub: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Tracks');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All Difficulties');
  const [selectedReward, setSelectedReward] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('deadline');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const stats = useMemo(() => getCompetitionsStats(ACTIVE_COMPETITIONS), []);

  const filteredCompetitions = useMemo(() => {
    return ACTIVE_COMPETITIONS.filter((item) => {
      // Platform filter
      if (selectedPlatform !== 'all' && item.platform !== selectedPlatform) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'All Tracks' && item.category !== selectedCategory) {
        return false;
      }

      // Difficulty filter
      if (selectedDifficulty !== 'All Difficulties' && item.difficulty !== selectedDifficulty) {
        return false;
      }

      // Reward type filter
      if (selectedReward !== 'all' && item.rewardType !== selectedReward) {
        return false;
      }

      // Search query (matches title, description, tags, host, or problem statement)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesHost = item.hostName.toLowerCase().includes(query);
        const matchesTags = item.tags.some((t) => t.toLowerCase().includes(query));
        const matchesPlatform = item.platformName.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesHost && !matchesTags && !matchesPlatform) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'deadline') {
        return a.daysRemaining - b.daysRemaining;
      }
      if (sortBy === 'prize') {
        return (b.prizeAmountUSD || 0) - (a.prizeAmountUSD || 0);
      }
      if (sortBy === 'teams') {
        return b.teamsCount - a.teamsCount;
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [searchQuery, selectedPlatform, selectedCategory, selectedDifficulty, selectedReward, sortBy]);

  const handleCopyLink = (id: string, url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedPlatform('all');
    setSelectedCategory('All Tracks');
    setSelectedDifficulty('All Difficulties');
    setSelectedReward('all');
    setSortBy('deadline');
  };

  const activeFiltersCount = 
    (selectedPlatform !== 'all' ? 1 : 0) +
    (selectedCategory !== 'All Tracks' ? 1 : 0) +
    (selectedDifficulty !== 'All Difficulties' ? 1 : 0) +
    (selectedReward !== 'all' ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  return (
    <div className="space-y-8">
      {/* ── Summary Stats Ribbon ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-black-150 dark:border-black-800 bg-card/60 backdrop-blur-xs flex items-center gap-3.5 shadow-2xs">
          <div className="size-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Trophy className="size-5.5" />
          </div>
          <div>
            <div className="text-xl md:text-2xl font-bold font-display text-foreground leading-none">
              {stats.totalCount} Live
            </div>
            <div className="text-xs text-muted-foreground mt-1 font-medium">Active Challenges</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-black-150 dark:border-black-800 bg-card/60 backdrop-blur-xs flex items-center gap-3.5 shadow-2xs">
          <div className="size-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <DollarSign className="size-5.5" />
          </div>
          <div>
            <div className="text-xl md:text-2xl font-bold font-display text-foreground leading-none">
              ${(stats.totalPrizeUSD / 1000).toFixed(0)}k+
            </div>
            <div className="text-xs text-muted-foreground mt-1 font-medium">Tracked Prize Pool</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-black-150 dark:border-black-800 bg-card/60 backdrop-blur-xs flex items-center gap-3.5 shadow-2xs">
          <div className="size-11 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Users className="size-5.5" />
          </div>
          <div>
            <div className="text-xl md:text-2xl font-bold font-display text-foreground leading-none">
              {(stats.totalTeams / 1000).toFixed(1)}k+
            </div>
            <div className="text-xs text-muted-foreground mt-1 font-medium">Registered Teams</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-black-150 dark:border-black-800 bg-card/60 backdrop-blur-xs flex items-center gap-3.5 shadow-2xs">
          <div className="size-11 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <Globe className="size-5.5" />
          </div>
          <div>
            <div className="text-xl md:text-2xl font-bold font-display text-foreground leading-none">
              {Object.keys(PLATFORMS).length} Platforms
            </div>
            <div className="text-xs text-muted-foreground mt-1 font-medium">Kaggle, HackerRank, etc.</div>
          </div>
        </div>
      </div>

      {/* ── Filter & Search Controls ────────────────────────────────────────── */}
      <div className="p-5 md:p-6 rounded-2xl border border-black-150 dark:border-black-800 bg-card shadow-xs space-y-5">
        {/* Row 1: Search & Sorting */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="size-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, LLM, computer vision, NASA, XGBoost, host..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-black-150 dark:border-black-800 bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition-all font-body"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground cursor-pointer px-1.5 py-0.5 rounded-md hover:bg-black-100 dark:hover:bg-black-800"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <label htmlFor="comp-sort" className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
              Sort by:
            </label>
            <select
              id="comp-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="py-2.5 px-3 rounded-xl border border-black-150 dark:border-black-800 bg-background text-xs font-semibold text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              <option value="deadline">⏱️ Deadline (Ending Soonest)</option>
              <option value="prize">💰 Prize Pool (Highest First)</option>
              <option value="teams">👥 Most Popular (Teams Count)</option>
              <option value="title">🔤 Alphabetical (Title)</option>
            </select>

            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 transition-colors cursor-pointer"
                title="Reset all active filters"
              >
                <RotateCcw className="size-3.5" />
                <span>Reset ({activeFiltersCount})</span>
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Platform Filter Pills */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground font-mono">
            Filter by Platform
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedPlatform('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                selectedPlatform === 'all'
                  ? 'bg-foreground text-background shadow-xs'
                  : 'bg-black-100 dark:bg-black-850 text-muted-foreground hover:text-foreground hover:bg-black-200 dark:hover:bg-black-800'
              }`}
            >
              All Platforms ({ACTIVE_COMPETITIONS.length})
            </button>

            {Object.values(PLATFORMS).map((p) => {
              const count = stats.platformCounts[p.id] || 0;
              const isSelected = selectedPlatform === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPlatform(p.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-foreground text-background shadow-xs'
                      : 'bg-black-100 dark:bg-black-850 text-muted-foreground hover:text-foreground hover:bg-black-200 dark:hover:bg-black-800'
                  }`}
                >
                  <span className="font-mono text-[11px] opacity-80">{p.icon}</span>
                  <span>{p.name}</span>
                  <span className="text-[10px] opacity-70">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 3: Technical Track / Category Filters */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground font-mono">
            Technical Track
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-primary text-primary-foreground font-bold shadow-2xs'
                      : 'bg-black-50 dark:bg-black-900 border border-black-150 dark:border-black-800 text-muted-foreground hover:text-foreground hover:border-black-300 dark:hover:border-black-700'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 4: Secondary Filters (Difficulty & Reward Type) */}
        <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-black-150 dark:border-black-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-muted-foreground">Difficulty:</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="py-1 px-2.5 rounded-lg border border-black-150 dark:border-black-800 bg-background text-xs font-medium text-foreground cursor-pointer"
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-muted-foreground">Reward Type:</span>
            <select
              value={selectedReward}
              onChange={(e) => setSelectedReward(e.target.value)}
              className="py-1 px-2.5 rounded-lg border border-black-150 dark:border-black-800 bg-background text-xs font-medium text-foreground cursor-pointer"
            >
              {REWARD_TYPES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          <div className="ml-auto text-xs text-muted-foreground font-mono">
            Showing <strong className="text-foreground">{filteredCompetitions.length}</strong> of {ACTIVE_COMPETITIONS.length} challenges
          </div>
        </div>
      </div>

      {/* ── Competition Cards Grid ──────────────────────────────────────────── */}
      {filteredCompetitions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompetitions.map((comp) => {
            const platformMeta = PLATFORMS[comp.platform] || PLATFORMS.kaggle;
            const isEndingSoon = comp.daysRemaining <= 15;

            return (
              <article
                key={comp.id}
                className="flex flex-col justify-between p-6 rounded-2xl border border-black-150 dark:border-black-800 bg-card hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group relative"
              >
                {/* Header: Platform & Status Badges */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide border ${platformMeta.badgeBg} ${platformMeta.badgeText}`}>
                      <span className="font-mono text-xs">{platformMeta.icon}</span>
                      <span>{comp.platformName}</span>
                    </span>

                    <div className="flex items-center gap-1.5">
                      {isEndingSoon ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                          <span className="size-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                          Ending Soon
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          Active
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Host */}
                  <h3 className="text-lg font-bold font-display text-foreground group-hover:text-primary transition-colors leading-snug mb-1">
                    <a href={comp.url} target="_blank" rel="noopener noreferrer">
                      {comp.title}
                    </a>
                  </h3>

                  <div className="text-xs text-muted-foreground font-medium mb-3 flex items-center gap-1.5">
                    <span>Host:</span>
                    <span className="text-foreground/90 font-semibold truncate">{comp.hostName}</span>
                  </div>

                  {/* Description snippet */}
                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed font-body mb-4">
                    {comp.description}
                  </p>

                  {/* Problem Statement Box if present */}
                  {comp.problemStatement && (
                    <div className="p-3 rounded-xl bg-black-50 dark:bg-black-900 border border-black-150 dark:border-black-800 text-[11px] text-muted-foreground font-body leading-relaxed mb-4">
                      <strong className="text-foreground block mb-0.5 font-sans">Objective:</strong>
                      {comp.problemStatement}
                    </div>
                  )}

                  {/* Metric Chips */}
                  <div className="grid grid-cols-2 gap-2 mb-4 p-3 rounded-xl bg-black-50/70 dark:bg-black-900/50 border border-black-150 dark:border-black-800 text-xs">
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">Prize Pool</div>
                      <div className="font-bold text-foreground font-display mt-0.5 flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <Trophy className="size-3 shrink-0" />
                        <span className="truncate">{comp.prizePool}</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">Time Remaining</div>
                      <div className={`font-bold font-mono mt-0.5 flex items-center gap-1 ${isEndingSoon ? 'text-rose-600 dark:text-rose-400' : 'text-foreground'}`}>
                        <Clock className="size-3 shrink-0" />
                        <span>{comp.daysRemaining} days</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">Registered Teams</div>
                      <div className="font-semibold text-foreground font-mono mt-0.5 flex items-center gap-1">
                        <Users className="size-3 shrink-0 text-muted-foreground" />
                        <span>{comp.teamsCount.toLocaleString()}</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">Track Tracked</div>
                      <div className="font-semibold text-foreground truncate mt-0.5">
                        {comp.category}
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {comp.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-black-100 dark:bg-black-850 text-foreground/80 border border-black-150 dark:border-black-800"
                      >
                        {tag}
                      </span>
                    ))}
                    {comp.tags.length > 4 && (
                      <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono text-muted-foreground">
                        +{comp.tags.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-4 border-t border-black-150 dark:border-black-800 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => handleCopyLink(comp.id, comp.url)}
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground font-medium p-1.5 rounded-lg hover:bg-black-100 dark:hover:bg-black-800 transition-colors cursor-pointer"
                    title="Copy competition link"
                  >
                    {copiedId === comp.id ? (
                      <>
                        <Check className="size-3.5 text-emerald-500" />
                        <span className="text-[11px] text-emerald-500 font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="size-3.5" />
                        <span className="text-[11px]">Share</span>
                      </>
                    )}
                  </button>

                  <a
                    href={comp.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-foreground text-background hover:opacity-90 transition-opacity shadow-xs"
                  >
                    <span>Enter on {comp.platformName}</span>
                    <ExternalLink className="size-3" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center rounded-2xl border border-black-150 dark:border-black-800 bg-card max-w-xl mx-auto space-y-4">
          <div className="size-12 rounded-2xl bg-black-100 dark:bg-black-800 text-muted-foreground flex items-center justify-center mx-auto">
            <Filter className="size-6 opacity-60" />
          </div>
          <h3 className="text-lg font-bold font-display text-foreground">
            No Competitions Match Your Filters
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Try adjusting your search keywords, broadening the platform selection, or clearing the track filters to see more active AI/ML challenges.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold cursor-pointer hover:opacity-95 transition-opacity"
            >
              <RotateCcw className="size-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        </div>
      )}

      {/* ── Partner & Host Submission Banner ────────────────────────────────── */}
      <div className="p-6 md:p-8 rounded-2xl border border-primary/20 bg-primary/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 mb-2">
            <Sparkles className="size-3" />
            Hackathons &amp; Challenges
          </span>
          <h4 className="text-lg md:text-xl font-bold font-display text-foreground">
            Organizing an AI/ML Competition or Corporate Hackathon?
          </h4>
          <p className="text-xs md:text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
            Feature your challenge to over 50,000 active AI practitioners, research scientists, and machine learning engineers on EncodeEdge.
          </p>
        </div>

        <a
          href="/contact"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-foreground text-background text-xs font-bold hover:opacity-90 transition-opacity shrink-0 shadow-xs"
        >
          <span>Submit a Competition</span>
          <ChevronRight className="size-4" />
        </a>
      </div>
    </div>
  );
};
