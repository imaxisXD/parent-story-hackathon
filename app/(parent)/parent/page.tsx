'use client';

import { useMutation, useQuery } from 'convex/react';
import { useState } from 'react';
import ActivityCalendar from '@/components/ActivityCalendar';
import AppHeader from '@/components/AppHeader';
import RecordCard from '@/components/RecordCard';
import StoriesGroupedList from '@/components/stories/StoriesGroupedList';
import StoriesToolbar, {
  type StoriesSort,
  type StoriesView,
} from '@/components/stories/StoriesToolbar';
import { api } from '@/convex/_generated/api';

export default function ParentHome() {
  const stories = useQuery(api.stories.getStories);
  const storyStats = useQuery(api.stories.getStoryStats);
  const incrementPlays = useMutation(api.stories.incrementPlays);

  const [view, setView] = useState<StoriesView>('list');
  const [sort, setSort] = useState<StoriesSort>('recent');
  const [search, setSearch] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string | undefined>(
    undefined
  );

  const handlePlayStory = async (storyId: any) => {
    try {
      await incrementPlays({ storyId });
    } catch (error) {
      console.error('Failed to increment plays:', error);
    }
  };

  return (
    <div
      data-app="parent"
      className="min-h-screen bg-gradient-to-b from-muted/40 to-background"
    >
      <AppHeader storyCount={storyStats?.totalStories ?? 0} />

      <main className="mx-auto max-w-4xl px-6 py-8">
        <div className="space-y-12">
          <section className="space-y-4">
            <div className="mb-2">
              <h2 className="font-sans text-3xl md:text-4xl font-medium tracking-tight">
                Take a moment to reflect
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Capture a short note about your day. We’ll gently turn it into a
                bedtime story.
              </p>
            </div>
            <div className="rounded-lg border border-border/70 bg-card/80 p-6 shadow-sm">
              <RecordCard />
            </div>
          </section>

          {/* Section 2: Your Daily Journal Log */}
          <section className="space-y-4">
            <div className="mb-2">
              <h2 className="font-sans text-2xl font-medium tracking-tight">
                Your journal
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                A calm timeline of recent entries.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              {/* Inline, compact, muted calendar */}

              <ActivityCalendar
                showInfographic={false}
                showLegend={true}
                showStats={true}
                onDaySelect={(d) => setSelectedDate(d)}
              />

              <div className="mt-4">
                <StoriesToolbar
                  view={view}
                  onViewChange={setView}
                  sort={sort}
                  onSortChange={setSort}
                  search={search}
                  onSearchChange={setSearch}
                  hasActiveFilters={Boolean(search || selectedDate)}
                  onClearAll={() => {
                    setSearch('');
                    setSelectedDate(undefined);
                  }}
                />
              </div>

              <div className="mt-4">
                {stories && stories.length > 0 ? (
                  <StoriesGroupedList
                    stories={stories as any}
                    view={view}
                    sort={sort}
                    search={search}
                    selectedDate={selectedDate}
                    onPlay={handlePlayStory}
                  />
                ) : (
                  <div className="rounded-lg border border-border/70 p-8 text-center text-muted-foreground">
                    {stories === undefined ? (
                      <span>Loading your journal…</span>
                    ) : (
                      <span>
                        No entries yet. Start with a short reflection above.
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
