import { gameState, updateBattleState } from './state.js'

export class Player {
  x: number
  y: number
  size: number
  prevX: number
  prevY: number
  prevHealth: number
  currentHealth: number
  maxHealth: number
  currentDamage: number
  movementStatus:
    | 'idle'
    | 'up'
    | 'down'
    | 'left'
    | 'right'
    | 'stable'
    | 'interrupted'
  faceDirection: 'up' | 'down' | 'left' | 'right'
  faceCount: {
    up: number
    down: number
    left: number
    right: number
  }
  id: string

  constructor(startX: number, startY: number, startSize: number) {
    this.x = startX
    this.y = startY
    this.size = startSize
    this.prevX = startX
    this.prevY = startY
    this.currentHealth = 100
    this.maxHealth = 100
    this.prevHealth = 100
    this.currentDamage = 0
    this.faceDirection = 'down'
    this.faceCount = {
      up: 0,
      down: 8,
      left: 0,
      right: 0,
    }
    this.movementStatus = 'idle'
  }

  get coordinates() {
    const { state } = gameState
    const { blockSize } = state
    return [
      Math.ceil(this.prevX / blockSize),
      Math.ceil(this.prevY / blockSize),
    ]
  }

  public moveUp() {
    if (this.faceDirection === 'up') {
      if (this.faceCount.up >= 8) {
        this.prevY = this.y
        this.movementStatus = 'up'
      }
    } else {
      this.faceDirection = 'up'
    }
  }

  public interruptMovement(value: boolean) {
    this.movementStatus = value ? 'interrupted' : 'stable'
  }

  public moveDown() {
    if (this.faceDirection === 'down') {
      if (this.faceCount.down >= 8) {
        this.prevY = this.y
        this.movementStatus = 'down'
      }
    } else {
      this.faceDirection = 'down'
    }
  }

  public moveLeft() {
    if (this.faceDirection === 'left') {
      if (this.faceCount.left >= 8) {
        this.prevX = this.x
        this.movementStatus = 'left'
      }
    } else {
      this.faceDirection = 'left'
    }
  }

  public moveRight() {
    if (this.faceDirection === 'right') {
      if (this.faceCount.right >= 8) {
        this.prevX = this.x
        this.movementStatus = 'right'
      }
    } else {
      this.faceDirection = 'right'
    }
  }

  public keepMoving() {
    this.prevX = this.x
    this.prevY = this.y
    this.movementStatus = 'stable'
    this.faceCount = {
      up: 8,
      down: 8,
      left: 8,
      right: 8,
    }
  }

  public stopMoving() {
    this.prevX = this.x
    this.prevY = this.y
    this.movementStatus = 'idle'
    this.faceCount = {
      up: 0,
      down: 0,
      left: 0,
      right: 0,
      [this.faceDirection]: 8,
    }
  }

  public updateFaceCount(direction: 'up' | 'down' | 'left' | 'right') {
    const { state } = gameState
    const { deltaTime, status } = state
    if (status !== 'inactive') {
      const deltaFrames = deltaTime / (1000 / 60)

      if (this.faceCount[direction] < 8) {
        this.faceCount = {
          up: 0,
          down: 0,
          left: 0,
          right: 0,
          [direction]: this.faceCount[direction] + 1 * deltaFrames,
        }
      }
    }
  }

  public updatePosition(x: number, y: number) {
    this.x = x
    this.y = y
  }

  public takeDamage() {
    const { state } = gameState
    const { deltaTime, status } = state
    if (!this.currentDamage) return

    if (status !== 'inactive') {
      const deltaFrames = deltaTime / (1000 / 60)
      if (this.currentHealth <= this.prevHealth - this.currentDamage) {
        const newHealth = this.prevHealth - this.currentDamage
        this.currentHealth = newHealth
        this.prevHealth = newHealth
        this.currentDamage = 0
        updateBattleState({
          lastMove: 'enemy',
        })
      } else {
        this.currentHealth -= 0.5 * deltaFrames
      }
    }
  }

  public takeHit(damage: number) {
    this.currentDamage = damage
  }
}

export function generatePlayer() {
  const { state } = gameState
  const { ctx, status, player, scale, verticalOffset } = state

  if (status !== 'inactive') {
    // top to bottom gradient
    if (player.movementStatus === 'idle') {
      player.updateFaceCount(player.faceDirection)
    }

    const gradient = ctx.createLinearGradient(
      player.x * scale,
      player.y * scale + verticalOffset / 2,
      player.x * scale,
      player.y * scale + player.size * scale + verticalOffset / 2
    )

    gradient.addColorStop(0, 'orangered')
    if (player.movementStatus === 'interrupted') {
      gradient.addColorStop(0.5, 'red')
    } else {
      gradient.addColorStop(1, 'white')
    }
    ctx.fillStyle = gradient

    ctx.save()
    if (player.faceDirection === 'up') {
      ctx.translate(
        (player.x + player.size / 2) * scale,
        (player.y + player.size / 2) * scale + verticalOffset / 2
      )
      ctx.rotate(Math.PI)
      ctx.translate(
        (-player.x - player.size / 2) * scale,
        (-player.y - player.size / 2) * scale - verticalOffset / 2
      )
    }
    if (player.faceDirection === 'left') {
      ctx.translate(
        (player.x + player.size / 2) * scale,
        (player.y + player.size / 2) * scale + verticalOffset / 2
      )
      ctx.rotate(Math.PI / 2)
      ctx.translate(
        (-player.x - player.size / 2) * scale,
        (-player.y - player.size / 2) * scale - verticalOffset / 2
      )
    }
    if (player.faceDirection === 'right') {
      ctx.translate(
        (player.x + player.size / 2) * scale,
        (player.y + player.size / 2) * scale + verticalOffset / 2
      )
      ctx.rotate(Math.PI * 1.5)
      ctx.translate(
        (-player.x - player.size / 2) * scale,
        (-player.y - player.size / 2) * scale - verticalOffset / 2
      )
    }
    ctx.fillRect(
      player.x * scale,
      player.y * scale + verticalOffset / 2,
      player.size * scale,
      player.size * scale
    )
    ctx.restore()
  }
}
