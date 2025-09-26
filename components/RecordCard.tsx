'use client';
import { MeshGradient, PulsingBorder } from '@paper-design/shaders-react';
import { Loader, MicOff } from 'lucide-react';
import Image from 'next/image';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useVapi } from '../hooks/useVapi';
import { Button } from './ui/button';

export default function RecordCard() {
  const { status, isSpeaking, error, start, stop } = useVapi();
  const cardState = useMemo(() => {
    if (error) return 'error';
    if (isSpeaking) return 'ai-speaking';
    return status;
  }, [status, isSpeaking, error]);

  const handleStartRecording = async () => {
    try {
      if (
        status === 'connected' ||
        cardState === 'ai-speaking' ||
        cardState === 'connecting' ||
        cardState === 'disconnecting'
      )
        return;
      await start();
    } catch (error) {
      console.warn('Failed to start recording:', error);
    }
  };

  const handleStopRecording = async () => {
    try {
      await stop();
    } catch (error) {
      console.warn('Failed to stop recording:', error);
    }
  };

  return (
    <div className="relative rounded-3xl overflow-hidden border border-pink-200">
      <div className="pointer-events-none absolute inset-0 z-0">
        <PulsingBorder
          style={{ height: '100%', width: '100%' }}
          colorBack="#ffffff00"
          roundness={0.18}
          thickness={0.028}
          softness={1}
          intensity={1}
          bloom={0.8}
          spots={3}
          spotSize={0.2}
          pulse={
            cardState === 'connected' || cardState === 'ai-speaking' ? 0.8 : 0.4
          }
          smoke={0.4}
          smokeSize={0.3}
          scale={1}
          rotation={0}
          offsetX={0}
          offsetY={0}
          speed={
            cardState === 'connected' || cardState === 'ai-speaking' ? 1.8 : 0.7
          }
          colors={['#8ec5ff', '#b6f3ea', '#cab8ff', '#ffd6e8']}
        />
      </div>
      <div
        className={cn(
          'relative z-10 rounded-[inherit] transition-all duration-500 p-4 pt-6',
          cardState === 'disconnected' &&
            'bg-gradient-to-b from-cyan-50/50 to-pink-50',
          cardState === 'connecting' && 'bg-amber-50/10',
          cardState === 'connected' && 'bg-green-50/10',
          cardState === 'disconnecting' && 'bg-orange-50/10',
          cardState === 'ai-speaking' && 'bg-transparent',
          cardState === 'error' && 'bg-red-50/10'
        )}
      >
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <button
              onClick={handleStartRecording}
              disabled={
                cardState === 'connecting' ||
                cardState === 'disconnecting' ||
                status === 'connected' ||
                cardState === 'error'
              }
              className={cn(
                'relative hover:scale-105 transition-all duration-300 w-[110px] h-[110px] rounded-full overflow-hidden focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed',
                cardState === 'connecting' && 'animate-pulse'
              )}
              type="button"
              aria-label="Start recording"
            >
              <MeshGradient
                style={{ height: '100%', width: '100%' }}
                distortion={0.8}
                swirl={0.5}
                offsetX={0}
                offsetY={0}
                scale={1}
                rotation={0}
                speed={2}
                colors={['#06b6d4', '#3b82f6', '#9333ea']}
                className="rounded-full opacity-20"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                {cardState === 'connecting' && (
                  <Loader className="h-10 w-10 text-white animate-spin" />
                )}
                {cardState === 'disconnecting' && (
                  <Loader className="h-10 w-10 text-white animate-spin" />
                )}
                {(cardState === 'connected' ||
                  cardState === 'disconnected') && (
                  <Image
                    src="/kira-mic.webp"
                    alt="Kira"
                    width={140}
                    height={140}
                    className="object-cover drop-shadow-md"
                    priority
                  />
                )}
                {cardState === 'ai-speaking' && (
                  <Image
                    src="/kira-speaking.gif"
                    alt="Kira"
                    width={140}
                    height={140}
                    className="object-cover drop-shadow-md"
                    unoptimized
                  />
                )}
              </div>
              {cardState === 'connected' && (
                <>
                  <div className="pointer-events-none absolute inset-0 rounded-full border-2 border-blue-500 animate-ping opacity-75"></div>
                  <div className="pointer-events-none absolute inset-0 rounded-full border-2 border-blue-500 animate-pulse"></div>
                </>
              )}
              {cardState === 'disconnecting' && (
                <div className="pointer-events-none absolute inset-0 rounded-full border-2 border-orange-400 animate-pulse opacity-75"></div>
              )}
              {cardState === 'connecting' && (
                <div className="pointer-events-none absolute inset-0 rounded-full border-2 border-amber-400 animate-ping opacity-50"></div>
              )}
            </button>
            {cardState === 'connected' && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border border-white animate-pulse"></div>
            )}
          </div>

          <div className="text-center space-y-2 min-h-12">
            {cardState === 'disconnected' && (
              <>
                <h3 className="text-base font-medium text-foreground">
                  Ready to Begin
                </h3>
                <p className="text-xs text-muted-foreground">
                  Click the microphone to start a new story session
                </p>
              </>
            )}

            {cardState === 'error' && (
              <>
                <h3 className="text-base font-medium text-red-600">
                  Connection Error
                </h3>
                <p className="text-xs text-muted-foreground">
                  {error ||
                    'Something went wrong. Please refresh and try again.'}
                </p>
              </>
            )}

            {cardState === 'connecting' && (
              <>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-foreground">
                    Connecting...
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Setting up your storytelling session
                </p>
              </>
            )}

            {cardState === 'connected' && (
              <>
                <h3 className="text-base font-medium text-foreground">
                  Listening...
                </h3>
                <p className="text-xs text-muted-foreground">
                  Let's talk about your day.
                </p>
              </>
            )}

            {cardState === 'disconnecting' && (
              <>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-foreground">
                    Disconnecting...
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Ending your storytelling session
                </p>
              </>
            )}

            {cardState === 'ai-speaking' && (
              <>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-foreground">
                    Kira is Speaking...
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Listen to the magical story being told
                </p>
              </>
            )}
          </div>
          {(cardState === 'connected' || cardState === 'ai-speaking') && (
            <div className="flex items-center justify-center gap-1 h-12">
              {Array.from({ length: 12 }, (_, i) => ({
                id: `waveform-${i}`,
                height: Math.random() * 40 + 10,
                delay: i * 0.1,
                duration: 0.5 + Math.random() * 0.5,
              })).map((bar) => (
                <div
                  key={bar.id}
                  className={cn(
                    'w-1 rounded-full animate-pulse',
                    cardState === 'connected' && 'bg-blue-500',
                    cardState === 'ai-speaking' && 'bg-primary'
                  )}
                  style={{
                    height: `${bar.height}px`,
                    animationDelay: `${bar.delay}s`,
                    animationDuration: `${bar.duration}s`,
                  }}
                ></div>
              ))}
            </div>
          )}
          <div className="flex items-center gap-3">
            {(cardState === 'connected' || cardState === 'ai-speaking') && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs bg-transparent border border-red-300 text-red-500"
                onClick={handleStopRecording}
              >
                <MicOff className="h-3 w-3 mr-1" />
                Stop
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
