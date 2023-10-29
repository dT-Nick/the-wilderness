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
  getMapMinusOneMinusOneState,
  updateMapMinusOneMinusOneState,
} from './map-[-1,-1].js'
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
import {
  getMapMinusThreeZeroState,
  updateMapMinusThreeZeroState,
} from './map-[-3,0].js'
import { getMapZeroOneState, updateMapZeroOneState } from './map-[0,1].js'

export function generateMapMinusTwoMinusOneState(): MapState {
  const { blocksVertical, blocksHorizontal } = getGameState()

  return {
    map: [
      { type: 'mountain', fromCoords: [0, 26], toCoords: [83, 27] },
      { type: 'mountain', fromCoords: [5, 25], toCoords: [76, 26] },
      { type: 'mountain', fromCoords: [16, 24], toCoords: [47, 25] },
      { type: 'mountain', fromCoords: [28, 23], toCoords: [38, 24] },
      { type: 'mountain', fromCoords: [32, 22], toCoords: [34, 23] },
      { type: 'hill', fromCoords: [0, 25], toCoords: [5, 26] },
      { type: 'hill', fromCoords: [3, 24], toCoords: [16, 25] },
      { type: 'hill', fromCoords: [15, 23], toCoords: [28, 24] },
      { type: 'hill', fromCoords: [18, 22], toCoords: [24, 23] },
      { type: 'hill', fromCoords: [27, 22], toCoords: [32, 23] },
      { type: 'hill', fromCoords: [30, 21], toCoords: [37, 22] },
      { type: 'hill', fromCoords: [34, 22], toCoords: [42, 23] },
      { type: 'hill', fromCoords: [38, 23], toCoords: [49, 24] },
      { type: 'hill', fromCoords: [47, 24], toCoords: [77, 25] },
      { type: 'hill', fromCoords: [76, 25], toCoords: [83, 26] },
      { type: 'hill', fromCoords: [55, 23], toCoords: [70, 24] },
      { type: 'hill', fromCoords: [59, 22], toCoords: [66, 23] },
      { type: 'hill', fromCoords: [4, 3], toCoords: [22, 4] },
      { type: 'hill', fromCoords: [11, 4], toCoords: [15, 5] },
      { type: 'hill', fromCoords: [0, 0], toCoords: [83, 2] },
      { type: 'hill', fromCoords: [0, 2], toCoords: [29, 3] },
      { type: 'hill', fromCoords: [46, 2], toCoords: [62, 3] },
      { type: 'hill', fromCoords: [51, 3], toCoords: [60, 4] },
      { type: 'hill', fromCoords: [54, 4], toCoords: [57, 5] },
      { type: 'hill', fromCoords: [72, 2], toCoords: [83, 3] },
      { type: 'hill', fromCoords: [78, 3], toCoords: [83, 4] },
      { type: 'forest', fromCoords: [8, 9], toCoords: [15, 14] },
      { type: 'forest', fromCoords: [10, 8], toCoords: [14, 9] },
      { type: 'forest', fromCoords: [15, 10], toCoords: [16, 13] },
      { type: 'forest', fromCoords: [9, 14], toCoords: [12, 15] },
      { type: 'forest', fromCoords: [7, 12], toCoords: [8, 13] },
      { type: 'forest', fromCoords: [7, 10], toCoords: [8, 12] },
      { type: 'forest', fromCoords: [24, 6], toCoords: [27, 19] },
      { type: 'forest', fromCoords: [27, 14], toCoords: [28, 18] },
      { type: 'forest', fromCoords: [28, 15], toCoords: [29, 17] },
      { type: 'forest', fromCoords: [23, 7], toCoords: [24, 12] },
      { type: 'forest', fromCoords: [22, 9], toCoords: [23, 11] },
      { type: 'forest', fromCoords: [27, 6], toCoords: [28, 8] },
      { type: 'forest', fromCoords: [23, 17], toCoords: [24, 19] },
      { type: 'forest', fromCoords: [24, 19], toCoords: [26, 20] },
      { type: 'forest', fromCoords: [38, 16], toCoords: [46, 19] },
      { type: 'forest', fromCoords: [34, 4], toCoords: [40, 8] },
      { type: 'forest', fromCoords: [72, 17], toCoords: [80, 22] },
      { type: 'forest', fromCoords: [57, 7], toCoords: [61, 12] },
      { type: 'forest', fromCoords: [35, 8], toCoords: [39, 9] },
      { type: 'forest', fromCoords: [33, 5], toCoords: [34, 7] },
      { type: 'forest', fromCoords: [35, 3], toCoords: [37, 4] },
      { type: 'forest', fromCoords: [40, 5], toCoords: [41, 6] },
      { type: 'forest', fromCoords: [58, 12], toCoords: [61, 13] },
      { type: 'forest', fromCoords: [60, 13], toCoords: [61, 14] },
      { type: 'forest', fromCoords: [61, 9], toCoords: [62, 13] },
      { type: 'forest', fromCoords: [62, 10], toCoords: [63, 12] },
      { type: 'forest', fromCoords: [58, 6], toCoords: [59, 7] },
      { type: 'forest', fromCoords: [56, 8], toCoords: [57, 10] },
      { type: 'forest', fromCoords: [40, 15], toCoords: [48, 16] },
      { type: 'forest', fromCoords: [42, 14], toCoords: [49, 15] },
      { type: 'forest', fromCoords: [44, 13], toCoords: [48, 14] },
      { type: 'forest', fromCoords: [40, 19], toCoords: [44, 20] },
      { type: 'forest', fromCoords: [37, 17], toCoords: [38, 18] },
      { type: 'forest', fromCoords: [71, 18], toCoords: [72, 21] },
      { type: 'forest', fromCoords: [70, 19], toCoords: [71, 20] },
      { type: 'forest', fromCoords: [74, 16], toCoords: [79, 17] },
      { type: 'forest', fromCoords: [76, 15], toCoords: [78, 16] },
      { type: 'forest', fromCoords: [76, 22], toCoords: [80, 23] },
      { type: 'forest', fromCoords: [80, 20], toCoords: [81, 24] },
      { type: 'forest', fromCoords: [78, 23], toCoords: [80, 24] },
      { type: 'forest', fromCoords: [81, 21], toCoords: [82, 23] },
    ],
    discovered: false,
  }
}

