import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getTodos = query({
  args: { listId: v.id("lists") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const list = await ctx.db.get(args.listId);
    if (list?.userId !== identity.tokenIdentifier) {
      throw new Error("Not authorized");
    }

    return await ctx.db
      .query("todos")
      .withIndex("by_list", (q) => q.eq("listId", args.listId))
      .collect();
  },
});

export const createTodo = mutation({
  args: { name: v.string(), listId: v.id("lists") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const list = await ctx.db.get(args.listId);
    if (list?.userId !== identity.tokenIdentifier) {
      throw new Error("Not authorized");
    }

    return await ctx.db.insert("todos", {
      name: args.name,
      listId: args.listId,
      completed: false,
    });
  },
});

export const deleteTodo = mutation({
  args: { todoId: v.id("todos") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const todo = await ctx.db.get(args.todoId);
    if (!todo) {
      return null;
    }

    const list = await ctx.db.get(todo.listId);
    if (list?.userId !== identity.tokenIdentifier) {
      throw new Error("Not authorized");
    }

    await ctx.db.delete(args.todoId);
  },
});

export const toggleTodo = mutation({
  args: { todoId: v.id("todos") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const todo = await ctx.db.get(args.todoId);
    if (!todo) {
      return null;
    }

    const list = await ctx.db.get(todo.listId);
    if (list?.userId !== identity.tokenIdentifier) {
      throw new Error("Not authorized");
    }

    await ctx.db.patch(args.todoId, { completed: !todo.completed });
  },
});

export const archiveCompletedTodos = mutation({
  args: { listId: v.id("lists") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const list = await ctx.db.get(args.listId);
    if (list?.userId !== identity.tokenIdentifier) {
      throw new Error("Not authorized");
    }

    if (!list) {
      return null;
    }

    const todos = await ctx.db
      .query("todos")
      .withIndex("by_list", (q) => q.eq("listId", args.listId))
      .collect();

    const completedTodos = todos.filter((todo) => todo.completed);

    const archivedListId = await ctx.db.insert("lists", {
      name: `${list.name} (${new Date().toLocaleDateString()})`,
      parentListId: args.listId,
      userId: identity.tokenIdentifier,
      archivedAt: new Date().getTime(),
    });

    for (const todo of completedTodos) {
      await ctx.db.patch(todo._id, { listId: archivedListId });
    }
  },
});
