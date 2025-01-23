import migrations from "@/drizzle/migrations";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { Slot } from "expo-router";
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
      <SafeAreaView>
        <Text>Migration error: {error.message}</Text>
      </SafeAreaView>
    );
  }

  if (!success) {
    return (
      <SafeAreaView>
        <Text>Migration is in progress...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <Slot />
    </SafeAreaView>
  );
}
