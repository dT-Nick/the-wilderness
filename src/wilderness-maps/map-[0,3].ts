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
import { getMapZeroTwoState, updateMapZeroTwoState } from './map-[0,2].js'

export function generateMapZeroThreeState(): MapState {
  const { blocksVertical, blocksHorizontal } = getGameState()

  return {
    map: [
      { type: 'forest', fromCoords: [39, 26], toCoords: [41, 27] },
      { type: 'hill', fromCoords: [0, 12], toCoords: [40, 14] },
      { type: 'hill', fromCoords: [43, 12], toCoords: [83, 14] },
      { type: 'hill', fromCoords: [43, 17], toCoords: [83, 19] },
      { type: 'water', fromCoords: [80, 19], toCoords: [83, 27] },
      { type: 'water', fromCoords: [78, 19], toCoords: [80, 25] },
      { type: 'water', fromCoords: [79, 25], toCoords: [80, 26] },
      { type: 'water', fromCoords: [5, 20], toCoords: [6, 26] },
      { type: 'water', fromCoords: [6, 21], toCoords: [7, 24] },
      { type: 'water', fromCoords: [0, 19], toCoords: [5, 27] },
      { type: 'hill', fromCoords: [0, 17], toCoords: [40, 19] },
      { type: 'void', fromCoords: [43, 11], toCoords: [48, 12] },
      { type: 'void', fromCoords: [35, 11], toCoords: [40, 12] },
      { type: 'void', fromCoords: [46, 10], toCoords: [48, 11] },
      { type: 'void', fromCoords: [35, 10], toCoords: [37, 11] },
      { type: 'carpet', fromCoords: [40, 15], toCoords: [43, 16] },
      { type: 'hill', fromCoords: [38, 14], toCoords: [40, 17] },
      { type: 'hill', fromCoords: [43, 14], toCoords: [45, 17] },
      { type: 'mountain', fromCoords: [0, 14], toCoords: [38, 17] },
      { type: 'mountain', fromCoords: [45, 14], toCoords: [83, 17] },
      { type: 'forest', fromCoords: [14, 20], toCoords: [20, 25] },
      { type: 'forest', fromCoords: [20, 21], toCoords: [21, 24] },
      { type: 'forest', fromCoords: [13, 21], toCoords: [14, 23] },
      { type: 'forest', fromCoords: [16, 25], toCoords: [18, 26] },
      { type: 'forest', fromCoords: [57, 21], toCoords: [71, 24] },
      { type: 'forest', fromCoords: [61, 24], toCoords: [68, 25] },
      { type: 'forest', fromCoords: [64, 20], toCoords: [69, 21] },
      { type: 'forest', fromCoords: [59, 20], toCoords: [61, 21] },
      { type: 'forest', fromCoords: [56, 22], toCoords: [57, 23] },
      { type: 'forest', fromCoords: [28, 21], toCoords: [39, 24] },
      { type: 'forest', fromCoords: [30, 24], toCoords: [35, 25] },
      { type: 'forest', fromCoords: [33, 20], toCoords: [38, 21] },
      { type: 'forest', fromCoords: [27, 21], toCoords: [28, 23] },
      { type: 'forest', fromCoords: [37, 24], toCoords: [41, 25] },
      { type: 'forest', fromCoords: [39, 21], toCoords: [40, 24] },
      { type: 'forest', fromCoords: [40, 22], toCoords: [41, 24] },
      { type: 'forest', fromCoords: [41, 23], toCoords: [42, 24] },
      { type: 'hellstone', fromCoords: [40, 0], toCoords: [43, 15] },
      { type: 'hellstone', fromCoords: [43, 1], toCoords: [46, 11] },
      { type: 'hellstone', fromCoords: [37, 1], toCoords: [40, 11] },
      { type: 'hellstone', fromCoords: [46, 2], toCoords: [48, 10] },
      { type: 'hellstone', fromCoords: [35, 2], toCoords: [37, 10] },
      { type: 'hellstone', fromCoords: [34, 4], toCoords: [35, 8] },
      { type: 'hellstone', fromCoords: [48, 4], toCoords: [49, 8] },
      { type: 'void', fromCoords: [0, 0], toCoords: [34, 12] },
      { type: 'void', fromCoords: [49, 0], toCoords: [83, 12] },
      { type: 'void', fromCoords: [48, 8], toCoords: [49, 12] },
      { type: 'void', fromCoords: [34, 8], toCoords: [35, 12] },
      { type: 'void', fromCoords: [34, 0], toCoords: [35, 4] },
      { type: 'void', fromCoords: [48, 0], toCoords: [49, 4] },
      { type: 'void', fromCoords: [46, 0], toCoords: [48, 2] },
      { type: 'void', fromCoords: [43, 0], toCoords: [46, 1] },
      { type: 'void', fromCoords: [35, 0], toCoords: [37, 2] },
      { type: 'void', fromCoords: [37, 0], toCoords: [40, 1] },
    ],
    discovered: false,
  }
}

const mapZeroThreeState: MapState = {
  map: [],
  discovered: false,
}

export function getMapZeroThreeState() {
  return mapZeroThreeState
}

export function updateMapZeroThreeState(
  changes:
    | Partial<typeof mapZeroThreeState>
    | ((state: typeof mapZeroThreeState) => Partial<typeof mapZeroThreeState>)
) {
  if (typeof changes === 'function') {
    Object.assign(mapZeroThreeState, changes(mapZeroThreeState))
  } else {
    Object.assign(mapZeroThreeState, changes)
  }
}

export function drawMapZeroThree() {
  const { map } = mapZeroThreeState
  drawBackgroundFromMap(map)
}

export function handleMapZeroThreeInput() {
  const { map } = mapZeroThreeState
  const restrictedCoords = deriveRestrictedCoordsFromMap(map, '[0,3]')

  handlePlayerMovement(restrictedCoords)
  handleMapZeroThreeExit()
}

export function handleMapZeroThreeExit() {
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
        mapId: '[0,2]',
      })
      const { discovered } = getMapZeroTwoState()
      if (!discovered) {
        updateMapZeroTwoState({
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
}
