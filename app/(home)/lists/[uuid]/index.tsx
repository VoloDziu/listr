import { useMutation, useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  View,
} from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { Footer } from "~/components/footer";
import { Header } from "~/components/header";
import { ListItem } from "~/components/list-item";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { api } from "~/convex/_generated/api";
import { Id } from "~/convex/_generated/dataModel";

function RightActions({ onDelete }: { onDelete: () => void }) {
  return (
    <View className="flex-row items-stretch">
      <Pressable
        onPress={onDelete}
        className="bg-destructive px-3 items-center justify-center basis-[5rem]"
      >
        <Text className="text-background">Delete</Text>
      </Pressable>
    </View>
  );
}

export default function List() {
  const { uuid } = useLocalSearchParams();
  const [newTodo, setNewTodo] = useState("");

  const list = useQuery(api.lists.getList, { id: uuid as Id<"lists"> });
  const archived = useQuery(api.lists.getArchivedLists, {
    parentListId: uuid as Id<"lists">,
  });
  const todos = useQuery(api.todos.getTodos, { listId: uuid as Id<"lists"> });

  const createTodo = useMutation(api.todos.createTodo);
  const deleteTodo = useMutation(api.todos.deleteTodo);
  const toggleTodo = useMutation(api.todos.toggleTodo);
  const archiveCompletedTodos = useMutation(api.todos.archiveCompletedTodos);

  const hasCompletedTodos = todos?.some((todo) => todo.completed);

  async function handleAddTodo() {
    if (!newTodo.trim() || !list) return;
    await createTodo({ name: newTodo.trim(), listId: list._id });
    setNewTodo("");
  }

  async function handleDeleteTodo(todoId: Id<"todos">) {
    await deleteTodo({ todoId });
  }

  async function handleToggleTodo(todoId: Id<"todos">) {
    await toggleTodo({ todoId });
  }

  async function handleArchive() {
    if (!list) return;
    await archiveCompletedTodos({ listId: list._id });
  }

  if (list === undefined || todos === undefined || archived === undefined) {
    return (
      <View className="flex-1 bg-background">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={64}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
    >
      <Header
        title={<Header.Title>{list?.name}</Header.Title>}
        onBack={() => router.dismissTo("/")}
        actions={
          <>
            {hasCompletedTodos && (
              <Button variant="secondary" size="sm" onPress={handleArchive}>
                <Text>Archive</Text>
              </Button>
            )}

            {!hasCompletedTodos && (
              <Button
                variant="secondary"
                size="sm"
                onPress={() => router.push(`/lists/${uuid}/archive`)}
              >
                <Text>View History</Text>
              </Button>
            )}
          </>
        }
      />

      <FlatList
        data={todos ?? []}
        keyExtractor={(todo) => todo._id.toString()}
        className="py-2"
        renderItem={({ item }) => (
          <Swipeable
            renderRightActions={() => (
              <RightActions onDelete={() => handleDeleteTodo(item._id)} />
            )}
            rightThreshold={40}
            friction={2}
          >
            <ListItem item={item} onPress={() => handleToggleTodo(item._id)} />
          </Swipeable>
        )}
        contentContainerStyle={todos.length === 0 ? { flex: 1 } : undefined}
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center">
            <Text className="text-muted-foreground">No items yet</Text>
          </View>
        )}
      />

      <Footer>
        <View className="flex-row gap-2">
          <Input
            className="flex-1"
            placeholder="Add an item..."
            value={newTodo}
            onChangeText={setNewTodo}
            onSubmitEditing={handleAddTodo}
            returnKeyType="done"
            blurOnSubmit={false}
          />
          <Button onPress={handleAddTodo}>
            <Text>Add</Text>
          </Button>
        </View>
      </Footer>
    </KeyboardAvoidingView>
  );
}
