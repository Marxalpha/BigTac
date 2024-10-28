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
      if (!name || !password) {
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
        console.log("Attempting sign in with:", { email, name });

        router.push({ pathname: "/Screens/lobby", params: { username: name } });
        // const signInResult = await signIn({   //not working for now
        //   username: name,
        //   password,
        // });

        // console.log("Sign in result:", signInResult);

        // if (signInResult.isSignedIn) {
        //   router.push("/Screens/lobby");
        // } else if (signInResult.nextStep?.signInStep === "CONFIRM_SIGN_UP") {
        //   // Handle unconfirmed signup
        //   setShowConfirmation(true);
        // } else {
        //   Alert.alert(
        //     "Sign In Failed",
        //     "Please check your credentials and try again."
        //   );
        // }
      } else {
        const signUpResult = await signUp({
          username: name, // Normalize email
          password,
          options: {
            userAttributes: {
              email: email.toLowerCase().trim(),
              name,
            },
            autoSignIn: true, // Enable auto sign-in after confirmation
          },
        });

        console.log("Sign up result:", signUpResult);

        if (
          !signUpResult.isSignUpComplete &&
          signUpResult.nextStep?.signUpStep === "CONFIRM_SIGN_UP"
        ) {
          setShowConfirmation(true);
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      const errorMessage = (error as Error).message;

      // Handle specific error cases
      if (errorMessage.includes("User not found")) {
        Alert.alert("Error", "No account found with this email address");
      } else if (errorMessage.includes("Incorrect username or password")) {
        Alert.alert("Error", "Incorrect email or password");
      } else if (errorMessage.includes("User is not confirmed")) {
        setShowConfirmation(true);
      } else {
        Alert.alert("Error", errorMessage);
      }
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
      const confirmResult = await confirmSignUp({
        username: name,
        confirmationCode: confirmCode,
      });

      console.log("Confirmation result:", confirmResult);

      if (confirmResult.isSignUpComplete) {
        const signInResult = await signIn({
          username: name,
          password,
        });

        if (signInResult.isSignedIn) {
          router.push("/Screens/lobby");
        } else {
          setShowConfirmation(false);
          setIsLogin(true);
          Alert.alert("Success", "Account confirmed! Please sign in.");
        }
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
          placeholder="Name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          editable={!isLoading}
        />
        {!isLogin && (
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={name}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
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
