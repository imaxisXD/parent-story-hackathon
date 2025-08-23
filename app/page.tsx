"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mic, Play, BookOpen, Star, Plus, MicOff, AudioWaveform as Waveform } from "lucide-react"
import ActivityCalendar from "@/components/ActivityCalendar"

export default function MyDayMyStoryApp() {
  const [isRecording, setIsRecording] = useState(false)
  const [selectedCharacter, setSelectedCharacter] = useState("superhero")
  const [recordingTime, setRecordingTime] = useState(0)
  const [isCreatingStory, setIsCreatingStory] = useState(false)

  // Convex hooks
  const stories = useQuery(api.stories.getStories)
  const storyStats = useQuery(api.stories.getStoryStats)
  const createStory = useMutation(api.stories.createStory)
  const incrementPlays = useMutation(api.stories.incrementPlays)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } else {
      setRecordingTime(0)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const characters = [
    { id: "superhero", name: "Super Hero", emoji: "🦸‍♀️" },
    { id: "pirate", name: "Pirate Captain", emoji: "🏴‍☠️" },
    { id: "astronaut", name: "Space Explorer", emoji: "🚀" },
    { id: "princess", name: "Royal Princess", emoji: "👸" },
    { id: "dinosaur", name: "Dino Friend", emoji: "🦕" },
    { id: "wizard", name: "Magic Wizard", emoji: "🧙‍♂️" },
  ]

  // Helper function to generate story titles
  const generateStoryTitle = (character: string, duration: number) => {
    const adventures = [
      "Adventure", "Quest", "Journey", "Mission", "Discovery", "Expedition", "Tale", "Story"
    ]
    const themes = {
      superhero: ["Grocery Store", "Park", "Library", "School", "Kitchen"],
      pirate: ["Coffee", "Treasure Hunt", "Island", "Ship", "Ocean"],
      astronaut: ["Space", "Moon", "Stars", "Rocket", "Planet"],
      princess: ["Castle", "Garden", "Ball", "Kingdom", "Magic"],
      dinosaur: ["Prehistoric", "Jungle", "Museum", "Fossil", "Ancient"],
      wizard: ["Magic", "Spell", "Potion", "Enchanted", "Mystical"]
    }
    
    const characterThemes = themes[character as keyof typeof themes] || ["Amazing"]
    const theme = characterThemes[Math.floor(Math.random() * characterThemes.length)]
    const adventure = adventures[Math.floor(Math.random() * adventures.length)]
    
    return `The ${theme} ${adventure}`
  }

  // Story creation handler
  const handleStopRecording = async () => {
    if (!isRecording || recordingTime === 0) return
    
    setIsCreatingStory(true)
    
    try {
      const selectedChar = characters.find(c => c.id === selectedCharacter)
      if (!selectedChar) return
      
      const storyTitle = generateStoryTitle(selectedCharacter, recordingTime)
      
      await createStory({
        title: storyTitle,
        character: selectedCharacter,
        characterName: selectedChar.name,
        emoji: selectedChar.emoji,
        duration: recordingTime,
      })
      
      // Reset recording state
      setIsRecording(false)
      setRecordingTime(0)
    } catch (error) {
      console.error("Failed to create story:", error)
      // Still stop recording even if creation fails
      setIsRecording(false)
      setRecordingTime(0)
    } finally {
      setIsCreatingStory(false)
    }
  }

  // Handle play button click
  const handlePlayStory = async (storyId: any) => {
    try {
      await incrementPlays({ storyId })
    } catch (error) {
      console.error("Failed to increment plays:", error)
    }
  }

  // Format duration from seconds to minutes
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    if (mins === 0) return `${secs}s`
    if (secs === 0) return `${mins}m`
    return `${mins}m ${secs}s`
  }

  // Format relative date
  const formatRelativeDate = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return "Today"
    if (days === 1) return "Yesterday"
    if (days < 7) return `${days} days ago`
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`
    return new Date(timestamp).toLocaleDateString()
  }

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
                <h1 className="text-xl font-semibold text-foreground font-serif">My Day, My Story</h1>
                <p className="text-sm text-muted-foreground">Turn your day into magical adventures</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {storyStats ? `${storyStats.totalStories} stories` : 'Loading...'}
              </span>
              <Button variant="outline" size="sm" className="h-8 bg-transparent">
                Family
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-8 py-8">
        <div className="space-y-12">
          <ActivityCalendar showInfographic={true} showLegend={true} showStats={true} />

          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-lg font-medium text-foreground font-serif">Tell Your Story</h2>
            </div>

            <div className="relative">
              {/* Recording Studio Card */}
              <div
                className={`p-8 border rounded-xl transition-all duration-500 ${
                  isRecording
                    ? "border-primary/30 bg-primary/5 shadow-lg shadow-primary/10"
                    : "border-border bg-card hover:bg-muted/30"
                }`}
              >
                {/* Recording Visualization */}
                <div className="flex flex-col items-center space-y-6">
                  {/* Main Recording Button */}
                  <div className="relative">
                    <button
                      className={`relative w-24 h-24 rounded-full transition-all duration-300 flex items-center justify-center ${
                        isRecording
                          ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/25"
                          : "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25"
                      }`}
                      onClick={isRecording ? handleStopRecording : () => setIsRecording(true)}
                      disabled={isCreatingStory}
                    >
                      {isRecording ? (
                        <div className="w-6 h-6 bg-white rounded-sm"></div>
                      ) : (
                        <Mic className="h-8 w-8 text-white" />
                      )}

                      {/* Pulsing ring animation when recording */}
                      {isRecording && (
                        <>
                          <div className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-75"></div>
                          <div className="absolute inset-0 rounded-full border-2 border-red-500 animate-pulse"></div>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Recording Status */}
                  <div className="text-center space-y-2">
                    {isRecording ? (
                      <>
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium text-foreground">Recording</span>
                          <div className="text-sm font-mono text-muted-foreground">{formatTime(recordingTime)}</div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Share your adventures and watch them become magical stories
                        </p>
                      </>
                    ) : (
                      <>
                        <h3 className="text-base font-medium text-foreground font-serif">
                          {isCreatingStory ? "Creating Your Story..." : "Ready to Record"}
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-md">
                          {isCreatingStory 
                            ? "Transforming your adventure into a magical story!"
                            : "Click the microphone and tell me about your day. I'll transform it into a magical bedtime story!"}
                        </p>
                      </>
                    )}
                  </div>

                  {/* Audio Waveform Visualization (when recording) */}
                  {isRecording && (
                    <div className="flex items-center justify-center gap-1 h-12">
                      {[...Array(12)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 bg-primary rounded-full animate-pulse"
                          style={{
                            height: `${Math.random() * 40 + 10}px`,
                            animationDelay: `${i * 0.1}s`,
                            animationDuration: `${0.5 + Math.random() * 0.5}s`,
                          }}
                        ></div>
                      ))}
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="h-8 text-xs bg-transparent" disabled={!isRecording}>
                      <MicOff className="h-3 w-3 mr-1" />
                      Pause
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 text-xs bg-transparent" disabled={!isRecording}>
                      <Waveform className="h-3 w-3 mr-1" />
                      Preview
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-medium text-foreground font-serif">Choose Your Character</h2>

            <div className="grid grid-cols-6 gap-3">
              {characters.map((character) => (
                <button
                  key={character.id}
                  className={`p-3 rounded-lg border transition-all notion-hover ${
                    selectedCharacter === character.id
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:bg-muted/50"
                  }`}
                  onClick={() => setSelectedCharacter(character.id)}
                >
                  <div className="text-2xl mb-2">{character.emoji}</div>
                  <div className="text-xs font-medium text-foreground">{character.name}</div>
                </button>
              ))}
            </div>
          </section>

          {/* Stories Database */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-foreground font-serif">Your Stories</h2>
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
                    <div key={story._id || index} className="px-4 py-3 notion-hover cursor-pointer">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-5 flex items-center gap-3">
                          <span className="text-lg">{story.emoji}</span>
                          <span className="font-medium text-foreground font-serif">{story.title}</span>
                        </div>
                        <div className="col-span-2">
                          <Badge variant="secondary" className="text-xs">
                            {story.characterName}
                          </Badge>
                        </div>
                        <div className="col-span-1 text-sm text-muted-foreground">{formatDuration(story.duration)}</div>
                        <div className="col-span-1 text-sm text-muted-foreground">{story.plays}</div>
                        <div className="col-span-1">
                          <div className="flex items-center">
                            {[...Array(story.rating)].map((_, i) => (
                              <Star key={i} className="h-3 w-3 text-yellow-500 fill-current" />
                            ))}
                          </div>
                        </div>
                        <div className="col-span-1 text-sm text-muted-foreground">{formatRelativeDate(story.createdAt)}</div>
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
                    {stories === undefined ? "Loading stories..." : "No stories yet. Record your first adventure!"}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
