import { query } from './_generated/server';

export const getUser = query({
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  },
});
