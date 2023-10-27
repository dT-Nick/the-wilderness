import { handlePlayerMovement } from './player.js'
import {
  deriveRestrictedCoordsFromMap,
  drawBackgroundFromMap,
} from './wilderness.js'
import { getSettlementMapState } from './wilderness-maps/settlement.js'
import {
  getCanvasState,
  getGameState,
  getSettlementState,
  isInitialised,
  isPlayerInitialised,
  updateGameState,
  updateSettlementState,
} from './state.js'
import {
  handleSettingsTriggerInputs,
  isButtonCurrentlyDown,
  isButtonDownEvent,
  isKeyCurrentlyDown,
  isKeyDownEvent,
} from './input.js'
import { getMapZeroState, updateMapZeroState } from './wilderness-maps/map-0.js'

export function drawSettlementMap() {
  const { map } = getSettlementMapState()
  drawBackgroundFromMap(map)
}

export function drawBuildings() {
  const { ctx, scale, verticalOffset } = getCanvasState()
  if (!isInitialised(ctx)) return
  const { buildings, selected } = getSettlementState()
  for (let building of buildings.filter(
    (b) => b.isPlaced && selected !== b.id
  )) {
    ctx.fillStyle = building.colour
    const { x, y, width, height, faceDirection } = building

    if (faceDirection === 'right') {
      ctx.fillRect(
        x * scale,
        y * scale + verticalOffset / 2,
        height * scale,
        width * scale
      )
      continue
    }
    if (faceDirection === 'left') {
      ctx.fillRect(
        x * scale + width * scale,
        y * scale + verticalOffset / 2,
        height * scale,
        width * scale
      )
      continue
    }
    if (faceDirection === 'up') {
      ctx.fillRect(
        x * scale,
        y * scale + verticalOffset / 2 + height * scale,
        width * scale,
        height * scale
      )
      continue
    }
    if (faceDirection === 'down') {
      ctx.fillRect(
        x * scale,
        y * scale + verticalOffset / 2,
        width * scale,
        height * scale
      )
      continue
    }
  }

  const selectedBuilding = buildings.find((b) => b.id === selected)
  if (selectedBuilding) {
    ctx.fillStyle = selectedBuilding.isPlaceable
      ? selectedBuilding.colour
      : 'red'
    const { x, y, width, height, faceDirection } = selectedBuilding

    if (faceDirection === 'right') {
      ctx.fillRect(
        x * scale,
        y * scale + verticalOffset / 2,
        height * scale,
        width * scale
      )
    }
    if (faceDirection === 'left') {
      ctx.fillRect(
        x * scale,
        y * scale + verticalOffset / 2,
        height * scale,
        width * scale
      )
    }
    if (faceDirection === 'up') {
      ctx.fillRect(
        x * scale,
        y * scale + verticalOffset / 2,
        width * scale,
        height * scale
      )
    }
    if (faceDirection === 'down') {
      ctx.fillRect(
        x * scale,
        y * scale + verticalOffset / 2,
        width * scale,
        height * scale
      )
    }
  }
}

export function handleSettlementInput() {
  const { map } = getSettlementMapState()
  const { status } = getSettlementState()
  const restrictedCoords = deriveRestrictedCoordsFromMap(map)

  if (status === 'exploring') {
    handlePlayerMovement(restrictedCoords)
    handleExploringInput()
  }
  if (status === 'building') {
    handleBuildingInput()
  }
  handleSettingsTriggerInputs()
  handleSettlementExit()
}

export function handleSettlementExit() {
  const { player, blocksHorizontal, blocksVertical } = getGameState()
  if (!isPlayerInitialised(player)) return

  const [pCoordsX, pCoordsY] = player.coordinates
  if (pCoordsX === Math.floor(blocksHorizontal / 2) && pCoordsY === 0) {
    if (
      (isKeyCurrentlyDown(['w', 'arrowup']) ||
        isButtonCurrentlyDown('dpadUp')) &&
      player.faceDirection === 'up'
    ) {
      updateGameState({
        status: 'wilderness',
      })
      const { discovered } = getMapZeroState()
      if (!discovered) {
        updateMapZeroState({
          discovered: true,
        })
      }
      player.goToCoordinates(
        Math.floor(blocksHorizontal / 2),
        blocksVertical - 1
      )
      player.stopMoving()
    }
  }
}

function handleExploringInput() {
  if (isKeyDownEvent(['b']) || isButtonDownEvent('buttonX')) {
    updateSettlementState({
      status: 'building',
    })
  }
}

function handleBuildingInput() {
  const { buildings, selected, selectedIndex } = getSettlementState()

  if (selected === null) {
    if (buildings.length > 1) {
      if (isKeyDownEvent(['s', 'arrowdown']) || isButtonDownEvent('dpadDown')) {
        updateSettlementState({
          selectedIndex: (buildings.length + 1) % buildings.length,
        })
      }
      if (isKeyDownEvent(['w', 'arrowup']) || isButtonDownEvent('dpadUp')) {
        updateSettlementState({
          selectedIndex: (buildings.length - 1) % buildings.length,
        })
      }
    }

    if (isKeyDownEvent(['e', 'enter']) || isButtonDownEvent('buttonA')) {
      updateSettlementState({
        selected: buildings[selectedIndex].id,
      })
    }
  } else {
    const building = buildings.find((b) => b.id === selected)
    if (!building)
      throw new Error(`Could not find building with id: ${selected}`)
    if (!isKeyCurrentlyDown('alt')) {
      if (isKeyDownEvent(['w', 'arrowup']) || isButtonDownEvent('dpadUp')) {
        building.moveUp()
      }
      if (isKeyDownEvent(['s', 'arrowdown']) || isButtonDownEvent('dpadDown')) {
        building.moveDown()
      }
      if (isKeyDownEvent(['a', 'arrowleft']) || isButtonDownEvent('dpadLeft')) {
        building.moveLeft()
      }
      if (
        isKeyDownEvent(['d', 'arrowright']) ||
        isButtonDownEvent('dpadRight')
      ) {
        building.moveRight()
      }
    }

    if (
      isKeyDownEvent(['z']) ||
      (isKeyCurrentlyDown('alt') && isKeyDownEvent(['arrowleft', 'a'])) ||
      (isButtonCurrentlyDown('buttonB') && isButtonDownEvent('dpadLeft'))
    ) {
      building.rotateLeft()
    }
    if (
      isKeyDownEvent(['c']) ||
      (isKeyCurrentlyDown('alt') && isKeyDownEvent(['arrowright', 'd'])) ||
      (isButtonCurrentlyDown('buttonB') && isButtonDownEvent('dpadRight'))
    ) {
      building.rotateRight()
    }

    if (isKeyDownEvent(['e', 'enter']) || isButtonDownEvent('buttonA')) {
      if (building.isPlaceable) {
        building.place()
        updateSettlementState({
          selected: null,
        })
      }
    }
    if (isKeyDownEvent(['tab', 'escape']) || isButtonDownEvent('buttonB')) {
      building.cancelPlacement()
      updateSettlementState({
        selected: null,
      })
    }
  }

  if (isKeyDownEvent(['b']) || isButtonDownEvent('buttonX')) {
    updateSettlementState({
      status: 'exploring',
      selected: null,
    })
  }
}
