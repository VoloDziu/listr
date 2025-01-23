import { listsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { db } from "~/lib/db";

export default function HomeScreen() {
  const [items, setItems] = useState<(typeof listsTable.$inferSelect)[] | null>(null);

  useEffect(() => {
    (async () => {
      const lists = await db.select().from(listsTable);
      setItems(lists);
    })();
  }, []);

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

  if (items === null || items.length === 0) {
    return (
      <View>
        <Text>Empty</Text>
        <Pressable
          onPress={() =>
            add({
              name: "test",
            })
          }
        >
          <Text>Add</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View>
      {items.map((item, index) => (
        <Pressable key={index} onPress={() => remove(item.id)}>
          <Text>{item.name}</Text>
        </Pressable>
      ))}

      <Pressable
        onPress={() =>
          add({
            name: "test2",
          })
        }
      >
        <Text>Add</Text>
      </Pressable>
    </View>
  );
}
