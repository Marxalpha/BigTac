import { useState, useCallback } from 'react';
import type { Player, SmallBoard, GameBoard } from '../constants/bigtac';

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export const useUltimateTicTacToe = () => {
  const initialGameState: GameBoard = {
    boards: Array(9).fill(null).map(() => Array(9).fill(null)),
    mainBoard: Array(9).fill(null),
    currentPlayer: 'X',
    nextBoardIndex: null, // null means player can play in any board
  };

  const [gameState, setGameState] = useState<GameBoard>(initialGameState);

  const checkWinner = (board: Player[]): Player => {
    for (const [a, b, c] of WINNING_COMBINATIONS) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  const isBoardFull = (board: Player[]): boolean => {
    return board.every(cell => cell !== null);
  };

  const isValidMove = (boardIndex: number, cellIndex: number): boolean => {
    // Check if the move is in the correct board
    if (gameState.nextBoardIndex !== null && gameState.nextBoardIndex !== boardIndex) {
      return false;
    }

    // Check if the cell is empty
    if (gameState.boards[boardIndex][cellIndex] !== null) {
      return false;
    }

    // Check if the small board is already won
    if (gameState.mainBoard[boardIndex] !== null) {
      return false;
    }

    // If the next board is full or already won, allow playing in any board
    if (gameState.nextBoardIndex !== null) {
      const nextBoard = gameState.boards[gameState.nextBoardIndex];
      const isNextBoardWon = gameState.mainBoard[gameState.nextBoardIndex] !== null;
      const isNextBoardFull = isBoardFull(nextBoard);
      if (isNextBoardWon || isNextBoardFull) {
        return true;
      }
    }

    return true;
  };

  const makeMove = (boardIndex: number, cellIndex: number) => {
    if (!isValidMove(boardIndex, cellIndex)) {
      return false;
    }

    setGameState(prevState => {
      // Create new boards array
      const newBoards = prevState.boards.map((board, idx) =>
        idx === boardIndex
          ? board.map((cell, i) =>
              i === cellIndex ? prevState.currentPlayer : cell
            )
          : [...board]
      );

      // Check if the small board was won
      const smallBoardWinner = checkWinner(newBoards[boardIndex]);
      const newMainBoard = [...prevState.mainBoard];
      
      if (smallBoardWinner || isBoardFull(newBoards[boardIndex])) {
        newMainBoard[boardIndex] = smallBoardWinner;
      }

      // Determine next board to play in
      let nextBoard: number | null = cellIndex;
      if (newMainBoard[cellIndex] !== null || isBoardFull(newBoards[cellIndex])) {
        nextBoard = null; // Allow playing in any board
      }

      return {
        boards: newBoards,
        mainBoard: newMainBoard,
        currentPlayer: prevState.currentPlayer === 'X' ? 'O' : 'X',
        nextBoardIndex: nextBoard,
      };
    });

    return true;
  };

  const getGameStatus = () => {
    const winner = checkWinner(gameState.mainBoard);
    if (winner) {
      return `Player ${winner} wins the game!`;
    }
    if (gameState.mainBoard.every(board => board !== null)) {
      return "It's a draw!";
    }
    return `Player ${gameState.currentPlayer}'s turn${
      gameState.nextBoardIndex !== null
        ? ` (must play in board ${gameState.nextBoardIndex + 1})`
        : ''
    }`;
  };

  const resetGame = () => {
    setGameState(initialGameState);
  };

  return {
    gameState,
    makeMove,
    getGameStatus,
    resetGame,
    isValidMove,
  };
};