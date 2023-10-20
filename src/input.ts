import { stopGameLoop } from './index.js'
import { gameState, updateState } from './state.js'

export function handleInput() {
  const { state } = gameState
  const {
    status,
    mouseDown,
    mouseX,
    mouseY,
    width,
    verticalOffset,
    scale,
    player,
    keysDown,
    prevMouseDown,
    blockSize,
  } = state

  if (mouseDown && !prevMouseDown) {
    if (mouseX > width - 54 * scale && mouseX < width - 5 * scale) {
      if (
        mouseY > 5 * scale + verticalOffset / 2 &&
        mouseY < 54 * scale + verticalOffset / 2
      ) {
        return true
      }
    }

    updateState({
      prevMouseDown: true,
    })
  }

  if (!mouseDown && prevMouseDown) {
    updateState({
      prevMouseDown: false,
    })
  }

  if (status === 'active') {
    if (player.movementStatus === 'idle') {
      const lastMovementKeyIndex = Math.max(
        keysDown.indexOf('arrowup'),
        keysDown.indexOf('arrowdown'),
        keysDown.indexOf('arrowleft'),
        keysDown.indexOf('arrowright'),
        keysDown.indexOf('w'),
        keysDown.indexOf('s'),
        keysDown.indexOf('a'),
        keysDown.indexOf('d')
      )
      const lastMovementKey = keysDown[lastMovementKeyIndex]

      switch (lastMovementKey) {
        case 'arrowup':
        case 'w':
          player.moveUp()
          break
        case 'arrowdown':
        case 's':
          player.moveDown()
          break
        case 'arrowleft':
        case 'a':
          player.moveLeft()
          break
        case 'arrowright':
        case 'd':
          player.moveRight()
          break
        default:
          break
      }
    }

    if (player.movementStatus === 'up') {
      const destinationY = player.prevY - blockSize
      const newY = player.y - blockSize / 8
      const isOnDestination = newY < destinationY

      player.updatePosition(player.x, isOnDestination ? destinationY : newY)
      if (isOnDestination) {
        player.stopMoving()
      }
    }
    if (player.movementStatus === 'down') {
      const destinationY = player.prevY + blockSize
      const newY = player.y + blockSize / 8
      const isOnDestination = newY > destinationY

      player.updatePosition(player.x, isOnDestination ? destinationY : newY)
      if (isOnDestination) {
        player.stopMoving()
      }
    }
    if (player.movementStatus === 'left') {
      const destinationX = player.prevX - blockSize
      const newX = player.x - blockSize / 8
      const isOnDestination = newX < destinationX

      player.updatePosition(isOnDestination ? destinationX : newX, player.y)
      if (isOnDestination) {
        player.stopMoving()
      }
    }
    if (player.movementStatus === 'right') {
      const destinationX = player.prevX + blockSize
      const newX = player.x + blockSize / 8
      const isOnDestination = newX > destinationX

      player.updatePosition(isOnDestination ? destinationX : newX, player.y)
      if (isOnDestination) {
        player.stopMoving()
      }
    }
  }

  return false
}
