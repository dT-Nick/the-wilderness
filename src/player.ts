import { isKeyCurrentlyDown } from './input.js'
import { LivingBeing } from './living-being.js'
import {
  getBattleState,
  getCanvasState,
  getDeltaFrames,
  getGameState,
  getInputState,
  isInitialised,
  updateBattleState,
  updateGameState,
} from './state.js'

export class Player extends LivingBeing {
  prevX: number
  prevY: number
  movementStatus: 'idle' | 'up' | 'down' | 'left' | 'right' | 'stable'
  faceCount: {
    up: number
    down: number
    left: number
    right: number
  }

  constructor(startX: number, startY: number, size: number) {
    super(startX, startY, size, 100, 'down')

    this.prevX = startX
    this.prevY = startY
    this.faceCount = {
      up: 0,
      down: 8,
      left: 0,
      right: 0,
    }
    this.movementStatus = 'idle'
  }

  get coordinates() {
    const { blockSize } = getGameState()

    const coords: [number, number] = [
      Math.round(this.prevX / blockSize),
      Math.round(this.prevY / blockSize),
    ]

    return coords
  }

  get speed() {
    const { blockSize } = getGameState()
    const isShiftDown = isKeyCurrentlyDown('shift')

    return blockSize / (isShiftDown ? 8 : 12)
  }

  public moveUp() {
    if (this.faceDirection === 'up') {
      if (this.faceCount.up >= 8) {
        this.prevY = this.y
        this.movementStatus = 'up'
      }
    } else {
      super.lookUp()
    }
  }

  public lookUp() {
    super.lookUp
    this.stopMoving()
  }

  public moveDown() {
    if (this.faceDirection === 'down') {
      if (this.faceCount.down >= 8) {
        this.prevY = this.y
        this.movementStatus = 'down'
      }
    } else {
      super.lookDown()
    }
  }

  public lookDown() {
    super.lookDown()
    this.stopMoving()
  }

  public moveLeft() {
    if (this.faceDirection === 'left') {
      if (this.faceCount.left >= 8) {
        this.prevX = this.x
        this.movementStatus = 'left'
      }
    } else {
      super.lookLeft()
    }
  }

  public lookLeft() {
    super.lookLeft()
    this.stopMoving()
  }

  public moveRight() {
    if (this.faceDirection === 'right') {
      if (this.faceCount.right >= 8) {
        this.prevX = this.x
        this.movementStatus = 'right'
      }
    } else {
      super.lookRight()
    }
  }

