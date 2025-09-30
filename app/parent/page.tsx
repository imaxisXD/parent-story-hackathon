'use client';

import { useQuery } from 'convex/react';
import dynamic from 'next/dynamic';

import { useState } from 'react';
import ActivityCalendar from '@/components/ActivityCalendar';
import AppHeader from '@/components/AppHeader';
import AudioPlayerBar from '@/components/AudioPlayerBar';
import StoriesGroupedList, {
  type Story,
} from '@/components/stories/StoriesGroupedList';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';

const RecordCard = dynamic(() => import('@/components/RecordCard'), {
  ssr: false,
});

export default function ParentHome() {
  const stories = useQuery(api.stories.getStories);

  const [selectedDate] = useState<string | undefined>(undefined);
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);

  const handlePlayStory = async (storyId: Id<'vapiReports'>) => {
    const story = stories?.find((s) => s._id === storyId);
    if (story) {
      setActiveStory(story);
      setShowPlayer(true);
    }
  };

  return (
    <div className="relative z-10">
      <AppHeader storyCount={stories?.length ?? 0} />
      <main className="mx-auto max-w-4xl px-6 py-34">
        <div className="space-y-12">
          <section className="space-y-4">
            <div className="mb-2">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Journal out loud
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Speak about your day for a minute. We’ll shape it into a calm
                bedtime story to listen together.
              </p>
            </div>
            <RecordCard />
          </section>

          {/* Section 2: Your Daily Stories */}
          <section className="space-y-4">
            <div className="mb-2">
              <h2 className="text-2xl font-medium tracking-tight">
                Your stories
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                A gentle timeline of your days.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              {/* Inline, compact, muted calendar */}

              <ActivityCalendar showLegend={true} showStats={true} />

              <div className="mt-4">
                {stories && stories.length > 0 ? (
                  <StoriesGroupedList
                    stories={stories}
                    view={'list'}
                    sort={'recent'}
                    search={''}
                    selectedDate={selectedDate}
                    onPlay={handlePlayStory}
                  />
                ) : (
                  <div className="rounded-lg border border-border/70 p-8 text-center text-muted-foreground">
                    {stories === undefined ? (
                      <span>Loading your stories…</span>
                    ) : (
                      <span>No stories yet. Tap the mic above to begin.</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
      {showPlayer && (
        <AudioPlayerBar
          story={activeStory}
          autoplay={true}
          onClose={() => setShowPlayer(false)}
        />
      )}
    </div>
  );
}
