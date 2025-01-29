import { relations } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const listsTable = sqliteTable("lists_table", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  archivedAt: int({ mode: "timestamp" }),
  parentListId: int(),
});

export const listsRelations = relations(listsTable, ({ many, one }) => ({
  todos: many(todosTable),
  parentList: one(listsTable, {
    fields: [listsTable.parentListId],
    references: [listsTable.id],
  }),
}));

export const todosTable = sqliteTable("todos_table", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  listId: int().notNull(),
  completed: int({ mode: "boolean" }).default(false).notNull(),
});

export const todosRelations = relations(todosTable, ({ one }) => ({
  list: one(listsTable, {
    fields: [todosTable.listId],
    references: [listsTable.id],
  }),
}));
