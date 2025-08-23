import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Helper function to update activity for a given date
const updateActivityForDate = async (ctx: any, date: string) => {
  // Check if activity record exists for this date
  const existingActivity = await ctx.db
    .query("activity")
    .filter((q: any) => q.eq(q.field("date"), date))
    .first();

  if (existingActivity) {
    // Update existing record
    await ctx.db.patch(existingActivity._id, {
      storiesCount: existingActivity.storiesCount + 1,
    });
  } else {
    // Create new activity record
    await ctx.db.insert("activity", {
      date,
      storiesCount: 1,
    });
  }
};

// Mutation to create a new story
export const createStory = mutation({
  args: {
    title: v.string(),
    character: v.string(),
    characterName: v.string(),
    emoji: v.string(),
    duration: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const today = new Date(now).toISOString().split("T")[0];

    // Create the story
    const storyId = await ctx.db.insert("stories", {
      title: args.title,
      character: args.character,
      characterName: args.characterName,
      emoji: args.emoji,
      duration: args.duration,
      plays: 0,
      rating: 5, // Default rating
      createdAt: now,
    });

    // Update activity for today
    await updateActivityForDate(ctx, today);

    return storyId;
  },
});

// Mutation to increment play count
export const incrementPlays = mutation({
  args: { storyId: v.id("stories") },
  handler: async (ctx, args) => {
    const story = await ctx.db.get(args.storyId);
    if (!story) {
      throw new Error("Story not found");
    }

    await ctx.db.patch(args.storyId, {
      plays: story.plays + 1,
    });
  },
});

// Mutation to update story rating
export const updateRating = mutation({
  args: {
    storyId: v.id("stories"),
    rating: v.number(),
  },
  handler: async (ctx, args) => {
    if (args.rating < 1 || args.rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    await ctx.db.patch(args.storyId, {
      rating: args.rating,
    });
  },
});

// Query to get all stories sorted by creation time (most recent first)
export const getStories = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("stories")
      .withIndex("by_created_at")
      .order("desc")
      .collect();
  },
});

// Query to get activity data for the past 365 days (GitHub-style)
export const getActivityData = query({
  handler: async (ctx) => {
    const today = new Date();
    // Start from 364 days ago (365 days total including today)
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 364);

    // Get all activity records
    const activities = await ctx.db.query("activity").collect();

    // Create a map for easy lookup
    const activityMap = new Map();
    activities.forEach(activity => {
      activityMap.set(activity.date, activity.storiesCount);
    });

    // Generate data for exactly 365 days ending today
    const data = [];
    for (let i = 0; i < 365; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];
      
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
    const stories = await ctx.db.query("stories").collect();
    
    const totalStories = stories.length;
    const totalPlays = stories.reduce((sum, story) => sum + story.plays, 0);
    const averageRating = totalStories > 0 
      ? stories.reduce((sum, story) => sum + story.rating, 0) / totalStories
      : 0;

    // Get stories from current year
    const currentYear = new Date().getFullYear();
    const currentYearStart = new Date(currentYear, 0, 1).getTime();
    const storiesThisYear = stories.filter(story => story.createdAt >= currentYearStart);

    return {
      totalStories,
      totalPlays,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      storiesThisYear: storiesThisYear.length,
    };
  },
});
