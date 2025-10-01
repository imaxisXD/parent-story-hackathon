'use client';

import { Loader2, Play } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Id } from '@/convex/_generated/dataModel';
import { cn } from '@/lib/utils';

export type StoriesView = 'grid' | 'list';
export type StoriesSort = 'recent' | 'longest';

export type Story = {
  _id: Id<'vapiReports'>;
  _creationTime: number;
  callId: string;
  timestamp: string;
  userEmail: string;
  userName: string;
  evaluation: boolean;
  summary: string;
  transcript: string;
  userId: Id<'users'>;
  storyText?: string;
  audioStorageId?: Id<'_storage'>;
  audioUrl?: string | null;
  workflowStatus?: string;
  workflowError?: string;
};

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
  onPlay: (id: Id<'vapiReports'>) => void;
}) {
  const [showMonths, setShowMonths] = useState<number>(3);

  const filteredSorted = useMemo(() => {
    const term = search.trim().toLowerCase();
    const arr = stories.filter((s) => {
      // Show completed stories OR work-in-progress stories (evaluation=true and pending/processing)
      const isCompleted = s.workflowStatus === 'completed' && s.audioStorageId;
      const isWorkInProgress =
        s.evaluation &&
        (s.workflowStatus === 'pending' || s.workflowStatus === 'processing');

      if (!isCompleted && !isWorkInProgress) return false;

      const matchesText = term
        ? s.storyText?.toLowerCase().includes(term) ||
          s.summary.toLowerCase().includes(term) ||
          s.userName.toLowerCase().includes(term)
        : true;
      const matchesDate = selectedDate
        ? new Date(Number(s.timestamp)).toISOString().split('T')[0] ===
          selectedDate
        : true;
      return matchesText && matchesDate;
    });
    arr.sort((a, b) => {
      const aTime = Number(a.timestamp);
      const bTime = Number(b.timestamp);
      switch (sort) {
        case 'longest': {
          const aDuration = (a.storyText?.length || 0) / 20; // ~20 chars per second
          const bDuration = (b.storyText?.length || 0) / 20;
          return bDuration - aDuration;
        }
        default:
          return bTime - aTime;
      }
    });
    return arr;
  }, [stories, sort, search, selectedDate]);

  const groups = useMemo(() => {
    const today: Story[] = [];
    const week: Story[] = [];
    const byMonth = new Map<string, Story[]>();

    for (const s of filteredSorted) {
      const timestamp = Number(s.timestamp);
      if (isToday(timestamp)) today.push(s);
      else if (isThisWeek(timestamp)) week.push(s);
      else {
        const key = monthKey(timestamp);
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
        (a, b) => (b.storyText?.length || 0) - (a.storyText?.length || 0)
      )[0];
    }
    return undefined;
  }, [groups.today, selectedDate]);

  function getStoryTitle(story: Story): string {
    if (story.storyText) {
      const firstSentence = story.storyText.split(/[.!?]/)[0];
      return firstSentence.length > 60
        ? firstSentence.substring(0, 60) + '...'
        : firstSentence;
    }
    return story.summary.length > 60
      ? story.summary.substring(0, 60) + '...'
      : story.summary;
  }

  function getEmoji(story: Story): string {
    const emojiMatch = story.storyText?.match(/[\p{Emoji}]/u);
    return emojiMatch ? emojiMatch[0] : '📖';
  }

  function getDuration(story: Story): number {
    const wordCount = story.storyText?.split(/\s+/).length || 0;
    return Math.ceil((wordCount / 150) * 60); // Convert to seconds
  }

  function Card({ s, highlight }: { s: Story; highlight?: boolean }) {
    const title = getStoryTitle(s);
    const emoji = getEmoji(s);
    const duration = getDuration(s);
    const isWorkInProgress =
      s.workflowStatus === 'pending' || s.workflowStatus === 'processing';

    return (
      <div
        className={cn(
          'group relative rounded-2xl border border-border bg-card p-4 shadow-xs hover:shadow-md hover-lift overflow-hidden',
          highlight && 'ring-2 ring-primary/40',
          isWorkInProgress && 'opacity-75'
        )}
      >
        <div className="absolute -top-6 -right-6 size-16 rounded-full bg-pink-200/40 blur-2xl" />
        <div className="flex items-start gap-3">
          <div className="text-2xl leading-none">{emoji}</div>
          <div className="min-w-0 flex-1">
            <div className="font-medium truncate">{title}</div>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant="secondary" className="text-[10px] rounded-full">
                {s.userName}
              </Badge>
              {highlight && (
                <span className="text-[10px] px-2 h-6 inline-flex items-center rounded-full bg-fun-yellow/30 border border-yellow-300/70">
                  Story of the Day
                </span>
              )}
              {isWorkInProgress && (
                <span className="text-[10px] px-2 h-6 inline-flex items-center gap-1 rounded-full bg-blue-100/80 border border-blue-300/70 text-blue-700">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Creating story...
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            {!isWorkInProgress && <span>{formatDuration(duration)}</span>}
            {isWorkInProgress && (
              <span className="text-blue-600 font-medium">
                {s.workflowStatus === 'pending' ? 'Queued' : 'Processing'}
              </span>
            )}
          </div>
          <span>{formatRelative(Number(s.timestamp))}</span>
        </div>
        {!isWorkInProgress && (
          <div className="absolute bottom-3 right-3">
            <Button
              variant="default"
              size="icon"
              className="rounded-full shadow-sm"
              onClick={() => onPlay(s._id)}
              aria-label={`Play ${title}`}
            >
              <Play className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    );
  }

  function Row({ s, highlight }: { s: Story; highlight?: boolean }) {
    const title = getStoryTitle(s);
    const emoji = getEmoji(s);
    const duration = getDuration(s);
    const isWorkInProgress =
      s.workflowStatus === 'pending' || s.workflowStatus === 'processing';

    return (
      <div
        className={cn(
          'flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover-lift',
          highlight && 'ring-2 ring-primary/40',
          isWorkInProgress && 'opacity-75'
        )}
      >
        <div className="text-xl w-7 text-center">{emoji}</div>
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate flex items-center gap-2">
            {title}
            {isWorkInProgress && (
              <span className="text-[10px] px-2 py-1 inline-flex items-center gap-1 rounded-full bg-blue-100/80 border border-blue-300/70 text-blue-700">
                <Loader2 className="h-3 w-3 animate-spin" />
                Creating...
              </span>
            )}
          </div>
          <div className="text-xs text-muted-foreground truncate">
            {isWorkInProgress
              ? `${s.workflowStatus === 'pending' ? 'Queued' : 'Processing'}`
              : `Duration ${formatDuration(duration)}`}
          </div>
        </div>

        <div className="text-xs text-muted-foreground w-24 text-right">
          {formatRelative(Number(s.timestamp))}
        </div>
        {!isWorkInProgress && (
          <Button
            variant="default"
            size="icon"
            className="rounded-full"
            onClick={() => onPlay(s._id)}
          >
            <Play className="h-4 w-4" />
          </Button>
        )}
        {isWorkInProgress && (
          <div className="w-10 h-10" /> // Placeholder to maintain alignment
        )}
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
            <Card key={s._id} s={s} highlight={storyOfTheDay?._id === s._id} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {groups.today.map((s) => (
            <Row key={s._id} s={s} highlight={storyOfTheDay?._id === s._id} />
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
              <Card key={s._id} s={s} />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {groups.week.map((s) => (
              <Row key={s._id} s={s} />
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
                <Card key={s._id} s={s} />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((s) => (
                <Row key={s._id} s={s} />
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
  console.log('MonthHeader', label, count);
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
