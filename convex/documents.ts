import { query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const documents = await ctx.db.query("documents").collect();
    // do something with `documents`
    return documents;
  },
});
