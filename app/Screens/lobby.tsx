import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function CreateOrJoinRoomScreen() {
  const handleCreateRoom = () => {
    console.log("Create Room button pressed");
    router.push({ pathname: "/Screens/CreateRoom" }); // Correct path for create-room
  };

  const handleJoinRoom = () => {
    router.push({ pathname: "/Screens/JoinRoom" }); // Correct path for join-room
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Create or Join a Room</ThemedText>
      <TouchableOpacity style={styles.button} onPress={handleCreateRoom}>
        <ThemedText style={styles.buttonText}>Create Room</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleJoinRoom}>
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
  button: {
    backgroundColor: "blue",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
    width: "80%",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});
