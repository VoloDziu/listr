import { listsTable, todosTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { db } from "~/lib/db";

export default function List() {
  const { uuid } = useLocalSearchParams();
  const [list, setList] = useState<
    | undefined
    | (typeof listsTable.$inferSelect & {
        todos: (typeof todosTable.$inferSelect)[];
      })
    | null
  >(null);

  async function loadList() {
    const result = await db.query.listsTable.findFirst({
      where: eq(listsTable.id, Number(uuid)),
      with: {
        todos: true,
      },
    });
    setList(result);
  }

  useEffect(() => {
    loadList();
  }, [uuid]);

  if (!list) {
    return null;
  }

  return (
    <View className="flex-1 bg-background">
      <View className="p-4 border-b border-border">
        <View className="flex-row items-center gap-2">
          <Button variant="ghost" size="sm" onPress={() => router.back()}>
            <Text>←</Text>
          </Button>
          <Text className="text-lg font-medium">{list.name}</Text>
        </View>
      </View>

      <FlatList
        data={list.todos ?? []}
        keyExtractor={(todo) => todo.id.toString()}
        renderItem={({ item: todo }) => (
          <View className="flex-row items-center p-4 border-b border-border">
            <Text className="flex-1">{todo.name}</Text>
            <Button
              variant="destructive"
              size="sm"
              onPress={async () => {
                await db.delete(todosTable).where(eq(todosTable.id, todo.id));
                loadList();
              }}
            >
              <Text>Delete</Text>
            </Button>
          </View>
        )}
        contentContainerStyle={
          list.todos.length === 0 ? { flex: 1 } : undefined
        }
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center">
            <Text className="text-muted-foreground">No todos yet</Text>
          </View>
        )}
      />

      <View className="p-4 border-t border-border">
        <Button onPress={() => router.push("/new")}>
          <Text>Add item</Text>
        </Button>
      </View>
    </View>
  );
}
