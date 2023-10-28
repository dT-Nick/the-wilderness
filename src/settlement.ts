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
  isButtonUpEvent,
  isKeyCurrentlyDown,
  isKeyDownEvent,
  isKeyUpEvent,
} from './input.js'
import { getMapZeroState, updateMapZeroState } from './wilderness-maps/map-0.js'

export function drawSettlementMap() {
  const { map } = getSettlementMapState()
  drawBackgroundFromMap(map)
}

export function drawBuildings() {
  const { ctx, scale, verticalOffset } = getCanvasState()
  const { blockSize } = getGameState()
  if (!isInitialised(ctx)) return
  const { buildings, selected } = getSettlementState()
  for (let building of buildings.filter(
    (b) => b.isPlaced && selected !== b.id
  )) {
    ctx.fillStyle = building.colour
    const { x, y, width, height, faceDirection, id } = building

    drawBuilding(id, x, y, width, height, faceDirection)
  }

  const selectedBuilding = buildings.find((b) => b.id === selected)
  if (selectedBuilding) {
    ctx.fillStyle = selectedBuilding.isPlaceable
      ? selectedBuilding.colour
      : 'red'
    ctx.strokeStyle = 'white'
    const { id, x, y, width, height, faceDirection } = selectedBuilding

    drawBuilding(id, x, y, width, height, faceDirection)
  }
}

export function drawBuilding(
  id: number,
  x: number,
  y: number,
  width: number,
  height: number,
  faceDirection: 'up' | 'down' | 'left' | 'right'
) {
  const { ctx, scale, verticalOffset } = getCanvasState()
  const { blockSize } = getGameState()
  const { selected } = getSettlementState()

  const isBeingPlaced = id === selected
  if (!isInitialised(ctx)) return

  if (faceDirection === 'right') {
    ctx.fillRect(
      x * scale,
      y * scale + verticalOffset / 2,
      height * scale,
      width * scale
    )
    if (isBeingPlaced) {
      ctx.strokeRect(
        x * scale,
        y * scale + verticalOffset / 2,
        height * scale,
        width * scale
      )
    }
    ctx.fillStyle = 'saddlebrown'
    ctx.fillRect(
      (x + height - blockSize) * scale,
      (y + (width / 2 - blockSize / 2)) * scale + verticalOffset / 2,
      blockSize * scale,
      blockSize * scale
    )
  }
  if (faceDirection === 'left') {
    ctx.fillRect(
      x * scale,
      y * scale + verticalOffset / 2,
      height * scale,
      width * scale
    )
    if (isBeingPlaced) {
      ctx.strokeRect(
        x * scale,
        y * scale + verticalOffset / 2,
        height * scale,
        width * scale
      )
    }
    ctx.fillStyle = 'saddlebrown'
    ctx.fillRect(
      x * scale,
      (y + (width / 2 - blockSize / 2)) * scale + verticalOffset / 2,
      blockSize * scale,
      blockSize * scale
    )
  }
  if (faceDirection === 'up') {
    ctx.fillRect(
      x * scale,
      y * scale + verticalOffset / 2,
      width * scale,
      height * scale
    )
    if (isBeingPlaced) {
      ctx.strokeRect(
        x * scale,
        y * scale + verticalOffset / 2,
        width * scale,
        height * scale
      )
    }
    ctx.fillStyle = 'saddlebrown'
    ctx.fillRect(
      (x + (width / 2 - blockSize / 2)) * scale,
      y * scale + verticalOffset / 2,
      blockSize * scale,
      blockSize * scale
    )
  }
  if (faceDirection === 'down') {
    ctx.fillRect(
      x * scale,
      y * scale + verticalOffset / 2,
      width * scale,
      height * scale
    )
    if (isBeingPlaced) {
      ctx.strokeRect(
        x * scale,
        y * scale + verticalOffset / 2,
        width * scale,
        height * scale
      )
    }
    ctx.fillStyle = 'saddlebrown'
    ctx.fillRect(
      (x + (width / 2 - blockSize / 2)) * scale,
      (y + height - blockSize) * scale + verticalOffset / 2,
      blockSize * scale,
      blockSize * scale
    )
  }
}

