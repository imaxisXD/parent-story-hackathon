import { useConversation } from '@elevenlabs/react';
import { AudioWaveform, Loader2, Mic, MicOff, Waves } from 'lucide-react';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

export default function RecordCard() {
  const { isSpeaking, startSession, status, endSession } = useConversation();
  const cardState = useMemo(() => {
    if (isSpeaking) return 'ai-speaking';
    return status; // 'disconnected', 'connecting', 'connected', or 'disconnecting'
  }, [status, isSpeaking]);

  const handleStartRecording = async () => {
    try {
      if (status === 'connected') return;
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await startSession({
        agentId: 'agent_4601k3h4kmvkfykv50nv1knm25xy',
        connectionType: 'websocket',
        dynamicVariables: {
          user_name: 'Angelo',
        },
        onMessage: (message) => {
          console.log('Message:', message);
        },
      });
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const handleStopRecording = async () => {
    try {
      await endSession();
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  return (
    <div className="relative">
      <div
        className={cn(
          'p-8 border rounded-xl transition-all duration-500',
          cardState === 'disconnected' &&
            'border-border bg-card hover:bg-muted/30',
          cardState === 'connecting' &&
            'border-amber-400/30 bg-amber-50/5 shadow-md shadow-amber-400/10',
          cardState === 'connected' &&
            'border-green-400/30 bg-green-50/5 shadow-md shadow-green-400/10',
          cardState === 'disconnecting' &&
            'border-orange-400/30 bg-orange-50/5 shadow-md shadow-orange-400/10',
          cardState === 'ai-speaking' &&
            'border-primary/30 bg-primary/5 shadow-lg shadow-primary/10'
        )}
      >
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <Button
              className={cn(
                'relative w-24 h-24 rounded-full border-2 transition-all duration-300 flex items-center justify-center',
                // Base state styling based on cardState
                cardState === 'disconnected' &&
                  'border-pink-400 bg-gradient-to-br from-pink-400 to-primary hover:from-pink-600 hover:to-pink-700 shadow-lg shadow-primary/25',
                cardState === 'connecting' &&
                  'border-amber-400 bg-gradient-to-br from-amber-300 to-amber-500 hover:from-amber-400 hover:to-amber-600 shadow-lg shadow-amber-400/25 animate-pulse',
                cardState === 'connected' &&
                  'border-green-400 bg-gradient-to-br from-green-400 to-primary hover:from-green-500 hover:to-primary shadow-lg shadow-green-400/25',
                cardState === 'disconnecting' &&
                  'border-orange-400 bg-gradient-to-br from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 shadow-lg shadow-orange-400/25 opacity-90',
                cardState === 'ai-speaking' &&
                  'border-primary bg-gradient-to-br from-violet-400 to-primary hover:from-violet-500 hover:to-primary shadow-lg shadow-primary/25'
              )}
              onClick={handleStartRecording}
              disabled={
                cardState === 'connecting' ||
                cardState === 'disconnecting' ||
                status === 'connected'
              }
            >
              {/* Icon based on state */}
              {cardState === 'connecting' && (
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              )}
              {cardState === 'disconnecting' && (
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              )}
              {cardState === 'connected' && (
                <Mic className="h-8 w-8 text-white" />
              )}
              {cardState === 'disconnected' && (
                <Mic className="h-8 w-8 text-white" />
              )}
              {cardState === 'ai-speaking' && (
                <Waves className="h-8 w-8 text-white animate-pulse" />
              )}

              {/* Pulsing ring animations based on state */}
              {cardState === 'connected' && (
                <>
                  <div className="absolute inset-0 rounded-full border-2 border-blue-500 animate-ping opacity-75"></div>
                  <div className="absolute inset-0 rounded-full border-2 border-blue-500 animate-pulse"></div>
                </>
              )}
              {cardState === 'ai-speaking' && (
                <>
                  <div className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-50"></div>
                  <div className="absolute inset-0 rounded-full border-2 border-primary animate-pulse"></div>
                </>
              )}
              {cardState === 'disconnecting' && (
                <div className="absolute inset-0 rounded-full border-2 border-orange-400 animate-pulse opacity-75"></div>
              )}
              {cardState === 'connecting' && (
                <div className="absolute inset-0 rounded-full border-2 border-amber-400 animate-ping opacity-50"></div>
              )}
            </Button>

            {/* Connection status indicator dot */}
            {cardState === 'connected' && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border border-white animate-pulse"></div>
            )}
          </div>

          {/* Connection and Recording Status */}
          <div className="text-center space-y-2 min-h-12">
            {cardState === 'disconnected' && (
              <>
                <h3 className="text-base font-medium text-foreground font-serif">
                  Ready to Begin
                </h3>
                <p className="text-xs text-muted-foreground">
                  Click the microphone to start a new story session
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
                <h3 className="text-base font-medium text-foreground font-serif">
                  Listening...
                </h3>
                <p className="text-xs text-muted-foreground">
                  Lets talk about your day.
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
                    AI is Speaking...
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Listen to the magical story being told
                </p>
              </>
            )}
          </div>

          {/* Audio Waveform Visualization */}
          {(cardState === 'connected' || cardState === 'ai-speaking') && (
            <div className="flex items-center justify-center gap-1 h-12">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'w-1 rounded-full animate-pulse',
                    cardState === 'connected' && 'bg-blue-500',
                    cardState === 'ai-speaking' && 'bg-primary'
                  )}
                  style={{
                    height: `${Math.random() * 40 + 10}px`,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: `${0.5 + Math.random() * 0.5}s`,
                  }}
                ></div>
              ))}
            </div>
          )}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs bg-transparent"
              disabled={
                cardState === 'ai-speaking' ||
                cardState === 'connecting' ||
                cardState === 'disconnecting'
              }
              onClick={handleStopRecording}
            >
              <MicOff className="h-3 w-3 mr-1" />
              Stop
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs bg-transparent"
              disabled={
                cardState !== 'connected' && cardState !== 'ai-speaking'
              }
            >
              <AudioWaveform className="h-3 w-3 mr-1" />
              Preview
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
