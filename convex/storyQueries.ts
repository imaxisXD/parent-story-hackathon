import { v } from 'convex/values';
import { internal } from './_generated/api';
import type { Doc } from './_generated/dataModel';
import { internalMutation, internalQuery } from './_generated/server';

export const getReport = internalQuery({
  args: { reportId: v.id('vapiReports') },
  handler: async (ctx, { reportId }): Promise<Doc<'vapiReports'> | null> => {
    return await ctx.db.get(reportId);
  },
});

export const updateWorkflowStatus = internalMutation({
  args: {
    reportId: v.id('vapiReports'),
    status: v.string(),
    error: v.optional(v.string()),
    audioStorageId: v.optional(v.id('_storage')),
  },
  handler: async (ctx, { reportId, status, error, audioStorageId }) => {
    const story = await ctx.db.get(reportId);
    if (story) {
      const user = await ctx.db.get(story.userId);
      if (user) {
        await ctx.db.patch(user._id, {
          usage: user.usage - 1,
        });
      }
      await ctx.db.patch(story._id, {
        audioStorageId,
        workflowStatus: status,
        ...(error && { workflowError: error }),
      });

      // When story workflow completes, notify the user via email
      if (status === 'completed' && user?.email) {
        // Construct an app URL for listening. Adjust if custom route.
        await ctx.scheduler.runAfter(
          0,
          internal.sendEmails.sendStoryCreatedEmail,
          {
            to: user.email,
            userName: story.userName || 'there',
          }
        );
      }
    }
  },
});

export const saveStoryText = internalMutation({
  args: {
    reportId: v.id('vapiReports'),
    storyText: v.string(),
  },
  handler: async (ctx, { reportId, storyText }) => {
    await ctx.db.patch(reportId, {
      storyText,
    });
  },
});

export const updateReport = internalMutation({
  args: {
    reportId: v.id('vapiReports'),
    audioStorageId: v.id('_storage'),
  },
  handler: async (ctx, { reportId, audioStorageId }) => {
    await ctx.db.patch(reportId, {
      audioStorageId,
    });
  },
});
