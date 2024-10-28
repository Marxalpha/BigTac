export type Player = "X" | "O" | null;
export type SmallBoard = Player[];
export type GameBoard = {
  boards: SmallBoard[];
  mainBoard: Player[];
  currentPlayer: Player;
  nextBoardIndex: number | null;
};
