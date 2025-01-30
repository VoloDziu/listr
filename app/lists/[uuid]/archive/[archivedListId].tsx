import { listsTable, todosTable } from "@/db/schema";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Text } from "~/components/ui/text";
import { getList } from "~/lib/actions";

export default function List() {
  const { archivedListId } = useLocalSearchParams();
  const [list, setList] = useState<
    typeof listsTable.$inferSelect & {
      todos: (typeof todosTable.$inferSelect)[];
    }
  >();

  async function loadList() {
    const result = await getList(Number(archivedListId));
    setList(result);
  }

  useEffect(() => {
    loadList();
  }, [archivedListId]);

  if (!list) {
    return <View className="flex-1 bg-background"></View>;
  }

  return (
    <View className="flex-1 bg-background">
      <View className="p-4 border-b border-border">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Button variant="ghost" size="icon" onPress={() => router.back()}>
              <Text>←</Text>
            </Button>
            <Text className="text-lg font-medium">{list.name}</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={list.todos ?? []}
        keyExtractor={(todo) => todo.id.toString()}
        className="py-2"
        renderItem={({ item: todo }) => (
          <View className="flex-row items-center px-4 bg-background">
            <View className="flex-1 flex-row items-center py-3 gap-4">
              <Checkbox
                checked={!!todo.completed}
                disabled={true}
                onCheckedChange={() => {}}
              />
              <Text className="line-through text-muted-foreground">
                {todo.name}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}
