import { v } from 'convex/values';
import { internal } from './_generated/api';
import { internalMutation } from './_generated/server';
import { workflow } from './storyWorkflow';

export const ingestEndOfCallReport = internalMutation({
  args: {
    callId: v.string(),
    transcript: v.string(),
    summary: v.string(),
    timestamp: v.string(),
    userEmail: v.string(),
    userName: v.string(),
    evaluation: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', args.userEmail))
      .first();

    if (!user) {
      return;
    }

    const evaluationBoolean = args.evaluation === 'true';

    const reportId = await ctx.db.insert('vapiReports', {
      callId: args.callId,
      timestamp: args.timestamp,
      userEmail: args.userEmail,
      userName: args.userName,
      evaluation: evaluationBoolean,
      summary: args.summary,
      transcript: args.transcript,
      userId: user._id,
      workflowStatus: evaluationBoolean ? 'pending' : 'skipped',
    });

    if (evaluationBoolean) {
      await workflow.start(
        ctx,
        internal.storyWorkflow.generateStoryFromTranscript,
        { reportId }
      );
    }

    return { reportId, workflowTriggered: evaluationBoolean };
  },
});

export const startWorkflow = internalMutation({
  args: {
    reportId: v.id('vapiReports'),
  },
  handler: async (ctx, { reportId }) => {
    await workflow.start(
      ctx,
      internal.storyWorkflow.generateStoryFromTranscript,
      { reportId }
    );
  },
});
