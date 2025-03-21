import { useSignUp } from "@clerk/clerk-expo";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, TextInput, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";

export default function AuthCode() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [code, setCode] = useState("");
  const inputRef = useRef<TextInput>(null);

  useFocusEffect(
    useCallback(() => {
      const timeout = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);

      return () => clearTimeout(timeout);
    }, []),
  );

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/");
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={64}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
    >
      <View className="p-4 border-b border-border">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Button variant="ghost" size="icon" onPress={() => router.back()}>
              <Text>←</Text>
            </Button>
            <Text className="text-lg font-medium">Verification Code</Text>
          </View>
        </View>
      </View>

      <View className="flex-grow p-4">
        <Text className="mb-2">Name</Text>
        <Input
          ref={inputRef}
          value={code}
          onChangeText={setCode}
          placeholder="Enter name"
          returnKeyType="done"
          onSubmitEditing={onVerifyPress}
        />
      </View>

      <View className="p-4">
        <Button onPress={onVerifyPress}>
          <Text>Submit</Text>
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}
