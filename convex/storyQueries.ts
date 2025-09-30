import { v } from 'convex/values';
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
    await ctx.db.patch(reportId, {
      audioStorageId,
      workflowStatus: status,
      ...(error && { workflowError: error }),
    });
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
