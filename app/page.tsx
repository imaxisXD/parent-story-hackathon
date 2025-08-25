'use client';
import { useMutation, useQuery } from 'convex/react';
import { BookOpen, Play, Plus, Star } from 'lucide-react';
import { useState } from 'react';
import ActivityCalendar from '@/components/ActivityCalendar';
import RecordCard from '@/components/RecordCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';

export default function MyDayMyStoryApp() {
  const [selectedCharacter, setSelectedCharacter] = useState('superhero');

  const stories = useQuery(api.stories.getStories);
  const storyStats = useQuery(api.stories.getStoryStats);
  const incrementPlays = useMutation(api.stories.incrementPlays);

  const characters = [
    { id: 'superhero', name: 'Super Hero', emoji: '🦸‍♀️' },
    { id: 'pirate', name: 'Pirate Captain', emoji: '🏴‍☠️' },
    { id: 'astronaut', name: 'Space Explorer', emoji: '🚀' },
    { id: 'princess', name: 'Royal Princess', emoji: '👸' },
    { id: 'dinosaur', name: 'Dino Friend', emoji: '🦕' },
    { id: 'wizard', name: 'Magic Wizard', emoji: '🧙‍♂️' },
  ];

  // Handle play button click
  const handlePlayStory = async (storyId: any) => {
    try {
      await incrementPlays({ storyId });
    } catch (error) {
      console.error('Failed to increment plays:', error);
    }
  };

  // Format duration from seconds to minutes
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    if (secs === 0) return `${mins}m`;
    return `${mins}m ${secs}s`;
  };

  // Format relative date
  const formatRelativeDate = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-background border-b border-border">
        <div className="max-w-5xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground font-serif">
                  My Day, My Story
                </h1>
                <p className="text-sm text-muted-foreground">
                  Turn your day into magical adventures
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {storyStats
                  ? `${storyStats.totalStories} stories`
                  : 'Loading...'}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-8 bg-transparent"
              >
                Family
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-8 py-8">
        <div className="space-y-12">
          <ActivityCalendar
            showInfographic={true}
            showLegend={true}
            showStats={true}
          />

          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-lg font-medium text-foreground font-serif">
                Let's Talk about your day
              </h2>
            </div>
            <RecordCard />
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium text-foreground font-serif">
              Choose Your Character
            </h2>

            <div className="grid grid-cols-6 gap-3">
              {characters.map((character) => (
                <Button
                  key={character.id}
                  className={`p-3 rounded-lg border transition-all notion-hover ${
                    selectedCharacter === character.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-card hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedCharacter(character.id)}
                >
                  <div className="text-2xl mb-2">{character.emoji}</div>
                  <div className="text-xs font-medium text-foreground">
                    {character.name}
                  </div>
                </Button>
              ))}
            </div>
          </section>

          {/* Stories Database */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-foreground font-serif">
                Your Stories
              </h2>
              <Button variant="ghost" size="sm" className="h-8">
                <Plus className="h-4 w-4 mr-2" />
                New Story
              </Button>
            </div>

            <div className="border border-border rounded-lg overflow-hidden">
              <div className="bg-muted/30 border-b border-border px-4 py-3">
                <div className="grid grid-cols-12 gap-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  <div className="col-span-5">Story</div>
                  <div className="col-span-2">Character</div>
                  <div className="col-span-1">Duration</div>
                  <div className="col-span-1">Plays</div>
                  <div className="col-span-1">Rating</div>
                  <div className="col-span-1">Date</div>
                  <div className="col-span-1"></div>
                </div>
              </div>

              <div className="divide-y divide-border">
                {stories && stories.length > 0 ? (
                  stories.map((story, index) => (
                    <div
                      key={story._id || index}
                      className="px-4 py-3 notion-hover cursor-pointer"
                    >
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-5 flex items-center gap-3">
                          <span className="text-lg">{story.emoji}</span>
                          <span className="font-medium text-foreground font-serif">
                            {story.title}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <Badge variant="secondary" className="text-xs">
                            {story.characterName}
                          </Badge>
                        </div>
                        <div className="col-span-1 text-sm text-muted-foreground">
                          {formatDuration(story.duration)}
                        </div>
                        <div className="col-span-1 text-sm text-muted-foreground">
                          {story.plays}
                        </div>
                        <div className="col-span-1">
                          <div className="flex items-center">
                            {[...Array(story.rating)].map((_, i) => (
                              <Star
                                key={i}
                                className="h-3 w-3 text-yellow-500 fill-current"
                              />
                            ))}
                          </div>
                        </div>
                        <div className="col-span-1 text-sm text-muted-foreground">
                          {formatRelativeDate(story.createdAt)}
                        </div>
                        <div className="col-span-1 flex justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handlePlayStory(story._id)}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-muted-foreground">
                    {stories === undefined
                      ? 'Loading stories...'
                      : 'No stories yet. Record your first adventure!'}
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
