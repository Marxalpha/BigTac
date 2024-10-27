import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { signUp, signIn } from "@/app/services/aws/authService"; // import functions

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleAuth = async () => {
    if (isLogin) {
      // Login
      await signIn(username, password);
    } else {
      // Sign up
      await signUp(username, password);
    }
    router.push({ pathname: "/Screens/lobby" });
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>
        {isLogin ? "Login" : "Sign Up"}
      </ThemedText>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleAuth}>
        <ThemedText style={styles.buttonText}>
          {isLogin ? "Login" : "Sign Up"}
        </ThemedText>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <ThemedText style={styles.switchText}>
          {isLogin
            ? "Need an account? Sign Up"
            : "Already have an account? Login"}
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
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
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
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
