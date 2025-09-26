'use client';

import { useMutation, useQuery } from 'convex/react';
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
  const storyStats = useQuery(api.stories.getStoryStats);
  const incrementPlays = useMutation(api.stories.incrementPlays);

  const [selectedDate] = useState<string | undefined>(undefined);
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);

  const handlePlayStory = async (storyId: Id<'stories'>) => {
    try {
      await incrementPlays({ storyId });
      const story = stories?.find((s: any) => s._id === storyId) as
        | Story
        | undefined;
      if (story) {
        setActiveStory(story);
        setShowPlayer(true);
      }
    } catch (error) {
      console.error('Failed to increment plays:', error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white relative overflow-x-hidden">
      {/* Pink Corner Dream Background */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
        radial-gradient(circle 600px at 0% 200px, #fce7f378, transparent),
        radial-gradient(circle 600px at 100% 200px, #fce7f378, transparent),
        radial-gradient(circle 600px at 0% calc(100% - 200px), #cee7f078, transparent),
        radial-gradient(circle 600px at 100% calc(100% - 200px), #fce7f378, transparent)
      `,
        }}
      />
      <div className="relative z-10">
        <AppHeader storyCount={storyStats?.totalStories ?? 0} />

        <main className="mx-auto max-w-4xl px-6 py-8 pt-36 md:pt-40">
          <div className="space-y-12">
            <section className="space-y-4">
              <div className="mb-2">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Tell Kira about your day
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Share a short voice note about your day. We’ll gently turn it
                  into a bedtime story.
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
                  A calm timeline of recent voice‑created stories.
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
    </div>
  );
}
