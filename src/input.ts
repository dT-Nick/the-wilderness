import { stopGameLoop } from './index.js'
import {
  battleState,
  gameState,
  updateBattleState,
  updateState,
} from './state.js'

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
    deltaTime,
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
    const deltaFrames = state.deltaTime / (1000 / 60)

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
    const lastMovementKey =
      lastMovementKeyIndex >= 0 ? keysDown[lastMovementKeyIndex] : null
    if (
      player.movementStatus === 'idle' ||
      player.movementStatus === 'stable'
    ) {
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
      const newY = player.y - (blockSize / 16) * deltaFrames
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
      const newY = player.y + (blockSize / 16) * deltaFrames
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
      const newX = player.x - (blockSize / 16) * deltaFrames
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
      const newX = player.x + (blockSize / 16) * deltaFrames
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

  return false
}

export function handleBattleInput() {
  const { state } = gameState
  const { state: bState } = battleState
  const { keysDown, prevKeysDown } = state

  if (
    (!prevKeysDown.includes('arrowup') && keysDown.includes('arrowup')) ||
    (!prevKeysDown.includes('w') && keysDown.includes('w'))
  ) {
    if (bState.selectedMove !== 1 && bState.selectedMove !== 2) {
      updateBattleState({
        selectedMove: bState.selectedMove === 3 ? 1 : 2,
      })
    }
  }
  if (
    (!prevKeysDown.includes('arrowdown') && keysDown.includes('arrowdown')) ||
    (!prevKeysDown.includes('s') && keysDown.includes('s'))
  ) {
    if (bState.selectedMove !== 3 && bState.selectedMove !== 4) {
      updateBattleState({
        selectedMove: bState.selectedMove === 1 ? 3 : 4,
      })
    }
  }
  if (
    (!prevKeysDown.includes('arrowleft') && keysDown.includes('arrowleft')) ||
    (!prevKeysDown.includes('a') && keysDown.includes('a'))
  ) {
    if (bState.selectedMove !== 1 && bState.selectedMove !== 3) {
      updateBattleState({
        selectedMove: bState.selectedMove === 2 ? 1 : 3,
      })
    }
  }
  if (
    (!prevKeysDown.includes('arrowright') && keysDown.includes('arrowright')) ||
    (!prevKeysDown.includes('d') && keysDown.includes('d'))
  ) {
    if (bState.selectedMove !== 2 && bState.selectedMove !== 4) {
      updateBattleState({
        selectedMove: bState.selectedMove === 1 ? 2 : 4,
      })
    }
  }
}
