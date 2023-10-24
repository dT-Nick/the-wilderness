import { getDeltaFrames, getGameState, getInputState } from '../state.js'

const mapZeroState = {}

export function drawMapZero() {}

export function handleMapZeroInput() {
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

        if (y > 1) {
          player.moveUp()
          break
        }
        player.lookUp()
        break
      }
      case 'arrowdown':
      case 's': {
        const [x, y] = player.coordinates

        if (y < blocksVertical) {
          player.moveDown()
          break
        }
        player.lookDown()
        break
      }
      case 'arrowleft':
      case 'a': {
        const [x] = player.coordinates

        if (x > 1) {
          player.moveLeft()
          break
        }
        player.lookLeft()
        break
      }
      case 'arrowright':
      case 'd': {
        const [x] = player.coordinates
        if (x < blocksHorizontal) {
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
    const newY = player.y - (blockSize / 4) * deltaFrames
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
    const newY = player.y + (blockSize / 4) * deltaFrames
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
    const newX = player.x - (blockSize / 4) * deltaFrames
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
    const newX = player.x + (blockSize / 4) * deltaFrames
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
