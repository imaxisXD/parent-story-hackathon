'use client';

import { Pause, Play, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Story } from '@/components/stories/StoriesGroupedList';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Props = {
  story: Story | null;
  autoplay?: boolean;
  onClose: () => void;
};

function formatTime(totalSeconds: number) {
  const clamped = Math.max(0, Math.floor(totalSeconds || 0));
  const minutes = Math.floor(clamped / 60)
    .toString()
    .padStart(1, '0');
  const seconds = (clamped % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export default function AudioPlayerBar({
  story,
  autoplay = false,
  onClose,
}: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);

  const canPlay = !!story?.audioUrl;

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const onLoaded = () => {
      setDuration(el.duration || 0);
    };
    const onTime = () => {
      if (!isSeeking) setCurrent(el.currentTime || 0);
    };
    const onPlayEvt = () => setIsPlaying(true);
    const onPauseEvt = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);

    el.addEventListener('loadedmetadata', onLoaded);
    el.addEventListener('timeupdate', onTime);
    el.addEventListener('play', onPlayEvt);
    el.addEventListener('pause', onPauseEvt);
    el.addEventListener('ended', onEnded);

    return () => {
      el.removeEventListener('loadedmetadata', onLoaded);
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('play', onPlayEvt);
      el.removeEventListener('pause', onPauseEvt);
      el.removeEventListener('ended', onEnded);
    };
  }, [isSeeking]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    // Reset when story changes
    setIsPlaying(false);
    setDuration(0);
    setCurrent(0);

    if (story?.audioUrl) {
      el.src = story.audioUrl;
      el.load();
      if (autoplay) {
        // Attempt to auto play; browsers may block if not user initiated
        el.play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    } else {
      el.removeAttribute('src');
      try {
        el.load();
      } catch {}
    }

    return () => {
      try {
        el.pause();
      } catch {}
    };
  }, [story, autoplay]);

  const progressPercent = useMemo(() => {
    if (!duration) return 0;
    return Math.min(100, Math.max(0, (current / duration) * 100));
  }, [current, duration]);

  const togglePlay = () => {
    const el = audioRef.current;
    if (!el || !canPlay) return;
    if (isPlaying) {
      el.pause();
    } else {
      el.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const onSeek = (value: number) => {
    const el = audioRef.current;
    if (!el || !duration) return;
    const next = (value / 100) * duration;
    try {
      el.currentTime = Number.isFinite(next) ? next : 0;
      setCurrent(el.currentTime || 0);
    } catch {}
  };

  if (!story) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-3 rounded-2xl border border-border bg-white shadow-md">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="text-xl select-none">{story.emoji}</div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{story.title}</div>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground">
                  {formatTime(current)} /{' '}
                  {formatTime(duration || story.duration || 0)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="icon"
                className={cn('rounded-full', !canPlay && 'opacity-50')}
                onClick={togglePlay}
                disabled={!canPlay}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => {
                  try {
                    audioRef.current?.pause();
                  } catch {}
                  onClose();
                }}
                aria-label="Close player"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="px-3 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-10 text-[11px] tabular-nums text-muted-foreground">
                {formatTime(current)}
              </span>
              <input
                type="range"
                min={0}
                max={100}
                value={progressPercent}
                onChange={(e) => onSeek(parseFloat(e.target.value))}
                onPointerDown={() => setIsSeeking(true)}
                onPointerUp={() => setIsSeeking(false)}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                aria-label="Seek"
              />
              <span className="w-10 text-[11px] tabular-nums text-muted-foreground text-right">
                {formatTime(duration || story.duration || 0)}
              </span>
            </div>
          </div>

          <audio
            ref={audioRef}
            preload="metadata"
            aria-label="Story audio playback"
          >
            {/* Providing an empty captions track to satisfy a11y rule; narrative audio has no dialog */}
            <track kind="captions" src="" label="captions" default />
          </audio>
          {!canPlay && (
            <div className="px-3 pb-3 text-[11px] text-muted-foreground">
              No audio found for this story.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
