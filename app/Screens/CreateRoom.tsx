import React, { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function CreateRoomScreen() {
  const [roomCode, setRoomCode] = useState("");

  useEffect(() => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setRoomCode(code);
  }, []);

  const handleStartGame = () => {
    router.push({ pathname: "/Screens/game", params: { roomId: roomCode } });
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Room Created</ThemedText>
      <ThemedText style={styles.roomCode}>{roomCode}</ThemedText>
      <ThemedText style={styles.instruction}>
        Share this code with your opponent
      </ThemedText>
      <TouchableOpacity style={styles.button} onPress={handleStartGame}>
        <ThemedText style={styles.buttonText}>Start Game</ThemedText>
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
  roomCode: {
    fontSize: 36,
    height: 60,
    fontWeight: "bold",
    textAlign: "center", // Center the text horizontally
    textAlignVertical: "center", // Center the text vertically
  },
  instruction: {
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "blue",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    width: "80%",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});
