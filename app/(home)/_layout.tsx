import { useAuth } from "@clerk/clerk-expo";
import { Stack } from "expo-router/stack";
import { View } from "react-native";
import Auth from "~/components/auth";

export default function Layout() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return <View className="flex-1 bg-background" />;
  }

  if (!isSignedIn) {
    return <Auth />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
