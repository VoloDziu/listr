import { useMutation } from "convex/react";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, TextInput, View } from "react-native";
import { Header } from "~/components/header";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { api } from "~/convex/_generated/api";

export default function NewItemScreen() {
  const [name, setName] = useState("");
  const inputRef = useRef<TextInput>(null);
  const insert = useMutation(api.lists.createList);

  useFocusEffect(
    useCallback(() => {
      const timeout = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);

      return () => clearTimeout(timeout);
    }, []),
  );

  async function add() {
    if (!name.trim()) return;

    const newListId = await insert({ name: name.trim() });

    router.push(`/lists/${newListId}`);
  }

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={64}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
    >
      <Header title="New List" onBack={() => router.dismissTo("/")} />

      <View className="flex-grow p-4">
        <Text className="mb-2">Name</Text>
        <Input
          ref={inputRef}
          value={name}
          onChangeText={setName}
          placeholder="Enter name"
          returnKeyType="done"
          onSubmitEditing={add}
        />
      </View>

      <View className="p-4">
        <Button onPress={add}>
          <Text>Add</Text>
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}
