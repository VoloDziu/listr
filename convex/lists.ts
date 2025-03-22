import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getList = query({
  args: { id: v.id("lists") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const list = await ctx.db.get(args.id);

    if (list?.userId !== identity.tokenIdentifier) {
      throw new Error("Not authorized");
    }

    return list;
  },
});

export const getNonArchivedLists = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const userLists = await ctx.db
      .query("lists")
      .withIndex("by_user", (q) => q.eq("userId", identity.tokenIdentifier))
      .collect();

    return userLists.filter((list) => list.archivedAt === undefined);
  },
});

export const getArchivedLists = query({
  args: { parentListId: v.id("lists") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const userLists = await ctx.db
      .query("lists")
      .withIndex("by_user", (q) => q.eq("userId", identity.tokenIdentifier))
      .collect();

    return userLists.filter((list) => list.parentListId === args.parentListId);
  },
});

export const deleteList = mutation({
  args: { id: v.id("lists") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const list = await ctx.db.get(args.id);

    if (list?.userId !== identity.tokenIdentifier) {
      throw new Error("Not authorized");
    }

    await ctx.db.delete(args.id);

    const todos = await ctx.db
      .query("todos")
      .withIndex("by_list", (q) => q.eq("listId", args.id))
      .collect();

    await Promise.all(todos.map((todo) => ctx.db.delete(todo._id)));
  },
});

export const createList = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    return await ctx.db.insert("lists", {
      name: args.name,
      userId: identity.tokenIdentifier,
    });
  },
});
