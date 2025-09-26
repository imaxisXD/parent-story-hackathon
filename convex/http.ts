import { httpRouter } from 'convex/server';
import { api } from './_generated/api';
import { httpAction } from './_generated/server';
import { authComponent, createAuth } from './auth';

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

  const raw =
    (body as { message?: VapiMessageMinimal } | VapiMessageMinimal) ?? {};
  const message: VapiMessageMinimal =
    ((raw as Record<string, unknown>).message as VapiMessageMinimal) ??
    (raw as VapiMessageMinimal);
  const type: string | undefined = message.type;

  // Extract identifiers defensively from known locations
  const call = message.call ?? {};
  const callId: string = call.id || call.callId || message.callId || 'unknown';
  const phoneNumber: string | undefined =
    message.phoneNumber || call.phoneNumber;
  const timestamp: number = Number(message.timestamp ?? Date.now());

  if (type === 'end-of-call-report') {
    console.log('end-of-call-report', message.transcript);
    // try {
    //   await ctx.runMutation((api as any).vapi.ingestEndOfCallReport, {
    //     type,
    //     callId,
    //     phoneNumber,
    //     payload: message,
    //     timestamp,
    //   });
    // } catch {
    //   return new Response(
    //     JSON.stringify({ ok: false, error: 'Failed to persist report' }),
    //     {
    //       status: 500,
    //       headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    //     }
    //   );
    // }
  }

  return new Response(
    JSON.stringify({ ok: true, handled: type === 'end-of-call-report', type }),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
});

const http = httpRouter();

authComponent.registerRoutes(http, createAuth);

http.route({ path: '/vapi/server', method: 'POST', handler: vapiServerEvents });
http.route({
  path: '/vapi/server',
  method: 'OPTIONS',
  handler: vapiServerEvents,
});

export default http;
