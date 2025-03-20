import migrations from "@/drizzle/migrations";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "~/components/ui/text";
import { db, expo } from "~/lib/db";
import "../global.css";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

export default function RootLayout() {
  const { success, error } = useMigrations(db, migrations);
  useDrizzleStudio(expo);

  if (error) {
    return (
      <ConvexProvider client={convex}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaView>
            <Text>Migration error: {error.message}</Text>
          </SafeAreaView>
        </GestureHandlerRootView>
      </ConvexProvider>
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
