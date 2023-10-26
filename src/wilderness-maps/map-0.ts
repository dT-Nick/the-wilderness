import { handleEnemyInteraction } from '../enemy.js'
import { isKeyCurrentlyDown } from '../input.js'
import { handleItemPickup } from '../item.js'
import { handlePlayerMovement } from '../player.js'
import {
  getDeltaFrames,
  getGameState,
  getInputState,
  isPlayerInitialised,
  updateGameState,
} from '../state.js'
import {
  MapState,
  deriveRestrictedCoordsFromMap,
  drawBackgroundFromMap,
} from '../wilderness.js'

export function generateMapZeroState(): MapState {
  const { blocksVertical, blocksHorizontal } = getGameState()

  return {
    map: [
      {
        type: 'forest',
        fromCoords: [19, 10],
        toCoords: [27, 16],
      },
      {
        type: 'water',
        fromCoords: [28, 17],
        toCoords: [36, 23],
      },
      {
        type: 'forest',
        fromCoords: [46, 1],
        toCoords: [54, 7],
      },
      {
        type: 'water',
        fromCoords: [55, 8],
        toCoords: [63, 14],
      },
      {
        type: 'forest',
        fromCoords: [73, 22],
        toCoords: [81, 27],
      },
      {
        type: 'forest',
        fromCoords: [Math.floor(blocksHorizontal / 2), blocksVertical - 1],
        toCoords: [Math.floor(blocksHorizontal / 2) + 1, blocksVertical],
      },
    ],
  }
}

const mapZeroState: MapState = {
  map: [],
}

export function updateMapZeroState(
  changes:
    | Partial<typeof mapZeroState>
    | ((state: typeof mapZeroState) => Partial<typeof mapZeroState>)
) {
  if (typeof changes === 'function') {
    Object.assign(mapZeroState, changes(mapZeroState))
  } else {
    Object.assign(mapZeroState, changes)
  }
}

export function drawMapZero() {
  const { map } = mapZeroState
  drawBackgroundFromMap(map)
}

export function handleMapZeroInput() {
  const { map } = mapZeroState
  const restrictedCoords = deriveRestrictedCoordsFromMap(map)

  handlePlayerMovement(restrictedCoords)
  handleMapZeroExit()
}

export function handleMapZeroExit() {
  const { player, blocksHorizontal, blocksVertical } = getGameState()
  if (!isPlayerInitialised(player)) return

  const [pCoordsX, pCoordsY] = player.coordinates
  if (
    pCoordsX === Math.floor(blocksHorizontal / 2) &&
    pCoordsY === blocksVertical - 1
  ) {
    if (
      isKeyCurrentlyDown(['s', 'arrowdown']) &&
      player.faceDirection === 'down'
    ) {
      updateGameState({
        status: 'settlement',
      })
      player.goToCoordinates(Math.floor(blocksHorizontal / 2), 0)
      player.stopMoving()
    }
  }
}
