import "./piece.css"
import { FC } from "react"
import { Piece } from "../../service/piece"

interface Props {
  piece: Piece
  squareIdx: number
  highlight: boolean
  selected: boolean
}

const PieceC: FC<Props> = ({ piece, squareIdx, highlight, selected }) => {
  const getTileColor = (i: number) => {
    const isDark = (Math.floor(i / 8) + i) % 2 === 0
    if (selected) return "#C7A163"
    if (highlight && isDark) return "#bb373c"
    if (highlight) return "#D94D51"
    if (isDark) return "#B58863"
    return "#F0D9B5"
  }

  const getPieceImg = () => {
    return "/pieces/" + piece.color + piece.piece + ".svg"
  }

  return (
    <div
      className="piece"
      style={{
        backgroundColor: getTileColor(squareIdx),
        cursor: !piece.empty ? "pointer" : "",
      }}
    >
      <p>{squareIdx}</p>
      {piece.piece !== "" && (
        <img
          src={getPieceImg()}
          alt={piece.piece}
          width={80}
          draggable="false"
        />
      )}
    </div>
  )
}

export default PieceC
