import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function GameScreen() {
  const { roomId } = useLocalSearchParams();
  const [currentTurn, setCurrentTurn] = useState("X");
  const [messages, setMessages] = useState<{ id: string; text: string }[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const renderCell = (row: number, col: number) => {
    const cellStyle = [
      styles.cell,
      (row % 6 < 3 && col % 6 < 3) || (row % 6 >= 3 && col % 6 >= 3)
        ? styles.cellLight
        : styles.cellDark,
      // Regular cell borders (thin)
      styles.cellBorder,
      // Major grid borders (thick)
      row % 3 === 0 ? styles.majorBorderTop : null,
      col % 3 === 0 ? styles.majorBorderLeft : null,
      row === 8 ? styles.majorBorderBottom : null,
      col === 8 ? styles.majorBorderRight : null,
    ];

    return (
      <TouchableOpacity key={`${row}-${col}`} style={cellStyle}>
        <ThemedText style={styles.cellText}></ThemedText>
      </TouchableOpacity>
    );
  };

  const renderGrid = () => {
    const grid = [];
    for (let i = 0; i < 9; i++) {
      const row = [];
      for (let j = 0; j < 9; j++) {
        row.push(renderCell(i, j));
      }
      grid.push(
        <View key={i} style={styles.row}>
          {row}
        </View>
      );
    }
    return grid;
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        { id: Date.now().toString(), text: newMessage },
      ]);
      setNewMessage("");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.roomInfo}>Room: {roomId}</ThemedText>
      <View style={styles.turnIndicator}>
        <ThemedText
          style={[
            styles.turnText,
            currentTurn === "X" ? styles.activeTurn : null,
          ]}
        >
          X
        </ThemedText>
        <ThemedText
          style={[
            styles.turnText,
            currentTurn === "O" ? styles.activeTurn : null,
          ]}
        >
          O
        </ThemedText>
      </View>
      <View style={styles.gridContainer}>
        <View style={styles.grid}>{renderGrid()}</View>
      </View>
      <View style={styles.chatContainer}>
        <FlatList
          data={messages}
          renderItem={({ item }) => (
            <ThemedText style={styles.message}>{item.text}</ThemedText>
          )}
          keyExtractor={(item) => item.id}
          style={styles.chatList}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendMessage}
          >
            <ThemedText style={styles.sendButtonText}>Send</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  roomInfo: {
    fontSize: 18,
    marginBottom: 10,
  },
  turnIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  turnText: {
    fontSize: 24,
    marginHorizontal: 10,
    opacity: 0.5,
  },
  activeTurn: {
    opacity: 1,
    fontWeight: "bold",
  },
  gridContainer: {
    alignItems: "center",
    padding: 10,
  },
  grid: {
    borderWidth: 2,
    borderColor: "#000",
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  cellLight: {
    backgroundColor: "#f0f0f0",
  },
  cellDark: {
    backgroundColor: "#e0e0e0",
  },
  cellBorder: {
    borderWidth: 0.5,
    borderColor: "#ccc",
  },
  majorBorderTop: {
    borderTopWidth: 2,
    borderTopColor: "#000",
  },
  majorBorderBottom: {
    borderBottomWidth: 2,
    borderBottomColor: "#000",
  },
  majorBorderLeft: {
    borderLeftWidth: 2,
    borderLeftColor: "#000",
  },
  majorBorderRight: {
    borderRightWidth: 2,
    borderRightColor: "#000",
  },
  cellText: {
    fontSize: 18,
  },
  chatContainer: {
    flex: 1,
    marginTop: 20,
  },
  chatList: {
    flex: 1,
  },
  message: {
    padding: 5,
  },
  inputContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
  },
  sendButtonText: {
    color: "white",
  },
});
