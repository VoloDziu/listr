import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  lists: defineTable({
    name: v.string(),
    archivedAt: v.optional(v.number()),
    parentListId: v.optional(v.id("lists")),
  }).index("by_parent", ["parentListId"]),
  todos: defineTable({
    name: v.string(),
    listId: v.id("lists"),
    completed: v.boolean(),
  }).index("by_list", ["listId"]),
});
