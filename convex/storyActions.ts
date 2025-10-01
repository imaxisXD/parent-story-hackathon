'use node';

import { v } from 'convex/values';
import OpenAI from 'openai';
import { internalAction } from './_generated/server';

export const generateStoryFromLLM = internalAction({
  args: {
    transcript: v.string(),
    userName: v.string(),
  },
  handler: async (_, { transcript }) => {
    try {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const systemPrompt = `You are a creative children's story writer. Your task is to transform a conversation transcript between a parent and Kira(the AI journal of the parent) into a captivating, age-appropriate story.

Guidelines:
- Create a story suitable for children aged 4-8 or choose age from the transcript.
- Use simpler language and shorter sentences.
- Include dialogue and descriptive language
- Make it engaging and educational
- Keep it between 300-500 words
- Incorporate elements from the conversation naturally
- End with a positive message or lesson`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-5-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: `Transform this conversation into a children's story:\n\n${transcript}`,
          },
        ],
      });

      const story = completion.choices[0]?.message?.content;

      if (!story) {
        return {
          success: false,
          error: 'No story generated from LLM',
        };
      }

      return {
        success: true,
        story,
      };
    } catch (error) {
      console.error('Error generating story from LLM:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
});

export const generateAudioFromStory = internalAction({
  args: {
    storyText: v.string(),
  },
  handler: async (ctx, { storyText }) => {
    try {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const mp3 = await openai.audio.speech.create({
        model: 'gpt-4o-mini-tts',
        voice: 'sage',
        input: storyText,
        instructions:
          'Speak in a cheerful and positive tone. Speak in a childrens voice. You are narrating a story to a child so be expressive and engaging.',
      });

      const arrayBuffer = await mp3.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });

      const storageId = await ctx.storage.store(blob);

      return {
        success: true,
        storageId: storageId,
      };
    } catch (error) {
      console.error('Error generating audio from story:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
});
