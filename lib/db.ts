import { drizzle } from "drizzle-orm/expo-sqlite";
import * as SQLite from "expo-sqlite";
import * as schema from "~/db/schema";

export const expo = SQLite.openDatabaseSync("db.db");
export const db = drizzle(expo, { schema });
