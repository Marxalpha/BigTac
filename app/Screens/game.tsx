import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useUltimateTicTacToe } from "@/hooks/useBigTac";
import { BlurView } from "expo-blur";

// Get screen width to calculate appropriate board size
const screenWidth = Dimensions.get("window").width;
const boardSize = Math.min(screenWidth / 3.5, 120); // Ensure boards aren't too large on big screens

export default function GameScreen() {
  const { roomId } = useLocalSearchParams();
  const [messages, setMessages] = useState<{ id: string; text: string }[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const {
    gameState,
    makeMove,
    getGameStatus,
    isValidMove,
  } = useUltimateTicTacToe();

  const renderCell = (boardIndex: number, cellIndex: number) => {
    const value = gameState.boards[boardIndex][cellIndex];
    const isPlayable = isValidMove(boardIndex, cellIndex);

    const cellStyle = [
      styles.cell,
      isPlayable ? styles.playableCell : null,
      cellIndex % 3 === 0 ? styles.cellBorderLeft : null,
      cellIndex % 3 === 2 ? styles.cellBorderRight : null,
      Math.floor(cellIndex / 3) === 0 ? styles.cellBorderTop : null,
      Math.floor(cellIndex / 3) === 2 ? styles.cellBorderBottom : null,
    ];

    return (
      <TouchableOpacity
        key={`${boardIndex}-${cellIndex}`}
        style={cellStyle}
        onPress={() => makeMove(boardIndex, cellIndex)}
        disabled={!isPlayable}
      >
        <ThemedText
          style={[styles.cellText, value === "X" ? styles.xText : styles.oText]}
        >
          {value || ""}
        </ThemedText>
      </TouchableOpacity>
    );
  };

  const renderBoardRow = (boardIndex: number, rowIndex: number) => {
    const cells = [];
    const startCell = rowIndex * 3;
    for (let i = startCell; i < startCell + 3; i++) {
      cells.push(renderCell(boardIndex, i));
    }
    return (
      <View key={`board-${boardIndex}-row-${rowIndex}`} style={styles.boardRow}>
        {cells}
      </View>
    );
  };

  const renderBoard = (boardIndex: number) => {
    const boardRows = [];
    const boardWinner = gameState.mainBoard[boardIndex];

    for (let i = 0; i < 3; i++) {
      boardRows.push(renderBoardRow(boardIndex, i));
    }

    const boardStyle = [
      styles.smallBoard,
      boardIndex % 3 === 0 ? styles.majorBorderLeft : null,
      boardIndex % 3 === 2 ? styles.majorBorderRight : null,
      Math.floor(boardIndex / 3) === 0 ? styles.majorBorderTop : null,
      Math.floor(boardIndex / 3) === 2 ? styles.majorBorderBottom : null,
    ];

    return (
      <View key={boardIndex} style={boardStyle}>
        <View style={styles.boardContent}>{boardRows}</View>
        {boardWinner && (
          <View style={styles.overlayContainer}>
            <BlurView intensity={50} style={styles.blurOverlay} />
            <View style={styles.winnerOverlay}>
              <ThemedText
                style={[
                  styles.winnerText,
                  boardWinner === "X" ? styles.xText : styles.oText,
                ]}
              >
                {boardWinner}
              </ThemedText>
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderGridRow = (rowIndex: number) => {
    const boards = [];
    for (let i = 0; i < 3; i++) {
      boards.push(renderBoard(rowIndex * 3 + i));
    }
    return (
      <View key={`grid-row-${rowIndex}`} style={styles.gridRow}>
        {boards}
      </View>
    );
  };

  const renderGrid = () => {
    const rows = [];
    for (let i = 0; i < 3; i++) {
      rows.push(renderGridRow(i));
    }
    return <View style={styles.grid}>{rows}</View>;
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
      <ThemedText style={styles.gameStatus}>{getGameStatus()}</ThemedText>
      <View style={styles.gridContainer}>{renderGrid()}</View>
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
  gridContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  grid: {
    backgroundColor: "#000",
    padding: 2,
  },
  gridRow: {
    flexDirection: "row",
  },
  smallBoard: {
    width: boardSize,
    height: boardSize,
    margin: 1,
    backgroundColor: "white",
    position: "relative",
    overflow: "hidden",
  },
  boardContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  boardRow: {
    flexDirection: "row",
    flex: 1,
  },
  cell: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  cellBorderTop: {
    borderTopWidth: 1,
    borderTopColor: "#999",
  },
  cellBorderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: "#999",
  },
  cellBorderLeft: {
    borderLeftWidth: 1,
    borderLeftColor: "#999",
  },
  cellBorderRight: {
    borderRightWidth: 1,
    borderRightColor: "#999",
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
    fontSize: Math.floor(boardSize * 0.2),
    fontWeight: "bold",
  },
  overlayContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  blurOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  winnerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  winnerText: {
    fontSize: Math.floor(boardSize * 0.6),
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  xText: {
    color: "#ff4444",
  },
  oText: {
    color: "#4444ff",
  },
  playableCell: {
    backgroundColor: "#e6ffe6",
  },
  gameStatus: {
    fontSize: 18,
    textAlign: "center",
    marginVertical: 10,
    fontWeight: "bold",
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