  public lookRight() {
    super.lookRight()
    this.stopMoving()
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
    const deltaFrames = getDeltaFrames()

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

  public takeDamage() {
    if (!this.currentDamage) return
    super.takeDamage()
    if (this.currentHealth <= this.prevHealth - this.currentDamage) {
      updateBattleState({
        lastMove: 'enemy',
        playerMenu: 'main',
      })
    }
  }
}

export function drawPlayer() {
  const { player, blockSize } = getGameState()
  const { ctx, scale, verticalOffset } = getCanvasState()

  if (isInitialised(ctx)) {
    if (player.movementStatus === 'idle') {
      player.updateFaceCount(player.faceDirection)
    }

    const gradient = ctx.createLinearGradient(
      player.x * scale,
      player.y * scale + verticalOffset / 2,
      player.x * scale,
      player.y * scale + player.size * scale + verticalOffset / 2
    )

    gradient.addColorStop(0, 'blue')
    gradient.addColorStop(1, 'lightblue')
    ctx.fillStyle = gradient

    ctx.save()
    if (player.faceDirection === 'up') {
      ctx.translate(
        (player.x + blockSize / 2) * scale,
        (player.y + blockSize / 2) * scale + verticalOffset / 2
      )
      ctx.rotate(Math.PI)
      ctx.translate(
        (-player.x - blockSize / 2) * scale,
        (-player.y - blockSize / 2) * scale - verticalOffset / 2
      )
    }
    if (player.faceDirection === 'left') {
      ctx.translate(
        (player.x + blockSize / 2) * scale,
        (player.y + blockSize / 2) * scale + verticalOffset / 2
      )
      ctx.rotate(Math.PI / 2)
      ctx.translate(
        (-player.x - blockSize / 2) * scale,
        (-player.y - blockSize / 2) * scale - verticalOffset / 2
      )
    }
    if (player.faceDirection === 'right') {
      ctx.translate(
        (player.x + blockSize / 2) * scale,
        (player.y + blockSize / 2) * scale + verticalOffset / 2
      )
      ctx.rotate(Math.PI * 1.5)
      ctx.translate(
        (-player.x - blockSize / 2) * scale,
        (-player.y - blockSize / 2) * scale - verticalOffset / 2
      )
    }
    ctx.fillRect(
      (player.x + blockSize / 2 - player.size / 2) * scale,
      (player.y + blockSize / 2 - player.size / 2) * scale + verticalOffset / 2,
      player.size * scale,
      player.size * scale
    )
    ctx.restore()

    // draw player coords in top left corner
    ctx.fillStyle = 'white'
    ctx.font = '16px serif'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.fillText(`[${player.coordinates[0]}, ${player.coordinates[1]}]`, 10, 20)
  }
}

export function handlePlayerMovement(
  restrictedCoords: Array<[number, number]>
) {
  const { keysDown } = getInputState()
  const { player, blockSize, blocksVertical, blocksHorizontal } = getGameState()

  const deltaFrames = getDeltaFrames()

  const lastMovementKeyIndex = Math.max(
    keysDown.findIndex((kD) => kD.key === 'arrowup'),
    keysDown.findIndex((kD) => kD.key === 'arrowdown'),
    keysDown.findIndex((kD) => kD.key === 'arrowleft'),
    keysDown.findIndex((kD) => kD.key === 'arrowright'),
    keysDown.findIndex((kD) => kD.key === 'w'),
    keysDown.findIndex((kD) => kD.key === 's'),
    keysDown.findIndex((kD) => kD.key === 'a'),
    keysDown.findIndex((kD) => kD.key === 'd')
  )

  const lastMovementKey =
    lastMovementKeyIndex >= 0 ? keysDown[lastMovementKeyIndex] : null

  if (
    (player.movementStatus === 'idle' || player.movementStatus === 'stable') &&
    lastMovementKey
  ) {
    switch (lastMovementKey.key) {
      case 'arrowup':
      case 'w': {
        const [x, y] = player.coordinates

        if (
          y > 0 &&
          !restrictedCoords.some((rc) => rc[0] === x && rc[1] === y - 1)
        ) {
          player.moveUp()
          break
        }
        player.lookUp()
        break
      }
      case 'arrowdown':
      case 's': {
        const [x, y] = player.coordinates

        if (
          y < blocksVertical - 1 &&
          !restrictedCoords.some((rc) => rc[0] === x && rc[1] === y + 1)
        ) {
          player.moveDown()
          break
        }
        player.lookDown()
        break
      }
      case 'arrowleft':
      case 'a': {
        const [x, y] = player.coordinates

        if (
          x > 0 &&
          !restrictedCoords.some((rc) => rc[0] === x - 1 && rc[1] === y)
        ) {
          player.moveLeft()
          break
        }
        player.lookLeft()
        break
      }
      case 'arrowright':
      case 'd': {
        const [x, y] = player.coordinates
        if (
          x < blocksHorizontal - 1 &&
          !restrictedCoords.some((rc) => rc[0] === x + 1 && rc[1] === y)
        ) {
          player.moveRight()
          break
        }
        player.lookRight()
        break
      }
      default:
        break
    }
  }

  if (player.movementStatus === 'up') {
    const destinationY = player.prevY - blockSize
    const newY = player.y - player.speed * deltaFrames
    const isOnDestination = newY < destinationY

    player.updatePosition(player.x, isOnDestination ? destinationY : newY)
    if (isOnDestination) {
      if (lastMovementKey) {
        player.keepMoving()
      } else {
        player.stopMoving()
      }
    }
  }
  if (player.movementStatus === 'down') {
    const destinationY = player.prevY + blockSize
    const newY = player.y + player.speed * deltaFrames
    const isOnDestination = newY > destinationY

    player.updatePosition(player.x, isOnDestination ? destinationY : newY)
    if (isOnDestination) {
      if (lastMovementKey) {
        player.keepMoving()
      } else {
        player.stopMoving()
      }
    }
  }
  if (player.movementStatus === 'left') {
    const destinationX = player.prevX - blockSize
    const newX = player.x - player.speed * deltaFrames
    const isOnDestination = newX < destinationX

    player.updatePosition(isOnDestination ? destinationX : newX, player.y)
    if (isOnDestination) {
      if (lastMovementKey) {
        player.keepMoving()
      } else {
        player.stopMoving()
      }
    }
  }
  if (player.movementStatus === 'right') {
    const destinationX = player.prevX + blockSize
    const newX = player.x + player.speed * deltaFrames
    const isOnDestination = newX > destinationX

    player.updatePosition(isOnDestination ? destinationX : newX, player.y)
    if (isOnDestination) {
      if (lastMovementKey) {
        player.keepMoving()
      } else {
        player.stopMoving()
      }
    }
  }
}

// export function generatePlayer() {
//   const { state } = gameState
//   const { ctx, status, player, scale, verticalOffset } = state

//   if (status !== 'inactive') {
//     // top to bottom gradient
//     if (player.movementStatus === 'idle') {
//       player.updateFaceCount(player.faceDirection)
//     }

//     const gradient = ctx.createLinearGradient(
//       player.x * scale,
//       player.y * scale + verticalOffset / 2,
//       player.x * scale,
//       player.y * scale + player.size * scale + verticalOffset / 2
//     )

//     gradient.addColorStop(0, 'orangered')
//     if (player.movementStatus === 'interrupted') {
//       gradient.addColorStop(0.5, 'red')
//     } else {
//       gradient.addColorStop(1, 'white')
//     }
//     ctx.fillStyle = gradient

//     ctx.save()
//     if (player.faceDirection === 'up') {
//       ctx.translate(
//         (player.x + player.size / 2) * scale,
//         (player.y + player.size / 2) * scale + verticalOffset / 2
//       )
//       ctx.rotate(Math.PI)
//       ctx.translate(
//         (-player.x - player.size / 2) * scale,
//         (-player.y - player.size / 2) * scale - verticalOffset / 2
//       )
//     }
//     if (player.faceDirection === 'left') {
//       ctx.translate(
//         (player.x + player.size / 2) * scale,
//         (player.y + player.size / 2) * scale + verticalOffset / 2
//       )
//       ctx.rotate(Math.PI / 2)
//       ctx.translate(
//         (-player.x - player.size / 2) * scale,
//         (-player.y - player.size / 2) * scale - verticalOffset / 2
//       )
//     }
//     if (player.faceDirection === 'right') {
//       ctx.translate(
//         (player.x + player.size / 2) * scale,
//         (player.y + player.size / 2) * scale + verticalOffset / 2
//       )
//       ctx.rotate(Math.PI * 1.5)
//       ctx.translate(
//         (-player.x - player.size / 2) * scale,
//         (-player.y - player.size / 2) * scale - verticalOffset / 2
//       )
//     }
//     ctx.fillRect(
//       player.x * scale,
//       player.y * scale + verticalOffset / 2,
//       player.size * scale,
//       player.size * scale
//     )
//     ctx.restore()
//   }
// }
