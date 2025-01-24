import { router } from "expo-router";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function List() {
  return (
    <View className="flex-1 bg-background">
      <View className="p-4 border-b border-border">
        <View className="flex-row items-center gap-2">
          <Button variant="ghost" size="sm" onPress={() => router.back()}>
            <Text>←</Text>
          </Button>
          <Text className="text-lg font-medium">List 1</Text>
        </View>
      </View>

      <View className="flex-grow p-4">
        <View className="flex-grow items-center justify-center">
          <Text className="text-muted-foreground mb-2">No items yet</Text>
          <Button onPress={() => router.push("/new")}>
            <Text>Add your first item</Text>
          </Button>
        </View>
      </View>

      <View className="p-4 border-t border-border">
        <Button onPress={() => router.push("/new")}>
          <Text>Add item</Text>
        </Button>
      </View>
    </View>
  );
}
