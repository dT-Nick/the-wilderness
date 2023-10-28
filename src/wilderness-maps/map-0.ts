import { handleEnemyInteraction } from '../enemy.js'
import { isButtonCurrentlyDown, isKeyCurrentlyDown } from '../input.js'
import { handleItemPickup } from '../item.js'
import { handlePlayerMovement } from '../player.js'
import {
  addNotification,
  getDeltaFrames,
  getGameState,
  getInputState,
  isPlayerInitialised,
  updateGameState,
  updateMessageState,
  updateWildernessState,
} from '../state.js'
import {
  MapState,
  deriveRestrictedCoordsFromMap,
  drawBackgroundFromMap,
} from '../wilderness.js'
import {
  getMapMinusOneZeroState,
  updateMapMinusOneZeroState,
} from './map-[-1,0].js'
import { getMapZeroOneState, updateMapZeroOneState } from './map-[0,1].js'
import { getMapOneZeroState, updateMapOneZeroState } from './map-[1,0].js'

export function generateMapZeroState(): MapState {
  const { blocksVertical, blocksHorizontal } = getGameState()

  return {
    map: [
      { type: 'mountain', fromCoords: [0, 26], toCoords: [14, 27] },
      { type: 'mountain', fromCoords: [0, 24], toCoords: [13, 26] },
      { type: 'mountain', fromCoords: [0, 21], toCoords: [12, 24] },
      { type: 'mountain', fromCoords: [0, 19], toCoords: [11, 21] },
      { type: 'mountain', fromCoords: [0, 18], toCoords: [10, 19] },
      { type: 'mountain', fromCoords: [0, 17], toCoords: [8, 18] },
      { type: 'mountain', fromCoords: [0, 16], toCoords: [5, 17] },
      { type: 'mountain', fromCoords: [0, 15], toCoords: [2, 16] },
      { type: 'forest', fromCoords: [59, 2], toCoords: [63, 4] },
      { type: 'forest', fromCoords: [63, 2], toCoords: [65, 6] },
      { type: 'forest', fromCoords: [61, 1], toCoords: [65, 2] },
      { type: 'forest', fromCoords: [63, 0], toCoords: [65, 1] },
      { type: 'forest', fromCoords: [65, 0], toCoords: [66, 3] },
      { type: 'forest', fromCoords: [66, 0], toCoords: [67, 2] },
      { type: 'forest', fromCoords: [67, 0], toCoords: [68, 1] },
      { type: 'forest', fromCoords: [60, 10], toCoords: [62, 11] },
      { type: 'forest', fromCoords: [35, 12], toCoords: [46, 15] },
      { type: 'forest', fromCoords: [42, 11], toCoords: [46, 12] },
      { type: 'forest', fromCoords: [34, 15], toCoords: [40, 16] },
      { type: 'forest', fromCoords: [36, 16], toCoords: [38, 17] },
      { type: 'forest', fromCoords: [34, 12], toCoords: [35, 15] },
      { type: 'forest', fromCoords: [33, 12], toCoords: [34, 14] },
      { type: 'forest', fromCoords: [35, 11], toCoords: [38, 12] },
      { type: 'forest', fromCoords: [44, 15], toCoords: [47, 16] },
      { type: 'forest', fromCoords: [46, 13], toCoords: [47, 15] },
      { type: 'wall', fromCoords: [40, 26], toCoords: [41, 27] },
      { type: 'wall', fromCoords: [42, 26], toCoords: [43, 27] },
      { type: 'hill', fromCoords: [14, 26], toCoords: [40, 27] },
      { type: 'hill', fromCoords: [43, 26], toCoords: [83, 27] },
      { type: 'hill', fromCoords: [80, 23], toCoords: [83, 24] },
      { type: 'hill', fromCoords: [72, 25], toCoords: [83, 26] },
      { type: 'hill', fromCoords: [76, 24], toCoords: [83, 25] },
      { type: 'wall', fromCoords: [39, 25], toCoords: [41, 26] },
      { type: 'wall', fromCoords: [42, 25], toCoords: [44, 26] },
      { type: 'forest', fromCoords: [41, 25], toCoords: [42, 27] },
      { type: 'forest', fromCoords: [11, 5], toCoords: [18, 11] },
      { type: 'forest', fromCoords: [13, 4], toCoords: [17, 5] },
      { type: 'forest', fromCoords: [18, 6], toCoords: [19, 8] },
      { type: 'forest', fromCoords: [10, 7], toCoords: [11, 10] },
      { type: 'forest', fromCoords: [14, 11], toCoords: [17, 12] },
      { type: 'forest', fromCoords: [9, 8], toCoords: [10, 9] },
      { type: 'forest', fromCoords: [15, 12], toCoords: [16, 13] },
      { type: 'forest', fromCoords: [38, 11], toCoords: [42, 12] },
      { type: 'forest', fromCoords: [37, 10], toCoords: [45, 11] },
      { type: 'forest', fromCoords: [39, 9], toCoords: [43, 10] },
      { type: 'forest', fromCoords: [59, 4], toCoords: [63, 9] },
      { type: 'forest', fromCoords: [58, 5], toCoords: [59, 9] },
      { type: 'forest', fromCoords: [59, 9], toCoords: [63, 10] },
      { type: 'forest', fromCoords: [63, 6], toCoords: [64, 8] },
      { type: 'wood', fromCoords: [35, 25], toCoords: [39, 26] },
      { type: 'wood', fromCoords: [44, 25], toCoords: [48, 26] },
      { type: 'wood', fromCoords: [36, 24], toCoords: [47, 25] },
      { type: 'wood', fromCoords: [40, 22], toCoords: [43, 23] },
      { type: 'wood', fromCoords: [38, 23], toCoords: [45, 24] },
      { type: 'forest', fromCoords: [33, 25], toCoords: [35, 26] },
      { type: 'forest', fromCoords: [34, 24], toCoords: [36, 25] },
      { type: 'forest', fromCoords: [35, 23], toCoords: [38, 24] },
      { type: 'forest', fromCoords: [37, 22], toCoords: [40, 23] },
      { type: 'forest', fromCoords: [39, 21], toCoords: [44, 22] },
      { type: 'forest', fromCoords: [43, 22], toCoords: [46, 23] },
      { type: 'forest', fromCoords: [45, 23], toCoords: [48, 24] },
      { type: 'forest', fromCoords: [47, 24], toCoords: [49, 25] },
      { type: 'forest', fromCoords: [48, 25], toCoords: [50, 26] },
    ],
    discovered: false,
  }
}

