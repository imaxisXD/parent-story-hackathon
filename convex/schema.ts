import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  stories: defineTable({
    title: v.string(),
    character: v.string(), // character ID (e.g., "superhero", "pirate")
    characterName: v.string(), // display name (e.g., "Super Hero", "Pirate Captain")
    emoji: v.string(), // character emoji
    duration: v.number(), // recording duration in seconds
    plays: v.number(), // number of times the story has been played
    rating: v.number(), // user rating 1-5
    audioUrl: v.optional(v.string()), // URL to audio file (for future use)
    transcript: v.optional(v.string()), // transcribed text (for future use)
    createdAt: v.number(), // timestamp when story was created
  })
    .index('by_created_at', ['createdAt'])
    .index('by_character', ['character'])
    .index('by_rating', ['rating']),

  activity: defineTable({
    date: v.string(), // YYYY-MM-DD format
    storiesCount: v.number(), // number of stories created on this date
    userId: v.optional(v.string()), // for future multi-user support
  })
    .index('by_date', ['date'])
    .index('by_user_date', ['userId', 'date']),

  vapiReports: defineTable({
    type: v.string(), // Vapi message.type, e.g., "end-of-call-report"
    callId: v.string(), // Call identifier if available
    phoneNumber: v.optional(v.string()), // phone number if present
    timestamp: v.number(), // time stored (ms)
    payload: v.any(), // full webhook payload for auditing/debugging
  })
    .index('by_call', ['callId'])
    .index('by_timestamp', ['timestamp']),
});
