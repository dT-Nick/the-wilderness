import { stopGameLoop } from './index.js'
import { gameState, updateState } from './state.js'

export function handleInput() {
  const { state } = gameState

  if (state.mouseDown && !state.prevMouseDown) {
    if (state.mouseX > state.width - 55 && state.mouseX < state.width - 5) {
      if (
        state.mouseY > 5 + state.verticalOffset / 2 &&
        state.mouseY < 55 + state.verticalOffset / 2
      ) {
        return true
      }
    }

    updateState({
      prevMouseDown: true,
    })
  }

  if (!state.mouseDown && state.prevMouseDown) {
    updateState({
      prevMouseDown: false,
    })
  }

  if (state.status === 'active') {
    if (state.player.movementStatus === 'idle') {
      const lastMovementKeyIndex = Math.max(
        state.keysDown.indexOf('arrowup'),
        state.keysDown.indexOf('arrowdown'),
        state.keysDown.indexOf('arrowleft'),
        state.keysDown.indexOf('arrowright'),
        state.keysDown.indexOf('w'),
        state.keysDown.indexOf('s'),
        state.keysDown.indexOf('a'),
        state.keysDown.indexOf('d')
      )
      const lastMovementKey = state.keysDown[lastMovementKeyIndex]

      switch (lastMovementKey) {
        case 'arrowup':
        case 'w':
          state.player.moveUp()
          break
        case 'arrowdown':
        case 's':
          state.player.moveDown()
          break
        case 'arrowleft':
        case 'a':
          state.player.moveLeft()
          break
        case 'arrowright':
        case 'd':
          state.player.moveRight()
          break
        default:
          break
      }
    }

    if (state.player.movementStatus === 'up') {
      const destinationY = state.player.prevY - state.blockSize
      const newY = state.player.y - state.blockSize / 8
      const isOnDestination = newY < destinationY

      state.player.updatePosition(
        state.player.x,
        isOnDestination ? destinationY : newY
      )
      if (isOnDestination) {
        state.player.stopMoving()
      }
    }
    if (state.player.movementStatus === 'down') {
      const destinationY = state.player.prevY + state.blockSize
      const newY = state.player.y + state.blockSize / 8
      const isOnDestination = newY > destinationY

      state.player.updatePosition(
        state.player.x,
        isOnDestination ? destinationY : newY
      )
      if (isOnDestination) {
        state.player.stopMoving()
      }
    }
    if (state.player.movementStatus === 'left') {
      const destinationX = state.player.prevX - state.blockSize
      const newX = state.player.x - state.blockSize / 8
      const isOnDestination = newX < destinationX

      state.player.updatePosition(
        isOnDestination ? destinationX : newX,
        state.player.y
      )
      if (isOnDestination) {
        state.player.stopMoving()
      }
    }
    if (state.player.movementStatus === 'right') {
      const destinationX = state.player.prevX + state.blockSize
      const newX = state.player.x + state.blockSize / 8
      const isOnDestination = newX > destinationX

      state.player.updatePosition(
        isOnDestination ? destinationX : newX,
        state.player.y
      )
      if (isOnDestination) {
        state.player.stopMoving()
      }
    }
  }

  return false
}
