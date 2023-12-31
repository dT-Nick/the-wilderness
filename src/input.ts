import { activateConsumable, getItemViaId, isConsumable } from './item.js'
import { loadGame } from './save.js'
import {
  constants,
  getBattleState,
  getGameState,
  getInputState,
  getPrevInputState,
  getSettlementState,
  getStartMenuState,
  isPlayerInitialised,
  updateBattleState,
  updateGameState,
  updateStartMenuState,
} from './state.js'

export function handleStartMenuInput() {
  const { selectedButton } = getStartMenuState()

  if (isKeyDownEvent(['e', 'enter']) || isButtonDownEvent('buttonA')) {
    if (selectedButton === 1) {
      const loaded = loadGame()
      if (!loaded) return
    } else {
      updateGameState({
        status: constants.startingScene,
      })
    }
    // document.documentElement.requestFullscreen()
  }

  if (isKeyDownEvent(['d', 'arrowRight']) || isButtonDownEvent('dpadRight')) {
    updateStartMenuState((c) => ({
      selectedButton: c.selectedButton === 0 ? 1 : 0,
    }))
  }
  if (isKeyDownEvent(['a', 'arrowLeft']) || isButtonDownEvent('dpadLeft')) {
    updateStartMenuState((c) => ({
      selectedButton: c.selectedButton === 0 ? 1 : 0,
    }))
  }
}

export function handleBattleInput() {
  const { enemies, player, inventory } = getGameState()

  const {
    status,
    enemyId,
    selectedMove,
    selectedOption,
    selectedItem,
    lastMove,
    playerMenu,
  } = getBattleState()

  const items = inventory
    .map((item) => getItemViaId(item.itemId))
    .filter((item) => isConsumable(item))

  if (isPlayerInitialised(player)) {
    const enemy = enemies.find((enemy) => enemy.id === enemyId)
    if (!enemy) throw new Error(`No enemy found with id: ${enemyId}`)

    const isWaitingForPlayerInput =
      lastMove !== 'player' &&
      status !== 'wait' &&
      player.currentDamage === null &&
      !player.currentHeal &&
      enemy.currentHealth > 0 &&
      enemy.currentDamage === null

    if (isKeyDownEvent(['escape', 'tab']) || isButtonDownEvent('buttonB')) {
      if (playerMenu === 'items') {
        updateBattleState({
          playerMenu: 'main',
        })
      }
      if (playerMenu === 'moves') {
        updateBattleState({
          playerMenu: 'main',
        })
      }
    }

    if (
      (isKeyDownEvent(['arrowup', 'w']) || isButtonDownEvent('dpadUp')) &&
      isWaitingForPlayerInput
    ) {
      if (playerMenu === 'moves' && selectedMove !== 1 && selectedMove !== 2) {
        updateBattleState({
          selectedMove: selectedMove === 3 ? 1 : 2,
        })
      }
      if (playerMenu === 'items' && isWaitingForPlayerInput) {
        updateBattleState({
          selectedItem: selectedItem === 1 ? items.length : selectedItem - 1,
        })
      }
    }
    if (
      (isKeyDownEvent(['arrowdown', 's']) || isButtonDownEvent('dpadDown')) &&
      isWaitingForPlayerInput
    ) {
      if (playerMenu === 'moves' && selectedMove !== 3 && selectedMove !== 4) {
        updateBattleState({
          selectedMove: selectedMove === 1 ? 3 : 4,
        })
      }
      if (playerMenu === 'items' && isWaitingForPlayerInput) {
        updateBattleState({
          selectedItem: selectedItem === items.length ? 1 : selectedItem + 1,
        })
      }
    }
    if (
      (isKeyDownEvent(['arrowleft', 'a']) || isButtonDownEvent('dpadLeft')) &&
      isWaitingForPlayerInput
    ) {
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
    if (
      (isKeyDownEvent(['arrowright', 'd']) || isButtonDownEvent('dpadRight')) &&
      isWaitingForPlayerInput
    ) {
      if (playerMenu === 'main') {
        updateBattleState({
          selectedOption: selectedOption === 1 ? 2 : 1,
        })
      }
      if (playerMenu === 'moves' && selectedMove !== 2 && selectedMove !== 4) {
        updateBattleState({
          selectedMove: selectedMove === 1 ? 2 : 4,
        })
      }
    }

    if (
      (isKeyDownEvent(['enter', 'e']) || isButtonDownEvent('buttonA')) &&
      isWaitingForPlayerInput
    ) {
      if (playerMenu === 'main') {
        if (selectedOption === 1) {
          updateBattleState({
            playerMenu: 'moves',
          })
        }
        if (selectedOption === 2) {
          updateBattleState({
            playerMenu: 'items',
          })
        }
      }
      if (playerMenu === 'moves') {
        if (selectedMove === 1) {
          enemy.takeHit(10, 'melee')
        }
        if (selectedMove === 2) {
          enemy.takeHit(5 + Math.round(Math.random() * 7), 'magic')
        }
        if (selectedMove === 3) {
          enemy.takeHit(3 + Math.round(Math.random() * 15), 'ranged')
        }
        if (selectedMove === 4) {
          enemy.takeHit(2 + Math.round(Math.random() * 20), 'magic')
        }
      }
      if (playerMenu === 'items') {
        if (inventory.length > 0) {
          const item = inventory[selectedItem - 1]
          if (!item)
            throw new Error(`No item found at index: ${selectedItem - 1}`)
          activateConsumable(item.itemId, item.id)
        }
      }
    }
  }
}

export function handleSettingsTriggerInputs() {
  const { status: settlementStatus } = getSettlementState()
  const { status } = getGameState()

  if (isKeyDownEvent(['m'])) {
    updateGameState((c) => ({
      status: 'world-map',
      prevStatus: c.status,
    }))
  }

  if (
    (status === 'settlement' &&
      isKeyDownEvent(['escape', 'tab']) &&
      settlementStatus === 'exploring') ||
    (status !== 'settlement' && isKeyDownEvent(['escape', 'tab'])) ||
    isButtonDownEvent('start')
  ) {
    updateGameState((c) => ({
      status: 'settings',
      prevStatus: c.status,
    }))
  }

  if (isKeyDownEvent(['i'])) {
    updateGameState((c) => ({
      status: 'inventory',
      prevStatus: c.status,
    }))
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

export function isButtonCurrentlyDown(buttonType: string | Array<string>) {
  const { touches } = getInputState()

  if (Array.isArray(buttonType)) {
    return buttonType.some((b) => touches.some((t) => t.type === b))
  }

  return touches.some((t) => t.type === buttonType)
}

export function isButtonDownEvent(buttonType: string | Array<string>) {
  const { touches } = getInputState()
  const { touches: prevTouches } = getPrevInputState()

  if (Array.isArray(buttonType)) {
    return buttonType.some(
      (b) =>
        touches.some((t) => t.type === b) &&
        !prevTouches.some((t) => t.type === b)
    )
  }

  return (
    touches.some((t) => t.type === buttonType) &&
    !prevTouches.some((t) => t.type === buttonType)
  )
}

export function isButtonUpEvent(buttonType: string | Array<string>) {
  const { touches } = getInputState()
  const { touches: prevTouches } = getPrevInputState()

  if (Array.isArray(buttonType)) {
    return buttonType.some(
      (b) =>
        !touches.some((t) => t.type === b) &&
        prevTouches.some((t) => t.type === b)
    )
  }

  return (
    !touches.some((t) => t.type === buttonType) &&
    prevTouches.some((t) => t.type === buttonType)
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
