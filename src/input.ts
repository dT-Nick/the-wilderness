import { handleEnemyInteraction } from './enemy.js'
import { calculateDamage } from './helpers/functions.js'
import { activateConsumable, handleItemPickup } from './item.js'
import { loadGame } from './save.js'
import {
  constants,
  getBattleState,
  getCanvasState,
  getGameState,
  getInputState,
  getPrevInputState,
  getSettlementState,
  getStartMenuState,
  getWildernessState,
  isInitialised,
  isPlayerInitialised,
  updateBattleState,
  updateGameState,
  updateMessageState,
  updateStartMenuState,
} from './state.js'
import { handleMapZeroInput } from './wilderness-maps/map-0.js'
import { handleMapMinusOneMinusOneInput } from './wilderness-maps/map-[-1,-1].js'
import { handleMapMinusOneZeroInput } from './wilderness-maps/map-[-1,0].js'
import { handleMapMinusOneOneInput } from './wilderness-maps/map-[-1,1].js'
import { handleMapMinusTwoMinusOneInput } from './wilderness-maps/map-[-2,-1].js'
import { handleMapMinusTwoZeroInput } from './wilderness-maps/map-[-2,0].js'
import { handleMapMinusThreeMinusOneInput } from './wilderness-maps/map-[-3,-1].js'
import { handleMapMinusThreeZeroInput } from './wilderness-maps/map-[-3,0].js'
import { handleMapZeroOneInput } from './wilderness-maps/map-[0,1].js'
import { handleMapZeroTwoInput } from './wilderness-maps/map-[0,2].js'
import { handleMapZeroThreeInput } from './wilderness-maps/map-[0,3].js'
import { handleMapOneZeroInput } from './wilderness-maps/map-[1,0].js'
import { handleMapOneOneInput } from './wilderness-maps/map-[1,1].js'
import { getSettlementMapState } from './wilderness-maps/settlement.js'

export function handleStartMenuInput() {
  const { width, height } = getCanvasState()
  const { mouseX, mouseY } = getInputState()
  const { startMenuButtonSize } = constants
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

export function handleWildernessInput() {
  const { mapId } = getWildernessState()

  switch (mapId) {
    case 0: {
      handleMapZeroInput()
      break
    }
    case '[-1,0]': {
      handleMapMinusOneZeroInput()
      break
    }
    case '[-2,0]': {
      handleMapMinusTwoZeroInput()
      break
    }
    case '[-3,0]': {
      handleMapMinusThreeZeroInput()
      break
    }
    case '[0,1]': {
      handleMapZeroOneInput()
      break
    }
    case '[0,2]': {
      handleMapZeroTwoInput()
      break
    }
    case '[0,3]': {
      handleMapZeroThreeInput()
      break
    }
    case '[1,0]': {
      handleMapOneZeroInput()
      break
    }
    case '[1,1]': {
      handleMapOneOneInput()
      break
    }
    case '[-1,1]': {
      handleMapMinusOneOneInput()
      break
    }
    case '[-1,-1]': {
      handleMapMinusOneMinusOneInput()
      break
    }
    case '[-2,-1]': {
      handleMapMinusTwoMinusOneInput()
      break
    }
    case '[-3,-1]': {
      handleMapMinusThreeMinusOneInput()
      break
    }
    default: {
      throw new Error(`Unknown mapId: ${mapId}`)
    }
  }

  handleSettingsTriggerInputs()
  handleItemPickup()
  handleEnemyInteraction()
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

  if (isPlayerInitialised(player)) {
    const enemy = enemies.find((enemy) => enemy.id === enemyId)
    if (!enemy) throw new Error(`No enemy found with id: ${enemyId}`)

    const isWaitingForPlayerInput =
      lastMove !== 'player' &&
      status !== 'wait' &&
      player.currentDamage === null &&
      !player.currentHeal &&
      !player.currentExperienceGain

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
          selectedItem:
            selectedItem === 1 ? inventory.length : selectedItem - 1,
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
          selectedItem:
            selectedItem === inventory.length ? 1 : selectedItem + 1,
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
          enemy.takeHit(10)
        }
        if (selectedMove === 2) {
          enemy.takeHit(5 + Math.round(Math.random() * 10))
        }
        if (selectedMove === 3) {
          enemy.takeHit(2 + Math.round(Math.random() * 20))
        }
        if (selectedMove === 4) {
          enemy.takeHit(0 + Math.round(Math.random() * 30))
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
