import { listsTable } from "@/db/schema";
import migrations from "@/drizzle/migrations";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import * as SQLite from "expo-sqlite";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import "react-native-reanimated";

const expo = SQLite.openDatabaseSync("db.db");
const db = drizzle(expo);

export default function RootLayout() {
  const { success, error } = useMigrations(db, migrations);
  useDrizzleStudio(expo);
  const [items, setItems] = useState<(typeof listsTable.$inferSelect)[] | null>(
    null,
  );

  useEffect(() => {
    if (!success) return;
    (async () => {
      const lists = await db.select().from(listsTable);
      setItems(lists);
    })();
  }, [success]);

  async function remove(id: number) {
    await db.delete(listsTable).where(eq(listsTable.id, id));
    const lists = await db.select().from(listsTable);
    setItems(lists);
  }

  async function add(props: typeof listsTable.$inferInsert) {
    await db.insert(listsTable).values(props);
    const lists = await db.select().from(listsTable);
    setItems(lists);
  }

  if (error) {
    return (
      <View>
        <Text style={{ color: "white" }}>Migration error: {error.message}</Text>
      </View>
    );
  }

  if (!success) {
    return (
      <View>
        <Text style={{ color: "white" }}>Migration is in progress...</Text>
      </View>
    );
  }

  if (items === null || items.length === 0) {
    return (
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          height: "100%",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "white" }}>Empty</Text>

        <Pressable
          onPress={() =>
            add({
              name: "test",
              age: 21,
              email: "test@user.com",
            })
          }
        >
          <Text style={{ color: "yellow" }}>Add</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        height: "100%",
        justifyContent: "center",
        gap: "12",
      }}
    >
      {items.map((item, index) => (
        <Pressable key={index} onPress={() => remove(item.id)}>
          <Text style={{ color: "white" }}>{item.name}</Text>
        </Pressable>
      ))}

      <Pressable
        onPress={() =>
          add({
            name: "test2",
          })
        }
      >
        <Text style={{ color: "yellow" }}>Add</Text>
      </Pressable>
    </View>
  );
}
