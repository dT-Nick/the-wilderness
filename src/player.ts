import {
  getCanvasState,
  getDeltaFrames,
  getGameState,
  getInputState,
  isInitialised,
  isPlayerInitialised,
} from './state.js'

export function drawPlayer() {
  const { player, blockSize } = getGameState()
  const { ctx, scale, verticalOffset } = getCanvasState()
  if (!isInitialised(ctx) || !isPlayerInitialised(player)) return
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

  ctx.fillStyle = 'white'
  ctx.font = '16px serif'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.fillText(`[${player.coordinates[0]}, ${player.coordinates[1]}]`, 10, 20)
}

export function handlePlayerMovement(
  restrictedCoords: Array<[number, number]>
) {
  const { keysDown, touches } = getInputState()
  const { player, blockSize, blocksVertical, blocksHorizontal } = getGameState()
  if (!isPlayerInitialised(player)) return

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

  const lastMovementButtonIndex = Math.max(
    touches.findIndex((t) => t.type === 'dpadUp'),
    touches.findIndex((t) => t.type === 'dpadDown'),
    touches.findIndex((t) => t.type === 'dpadLeft'),
    touches.findIndex((t) => t.type === 'dpadRight')
  )

  const lastMovementButton =
    lastMovementButtonIndex >= 0 ? touches[lastMovementButtonIndex] : null

  if (
    (player.movementStatus === 'idle' || player.movementStatus === 'stable') &&
    lastMovementButton
  ) {
    switch (lastMovementButton.type) {
      case 'dpadUp': {
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
      case 'dpadDown': {
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
      case 'dpadLeft': {
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
      case 'dpadRight': {
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
