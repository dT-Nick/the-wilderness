import { getGameState } from '../state.js'

export function getEntityXAndYValuesFromCoords(
  xCoord: number,
  yCoord: number,
  blockSize: number
) {
  return [xCoord * blockSize, yCoord * blockSize]
}

export function getXAndYValuesFromCoords(
  xCoord: number,
  yCoord: number,
  blockSize: number,
  scale: number
) {
  return [xCoord * (blockSize * scale), yCoord * (blockSize * scale)]
}

export function getCoordsFromXAndYValues(
  xValue: number,
  yValue: number,
  blockSize: number,
  verticalOffset: number,
  scale: number
) {
  return [
    Math.floor(xValue / (blockSize * scale)),
    Math.floor((yValue - verticalOffset / 2) / (blockSize * scale)),
  ]
}
