'use client';

import Vapi from '@vapi-ai/web';
import { useCallback, useEffect, useRef, useState } from 'react';
import { suppressDeprecatedDailyWarnings } from '@/lib/utils';

export type VapiStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'disconnecting';

type VapiEventMessage = {
  type?: string;
  role?: 'user' | 'assistant' | string;
  transcript?: string;
  [key: string]: unknown;
};

export function useVapi() {
  const vapiRef = useRef<InstanceType<typeof Vapi> | null>(null);
  const [status, setStatus] = useState<VapiStatus>('disconnected');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_VAPI_API_KEY || '';
      if (!apiKey) {
        console.warn(
          'NEXT_PUBLIC_VAPI_API_KEY is not set. Vapi will not connect.'
        );
      }

      // Suppress the deprecated Daily.js version warning
      // This is a temporary workaround for VAPI SDK still referencing old Daily.js version
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
      });

      vapi.on('speech-start', () => {
        setIsSpeaking(true);
      });

      vapi.on('speech-end', () => {
        setIsSpeaking(false);
      });

      vapi.on('message', (message: VapiEventMessage) => {
        console.log('Vapi message:', message);
      });

      vapi.on('error', (error: unknown) => {
        console.warn('Vapi error:', error);
        setStatus('disconnected');
        setError(error instanceof Error ? error.message : String(error));
        // Don't re-throw the error as it's already handled
      });

      return () => {
        try {
          vapi?.stop?.();
        } catch {}
      };
    } catch (error) {
      console.warn('Error initializing Vapi:', error);
      setError(error instanceof Error ? error.message : String(error));
      setStatus('disconnected');
    }
  }, []);

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
        // Request microphone permissions
        await navigator.mediaDevices.getUserMedia({ audio: true });

        const assistantId =
          assistantIdParam || process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
        const assistantOverrides = {
          variableValues: {
            user_name: 'Angelo',
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
          // Do not rethrow; swallow to avoid breaking the app
          return;
        }
      } catch (error) {
        console.warn('Failed to start VAPI call with Daily.co:', error);
        setStatus('disconnected');
        setError(error instanceof Error ? error.message : String(error));
        // Don't re-throw the error as it's already handled in the component
      }
    },
    [status]
  );

  const stop = useCallback(async () => {
    if (status === 'disconnected' || status === 'disconnecting') return;
    setStatus('disconnecting');

    try {
      vapiRef.current?.stop();
    } catch (error) {
      console.error('Failed to stop VAPI call:', error);
      setError(error instanceof Error ? error.message : String(error));
    }
  }, [status]);

  return { status, isSpeaking, error, start, stop } as const;
}

export default useVapi;
