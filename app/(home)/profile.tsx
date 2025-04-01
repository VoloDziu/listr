import { useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { View } from "react-native";
import { Header } from "~/components/header";
import { SignOutButton } from "~/components/sign-out-button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default function ProfileScreen() {
  const { isLoaded, user } = useUser();

  if (!isLoaded) {
    return <View className="bg-background flex-1">Loading...</View>;
  }

  return (
    <View className="bg-background flex-1">
      <Header
        title={<Header.Title>Profile</Header.Title>}
        onBack={() => router.back()}
      />

      <View className="p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg" numberOfLines={1}>
              {user?.emailAddresses[0].emailAddress}
            </CardTitle>
            <CardDescription
              className="text-base text-muted-foreground"
              numberOfLines={1}
            >
              Joined {user?.createdAt?.toLocaleDateString()}
            </CardDescription>
          </CardHeader>

          <CardFooter>
            <SignOutButton />
          </CardFooter>
        </Card>
      </View>
    </View>
  );
}
