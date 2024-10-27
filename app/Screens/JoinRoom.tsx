import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { router } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function JoinRoomScreen() {
  const [roomCode, setRoomCode] = useState("");

  const handleJoinRoom = () => {
    if (roomCode.length === 6) {
      router.push({ pathname: "/Screens/game", params: { roomId: roomCode } });
    } else {
      // Show an error message or alert that the room code is invalid
      console.log("Invalid room code");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Join Room</ThemedText>
      <TextInput
        style={styles.input}
        value={roomCode}
        onChangeText={setRoomCode}
        placeholder="Enter 6-digit room code"
        keyboardType="number-pad"
        maxLength={6}
      />
      <TouchableOpacity
        style={[styles.button, roomCode.length !== 6 && styles.buttonDisabled]}
        onPress={handleJoinRoom}
        disabled={roomCode.length !== 6}
      >
        <ThemedText style={styles.buttonText}>Join Room</ThemedText>
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
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 18,
  },
  button: {
    backgroundColor: "blue",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    width: "80%",
  },
  buttonDisabled: {
    backgroundColor: "gray",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});
