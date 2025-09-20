'use client';

import { useQuery } from 'convex/react';
import { BookOpen, Flame, Sparkles, Star } from 'lucide-react';
import Image from 'next/image';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';

export default function AppHeader({
  storyCount: storyCountProp,
}: {
  storyCount?: number;
}) {
  const storyStats = useQuery(api.stories.getStoryStats);
  const activityData = useQuery(api.stories.getActivityData);

  const storyCount = storyCountProp ?? storyStats?.totalStories ?? 0;

  const { streak, xp, level, progress } = useMemo(() => {
    // Build a set of active dates (YYYY-MM-DD) for quick lookups
    const set = new Set<string>();
    if (activityData) {
      for (const d of activityData) {
        if (d.stories > 0) set.add(d.date);
      }
    }
    const today = new Date();
    const fmt = (dt: Date) => dt.toISOString().split('T')[0];
    let s = 0;
    // Walk backwards from today while stories were created
    for (let i = 0; i < 400; i++) {
      const dt = new Date(today);
      dt.setDate(today.getDate() - i);
      if (set.has(fmt(dt))) s += 1;
      else break;
    }
    const totalStories = storyStats?.totalStories ?? 0;
    const computedXp = totalStories * 10; // 10 XP per story
    const computedLevel = Math.floor(computedXp / 100) + 1; // 100 XP per level
    const progressPct = computedXp % 100; // progress within current level
    return {
      streak: s,
      xp: computedXp,
      level: computedLevel,
      progress: progressPct,
    };
  }, [activityData, storyStats]);

  return (
    <header className="bg-transparent">
      <div className="max-w-5xl mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white shadow-sm border border-border rounded-xl flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground font-serif tracking-tight">
                Parent Story
              </h1>
              <p className="text-sm text-muted-foreground">
                Make every day a little adventure
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Streak chip */}
            <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-white border border-border shadow-xs px-3 h-8 text-xs text-muted-foreground">
              <Flame className="h-3.5 w-3.5 text-orange-500" />
              <span>
                {streak} day{streak === 1 ? '' : 's'} streak
              </span>
            </div>
            {/* XP chip with progress */}
            <div className="hidden md:flex items-center gap-2 rounded-full bg-white border border-border shadow-xs px-3 h-8 text-xs text-muted-foreground">
              <Star className="h-3.5 w-3.5 text-yellow-500" />
              <span>Lv {level}</span>
              <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="tabular-nums">{xp} XP</span>
            </div>
            {/* Total stories chip */}
            <div className="hidden sm:flex items-center gap-2 rounded-full bg-white border border-border shadow-xs px-3 h-8 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-yellow-500" />
              <span>{storyCount} stories</span>
            </div>
            <Button variant="outline" size="sm" className="h-8 bg-white/70">
              Family
            </Button>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-border shadow-xs">
              <Image
                src="/kira.webp"
                alt="Kira"
                width={32}
                height={32}
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
