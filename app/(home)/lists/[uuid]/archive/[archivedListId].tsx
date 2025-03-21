import { useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { FlatList, View } from "react-native";
import { Header } from "~/components/header";
import { Checkbox } from "~/components/ui/checkbox";
import { Text } from "~/components/ui/text";
import { api } from "~/convex/_generated/api";
import { Id } from "~/convex/_generated/dataModel";

export default function List() {
  const { archivedListId } = useLocalSearchParams();
  const list = useQuery(api.lists.getList, {
    id: archivedListId as Id<"lists">,
  });
  const todos = useQuery(api.todos.getTodos, {
    listId: archivedListId as Id<"lists">,
  });

  if (list === undefined || todos === undefined) {
    return (
      <View className="flex-1 bg-background">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!list) {
    return <View className="flex-1 bg-background"></View>;
  }

  return (
    <View className="flex-1 bg-background">
      <Header title={list.name} onBack={() => router.back()} />

      <FlatList
        data={todos}
        keyExtractor={(todo) => todo._id.toString()}
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
