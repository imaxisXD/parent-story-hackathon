import { Resend } from '@convex-dev/resend';
import { v } from 'convex/values';
import { components } from './_generated/api';
import { internalMutation } from './_generated/server';

export const resendClient: Resend = new Resend(components.resend, {
  testMode: false,
});

export const sendStoryCreatedEmail = internalMutation({
  args: {
    to: v.string(),
    userName: v.string(),
  },
  handler: async (ctx, { to, userName }) => {
    const subject = 'Your bedtime story is ready! ✨';
    const html = `
      <div style="font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; color: #111;">
        <h1 style="margin: 0 0 12px; font-size: 22px;">Hey ${userName || 'there'} 👋</h1>
        <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.5;">
          Your brand-new, AI-crafted bedtime story has just landed! We turned your conversation into a cozy audio adventure—perfect for wind-down time.
        </p>
        <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.5;">
          Put on your headphones, tuck in, and let the magic begin. 🌙✨
        </p>
       
        <p style="margin: 0 0 8px; color: #555; font-size: 14px;">Tip: Stories live in your Parent dashboard—play them anytime.</p>
        <p style="margin: 0; color: #777; font-size: 12px;">Made with ❤️ by Kira</p>
      </div>
    `;

    await resendClient.sendEmail(ctx, {
      from: 'Kira Story <no-reply@campagin.resonex.cc>',
      to,
      subject,
      html,
    });
  },
});
