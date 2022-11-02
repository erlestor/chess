export class Piece {
  piece = ""
  color = ""

  constructor(s: string) {
    if (s === "") return
    this.piece = s[1]
    this.color = s[0]
  }

  get empty() {
    return this.isEmpty()
  }

  get opponentColor() {
    if (this.color === "w") return "b"
    if (this.color === "b") return "w"
    return ""
  }

  get white() {
    return this.color === "w"
  }

  get black() {
    return this.color === "b"
  }

  isEmpty() {
    return this.piece === ""
  }

  get slidingPiece() {
    return ["b", "r", "q"].includes(this.piece)
  }

  get pawn() {
    return this.piece === "p"
  }

  get knight() {
    return this.piece === "n"
  }

  get king() {
    return this.piece === "k"
  }
}
