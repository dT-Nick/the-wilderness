import { getGameState } from '../state.js'

export function getXAndYValuesFromCoords(
  xCoord: number,
  yCoord: number,
  blockSize: number
) {
  return [xCoord * blockSize, yCoord * blockSize]
}
