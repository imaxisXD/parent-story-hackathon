'use client';

import Vapi from '@vapi-ai/web';
import { useQuery } from 'convex/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '@/convex/_generated/api';
import { suppressDeprecatedDailyWarnings } from '@/lib/utils';

export type VapiStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'disconnecting';

export function useVapi() {
  const vapiRef = useRef<InstanceType<typeof Vapi> | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<VapiStatus>('disconnected');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const user = useQuery(api.auth.getCurrentUser);

  // Function to cleanup media stream
  const cleanupMediaStream = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      mediaStreamRef.current = null;
    }
  }, []);

  useEffect(() => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_VAPI_API_KEY || '';
      if (!apiKey) {
        console.warn(
          'NEXT_PUBLIC_VAPI_API_KEY is not set. Vapi will not connect.'
        );
      }

      const cleanupSuppression = suppressDeprecatedDailyWarnings();

      const vapi = new Vapi(apiKey);
      vapiRef.current = vapi;

      cleanupSuppression();

      vapi.on('call-start', () => {
        setStatus('connected');
      });

      vapi.on('call-end', () => {
        setStatus('disconnected');
        setIsSpeaking(false);
        cleanupMediaStream();
      });

      vapi.on('speech-start', () => {
        setIsSpeaking(true);
      });

      vapi.on('speech-end', () => {
        setIsSpeaking(false);
      });

      vapi.on('error', (error: unknown) => {
        console.warn('Vapi error:', error);
        setStatus('disconnected');
        setError(error instanceof Error ? error.message : String(error));
        cleanupMediaStream();
      });

      return () => {
        try {
          vapi?.stop?.();
          cleanupMediaStream();
        } catch {}
      };
    } catch (error) {
      console.warn('Error initializing Vapi:', error);
      setError(error instanceof Error ? error.message : String(error));
      setStatus('disconnected');
    }
  }, [cleanupMediaStream]);

  const start = useCallback(
    async (assistantIdParam?: string) => {
      if (
        status === 'connected' ||
        status === 'connecting' ||
        status === 'disconnecting'
      )
        return;
      setStatus('connecting');

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        mediaStreamRef.current = stream;

        const assistantId =
          assistantIdParam || process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
        const assistantOverrides = {
          variableValues: {
            user_name: user?.name,
            user_email: user?.email,
          },
        };
        try {
          await vapiRef.current?.start(assistantId, assistantOverrides);
        } catch (startError) {
          console.warn('Error calling vapi.start():', startError);
          setStatus('disconnected');
          setError(
            startError instanceof Error
              ? startError.message
              : String(startError)
          );
          return;
        }
      } catch (error) {
        console.warn('Failed to start VAPI call with Daily.co:', error);
        setStatus('disconnected');
        setError(error instanceof Error ? error.message : String(error));
      }
    },
    [status, user?.email, user?.name]
  );

  const stop = useCallback(async () => {
    if (status === 'disconnected' || status === 'disconnecting') return;
    setStatus('disconnecting');

    try {
      vapiRef.current?.stop();
      cleanupMediaStream();
    } catch (error) {
      console.error('Failed to stop VAPI call:', error);
      setError(error instanceof Error ? error.message : String(error));
      cleanupMediaStream();
    }
  }, [status, cleanupMediaStream]);

  return { status, isSpeaking, error, start, stop } as const;
}

export default useVapi;
