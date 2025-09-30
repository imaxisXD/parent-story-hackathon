import { httpRouter } from 'convex/server';
import { internal } from './_generated/api';
import { httpAction } from './_generated/server';
import { authComponent, createAuth } from './auth';

interface VoiceConfig {
  model: string;
  pitch: number;
  speed: number;
  region: string;
  volume: number;
  voiceId: string;
  provider: string;
  languageBoost: string;
  textNormalizationEnabled: boolean;
}

interface ModelConfig {
  model: string;
  messages: unknown[];
  provider: string;
}

interface TranscriberConfig {
  model: string;
  language: string;
  provider: string;
  endpointing: number;
}

interface AnalysisPlan {
  summaryPlan: {
    messages: unknown[];
  };
  structuredDataPlan: {
    schema: unknown;
    enabled: boolean;
    messages: unknown[];
  };
}

interface StartSpeakingPlan {
  waitSeconds: number;
  smartEndpointingEnabled: string;
}

export interface WebhookMessage {
  message: {
    timestamp: number;
    type: string; // e.g. 'speech-update', 'end-of-call-report'
    status?: string;
    role?: string;
    turn?: number;
    transcript?: string;
    summary?: string;
    artifact?: {
      messages?: Array<{
        role: string;
        message: string;
        time: number;
        secondsFromStart: number;
        endTime?: number;
        duration?: number;
        source?: string;
      }>;
      messagesOpenAIFormatted?: Array<{
        role: string;
        content: string;
      }>;
      variables?: {
        user_email: string;
        user_name: string;
      };
    };
    call: {
      id: string;
      orgId: string;
      createdAt: string;
      updatedAt: string;
      type: string;
      cost: number;
      monitor: {
        listenUrl: string;
        controlUrl: string;
      };
      transport: {
        provider: string;
        videoRecordingEnabled: boolean;
        assistantVideoEnabled: boolean;
        callUrl: string;
      };
      webCallUrl: string;
      status: string;
      assistantId: string;
      assistantOverrides?: {
        variableValues?: {
          user_name: string;
          user_email: string;
        };
      };
    };
    assistant?: {
      id: string;
      orgId: string;
      name: string;
      voice: VoiceConfig;
      createdAt: string;
      updatedAt: string;
      model: ModelConfig;
      recordingEnabled: boolean;
      firstMessage: string;
      voicemailMessage: string;
      endCallFunctionEnabled: boolean;
      endCallMessage: string;
      transcriber: TranscriberConfig;
      clientMessages: string[];
      endCallPhrases: string[];
      hipaaEnabled: boolean;
      analysisPlan: AnalysisPlan;
      backgroundDenoisingEnabled: boolean;
      startSpeakingPlan: StartSpeakingPlan;
      variableValues: {
        user_name: string;
        user_email: string;
      };
    };
    analysis?: {
      successEvaluation: string;
    };
  };
}

export const vapiServerEvents = httpAction(async (ctx, request) => {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', {
      status: 405,
    });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const raw = body ?? {};
  const response = raw as WebhookMessage;
  const type = response.message.type;

  if (type === 'end-of-call-report') {
    await ctx.runMutation(internal.vapi.ingestEndOfCallReport, {
      callId: response.message.call.id,
      transcript: response.message.transcript || '',
      summary: response.message.summary || '',
      timestamp: response.message.timestamp.toString(),
      userEmail:
        response.message.artifact?.variables?.user_email ||
        response.message.assistant?.variableValues?.user_email ||
        '',
      userName:
        response.message.artifact?.variables?.user_name ||
        response.message.assistant?.variableValues?.user_name ||
        '',
      evaluation: response.message.analysis?.successEvaluation || 'false',
    });
  }

  return new Response(
    JSON.stringify({ ok: true, handled: type === 'end-of-call-report', type }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
});

const http = httpRouter();

authComponent.registerRoutes(http, createAuth);

http.route({ path: '/vapi/server', method: 'POST', handler: vapiServerEvents });

export default http;
