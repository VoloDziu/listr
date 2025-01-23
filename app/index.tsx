import { listsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { db } from "~/lib/db";

export default function HomeScreen() {
  const [items, setItems] = useState<(typeof listsTable.$inferSelect)[] | null>(
    null,
  );

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

  if (items === null || items.length === 0) {
    return (
      <View className="flex-grow">
        <View className="flex-grow items-center justify-center">
          <Text>Empty</Text>
        </View>
        <View className="p-4">
          <Button onPress={() => router.push("/new")}>
            <Text>Add (empty)</Text>
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-grow">
      <View className="flex-grow">
        {items.map((item, index) => (
          <Button key={index} onPress={() => remove(item.id)} variant="link">
            <Text>{item.name}</Text>
          </Button>
        ))}
      </View>

      <View className="p-4">
        <Button onPress={() => router.push("/new")}>
          <Text>Add</Text>
        </Button>
      </View>
    </View>
  );
}
