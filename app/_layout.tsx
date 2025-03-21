import { tokenCache } from "@/lib/cache";
import { ClerkProvider } from "@clerk/clerk-expo";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Stack } from "expo-router";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import "../global.css";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

  if (!publishableKey) {
    throw new Error(
      "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env",
    );
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ConvexProvider client={convex}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaView className="flex-1 bg-background">
            <Stack screenOptions={{ headerShown: false }} />
          </SafeAreaView>
        </GestureHandlerRootView>
      </ConvexProvider>
    </ClerkProvider>
  );
}
