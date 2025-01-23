import { listsTable } from "@/db/schema";
import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { db } from "~/lib/db";

export default function NewItemScreen() {
  const [name, setName] = useState("");

  async function add() {
    if (!name.trim()) return;

    await db.insert(listsTable).values({
      name: name.trim(),
    });

    router.back();
  }

  return (
    <View className="flex-grow">
      <View className="flex-grow p-4">
        <Text className="mb-2">Name</Text>
        <Input
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
