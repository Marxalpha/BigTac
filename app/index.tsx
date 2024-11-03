import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  signUp,
  signIn,
  getCurrentUser,
  confirmSignUp,
} from "aws-amplify/auth";

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmCode, setConfirmCode] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const user = await getCurrentUser();
      if (user) {
        router.push("/Screens/lobby");
      }
    } catch (error) {
      console.log("User is not signed in");
    }
  };

  const validateInputs = () => {
    if (isLogin) {
      if (!email || !password) {
        Alert.alert("Error", "Please fill in all fields");
        return false;
      }
    } else {
      if (!email || !name || !password) {
        Alert.alert("Error", "Please fill in all fields");
        return false;
      }
      if (!email.includes("@")) {
        Alert.alert("Error", "Please enter a valid email address");
        return false;
      }
      if (password.length < 8) {
        Alert.alert("Error", "Password must be at least 8 characters");
        return false;
      }
    }
    return true;
  };

  const handleAuth = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);
    try {
      if (isLogin) {
        router.push({
          pathname: "/Screens/lobby",
          params: { username: name },
        });
        // const { isSignedIn, nextStep } = await signIn({
        //   username: email, // Use email as username for sign in
        //   password,
        // });

        // console.log("Sign in result:", { isSignedIn, nextStep });

        // if (isSignedIn) {
        //   router.push("/Screens/lobby");
        // }
      } else {
        const { isSignUpComplete, nextStep } = await signUp({
          username: email, // Use email as username for sign up
          password,
          options: {
            userAttributes: {
              email,
              name,
            },
          },
        });

        if (!isSignUpComplete && nextStep.signUpStep === "CONFIRM_SIGN_UP") {
          setShowConfirmation(true);
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      Alert.alert("Error", (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmSignUp = async () => {
    if (!confirmCode) {
      Alert.alert("Error", "Please enter confirmation code");
      return;
    }

    setIsLoading(true);
    try {
      const { isSignUpComplete } = await confirmSignUp({
        username: email, // Use email as username for confirmation
        confirmationCode: confirmCode,
      });

      if (isSignUpComplete) {
        setShowConfirmation(false);
        setIsLogin(true);
        Alert.alert("Success", "Account created successfully! Please sign in.");
      }
    } catch (error) {
      console.error("Confirmation error:", error);
      Alert.alert("Error", (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  if (showConfirmation) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.title}>Confirm Sign Up</ThemedText>
        <ThemedText style={styles.subtitle}>
          Please enter the verification code sent to your email
        </ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Confirmation Code"
          value={confirmCode}
          onChangeText={setConfirmCode}
          keyboardType="number-pad"
          editable={!isLoading}
        />
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleConfirmSignUp}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <ThemedText style={styles.buttonText}>Confirm</ThemedText>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShowConfirmation(false)}
          disabled={isLoading}
        >
          <ThemedText style={styles.switchText}>Go Back</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <ThemedView style={styles.container}>
        <ThemedText style={styles.title}>
          {isLogin ? "Login" : "Sign Up"}
        </ThemedText>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
        />

        {!isLogin && (
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            editable={!isLoading}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!isLoading}
        />

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleAuth}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <ThemedText style={styles.buttonText}>
              {isLogin ? "Login" : "Sign Up"}
            </ThemedText>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setIsLogin(!isLogin);
            setEmail("");
            setName("");
            setPassword("");
          }}
          disabled={isLoading}
        >
          <ThemedText style={styles.switchText}>
            {isLogin
              ? "Need an account? Sign Up"
              : "Already have an account? Login"}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: "gray",
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    height: 45,
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  switchText: {
    marginTop: 20,
    color: "blue",
  },
});
