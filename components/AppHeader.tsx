'use client';

import { useQuery } from 'convex/react';
import { Flame, Star } from 'lucide-react';
import Image from 'next/image';
import { useMemo } from 'react';
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
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 pb-2 backdrop-blur-sm ">
      <div className="max-w-5xl mx-auto px-4 py-1 rounded-2xl border border-pink-400 shadow-sm bg-[#227effcc] backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Image
                src="/kira-mic-nobg.png"
                alt="Kira"
                width={54}
                height={54}
                className="object-cover rounded-full"
              />

              <div>
                <h1 className="text-2xl font-black tracking-tight text-white">
                  Kira
                </h1>
                <p className="text-sm text-gray-200">
                  Voice journal your day. Listen together at bedtime.
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-white border border-border shadow-xs px-3 h-8 text-xs text-muted-foreground">
              <Flame className="h-3.5 w-3.5 text-orange-500 fill-orange-200" />
              <span>
                {streak} day{streak > 1 ? 's' : ''} streak
              </span>
            </div>

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
            {/* {clerk} */}
          </div>
        </div>
      </div>
    </header>
  );
}
