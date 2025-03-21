import { useClerk } from "@clerk/clerk-expo";
import { Text } from "react-native";
import { Button } from "./ui/button";

export const SignOutButton = () => {
  // Use `useClerk()` to access the `signOut()` function
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirect to your desired page
      // router.dismissTo("/");
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <Button onPress={handleSignOut}>
      <Text>Sign out</Text>
    </Button>
  );
};
