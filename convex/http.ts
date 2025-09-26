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

  const raw = body ?? {};
  const message = raw as Record<string, unknown>;
  const type: string | undefined = message.type;

  // Extract identifiers defensively from known locations
  const call = message.call ?? {};

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
