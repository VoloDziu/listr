import { listsTable, todosTable } from "@/db/schema";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { getArchivedLists, getList } from "~/lib/actions";

export default function Archive() {
  const { uuid } = useLocalSearchParams();
  const [parentList, setParentList] =
    useState<typeof listsTable.$inferSelect>();
  const [archivedLists, setArchivedLists] = useState<
    (typeof listsTable.$inferSelect & {
      todos: (typeof todosTable.$inferSelect)[];
    })[]
  >([]);

  async function loadArchive() {
    const parent = await getList(Number(uuid));
    const archived = await getArchivedLists(Number(uuid));
    setParentList(parent);
    setArchivedLists(archived);
  }

  useEffect(() => {
    loadArchive();
  }, [uuid]);

  if (!parentList) {
    return <View className="flex-1 bg-background" />;
  }

  return (
    <View className="flex-1 bg-background">
      <View className="p-4 border-b border-border">
        <View className="flex-row items-center gap-2">
          <Button variant="ghost" size="icon" onPress={() => router.back()}>
            <Text>←</Text>
          </Button>
          <Text className="text-lg font-medium">{parentList.name} Archive</Text>
        </View>
      </View>

      <FlatList
        data={archivedLists}
        keyExtractor={(list) => list.id.toString()}
        className="py-2"
        renderItem={({ item: list }) => (
          <Pressable
            onPress={() => router.push(`/lists/${uuid}/archive/${list.id}`)}
            className="flex-row items-center px-4 py-3 gap-4"
          >
            <View className="flex-1">
              <Text>{list.name}</Text>
              <Text className="text-sm text-muted-foreground">
                {list.todos.length} todos •{" "}
                {new Date(list.archivedAt!).toLocaleDateString()}
              </Text>
            </View>
          </Pressable>
        )}
        contentContainerStyle={
          archivedLists.length === 0 ? { flex: 1 } : undefined
        }
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center">
            <Text className="text-muted-foreground">No archived lists yet</Text>
          </View>
        )}
      />
    </View>
  );
}
