import { v } from 'convex/values';
import { mutation } from './_generated/server';

export const ingestEndOfCallReport = mutation({
  args: {
    type: v.string(),
    callId: v.string(),
    phoneNumber: v.optional(v.string()),
    payload: v.any(),
    timestamp: v.number(),
  },
  handler: async (ctx, args) => {
    const { type, callId, phoneNumber, payload, timestamp } = args;
    const id = await ctx.db.insert('vapiReports', {
      type,
      callId,
      phoneNumber,
      payload,
      timestamp,
    });
    return { id };
  },
});
