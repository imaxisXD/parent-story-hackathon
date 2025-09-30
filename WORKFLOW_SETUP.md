# Story Generation Workflow Setup

This document explains the Convex workflow implementation for generating audio stories from VAPI call transcripts.

## Overview

The workflow automatically processes VAPI call transcripts when the evaluation is marked as `true`:

1. ✅ **Validation**: Checks if the call evaluation was successful
2. 📝 **Story Generation**: Uses OpenAI GPT-4 to transform the transcript into a children's story
3. 🎙️ **Audio Conversion**: Converts the story to audio using ElevenLabs text-to-speech
4. 💾 **Storage**: Saves the audio file to Convex storage
5. 🔄 **Update**: Links the audio back to the VAPI report

## Architecture

### Files Created

- **`convex/storyWorkflow.ts`**: Main workflow definition using Convex Workflow component
- **`convex/storyHelpers.ts`**: Helper functions for LLM and ElevenLabs integration
- **`convex/schema.ts`**: Updated to include workflow status and audio storage fields
- **`convex/vapi.ts`**: Updated to trigger the workflow on successful calls
- **`convex/convex.config.ts`**: Configured with the workflow component

### Workflow Steps

```typescript
1. getReport(reportId)
   ↓
2. Check evaluation === true
   ↓
3. updateWorkflowStatus(reportId, 'processing')
   ↓
4. generateStoryFromLLM(transcript, userName)
   ↓
5. saveStoryText(reportId, storyText)
   ↓
6. generateAudioFromStory(storyText)
   ↓
7. saveAudioToStorage(reportId, audioBlob)
   ↓
8. updateWorkflowStatus(reportId, 'completed')
```

## Required Environment Variables

Add these to your `.env.local` file:

```bash
# OpenAI (for story generation)
OPENAI_API_KEY=sk-...

# ElevenLabs (for text-to-speech)
ELEVENLABS_API_KEY=...

# Optional: Specify a voice ID from your ElevenLabs account
# Default: EXAVITQu4vr4xnSDxMaL (Sarah voice)
ELEVENLABS_VOICE_ID=...
```

## Deployment Steps

1. **Install Dependencies** ✅ (Already done)
   ```bash
   pnpm install @convex-dev/workflow @elevenlabs/elevenlabs-js openai
   ```

2. **Set Environment Variables**
   - Add the required API keys to your Convex dashboard
   - Go to: https://dashboard.convex.dev → Your Project → Settings → Environment Variables
   - Add:
     - `OPENAI_API_KEY`
     - `ELEVENLABS_API_KEY`
     - `ELEVENLABS_VOICE_ID` (optional)

3. **Deploy to Convex**
   ```bash
   npx convex deploy
   ```

4. **Test the Workflow**
   - Make a VAPI call that results in `evaluation: true`
   - Check the Convex dashboard to see the workflow execution
   - Monitor logs for any errors

## Monitoring & Debugging

### Check Workflow Status

Query the `vapiReports` table to see the workflow status:

```typescript
// In Convex dashboard or your app
const reports = await ctx.db
  .query('vapiReports')
  .withIndex('by_user', (q) => q.eq('userId', userId))
  .collect();

// Check workflowStatus field:
// - 'pending': Workflow is queued
// - 'processing': Workflow is running
// - 'completed': Story and audio generated successfully
// - 'failed': Workflow encountered an error
// - 'skipped': Evaluation was false
```

### Access Generated Audio

```typescript
// Get the audio URL
const report = await ctx.db.get(reportId);
if (report.audioStorageId) {
  const url = await ctx.storage.getUrl(report.audioStorageId);
  // Use this URL to play the audio
}
```

### Common Issues

1. **Workflow not triggering**
   - Check that `evaluation` is coming through as `'true'` (string) from VAPI
   - Verify the workflow component is properly installed in `convex.config.ts`

2. **LLM generation fails**
   - Verify `OPENAI_API_KEY` is set correctly
   - Check OpenAI API quota and billing

3. **Audio generation fails**
   - Verify `ELEVENLABS_API_KEY` is set correctly
   - Check ElevenLabs API quota
   - Ensure the voice ID is valid

4. **Storage fails**
   - Check Convex storage limits on your plan
   - Verify the audio blob is being generated correctly

## Customization

### Change the Story Prompt

Edit the system prompt in `convex/storyHelpers.ts`:

```typescript
const systemPrompt = `You are a creative children's story writer...`;
```

### Change the Voice

Update the `voiceId` in `convex/storyHelpers.ts` or set `ELEVENLABS_VOICE_ID`:

```typescript
const voiceId = process.env.ELEVENLABS_VOICE_ID || 'your-voice-id';
```

Browse available voices at: https://elevenlabs.io/voice-library

### Change the LLM Model

Update the model in `convex/storyHelpers.ts`:

```typescript
const completion = await openai.chat.completions.create({
  model: 'gpt-4o', // or 'gpt-3.5-turbo', etc.
  // ...
});
```

## API Reference

### Workflow Function

```typescript
internal.storyWorkflow.generateStoryFromTranscript({
  reportId: Id<"vapiReports">
})
```

### Helper Functions

All helper functions are internal and called by the workflow:

- `getReport(reportId)`: Fetches the VAPI report
- `updateWorkflowStatus(reportId, status, error?)`: Updates workflow state
- `saveStoryText(reportId, storyText)`: Saves generated story
- `saveAudioToStorage(reportId, audioBlob)`: Stores audio file
- `generateStoryFromLLM(transcript, userName)`: Generates story using OpenAI
- `generateAudioFromStory(storyText)`: Converts story to audio using ElevenLabs

## Next Steps

Consider adding:

1. **Retry Logic**: The workflow component handles retries automatically, but you can customize retry behavior
2. **Notifications**: Send email/push notifications when stories are ready
3. **UI Integration**: Display generated stories and audio in your app
4. **Multiple Voices**: Allow users to choose different narration voices
5. **Story Customization**: Let users specify story themes, lengths, or styles
6. **Analytics**: Track generation success rates and user engagement

## Resources

- [Convex Workflows Documentation](https://www.convex.dev/components/workflow)
- [ElevenLabs API Documentation](https://elevenlabs.io/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