export function drawBuildingSelectionPanel() {
  const { ctx, scale, width, height, verticalOffset } = getCanvasState()
  if (!isInitialised(ctx)) return

  const { blockSize } = getGameState()

  const { buildings, selectedIndex, selected, status } = getSettlementState()
  const selectableBuildings = buildings.filter((b) => !b.isPlaced)

  if (selected !== null || status !== 'building') return

  ctx.fillStyle = 'white'
  ctx.strokeStyle = 'black'
  ctx.fillRect(
    20 * scale,
    20 * scale + verticalOffset / 2,
    blockSize * scale * 7,
    height - 40 * scale - verticalOffset
  )
  ctx.strokeRect(
    20 * scale,
    20 * scale + verticalOffset / 2,
    blockSize * scale * 7,
    height - 40 * scale - verticalOffset
  )

  for (let i = 0; i < selectableBuildings.length; i++) {
    const { colour, width, height } = selectableBuildings[i]
    const x = 20 * scale + blockSize * scale
    const y = 20 * scale + blockSize * scale + i * blockSize * scale * 2

    ctx.fillStyle = colour
    ctx.fillRect(x, y + verticalOffset / 2, width * scale, height * scale)
    ctx.fillStyle = 'saddlebrown'
    ctx.fillRect(
      x + (width / 2 - blockSize / 2) * scale,
      y + (height - blockSize) * scale + verticalOffset / 2,
      blockSize * scale,
      blockSize * scale
    )

    if (i === selectedIndex) {
      ctx.strokeStyle = 'cyan'
      ctx.strokeRect(x, y + verticalOffset / 2, width * scale, height * scale)
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
  const { player, blocksHorizontal, blocksVertical, blockSize } = getGameState()
  const { buildings } = getSettlementState()
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
  const homeBuilding = buildings.find((b) => b.name === 'home')
  if (homeBuilding) {
    const {
      id,
      width,
      height,
      faceDirection,
      coordinates: { fromCoords: coordinates },
    } = homeBuilding
    let homeEntryXCoord = 0
    let homeEntryYCoord = 0
    let homeEntryFaceDirection: 'up' | 'down' | 'left' | 'right' = 'up'
    if (faceDirection === 'up') {
      homeEntryXCoord = coordinates[0] + Math.floor(width / blockSize / 2)
      homeEntryYCoord = coordinates[1] - 1
      homeEntryFaceDirection = 'down'
    }
    if (faceDirection === 'down') {
      homeEntryXCoord = coordinates[0] + Math.floor(width / blockSize / 2)
      homeEntryYCoord = coordinates[1] + height / blockSize
      homeEntryFaceDirection = 'up'
    }
    if (faceDirection === 'left') {
      homeEntryXCoord = coordinates[0] - 1
      homeEntryYCoord = coordinates[1] + Math.floor(width / blockSize / 2)
      homeEntryFaceDirection = 'right'
    }
    if (faceDirection === 'right') {
      homeEntryXCoord = coordinates[0] + height / blockSize
      homeEntryYCoord = coordinates[1] + Math.floor(width / blockSize / 2)
      homeEntryFaceDirection = 'left'
    }

    if (pCoordsX === homeEntryXCoord && pCoordsY === homeEntryYCoord) {
      if (homeEntryFaceDirection === 'up') {
        if (
          (isKeyCurrentlyDown(['w', 'arrowup']) ||
            isButtonCurrentlyDown('dpadUp')) &&
          player.faceDirection === 'up'
        ) {
          updateGameState({
            status: 'building',
            buildingId: id,
          })
          player.goToCoordinates(41, 20)
          player.stopMoving()
        }
      }
      if (homeEntryFaceDirection === 'down') {
        if (
          (isKeyCurrentlyDown(['s', 'arrowdown']) ||
            isButtonCurrentlyDown('dpadDown')) &&
          player.faceDirection === 'down'
        ) {
          updateGameState({
            status: 'building',
            buildingId: id,
          })
          player.goToCoordinates(41, 6)
          player.stopMoving()
        }
      }
      if (homeEntryFaceDirection === 'left') {
        if (
          (isKeyCurrentlyDown(['a', 'arrowleft']) ||
            isButtonCurrentlyDown('dpadLeft')) &&
          player.faceDirection === 'left'
        ) {
          updateGameState({
            status: 'building',
            buildingId: id,
          })
          player.goToCoordinates(51, 13)
          player.stopMoving()
        }
      }
      if (homeEntryFaceDirection === 'right') {
        if (
          (isKeyCurrentlyDown(['d', 'arrowright']) ||
            isButtonCurrentlyDown('dpadRight')) &&
          player.faceDirection === 'right'
        ) {
          updateGameState({
            status: 'building',
            buildingId: id,
          })
          player.goToCoordinates(31, 13)
          player.stopMoving()
        }
      }
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

  const selectableBuildings = buildings.filter((b) => !b.isPlaced)

  if (selected === null) {
    if (selectableBuildings.length > 1) {
      if (isKeyDownEvent(['s', 'arrowdown']) || isButtonDownEvent('dpadDown')) {
        updateSettlementState({
          selectedIndex:
            (selectableBuildings.length + 1) % selectableBuildings.length,
        })
      }
      if (isKeyDownEvent(['w', 'arrowup']) || isButtonDownEvent('dpadUp')) {
        updateSettlementState({
          selectedIndex:
            (selectableBuildings.length - 1) % selectableBuildings.length,
        })
      }
    }

    if (
      (isKeyDownEvent(['e', 'enter']) || isButtonDownEvent('buttonA')) &&
      selectableBuildings.length > 0
    ) {
      updateSettlementState({
        selected: selectableBuildings[selectedIndex].id,
      })
    }
  } else {
    const building = buildings.find((b) => b.id === selected)
    if (!building)
      throw new Error(`Could not find building with id: ${selected}`)
    if (!isKeyCurrentlyDown('alt') && !isButtonCurrentlyDown('buttonB')) {
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
      if (
        isKeyCurrentlyDown(['w', 'arrowup']) ||
        isButtonCurrentlyDown('dpadUp')
      ) {
        building.startMovingUp()
      }
      if (
        isKeyCurrentlyDown(['s', 'arrowdown']) ||
        isButtonCurrentlyDown('dpadDown')
      ) {
        building.startMovingDown()
      }
      if (
        isKeyCurrentlyDown(['a', 'arrowleft']) ||
        isButtonCurrentlyDown('dpadLeft')
      ) {
        building.startMovingLeft()
      }
      if (
        isKeyCurrentlyDown(['d', 'arrowright']) ||
        isButtonCurrentlyDown('dpadRight')
      ) {
        building.startMovingRight()
      }
      if (
        isKeyUpEvent([
          'w',
          'arrowup',
          's',
          'arrowdown',
          'a',
          'arrowleft',
          'd',
          'arrowright',
        ]) ||
        isButtonUpEvent(['dpadUp', 'dpadDown', 'dpadLeft', 'dpadRight'])
      ) {
        building.stopMoving()
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
    if (isKeyDownEvent(['tab', 'escape']) || isButtonDownEvent('buttonX')) {
      building.cancelPlacement()
      updateSettlementState({
        selected: null,
      })
    }
  }

  if (
    (isKeyDownEvent(['escape', 'tab', 'b']) || isButtonDownEvent('buttonX')) &&
    selected === null
  ) {
    updateSettlementState({
      status: 'exploring',
      selected: null,
    })
  }
}

export function deriveExtendedRestrictedCoordsFromRestrictedCoordsArray(
  restrictedCoords: Array<[number, number]>
) {
  let extendedRestrictedCoords: Array<[number, number]> = [...restrictedCoords]

  for (let coords of restrictedCoords) {
    const [x, y] = coords
    if (!extendedRestrictedCoords.find((c) => c[0] === x + 1 && c[1] === y)) {
      extendedRestrictedCoords.push([x + 1, y])
    }
    if (!extendedRestrictedCoords.find((c) => c[0] === x - 1 && c[1] === y)) {
      extendedRestrictedCoords.push([x - 1, y])
    }
    if (!extendedRestrictedCoords.find((c) => c[0] === x && c[1] === y + 1)) {
      extendedRestrictedCoords.push([x, y + 1])
    }
    if (!extendedRestrictedCoords.find((c) => c[0] === x && c[1] === y - 1)) {
      extendedRestrictedCoords.push([x, y - 1])
    }
  }

  return extendedRestrictedCoords
}

export function takeSettlementDamage() {
  const { buildings } = getSettlementState()

  const aliveBuildings = buildings.filter(
    (b) => b.currentHealth > 0 && b.isPlaced
  )

  if (aliveBuildings.length === 0) {
    return updateGameState({
      status: 'game-over',
    })
  }

  // min because the top of the map is Y = 0 and the left of the map is X = 0
  const highestYCoord = Math.min(
    ...aliveBuildings.map((b) => b.coordinates.fromCoords[1])
  )
  const highestXCoord = Math.min(
    ...aliveBuildings.map((b) => b.coordinates.fromCoords[0])
  )

  const upperMostBuildings = aliveBuildings.filter(
    (b) => b.coordinates.fromCoords[1] === highestYCoord
  )
  const leftMostBuilding = upperMostBuildings.find(
    (b) => b.coordinates.fromCoords[0] === highestXCoord
  )
  if (!leftMostBuilding) throw new Error('Could not find left most building')

  leftMostBuilding.takeDamage(1)
}
