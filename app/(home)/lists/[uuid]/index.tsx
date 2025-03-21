import { useMutation, useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  View,
} from "react-native";
import Swipeable, {
  SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import { Header } from "~/components/header";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
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
        <Text>Delete</Text>
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

  const swipeableRefs = useRef<{ [key: string]: SwipeableMethods | null }>({});

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
        title={list?.name ?? ""}
        onBack={() => router.dismissTo("/")}
        actions={
          <>
            {hasCompletedTodos && (
              <Button variant="secondary" size="sm" onPress={handleArchive}>
                <Text>Archive</Text>
              </Button>
            )}

            {!hasCompletedTodos && archived && archived.length > 0 && (
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
        renderItem={({ item: todo }) => (
          <Swipeable
            ref={(ref) => (swipeableRefs.current[todo._id] = ref)}
            renderRightActions={() => (
              <RightActions onDelete={() => handleDeleteTodo(todo._id)} />
            )}
            rightThreshold={40}
            friction={2}
            onSwipeableOpen={() => {
              Object.entries(swipeableRefs.current).forEach(([id, ref]) => {
                if (id !== todo._id.toString() && ref) {
                  ref.close();
                }
              });
            }}
          >
            <View className="flex-row items-center px-4 bg-background">
              <Pressable
                onPress={() => handleToggleTodo(todo._id)}
                className="flex-1 flex-row items-center py-3 gap-4"
              >
                <Checkbox
                  checked={!!todo.completed}
                  onCheckedChange={() => handleToggleTodo(todo._id)}
                />
                <Text
                  className={
                    todo.completed ? "line-through text-muted-foreground" : ""
                  }
                >
                  {todo.name}
                </Text>
              </Pressable>
            </View>
          </Swipeable>
        )}
        contentContainerStyle={todos.length === 0 ? { flex: 1 } : undefined}
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center">
            <Text className="text-muted-foreground">No todos yet</Text>
          </View>
        )}
      />

      <View className="p-4 border-t border-border">
        <View className="flex-row gap-2">
          <Input
            className="flex-1"
            placeholder="Add a todo..."
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
      </View>
    </KeyboardAvoidingView>
  );
}
