import migrations from "@/drizzle/migrations";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { View, Text } from "react-native";
import "react-native-reanimated";
import { Slot } from "expo-router";
import { db, expo } from "~/lib/db";
import "../global.css";

export default function RootLayout() {
  const { success, error } = useMigrations(db, migrations);
  useDrizzleStudio(expo);

  if (error) {
    return (
      <View>
        <Text style={{ color: "white" }}>Migration error: {error.message}</Text>
      </View>
    );
  }

  if (!success) {
    return (
      <View>
        <Text style={{ color: "white" }}>Migration is in progress...</Text>
      </View>
    );
  }

  return <Slot />;
}
