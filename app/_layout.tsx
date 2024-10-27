import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { Amplify } from "aws-amplify";
import awsconfig from "./amplifyconfiguration.json";

// Add this before configuring
console.log("About to configure Amplify with:", {
  region: awsconfig.aws_project_region,
  userPoolId: awsconfig.aws_user_pools_id,
  hasWebClientId: !!awsconfig.aws_user_pools_web_client_id,
});

// Configure Amplify
try {
  Amplify.configure(awsconfig);
  console.log("Amplify Configured Successfully");
} catch (error) {
  console.error("Error configuring Amplify:", error);
}

import { useColorScheme } from "@/hooks/useColorScheme";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="Screens/lobby" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
