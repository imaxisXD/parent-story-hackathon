'use client';

import { Play, Star } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Id } from '@/convex/_generated/dataModel';
import { cn } from '@/lib/utils';

export type Story = {
  _id: Id<'stories'>;
  emoji: string;
  title: string;
  characterName: string;
  duration: number;
  plays: number;
  rating: number;
  audioUrl?: string;
  createdAt: number; // timestamp
};

export type StoriesView = 'grid' | 'list';
export type StoriesSort = 'recent' | 'mostPlayed' | 'highestRated' | 'longest';

function isToday(ts: number) {
  const d = new Date(ts);
  const t = new Date();
  return (
    d.getFullYear() === t.getFullYear() &&
    d.getMonth() === t.getMonth() &&
    d.getDate() === t.getDate()
  );
}
function isThisWeek(ts: number) {
  const d = new Date(ts);
  const now = new Date();
  const day = (now.getDay() + 6) % 7; // Monday=0
  const monday = new Date(now);
  monday.setDate(now.getDate() - day);
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return d >= monday && d <= sunday && !isToday(ts);
}

function monthKey(ts: number) {
  const d = new Date(ts);
  return `${d.toLocaleString('en-US', { month: 'long' })} ${d.getFullYear()}`;
}

function formatRelative(date: number) {
  const diff = Date.now() - date;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return new Date(date).toLocaleDateString();
}

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  if (secs === 0) return `${mins}m`;
  return `${mins}m ${secs}s`;
}

