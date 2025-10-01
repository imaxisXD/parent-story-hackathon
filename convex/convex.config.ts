import betterAuth from '@convex-dev/better-auth/convex.config';
import resend from '@convex-dev/resend/convex.config';
import workflow from '@convex-dev/workflow/convex.config';
import { defineApp } from 'convex/server';

const app = defineApp();
app.use(betterAuth);
app.use(workflow);
app.use(resend);

export default app;
