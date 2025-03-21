import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { Stack } from "expo-router/stack";
import { View } from "react-native";

export default function Layout() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return <View className="flex-1 bg-background"></View>;
  }

  if (!isSignedIn) {
    return <Redirect href={"/auth"} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
