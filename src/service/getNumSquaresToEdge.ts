export const getNumSquaresToEdge = () => {
  let numSquaresToEdge = []

  for (let file = 0; file < 8; file++) {
    for (let rank = 0; rank < 8; rank++) {
      const numNorth = 7 - rank
      const numSouth = rank
      const numWest = file
      const numEast = 7 - file

      const squareIndex = rank * 8 + file

      numSquaresToEdge[squareIndex] = [
        numNorth,
        numSouth,
        numWest,
        numEast,
        Math.min(numNorth, numWest),
        Math.min(numSouth, numEast),
        Math.min(numNorth, numEast),
        Math.min(numSouth, numWest),
      ]
    }
  }

  return numSquaresToEdge
}
