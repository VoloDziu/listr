import { listsTable } from "@/db/schema";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { TextInput, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { db } from "~/lib/db";

export default function NewItemScreen() {
  const [name, setName] = useState("");
  const inputRef = useRef<TextInput>(null);

  useFocusEffect(
    useCallback(() => {
      const timeout = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);

      return () => clearTimeout(timeout);
    }, [])
  );

  async function add() {
    if (!name.trim()) return;

    await db.insert(listsTable).values({
      name: name.trim(),
    });

    router.dismissTo("/");
  }

  return (
    <View className="flex-grow bg-background">
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
    </View>
  );
}
