import migrations from "@/drizzle/migrations";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "~/components/ui/text";
import { db, expo } from "~/lib/db";
import "../global.css";

export default function RootLayout() {
  const { success, error } = useMigrations(db, migrations);
  useDrizzleStudio(expo);

  if (error) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView>
          <Text>Migration error: {error.message}</Text>
        </SafeAreaView>
      </GestureHandlerRootView>
    );
  }

  if (!success) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView>
          <Text>Migration is in progress...</Text>
        </SafeAreaView>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 bg-background">
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
