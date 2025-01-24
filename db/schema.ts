import { relations } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const listsTable = sqliteTable("lists_table", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
});

export const listsRelations = relations(listsTable, ({ many }) => ({
  todos: many(todosTable),
}))

export const todosTable = sqliteTable("todos_table", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  listId: int(),
});

export const todosRelations = relations(todosTable, ({ one }) => ({
  list: one(listsTable, {
    fields: [todosTable.listId],
    references: [listsTable.id],
  }),
}));