import { listsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { db } from "~/lib/db";

type ListItem = typeof listsTable.$inferSelect;

function EmptyList() {
  return (
    <View className="flex-grow items-center justify-center">
      <Button onPress={() => router.push("/new")}>
        <Text>Create your first list</Text>
      </Button>
    </View>
  );
}

export default function HomeScreen() {
  const [items, setItems] = useState<ListItem[] | null>(null);

  const loadItems = useCallback(async () => {
    const lists = await db.select().from(listsTable);
    setItems(lists);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadItems();
    }, [loadItems]),
  );

  async function remove(id: number) {
    await db.delete(listsTable).where(eq(listsTable.id, id));
    await loadItems();
  }

  const renderItem = useCallback(
    ({ item }: { item: ListItem }) => (
      <View className="flex-row items-center px-4 py-2">
        <Button
          variant="link"
          className="flex-grow"
          onPress={() => router.push(`/lists/${item.id}`)}
        >
          <Text>{item.name}</Text>
        </Button>
        <Button size="sm" variant="destructive" onPress={() => remove(item.id)}>
          <Text>D</Text>
        </Button>
      </View>
    ),
    [],
  );

  return (
    <View className="flex-1 bg-background">
      {items?.length === 0 && <EmptyList />}

      {items?.length && items.length > 0 && (
        <>
          <FlatList
            data={items ?? []}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
          />

          <View className="p-4 shrink-0">
            <Button onPress={() => router.push("/new")}>
              <Text>Add 23</Text>
            </Button>
          </View>
        </>
      )}
    </View>
  );
}