export default function StoriesGroupedList({
  stories,
  view,
  sort,
  search,
  selectedDate,
  onPlay,
}: {
  stories: Story[];
  view: StoriesView;
  sort: StoriesSort;
  search: string;
  selectedDate?: string;
  onPlay: (id: Id<'stories'>) => void;
}) {
  const [showMonths, setShowMonths] = useState<number>(3); // reveal more on demand
  const [favorites, setFavorites] = useState<Record<string, boolean>>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const raw = localStorage.getItem('ps:favorites');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('ps:favorites', JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  const filteredSorted = useMemo(() => {
    const term = search.trim().toLowerCase();
    const arr = stories.filter((s) => {
      const matchesText = term
        ? s.title.toLowerCase().includes(term) ||
          s.characterName.toLowerCase().includes(term)
        : true;
      const matchesDate = selectedDate
        ? new Date(s.createdAt).toISOString().split('T')[0] === selectedDate
        : true;
      return matchesText && matchesDate;
    });
    arr.sort((a, b) => {
      switch (sort) {
        case 'mostPlayed':
          return b.plays - a.plays;
        case 'highestRated':
          return b.rating - a.rating;
        case 'longest':
          return b.duration - a.duration;
        default:
          return b.createdAt - a.createdAt;
      }
    });
    return arr;
  }, [stories, sort, search, selectedDate]);

  const groups = useMemo(() => {
    const today: Story[] = [];
    const week: Story[] = [];
    const byMonth = new Map<string, Story[]>();

    for (const s of filteredSorted) {
      if (isToday(s.createdAt)) today.push(s);
      else if (isThisWeek(s.createdAt)) week.push(s);
      else {
        const key = monthKey(s.createdAt);
        if (!byMonth.has(key)) byMonth.set(key, []);
        const list = byMonth.get(key);
        if (list) list.push(s);
      }
    }

    // Prepare months list newest first
    const months = Array.from(byMonth.entries()).sort((a, b) => {
      const [am, ay] = a[0].split(' ');
      const [bm, by] = b[0].split(' ');
      const aDate = new Date(`${am} 1, ${ay}`);
      const bDate = new Date(`${bm} 1, ${by}`);
      return bDate.getTime() - aDate.getTime();
    });

    return { today, week, months };
  }, [filteredSorted]);

  const storyOfTheDay = useMemo(() => {
    if (!selectedDate && (groups.today?.length ?? 0) > 0) {
      return [...groups.today].sort(
        (a, b) => b.rating - a.rating || b.plays - a.plays
      )[0];
    }
    return undefined;
  }, [groups.today, selectedDate]);

  function toggleFav(id?: string) {
    if (!id) return;
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function Card({ s, highlight }: { s: Story; highlight?: boolean }) {
    return (
      <div
        className={cn(
          'group relative rounded-2xl border border-border bg-card p-4 shadow-xs hover:shadow-md hover-lift overflow-hidden',
          highlight && 'ring-2 ring-primary/40'
        )}
      >
        <div className="absolute -top-6 -right-6 size-16 rounded-full bg-pink-200/40 blur-2xl" />
        <div className="flex items-start gap-3">
          <div className="text-2xl leading-none">{s.emoji}</div>
          <div className="min-w-0">
            <div className="font-medium truncate">{s.title}</div>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant="secondary" className="text-[10px] rounded-full">
                {s.characterName}
              </Badge>
              <button
                type="button"
                onClick={() => toggleFav(s._id as string)}
                className={cn(
                  'text-xs px-2 h-6 rounded-full border',
                  favorites[s._id as string]
                    ? 'border-primary text-primary bg-primary/10'
                    : 'border-border text-muted-foreground bg-white'
                )}
              >
                {favorites[s._id as string] ? '★ Favorite' : '☆ Favorite'}
              </button>
              {highlight && (
                <span className="text-[10px] px-2 h-6 inline-flex items-center rounded-full bg-fun-yellow/30 border border-yellow-300/70">
                  Story of the Day
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span>{formatDuration(s.duration)}</span>
            <span>•</span>

            <span className="flex items-center gap-1">
              {Array.from({ length: s.rating }).map((_, starIndex) => (
                <Star
                  key={`${s._id || s.title}-star-${starIndex}`}
                  className="h-3 w-3 text-yellow-500 fill-current"
                />
              ))}
            </span>
          </div>
          <span>{formatRelative(s.createdAt)}</span>
        </div>
        <div className="absolute bottom-3 right-3">
          <Button
            variant="default"
            size="icon"
            className="rounded-full shadow-sm"
            onClick={() => onPlay(s._id)}
            aria-label={`Play ${s.title}`}
          >
            <Play className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  function Row({ s, highlight }: { s: Story; highlight?: boolean }) {
    return (
      <div
        className={cn(
          'flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover-lift',
          highlight && 'ring-2 ring-primary/40'
        )}
      >
        <div className="text-xl w-7 text-center">🦸🏻</div>
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">{s.title}</div>
          <div className="text-xs text-muted-foreground truncate">
            Duration {formatDuration(s.duration)}
          </div>
        </div>

        <div className="text-xs text-muted-foreground w-24 text-right">
          {formatRelative(s.createdAt)}
        </div>
        <Button
          variant="default"
          size="icon"
          className="rounded-full"
          onClick={() => onPlay(s._id)}
        >
          <Play className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Today */}
      <GroupHeader title="Today" count={groups.today.length} />
      {groups.today.length === 0 ? (
        <EmptyDay />
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.today.map((s) => (
            <Card
              key={s._id || s.title}
              s={s}
              highlight={storyOfTheDay?._id === s._id}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {groups.today.map((s) => (
            <Row
              key={s._id || s.title}
              s={s}
              highlight={storyOfTheDay?._id === s._id}
            />
          ))}
        </div>
      )}

      {/* This Week */}
      {groups.week.length > 0 && (
        <GroupHeader title="This Week" count={groups.week.length} />
      )}
      {groups.week.length > 0 &&
        (view === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.week.map((s) => (
              <Card key={s._id || s.title} s={s} />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {groups.week.map((s) => (
              <Row key={s._id || s.title} s={s} />
            ))}
          </div>
        ))}

      {/* Earlier months */}
      {groups.months.slice(0, showMonths).map(([label, items]) => (
        <div key={label} className="space-y-3">
          <MonthHeader label={label} count={items.length} />
          {view === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((s) => (
                <Card key={s._id || s.title} s={s} />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((s) => (
                <Row key={s._id || s.title} s={s} />
              ))}
            </div>
          )}
        </div>
      ))}

      {groups.months.length > showMonths && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMonths((n) => n + 3)}
          >
            Show older months
          </Button>
        </div>
      )}
    </div>
  );
}

function GroupHeader({ title, count }: { title: string; count: number }) {
  return (
    <div className="sticky top-0 z-10 -mx-2 px-2 py-1.5 bg-gradient-to-b from-white/90 to-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 rounded">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className="text-xs text-muted-foreground">{count}</span>
      </div>
    </div>
  );
}
function MonthHeader({ label, count }: { label: string; count: number }) {
  return (
    <div className="sticky top-10 z-10 -mx-2 px-2 py-1.5 bg-gradient-to-b from-white/90 to-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 rounded">
      <div className="flex items-center gap-2">
        <h4 className="text-base font-medium">{label}</h4>
        <span className="text-xs text-muted-foreground">{count}</span>
      </div>
    </div>
  );
}
function EmptyDay() {
  return (
    <div className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground bg-white/60">
      No story yet today — tap the mic to save your streak!
    </div>
  );
}
