import { paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    title: v.optional(v.string()),
    initialContent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new ConvexError("Unauthorized");
    }
    console.log(user);
    const organizationId = user.organization_id as string | undefined;
    console.log(organizationId);
    return await ctx.db.insert("documents", {
      title: args.title ?? "Untitled Document",
      initialContent: args.initialContent,
      ownerId: user.subject,
      organizationId: organizationId,
    });
  },
}); 

export const get = query({
  args: {
    paginationOpts: paginationOptsValidator,
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    const organizationId = user.organization_id as string | undefined;
    const queryBuilder = ctx.db.query("documents");

    // 如果有搜索词，使用搜索索引
    if (args.search) {
      return await queryBuilder
        .withSearchIndex("search_title", (q) => {
          const searchQuery = q.search("title", args.search!);
          return organizationId
            ? searchQuery.eq("organizationId", organizationId)
            : searchQuery.eq("ownerId", user.subject);
        })
        .paginate(args.paginationOpts);
    }

    // 没有搜索词时，使用普通索引
    return await queryBuilder
      .withIndex(
        organizationId ? "by_organization_id" : "by_owner_id",
        (q) =>
          organizationId
            ? q.eq("organizationId", organizationId)
            : q.eq("ownerId", user.subject)
      )
      .paginate(args.paginationOpts);
  },
});

export const removeById = mutation({
  args: {
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new ConvexError("Unauthorized");
    }
    const document = await ctx.db.get(args.id);
    if (!document) {
      throw new ConvexError("Document not found");
    }
    const organizationId = user.organization_id as string | undefined;
    // 检查权限：要么是文档所有者，要么在同一个组织内
    const isOwner = document.ownerId === user.subject;
    const isInSameOrganization =
      organizationId &&
      document.organizationId &&
      document.organizationId === organizationId;
    if (!isOwner && !isInSameOrganization) {
      throw new ConvexError("Unauthorized");
    }
    return await ctx.db.delete(args.id);
  },
});

export const updateById = mutation({
  args: {
    id: v.id("documents"),
    title: v.optional(v.string()),
    initialContent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new ConvexError("Unauthorized");
    }
    const document = await ctx.db.get(args.id);
    if (!document) {
      throw new ConvexError("Document not found");
    }
    const organizationId = user.organization_id as string | undefined;
    // 检查权限：要么是文档所有者，要么在同一个组织内
    const isOwner = document.ownerId === user.subject;
    const isInSameOrganization =
      organizationId &&
      document.organizationId &&
      document.organizationId === organizationId;
    if (!isOwner && !isInSameOrganization) {
      throw new ConvexError("Unauthorized");
    }
    return await ctx.db.patch(args.id, {
      title: args.title,
      initialContent: args.initialContent,
    });
  },
});
