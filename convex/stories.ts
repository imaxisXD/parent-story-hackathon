import { query } from './_generated/server';

export const getStories = query({
  handler: async (ctx) => {
    const authenticatedUser = await ctx.auth.getUserIdentity();
    if (!authenticatedUser) {
      throw new Error('User not authenticated');
    }
    const email = authenticatedUser.email;
    if (!email) {
      throw new Error('User email not found');
    }
    const user = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', email))
      .first();
    if (!user) {
      throw new Error('User not found');
    }

    const reports = await ctx.db
      .query('vapiReports')
      .withIndex('by_user', (q) => q.eq('userId', user._id))
      .order('desc')
      .collect();

    const reportsWithUrls = await Promise.all(
      reports.map(async (report) => {
        if (report.audioStorageId) {
          const audioUrl = await ctx.storage.getUrl(report.audioStorageId);
          return { ...report, audioUrl };
        }
        return { ...report, audioUrl: null };
      })
    );

    return reportsWithUrls;
  },
});

// Query to get activity data for the past 365 days (GitHub-style)
export const getActivityData = query({
  handler: async (ctx) => {
    const authenticatedUser = await ctx.auth.getUserIdentity();
    if (!authenticatedUser) {
      throw new Error('User not authenticated');
    }
    const email = authenticatedUser.email;
    if (!email) {
      throw new Error('User email not found');
    }
    const user = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', email))
      .first();
    if (!user) {
      throw new Error('User not found');
    }

    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 364);

    // Get all vapiReports for this user
    const reports = await ctx.db
      .query('vapiReports')
      .withIndex('by_user', (q) => q.eq('userId', user._id))
      .collect();

    // Group reports by date
    const activityMap = new Map<string, number>();
    reports.forEach((report) => {
      const createdAtMs = report._creationTime;
      if (typeof createdAtMs !== 'number' || Number.isNaN(createdAtMs)) return;
      const date = new Date(createdAtMs).toISOString().split('T')[0];
      activityMap.set(date, (activityMap.get(date) || 0) + 1);
    });

    // Generate data for exactly 365 days ending today
    const data = [];
    for (let i = 0; i < 365; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      const stories = activityMap.get(dateStr) || 0;
      // Calculate level (0-4) based on story count
      let level = 0;
      if (stories > 0) level = 1;
      if (stories > 1) level = 2;
      if (stories > 2) level = 3;
      if (stories > 4) level = 4;

      // Calculate week info for proper grid layout
      const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
      const weeksSinceStart = Math.floor(i / 7);

      data.push({
        date: dateStr,
        level,
        stories,
        dayOfWeek,
        weekIndex: weeksSinceStart,
      });
    }

    return data;
  },
});

// Query to get story statistics
export const getStoryStats = query({
  handler: async (ctx) => {
    const authenticatedUser = await ctx.auth.getUserIdentity();
    if (!authenticatedUser) {
      throw new Error('User not authenticated');
    }
    const email = authenticatedUser.email;
    if (!email) {
      throw new Error('User email not found');
    }
    const user = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', email))
      .first();
    if (!user) {
      throw new Error('User not found');
    }

    const reports = await ctx.db
      .query('vapiReports')
      .withIndex('by_user', (q) => q.eq('userId', user._id))
      .collect();

    const totalStories = reports.length;

    // Get stories from current year
    const currentYear = new Date().getFullYear();
    const currentYearStart = new Date(currentYear, 0, 1).getTime();
    const storiesThisYear = reports.filter((report) => {
      return report._creationTime >= currentYearStart;
    });

    // Count completed stories (those with audio)
    const completedStories = reports.filter(
      (r) => r.workflowStatus === 'completed' && r.audioStorageId
    ).length;

    return {
      totalStories,
      completedStories,
      storiesThisYear: storiesThisYear.length,
    };
  },
});
