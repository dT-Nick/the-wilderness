import {
  constants,
  getBattleState,
  getCanvasState,
  getGameState,
  getInputState,
  getPrevInputState,
  getWildernessState,
  isInitialised,
  updateBattleState,
  updateGameState,
} from './state.js'
import { handleMapZeroInput } from './wilderness-maps/map-0.js'

export function handleStartMenuInput() {
  const { width, height } = getCanvasState()
  const { mouseX, mouseY } = getInputState()
  const { startMenuButtonSize } = constants
  const mouseDownEvent = isMouseDownEvent()

  if (mouseDownEvent) {
    if (
      mouseX > width / 2 - startMenuButtonSize / 2 &&
      mouseX < width / 2 + startMenuButtonSize / 2 &&
      mouseY > height / 2 - startMenuButtonSize / 2 &&
      mouseY < height / 2 + startMenuButtonSize / 2
    ) {
      updateGameState({
        status: 'wilderness',
      })
    }
  }
}

export function handleWildernessInput() {
  const { mapId } = getWildernessState()

  switch (mapId) {
    case 0: {
      handleMapZeroInput()
      break
    }
    default: {
      throw new Error(`Unknown mapId: ${mapId}`)
    }
  }
}

export function handleBattleInput() {
  const { ctx } = getCanvasState()
  const { enemies, player } = getGameState()
  const {
    status,
    enemyId,
    selectedMove,
    selectedOption,
    lastMove,
    playerMenu,
  } = getBattleState()

  if (isInitialised(ctx)) {
    const enemy = enemies.find((enemy) => enemy.id === enemyId)
    if (!enemy) throw new Error(`No enemy found with id: ${enemyId}`)

    const isWaitingForPlayerInput = lastMove !== 'player' && status !== 'wait'

    if (isKeyDownEvent(['arrowup', 'w']) && isWaitingForPlayerInput) {
      if (playerMenu === 'moves' && selectedMove !== 1 && selectedMove !== 2) {
        updateBattleState({
          selectedMove: selectedMove === 3 ? 1 : 2,
        })
      }
    }
    if (isKeyDownEvent(['arrowdown', 's']) && isWaitingForPlayerInput) {
      if (playerMenu === 'moves' && selectedMove !== 3 && selectedMove !== 4) {
        updateBattleState({
          selectedMove: selectedMove === 1 ? 3 : 4,
        })
      }
    }
    if (isKeyDownEvent(['arrowleft', 'a']) && isWaitingForPlayerInput) {
      if (playerMenu === 'main') {
        updateBattleState({
          selectedOption: selectedOption === 1 ? 2 : 1,
        })
      }
      if (playerMenu === 'moves' && selectedMove !== 1 && selectedMove !== 3) {
        updateBattleState({
          selectedMove: selectedMove === 2 ? 1 : 3,
        })
      }
    }
    if (isKeyDownEvent(['arrowright', 'd']) && isWaitingForPlayerInput) {
      if (playerMenu === 'main') {
        updateBattleState({
          selectedOption: selectedOption === 1 ? 2 : 1,
        })
      }
      if (selectedMove !== 2 && selectedMove !== 4) {
        updateBattleState({
          selectedMove: selectedMove === 1 ? 2 : 4,
        })
      }
    }

    if (isKeyDownEvent('enter') && isWaitingForPlayerInput) {
      if (playerMenu === 'main') {
        if (selectedOption === 1) {
          updateBattleState({
            playerMenu: 'moves',
          })
        }
        if (selectedOption === 2) {
          // TODO: Items...
        }
      }
      if (playerMenu === 'moves') {
        if (selectedMove === 1) {
          enemy.takeHit(10)
        }
        if (selectedMove === 2) {
          enemy.takeHit(20)
        }
        if (selectedMove === 3) {
          enemy.takeHit(30)
        }
        if (selectedMove === 4) {
          enemy.takeHit(40)
        }
      }
    }
  }
}

export function isKeyCurrentlyDown(key: string | Array<string>) {
  const { keysDown } = getInputState()

  if (Array.isArray(key)) {
    return key.some((k) => keysDown.some((kD) => kD.key === k))
  }

  return keysDown.some((kD) => kD.key === key)
}

export function isKeyDownEvent(key: string | Array<string>) {
  const { keysDown } = getInputState()
  const { keysDown: prevKeysDown } = getPrevInputState()

  if (Array.isArray(key)) {
    return key.some(
      (k) =>
        keysDown.some((kD) => kD.key === k) &&
        !prevKeysDown.some((kD) => kD.key === k)
    )
  }

  return (
    keysDown.some((kD) => kD.key === key) &&
    !prevKeysDown.some((kD) => kD.key === key)
  )
}

export function isKeyUpEvent(key: string | Array<string>) {
  const { keysDown } = getInputState()
  const { keysDown: prevKeysDown } = getPrevInputState()

  if (Array.isArray(key)) {
    return key.some(
      (k) =>
        !keysDown.some((kD) => kD.key === k) &&
        prevKeysDown.some((kD) => kD.key === k)
    )
  }

  return (
    !keysDown.some((kD) => kD.key === key) &&
    prevKeysDown.some((kD) => kD.key === key)
  )
}

export function isMouseUpEvent() {
  const { mouse } = getInputState()
  const { mouse: prevMouse } = getPrevInputState()

  return !mouse.isDown && prevMouse.isDown
}

export function isMouseDownEvent() {
  const { mouse } = getInputState()
  const { mouse: prevMouse } = getPrevInputState()

  return mouse.isDown && !prevMouse.isDown
}

export function isHoveringOn(
  startX: number,
  startY: number,
  width: number,
  height: number
) {
  const { mouseX, mouseY } = getInputState()

  return (
    mouseX >= startX &&
    mouseX <= startX + width &&
    mouseY >= startY &&
    mouseY <= startY + height
  )
}