const mapZeroState: MapState = {
  map: [],
  discovered: false,
}

export function getMapZeroState() {
  return mapZeroState
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
      (isKeyCurrentlyDown(['s', 'arrowdown']) ||
        isButtonCurrentlyDown('dpadDown')) &&
      player.faceDirection === 'down'
    ) {
      updateGameState({
        status: 'settlement',
      })
      player.goToCoordinates(Math.floor(blocksHorizontal / 2), 0)
      player.stopMoving()
    }
  }

  if (pCoordsX === 0) {
    if (
      (isKeyCurrentlyDown(['a', 'arrowleft']) ||
        isButtonCurrentlyDown('dpadLeft')) &&
      player.faceDirection === 'left'
    ) {
      updateWildernessState({
        mapId: '[-1,0]',
      })
      const { discovered } = getMapMinusOneZeroState()
      if (!discovered) {
        updateMapMinusOneZeroState({
          discovered: true,
        })
        addNotification(
          'New area discovered! This area has been added to the world map'
        )
      }
      player.goToCoordinates(blocksHorizontal - 1, pCoordsY)
      player.stopMoving()
    }
  }

  if (pCoordsY === 0) {
    if (
      (isKeyCurrentlyDown(['w', 'arrowup']) ||
        isButtonCurrentlyDown('dpadUp')) &&
      player.faceDirection === 'up'
    ) {
      updateWildernessState({
        mapId: '[0,1]',
      })
      const { discovered } = getMapZeroOneState()
      if (!discovered) {
        updateMapZeroOneState({
          discovered: true,
        })
        addNotification(
          'New area discovered! This area has been added to the world map'
        )
      }
      player.goToCoordinates(pCoordsX, blocksVertical - 1)
      player.stopMoving()
    }
  }

  if (pCoordsX === blocksHorizontal - 1) {
    if (
      (isKeyCurrentlyDown(['d', 'arrowright']) ||
        isButtonCurrentlyDown('dpadRight')) &&
      player.faceDirection === 'right'
    ) {
      updateWildernessState({
        mapId: '[1,0]',
      })
      const { discovered } = getMapOneZeroState()
      if (!discovered) {
        updateMapOneZeroState({
          discovered: true,
        })
        addNotification(
          'New area discovered! This area has been added to the world map'
        )
      }
      player.goToCoordinates(0, pCoordsY)
      player.stopMoving()
    }
  }
}
