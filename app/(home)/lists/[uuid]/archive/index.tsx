import { useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { FlatList, Pressable, View } from "react-native";
import { Header } from "~/components/header";
import { Text } from "~/components/ui/text";
import { api } from "~/convex/_generated/api";
import { Doc, Id } from "~/convex/_generated/dataModel";

export default function Archive() {
  const { uuid } = useLocalSearchParams();
  const parentList = useQuery(api.lists.getList, { id: uuid as Id<"lists"> });
  const archivedLists = useQuery(api.lists.getArchivedLists, {
    parentListId: uuid as Id<"lists">,
  });

  if (parentList === undefined || archivedLists === undefined) {
    return (
      <View className="flex-1 bg-background">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!parentList) {
    return <View className="flex-1 bg-background" />;
  }

  return (
    <View className="flex-1 bg-background">
      <Header
        title={parentList?.name + " History"}
        onBack={() => router.back()}
      />

      <FlatList
        data={archivedLists}
        keyExtractor={(list) => list._id.toString()}
        className="py-2"
        renderItem={({ item }) => (
          <Preview list={item} parentListId={parentList?._id} />
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

function Preview(props: { parentListId: Id<"lists">; list: Doc<"lists"> }) {
  const todos = useQuery(api.todos.getTodos, { listId: props.list._id });

  return (
    <Pressable
      onPress={() =>
        router.push(`/lists/${props.parentListId}/archive/${props.list._id}`)
      }
      className="flex-row items-center px-4 py-3 gap-4"
    >
      <View className="flex-1">
        <Text>{props.list.name}</Text>
        <Text className="text-sm text-muted-foreground">
          {todos?.length} todos •{" "}
          {new Date(props.list.archivedAt!).toLocaleDateString()}
        </Text>
      </View>
    </Pressable>
  );
}
