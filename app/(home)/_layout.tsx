import { useAuth } from "@clerk/clerk-expo";
import { Stack } from "expo-router/stack";
import { SafeAreaView, View } from "react-native";
import Auth from "~/components/auth";

export default function Layout() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return <View className="flex-1 bg-card" />;
  }

  if (!isSignedIn) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <Auth />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  );
}
