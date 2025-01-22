import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const listsTable = sqliteTable("lists_table", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
});
