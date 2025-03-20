import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getList = query({
  args: { id: v.id("lists") },
  handler: async (ctx, args) => await ctx.db.get(args.id),
});

export const getNonArchivedLists = query({
  handler: async (ctx) =>
    await ctx.db
      .query("lists")
      .withIndex("by_parent", (q) => q.eq("parentListId", undefined))
      .collect(),
});

export const getArchivedLists = query({
  args: { parentListId: v.id("lists") },
  handler: async (ctx, args) =>
    await ctx.db
      .query("lists")
      .withIndex("by_parent", (q) => q.eq("parentListId", args.parentListId))
      .collect(),
});

export const deleteList = mutation({
  args: { id: v.id("lists") },
  handler: async (ctx, args) => {
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
  handler: async (ctx, args) =>
    await ctx.db.insert("lists", {
      name: args.name,
    }),
});
