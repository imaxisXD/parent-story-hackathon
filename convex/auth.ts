import { createClient, type GenericCtx } from '@convex-dev/better-auth';
import { convex } from '@convex-dev/better-auth/plugins';
import { betterAuth } from 'better-auth';
import { components } from './_generated/api';
import type { DataModel } from './_generated/dataModel';
import { mutation, query } from './_generated/server';

const siteUrl = process.env.SITE_URL!;

// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuth = (
  ctx: GenericCtx<DataModel>,
  { optionsOnly } = { optionsOnly: false }
) => {
  return betterAuth({
    logger: {
      disabled: optionsOnly,
    },
    baseURL: siteUrl,
    database: authComponent.adapter(ctx),
    socialProviders: {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID as string,
        clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        redirectURI: `${siteUrl}/parent`,
      },
    },

    plugins: [convex()],
  });
};

// Feel free to edit, omit, etc.
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userData = await authComponent.getAuthUser(ctx);
    if (!userData) {
      return null;
    }
    const user = await ctx.db
      .query('users')
      .withIndex('by_identifier', (q) => q.eq('identifier', userData._id))
      .first();
    return {
      email: userData.email,
      name: userData.name,
      image: userData.image,
      usage: user?.usage ?? 2,
    };
  },
});

export const storeUser = mutation({
  args: {},
  handler: async (ctx) => {
    const userFromBetterAuth = await authComponent.getAuthUser(ctx);
    if (userFromBetterAuth) {
      const user = await ctx.db
        .query('users')
        .withIndex('by_identifier', (q) =>
          q.eq('identifier', userFromBetterAuth._id)
        )
        .first();
      if (!user) {
        //Insert new user
        await ctx.db.insert('users', {
          identifier: userFromBetterAuth._id,
          name: userFromBetterAuth.name,
          email: userFromBetterAuth.email,
          usage: 2,
        });
      }
    }
  },
});
