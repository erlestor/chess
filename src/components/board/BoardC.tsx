import { useState, useEffect } from "react"
import PieceC from "../piece/PieceC"
import "./board.css"
import { Board } from "../../service/board"
import { Move } from "../../service/move"

const BoardC = () => {
  const [board, setBoard] = useState<Board>(new Board())
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null)
  const [highlightedSquares, setHighlightedSquares] = useState<number[]>([])

  const handleMouseDown = (squareIdx: number) => {
    const moves: Move[] = JSON.parse(JSON.stringify(board.legalMoves))
    const movesForPiece = moves
      .filter((move) => move.startSquare === squareIdx)
      .map((move) => move.targetSquare)
    console.log(movesForPiece)
    setHighlightedSquares(movesForPiece)
    setSelectedPiece(squareIdx)
  }

  const movePiece = (target: number) => {
    setHighlightedSquares([])
    if (!selectedPiece) return
    const from = selectedPiece
    setSelectedPiece(null)
    if (target === from) return
    if (board.squares[from].empty) return

    const newBoard = Object.assign(
      Object.create(Object.getPrototypeOf(board)),
      board
    )
    newBoard.movePiece(from, target)
    setBoard(newBoard)
  }

  return (
    <div className="board-container">
      <h1 className="turn-header">{board.turnToMoveText() + " to move"} </h1>
      {board.legalMoves.length === 0 && (
        <h1 className="turn-header">Checkmate</h1>
      )}
      <div className="board">
        {board.squares.map((piece, squareIdx) => (
          <div
            onMouseDown={() => handleMouseDown(squareIdx)}
            onMouseUp={() => movePiece(squareIdx)}
            key={squareIdx}
          >
            <PieceC
              piece={piece}
              squareIdx={squareIdx}
              highlight={highlightedSquares.includes(squareIdx)}
              selected={squareIdx === selectedPiece}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default BoardC
