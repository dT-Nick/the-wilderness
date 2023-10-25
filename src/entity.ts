import { getGameState } from './state.js'

let entityId = 0

export class Entity {
  x: number
  y: number
  size: number
  id: number

  constructor(startX: number, startY: number, size: number) {
    this.x = startX
    this.y = startY
    this.size = size
    this.id = entityId++
  }

  get coordinates() {
    const { blockSize } = getGameState()

    const coords: [number, number] = [
      Math.round(this.x / blockSize),
      Math.round(this.y / blockSize),
    ]

    return coords
  }

  public updatePosition(x: number, y: number) {
    this.x = x
    this.y = y
  }
}
