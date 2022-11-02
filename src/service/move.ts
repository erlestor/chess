import { Board } from "./board"
import { Piece } from "./piece"
import { getNumSquaresToEdge } from "./getNumSquaresToEdge"

const directionOffsets = [8, -8, -1, 1, 7, -7, 9, -9]

export class Move {
  startSquare
  targetSquare
  castle = false

  constructor(startSquare: number, targetSquare: number) {
    this.startSquare = startSquare
    this.targetSquare = targetSquare
  }

  setCastle() {
    this.castle = true
  }
}

export const generateLegalMoves = (board: Board) => {
  console.log("generateLegalMoves() called")
  const pseudoLegalMoves = generateMoves(board)
  const legalMoves: Move[] = []

  for (const moveToVerifyIdx in pseudoLegalMoves) {
    const moveToVerify = pseudoLegalMoves[moveToVerifyIdx]
    board.makeMove(moveToVerify)

    const opponentResponses = generateMoves(board)
    board.toggleTurnToMove()
    const kingPos = board.squares
      .map((piece) => piece.color + piece.piece)
      .indexOf(board.turnToMove + "k")
    board.toggleTurnToMove()

    if (
      !opponentResponses.some((response) => response.targetSquare === kingPos)
    ) {
      legalMoves.push(moveToVerify)
    }

    board.unmakeMove(moveToVerify)
  }

  return legalMoves
}

const generateMoves = (board: Board) => {
  const moves: Move[] = []

  for (let startSquare = 0; startSquare < 64; startSquare++) {
    const piece = board.getPiece(startSquare)
    if (piece.color === board.turnToMove) {
      if (piece.slidingPiece)
        generateSlidingMoves(moves, startSquare, piece, board)
      if (piece.pawn) generatePawnMoves(moves, startSquare, piece, board)
      if (piece.knight) generateKnightMoves(moves, startSquare, piece, board)
      if (piece.king) generateKingMoves(moves, startSquare, piece, board)
    }
  }

  return moves
}

const generateSlidingMoves = (
  moves: Move[],
  startSquare: number,
  piece: Piece,
  board: Board
) => {
  const numSquaresToEdge = getNumSquaresToEdge()
  const startDirIndex = piece.piece === "b" ? 4 : 0
  const endDirIndex = piece.piece === "r" ? 4 : 8

  for (
    let directionIndex = startDirIndex;
    directionIndex < endDirIndex;
    directionIndex++
  ) {
    for (let n = 0; n < numSquaresToEdge[startSquare][directionIndex]; n++) {
      const targetSquare =
        startSquare + directionOffsets[directionIndex] * (n + 1)
      const pieceOnTargetSquare = board.getPiece(targetSquare)

      // blocked by friendly piece
      if (piece.color === pieceOnTargetSquare.color) break

      moves.push(new Move(startSquare, targetSquare))

      //  capture enemy piece
      if (piece.opponentColor === pieceOnTargetSquare.color) break
    }
  }
}

const generatePawnMoves = (
  moves: Move[],
  startSquare: number,
  piece: Piece,
  board: Board
) => {
  const checkMoves = []
  const offsets = [7, 9]

  const square1 = piece.color === "w" ? 48 : 8
  const square2 = piece.color === "w" ? 56 : 16
  const offset1 =
    piece.color === "w" ? -directionOffsets[0] : directionOffsets[0]
  const offset2 =
    piece.color === "w" ? -directionOffsets[0] * 2 : directionOffsets[0] * 2

  checkMoves.push(startSquare + offset1)

  if (startSquare >= square1 && startSquare < square2)
    checkMoves.push(startSquare + offset2)

  offsets.forEach((dir) => {
    const targetSquare =
      piece.color === "w" ? startSquare - dir : startSquare + dir
    const targetPiece = board.getPiece(targetSquare)
    if (!targetPiece.empty && targetPiece.color !== piece.color)
      checkMoves.push(targetSquare)
  })

  checkMoves.forEach((move) => {
    if (move < 0 || move >= 64) return

    if (
      board.getPiece(move).piece === "" ||
      ((Math.abs(move - startSquare) === 7 ||
        Math.abs(move - startSquare) === 9) &&
        board.getPiece(move).color !== piece.color)
    )
      moves.push(new Move(startSquare, move))
  })
}

const generateKnightMoves = (
  moves: Move[],
  startSquare: number,
  piece: Piece,
  board: Board
) => {
  const knightDirections = [17, 15, -15, -17, 10, 6, -10, -6]

  knightDirections.forEach((dir) => {
    const targetSquare = startSquare + dir
    const targetPiece = board.getPiece(targetSquare)
    if (
      targetSquare >= 0 &&
      targetSquare < 64 &&
      (targetPiece.empty || targetPiece.color !== piece.color)
    ) {
      moves.push(new Move(startSquare, targetSquare))
    }
  })
}

const generateKingMoves = (
  moves: Move[],
  startSquare: number,
  piece: Piece,
  board: Board
) => {
  directionOffsets.forEach((dir) => {
    const targetSquare = startSquare + dir
    const targetPiece = board.getPiece(targetSquare)

    if (targetSquare < 0 || targetSquare >= 64) return

    if (targetPiece.empty || targetPiece.color !== piece.color)
      moves.push(new Move(startSquare, targetSquare))
  })

  // CASTLING
  // TODO: sjekke om tårn eller konge har flytta sæ

  let directions = ["k", "q", "K", "Q"]
  if (piece.white) directions = directions.filter((d) => d.toLowerCase() === d)
  if (piece.black) directions = directions.filter((d) => d.toUpperCase() === d)

  const castleTile: { k: number; q: number; K: number; Q: number } = {
    k: 62,
    q: 58,
    K: 6,
    Q: 2,
  }

  for (const dirIdx in directions) {
    const dir: "k" | "q" | "K" | "Q" = directions[dirIdx] as any
    if (board.canCastle(dir) && board.castleSquaresEmpty(dir)) {
      const targetSquare = castleTile["k"]
      const move = new Move(startSquare, targetSquare)
      move.setCastle()
      moves.push(move)
    }
  }
}
