import { useMutation, useQuery } from "convex/react";
import { router } from "expo-router";
import { useCallback } from "react";
import { FlatList, Pressable, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { api } from "~/convex/_generated/api";
import { Doc } from "~/convex/_generated/dataModel";

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
  const items = useQuery(api.lists.getNonArchivedLists);

  const remove = useMutation(api.lists.deleteList);

  const renderItem = useCallback(
    ({ item }: { item: Doc<"lists"> }) => (
      <View className="flex-row mt-4 items-center pr-4 border border-border rounded">
        <Pressable
          className="flex-grow pl-4 py-5"
          onPress={() => router.push(`/lists/${item._id}`)}
        >
          <Text className="text-lg">{item.name}</Text>
        </Pressable>

        <Button
          size="sm"
          variant="destructive"
          onPress={() => remove({ id: item._id })}
        >
          <Text>delete</Text>
        </Button>
      </View>
    ),
    [],
  );

  return (
    <View className="flex-1 bg-background">
      <View className="p-4 border-b border-border">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Text className="text-lg font-medium">Your lists</Text>
          </View>
        </View>
      </View>

      {items?.length === 0 && <EmptyList />}

      {items?.length && items.length > 0 && (
        <>
          <FlatList
            data={items ?? []}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
          />

          <View className="p-4 shrink-0">
            <Button onPress={() => router.push("/new")}>
              <Text>Add</Text>
            </Button>
          </View>
        </>
      )}
    </View>
  );
}
