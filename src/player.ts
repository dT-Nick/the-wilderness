import { gameState } from './state.js'

export class Player {
  x: number
  y: number
  coords: [number, number]
  size: number
  prevX: number
  prevY: number
  movementStatus: 'idle' | 'up' | 'down' | 'left' | 'right'
  id: string

  constructor(startX: number, startY: number, startSize: number) {
    this.x = startX
    this.y = startY
    this.coords = [17, 6]
    this.size = startSize
    this.prevX = startX
    this.prevY = startY
    this.movementStatus = 'idle'
  }

  public moveUp() {
    this.prevY = this.y
    this.movementStatus = 'up'
  }

  public moveDown() {
    this.prevY = this.y
    this.movementStatus = 'down'
  }

  public moveLeft() {
    this.prevX = this.x
    this.movementStatus = 'left'
  }

  public moveRight() {
    this.prevX = this.x
    this.movementStatus = 'right'
  }

  public stopMoving() {
    const { state } = gameState
    const { blockSize } = state
    this.prevX = this.x
    this.prevY = this.y
    this.coords = [Math.ceil(this.x / blockSize), Math.ceil(this.y / blockSize)]
    this.movementStatus = 'idle'
  }

  public updatePosition(x: number, y: number) {
    this.x = x
    this.y = y
  }
}

export function generatePlayer() {
  const { state } = gameState
  const { ctx, status, player, scale, verticalOffset } = state

  if (status !== 'inactive') {
    ctx.fillStyle = 'white'
    ctx.fillRect(
      player.x * scale,
      player.y * scale + verticalOffset / 2,
      player.size * scale,
      player.size * scale
    )
  }
}
