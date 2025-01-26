import { listsTable, todosTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
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
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { db } from "~/lib/db";

const RightActions = ({ onDelete }: { onDelete: () => void }) => {
  return (
    <Button onPress={onDelete} variant="destructive" size="sm">
      <Text className="text-foreground">Delete</Text>
    </Button>
  );
};

export default function List() {
  const { uuid } = useLocalSearchParams();
  const [newTodo, setNewTodo] = useState("");
  const [list, setList] = useState<
    | undefined
    | (typeof listsTable.$inferSelect & {
        todos: (typeof todosTable.$inferSelect)[];
      })
    | null
  >(null);
  const swipeableRefs = useRef<{ [key: string]: SwipeableMethods | null }>({});

  async function loadList() {
    const result = await db.query.listsTable.findFirst({
      where: eq(listsTable.id, Number(uuid)),
      with: {
        todos: true,
      },
    });
    setList(result);
  }

  async function addTodo() {
    if (!newTodo.trim() || !list) return;

    await db.insert(todosTable).values({
      name: newTodo.trim(),
      listId: list.id,
      completed: 0,
    });

    setNewTodo("");
    loadList();
  }

  async function deleteTodo(todoId: number) {
    await db.delete(todosTable).where(eq(todosTable.id, todoId));
    loadList();
  }

  async function toggleTodo(todoId: number, completed: number) {
    await db
      .update(todosTable)
      .set({ completed: completed ? 0 : 1 })
      .where(eq(todosTable.id, todoId));
    loadList();
  }

  useEffect(() => {
    loadList();
  }, [uuid]);

  if (!list) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={64}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
    >
      <View className="p-4 border-b border-border">
        <View className="flex-row items-center gap-2">
          <Button variant="ghost" size="icon" onPress={() => router.back()}>
            <Text>←</Text>
          </Button>
          <Text className="text-lg font-medium">{list.name}</Text>
        </View>
      </View>

      <FlatList
        data={list.todos ?? []}
        keyExtractor={(todo) => todo.id.toString()}
        className="py-2"
        renderItem={({ item: todo }) => (
          <Swipeable
            ref={(ref) => (swipeableRefs.current[todo.id] = ref)}
            renderRightActions={() => (
              <RightActions onDelete={() => deleteTodo(todo.id)} />
            )}
            rightThreshold={40}
            friction={2}
            onSwipeableOpen={() => {
              Object.entries(swipeableRefs.current).forEach(([id, ref]) => {
                if (id !== todo.id.toString() && ref) {
                  ref.close();
                }
              });
            }}
          >
            <View className="flex-row items-center px-4 bg-background">
              <Pressable
                onPress={() => toggleTodo(todo.id, todo.completed)}
                className="flex-1 flex-row items-center py-3 gap-4"
              >
                <Checkbox
                  checked={!!todo.completed}
                  onCheckedChange={() => toggleTodo(todo.id, todo.completed)}
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
        <View className="flex-row gap-2">
          <Input
            className="flex-1"
            placeholder="Add a todo..."
            value={newTodo}
            onChangeText={setNewTodo}
            onSubmitEditing={addTodo}
            returnKeyType="done"
            blurOnSubmit={false}
          />
          <Button onPress={addTodo}>
            <Text>Add1</Text>
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
