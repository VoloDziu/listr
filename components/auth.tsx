import { useSignIn, useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import React from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";

export default function Auth() {
  const [activeTab, setActiveTab] = React.useState("sign-in");
  const [error, setError] = React.useState(false);

  const {
    signIn,
    setActive: setSignInActive,
    isLoaded: signInIsLoaded,
  } = useSignIn();
  const { isLoaded: SignUpIsLoaded, signUp } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!signInIsLoaded) return;

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        await setSignInActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
        setError(true);
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
      setError(true);
    }
  };

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!SignUpIsLoaded) return;

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      router.push("/auth-code");
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
      className="bg-background flex-1"
    >
      <ScrollView className="px-4">
        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value);
          }}
          className="w-full max-w-[400px] mx-auto flex-col gap-1.5 flex-1"
        >
          <Text className="text-3xl font-semibold mt-10 text-center mb-10">
            Listr
          </Text>

          <TabsList className="flex-row w-full mb-5">
            <TabsTrigger value="sign-in" className="flex-1">
              <Text>Sign in</Text>
            </TabsTrigger>
            <TabsTrigger value="sign-up" className="flex-1">
              <Text>Sign up</Text>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sign-up">
            <Card>
              <CardContent className="gap-4 pt-6">
                <View className="gap-1">
                  <Label nativeID="sign-up-email">Email</Label>
                  <Input
                    id="sign-up-email"
                    value={emailAddress}
                    onChangeText={(value) => {
                      setEmailAddress(value);
                      setError(false);
                    }}
                  />
                </View>

                <View className="gap-1 mb-4">
                  <Label nativeID="sign-up-password">Password</Label>
                  <Input
                    id="sign-up-password"
                    secureTextEntry
                    value={password}
                    onChangeText={(value) => {
                      setPassword(value);
                      setError(false);
                    }}
                    onSubmitEditing={onSignUpPress}
                  />
                </View>
              </CardContent>

              <CardFooter>
                <Button className="w-full" onPress={onSignUpPress}>
                  <Text>Create an account</Text>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="sign-in">
            <Card>
              <CardContent className="gap-4 pt-6">
                <View className="gap-1">
                  <Label nativeID="sign-in-email">Email</Label>
                  <Input
                    id="sign-in-email"
                    value={emailAddress}
                    onChangeText={(value) => {
                      setEmailAddress(value);
                      setError(false);
                    }}
                  />
                </View>

                <View className="gap-1 mb-4">
                  <Label nativeID="sign-in-password">Password</Label>
                  <Input
                    id="sign-in-password"
                    secureTextEntry
                    value={password}
                    onChangeText={(value) => {
                      setPassword(value);
                      setError(false);
                    }}
                    onSubmitEditing={onSignInPress}
                  />
                </View>
              </CardContent>

              <CardFooter className="flex-col gap-4">
                <Button className="w-full" onPress={onSignInPress}>
                  <Text>Sign me in</Text>
                </Button>
                {error && (
                  <Text className="text-center">
                    Failed to log in, please double-check your credentials.
                  </Text>
                )}
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
