import { generateLegalMoves, Move } from "./move"
import { Piece } from "./piece"

export class Board {
  squares = Array(64).fill(new Piece(""))
  turnToMove = "w"
  castlingRights = ""
  enPassant = ""
  legalMoves: Move[] = []
  lastDeletedPiece = new Piece("")

  constructor() {
    this.loadFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
    this.generateMoves()
  }

  generateMoves() {
    this.legalMoves = generateLegalMoves(this)
  }

  canCastle(piece: string) {
    return this.castlingRights.includes(piece)
  }

  castleSquaresEmpty(s: "k" | "q" | "K" | "Q") {
    const obj: { k: boolean; q: boolean; K: boolean; Q: boolean } = {
      k: this.squares[61].empty && this.squares[62].empty,
      q:
        this.squares[57].empty &&
        this.squares[58].empty &&
        this.squares[59].empty,
      K: this.squares[5].empty && this.squares[6].empty,
      Q:
        this.squares[1].empty && this.squares[2].empty && this.squares[3].empty,
    }
    return obj[s]
  }

  getPiece(i: number) {
    return this.squares[i]
  }

  setPiece(i: number, piece: string) {
    this.squares[i] = new Piece(piece)
  }

  movePiece(from: number, target: number) {
    const move = new Move(from, target)
    if (!this.isMoveLegal(from, target)) return

    if (this.squares[target].isEmpty()) {
      const audio = new Audio("/sounds/move.mp3")
      audio.play()
    } else {
      const audio = new Audio("/sounds/capture.mp3")
      audio.play()
    }

    // WTF DU CREATE JO EN NY MOVE HELE TIDA FOR FAEN. D GIR INGEN MENING
    console.log(move)
    if (move.castle) {
      console.log("castling")
    }

    this.makeMove(move)
    this.generateMoves()

    // random opponent
    if (this.turnToMove === "b") this.chooseComputerMove()
  }

  chooseComputerMove() {
    const move =
      this.legalMoves[Math.floor(Math.random() * (this.legalMoves.length - 1))]
    this.movePiece(move.startSquare, move.targetSquare)
  }

  makeMove(move: Move) {
    this.lastDeletedPiece = this.squares[move.targetSquare]
    this.squares[move.targetSquare] = this.squares[move.startSquare]
    this.squares[move.startSquare] = new Piece("")
    this.toggleTurnToMove()
  }

  unmakeMove(move: Move) {
    this.squares[move.startSquare] = this.squares[move.targetSquare]
    this.squares[move.targetSquare] = this.lastDeletedPiece
    this.toggleTurnToMove()
  }

  toggleTurnToMove() {
    if (this.turnToMove === "w") this.turnToMove = "b"
    else this.turnToMove = "w"
  }

  turnToMoveText() {
    if (this.turnToMove === "w") return "White"
    if (this.turnToMove === "b") return "Black"
  }

  isMoveLegal(from: number, target: number) {
    return this.legalMoves.some(
      (move) => move.startSquare === from && move.targetSquare === target
    )
  }

  loadFen(fenStr: string) {
    // rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1

    const fen = fenStr.split(" ")

    // Pieces
    const layout = fen[0].split("").filter((p) => p !== "/")
    let i = 0
    for (const charIdx in layout) {
      const char = layout[charIdx]
      const skipN = Number(char)

      if (skipN) {
        i += skipN
        continue
      }

      const color = char === char.toUpperCase() ? "w" : "b"
      this.setPiece(i, color + char.toLowerCase())
      i++
    }

    // Turn to move
    this.turnToMove = fen[1]

    // castling
    this.castlingRights = fen[2]

    // en passant
    const enPassant = fen[3]
    if (enPassant === "-") this.enPassant = ""
    else this.enPassant = enPassant

    // halfmove clock

    // fullmove number
  }
}
