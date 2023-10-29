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
import {
  getMapMinusTwoZeroState,
  updateMapMinusTwoZeroState,
} from './map-[-2,0].js'
import {
  getMapMinusThreeMinusOneState,
  updateMapMinusThreeMinusOneState,
} from './map-[-3,-1].js'
import { getMapZeroOneState, updateMapZeroOneState } from './map-[0,1].js'
import { getMapZeroThreeState, updateMapZeroThreeState } from './map-[0,3].js'

export function generateMapZeroTwoState(): MapState {
  const { blocksVertical, blocksHorizontal } = getGameState()

  return {
    map: [
      { type: 'water', fromCoords: [0, 26], toCoords: [10, 27] },
      { type: 'water', fromCoords: [78, 26], toCoords: [83, 27] },
      { type: 'water', fromCoords: [0, 0], toCoords: [3, 26] },
      { type: 'water', fromCoords: [82, 0], toCoords: [83, 26] },
      { type: 'water', fromCoords: [3, 25], toCoords: [8, 26] },
      { type: 'water', fromCoords: [3, 24], toCoords: [6, 25] },
      { type: 'water', fromCoords: [3, 23], toCoords: [4, 24] },
      { type: 'water', fromCoords: [80, 25], toCoords: [82, 26] },
      { type: 'water', fromCoords: [81, 17], toCoords: [82, 25] },
      { type: 'water', fromCoords: [3, 14], toCoords: [4, 23] },
      { type: 'water', fromCoords: [4, 18], toCoords: [5, 24] },
      { type: 'water', fromCoords: [3, 0], toCoords: [4, 5] },
      { type: 'water', fromCoords: [4, 0], toCoords: [5, 2] },
      { type: 'water', fromCoords: [81, 0], toCoords: [82, 5] },
      { type: 'water', fromCoords: [80, 0], toCoords: [81, 2] },
      { type: 'forest', fromCoords: [15, 5], toCoords: [23, 10] },
      { type: 'forest', fromCoords: [64, 5], toCoords: [71, 11] },
      { type: 'forest', fromCoords: [44, 15], toCoords: [52, 23] },
      { type: 'forest', fromCoords: [21, 19], toCoords: [31, 24] },
      { type: 'forest', fromCoords: [31, 21], toCoords: [32, 23] },
      { type: 'forest', fromCoords: [24, 24], toCoords: [30, 25] },
      { type: 'forest', fromCoords: [24, 18], toCoords: [27, 19] },
      { type: 'forest', fromCoords: [20, 21], toCoords: [21, 22] },
      { type: 'forest', fromCoords: [52, 16], toCoords: [53, 20] },
      { type: 'forest', fromCoords: [53, 17], toCoords: [54, 19] },
      { type: 'forest', fromCoords: [43, 16], toCoords: [44, 22] },
      { type: 'forest', fromCoords: [42, 17], toCoords: [43, 22] },
      { type: 'forest', fromCoords: [41, 19], toCoords: [42, 21] },
      { type: 'forest', fromCoords: [48, 23], toCoords: [51, 24] },
      { type: 'forest', fromCoords: [47, 14], toCoords: [49, 15] },
      { type: 'forest', fromCoords: [61, 5], toCoords: [64, 11] },
      { type: 'forest', fromCoords: [60, 6], toCoords: [61, 10] },
      { type: 'forest', fromCoords: [59, 7], toCoords: [60, 9] },
      { type: 'forest', fromCoords: [71, 5], toCoords: [72, 10] },
      { type: 'forest', fromCoords: [72, 7], toCoords: [73, 9] },
      { type: 'forest', fromCoords: [65, 4], toCoords: [70, 5] },
      { type: 'forest', fromCoords: [62, 11], toCoords: [68, 12] },
      { type: 'forest', fromCoords: [34, 2], toCoords: [49, 6] },
      { type: 'forest', fromCoords: [37, 1], toCoords: [44, 2] },
      { type: 'forest', fromCoords: [38, 0], toCoords: [42, 1] },
      { type: 'forest', fromCoords: [43, 6], toCoords: [48, 7] },
      { type: 'forest', fromCoords: [33, 3], toCoords: [34, 5] },
      { type: 'forest', fromCoords: [49, 3], toCoords: [50, 5] },
      { type: 'forest', fromCoords: [17, 10], toCoords: [22, 11] },
      { type: 'forest', fromCoords: [19, 4], toCoords: [22, 5] },
      { type: 'forest', fromCoords: [23, 6], toCoords: [24, 8] },
      { type: 'forest', fromCoords: [14, 6], toCoords: [15, 9] },
    ],
    discovered: false,
  }
}

const mapZeroTwoState: MapState = {
  map: [],
  discovered: false,
}

export function getMapZeroTwoState() {
  return mapZeroTwoState
}

export function updateMapZeroTwoState(
  changes:
    | Partial<typeof mapZeroTwoState>
    | ((state: typeof mapZeroTwoState) => Partial<typeof mapZeroTwoState>)
) {
  if (typeof changes === 'function') {
    Object.assign(mapZeroTwoState, changes(mapZeroTwoState))
  } else {
    Object.assign(mapZeroTwoState, changes)
  }
}

export function drawMapZeroTwo() {
  const { map } = mapZeroTwoState
  drawBackgroundFromMap(map)
}

export function handleMapZeroTwoInput() {
  const { map } = mapZeroTwoState
  const restrictedCoords = deriveRestrictedCoordsFromMap(map, '[0,2]')

  handlePlayerMovement(restrictedCoords)
  handleMapZeroTwoExit()
}

export function handleMapZeroTwoExit() {
  const { player, blocksHorizontal, blocksVertical } = getGameState()
  if (!isPlayerInitialised(player)) return

  const [pCoordsX, pCoordsY] = player.coordinates
  if (pCoordsY === blocksVertical - 1) {
    if (
      (isKeyCurrentlyDown(['s', 'arrowdown']) ||
        isButtonCurrentlyDown('dpadDown')) &&
      player.faceDirection === 'down'
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
      player.goToCoordinates(pCoordsX, 0)
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
        mapId: '[0,3]',
      })
      const { discovered } = getMapZeroThreeState()
      if (!discovered) {
        updateMapZeroThreeState({
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
}