const mapMinusTwoMinusOneState: MapState = {
  map: [],
  discovered: false,
}

export function getMapMinusTwoMinusOneState() {
  return mapMinusTwoMinusOneState
}

export function updateMapMinusTwoMinusOneState(
  changes:
    | Partial<typeof mapMinusTwoMinusOneState>
    | ((
        state: typeof mapMinusTwoMinusOneState
      ) => Partial<typeof mapMinusTwoMinusOneState>)
) {
  if (typeof changes === 'function') {
    Object.assign(mapMinusTwoMinusOneState, changes(mapMinusTwoMinusOneState))
  } else {
    Object.assign(mapMinusTwoMinusOneState, changes)
  }
}

export function drawMapMinusTwoMinusOne() {
  const { map } = mapMinusTwoMinusOneState
  drawBackgroundFromMap(map)
}

export function handleMapMinusTwoMinusOneInput() {
  const { map } = mapMinusTwoMinusOneState
  const restrictedCoords = deriveRestrictedCoordsFromMap(map, '[-2,-1]')

  handlePlayerMovement(restrictedCoords)
  handleMapMinusTwoMinusOneExit()
}

export function handleMapMinusTwoMinusOneExit() {
  const { player, blocksHorizontal, blocksVertical } = getGameState()
  if (!isPlayerInitialised(player)) return

  const [pCoordsX, pCoordsY] = player.coordinates
  if (pCoordsX === 0) {
    if (
      (isKeyCurrentlyDown(['a', 'arrowleft']) ||
        isButtonCurrentlyDown('dpadLeft')) &&
      player.faceDirection === 'left'
    ) {
      updateWildernessState({
        mapId: '[-3,-1]',
      })
      const { discovered } = getMapMinusThreeMinusOneState()
      if (!discovered) {
        updateMapMinusThreeMinusOneState({
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
  if (pCoordsX === blocksHorizontal - 1) {
    if (
      (isKeyCurrentlyDown(['d', 'arrowright']) ||
        isButtonCurrentlyDown('dpadRight')) &&
      player.faceDirection === 'right'
    ) {
      updateWildernessState({
        mapId: '[-1,-1]',
      })
      const { discovered } = getMapMinusOneMinusOneState()
      if (!discovered) {
        updateMapMinusOneMinusOneState({
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
