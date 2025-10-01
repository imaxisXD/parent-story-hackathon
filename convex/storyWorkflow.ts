import { WorkflowManager } from '@convex-dev/workflow';
import { v } from 'convex/values';
import { components, internal } from './_generated/api';
import type { Doc } from './_generated/dataModel';

export const workflow = new WorkflowManager(components.workflow);

/**
 * Story Generation Workflow
 *
 * This workflow orchestrates the following steps:
 * 1. Check if evaluation is true
 * 2. Extract transcript from VAPI report
 * 3. Generate story from transcript using LLM
 * 4. Convert story to audio using ElevenLabs
 * 5. Store audio in Convex storage
 * 6. Update the VAPI report with the results
 */

export const generateStoryFromTranscript = workflow.define({
  args: {
    reportId: v.id('vapiReports'),
  },
  handler: async (step, { reportId }) => {
    const report: Doc<'vapiReports'> | null = await step.runQuery(
      internal.storyQueries.getReport,
      {
        reportId,
      }
    );

    if (!report) {
      throw new Error(`Report ${reportId} not found`);
    }

    if (!report.evaluation) {
      await step.runMutation(internal.storyQueries.updateWorkflowStatus, {
        reportId,
        status: 'skipped',
        error: 'Evaluation was false, no story generated',
      });
      return { success: false, reason: 'evaluation_false' };
    }

    // Step 2: Mark workflow as processing
    await step.runMutation(internal.storyQueries.updateWorkflowStatus, {
      reportId,
      status: 'processing',
    });

    // Step 3: Generate story from transcript using LLM
    const storyResult = await step.runAction(
      internal.storyActions.generateStoryFromLLM,
      {
        transcript: report.transcript,
        userName: report.userName,
      }
    );

    if (!storyResult.success) {
      await step.runMutation(internal.storyQueries.updateWorkflowStatus, {
        reportId,
        status: 'failed',
        error: storyResult.error || 'Failed to generate story',
      });
      return { success: false, reason: 'llm_generation_failed' };
    }

    // Step 4: Save the story text
    await step.runMutation(internal.storyQueries.saveStoryText, {
      reportId,
      storyText: storyResult.story || '',
    });

    // Step 5: Convert story to audio using ElevenLabs
    const audioResult = await step.runAction(
      internal.storyActions.generateAudioFromStory,
      {
        storyText: storyResult.story || '',
      }
    );

    if (!audioResult.success) {
      await step.runMutation(internal.storyQueries.updateWorkflowStatus, {
        reportId,
        status: 'failed',
        error: audioResult.error || 'Failed to generate audio',
      });
      return { success: false, reason: 'audio_generation_failed' };
    }

    await step.runMutation(internal.storyQueries.updateWorkflowStatus, {
      reportId,
      status: 'completed',
      audioStorageId: audioResult.storageId,
    });
  },
});
