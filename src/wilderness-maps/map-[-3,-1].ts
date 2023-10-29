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
  getMapMinusTwoMinusOneState,
  updateMapMinusTwoMinusOneState,
} from './map-[-2,-1].js'
import {
  getMapMinusTwoZeroState,
  updateMapMinusTwoZeroState,
} from './map-[-2,0].js'
import {
  getMapMinusThreeZeroState,
  updateMapMinusThreeZeroState,
} from './map-[-3,0].js'
import { getMapZeroOneState, updateMapZeroOneState } from './map-[0,1].js'

export function generateMapMinusThreeMinusOneState(): MapState {
  const { blocksVertical, blocksHorizontal } = getGameState()

  return {
    map: [
      { type: 'hill', fromCoords: [60, 0], toCoords: [83, 1] },
      { type: 'water', fromCoords: [53, 0], toCoords: [60, 1] },
      { type: 'water', fromCoords: [55, 1], toCoords: [64, 2] },
      { type: 'water', fromCoords: [57, 2], toCoords: [63, 3] },
      { type: 'water', fromCoords: [59, 3], toCoords: [61, 4] },
      { type: 'water', fromCoords: [58, 3], toCoords: [59, 4] },
      { type: 'forest', fromCoords: [47, 0], toCoords: [51, 1] },
      { type: 'forest', fromCoords: [48, 1], toCoords: [50, 2] },
      { type: 'water', fromCoords: [42, 21], toCoords: [60, 27] },
      { type: 'water', fromCoords: [60, 22], toCoords: [67, 27] },
      { type: 'water', fromCoords: [67, 23], toCoords: [70, 27] },
      { type: 'mountain', fromCoords: [73, 26], toCoords: [83, 27] },
      { type: 'hill', fromCoords: [72, 25], toCoords: [83, 26] },
      { type: 'water', fromCoords: [42, 12], toCoords: [46, 21] },
      { type: 'water', fromCoords: [42, 9], toCoords: [44, 12] },
      { type: 'water', fromCoords: [42, 7], toCoords: [43, 9] },
      { type: 'water', fromCoords: [44, 11], toCoords: [45, 12] },
      { type: 'water', fromCoords: [46, 16], toCoords: [47, 21] },
      { type: 'water', fromCoords: [47, 19], toCoords: [58, 21] },
      { type: 'water', fromCoords: [47, 18], toCoords: [48, 19] },
      { type: 'water', fromCoords: [58, 20], toCoords: [59, 21] },
      { type: 'water', fromCoords: [60, 21], toCoords: [64, 22] },
      { type: 'water', fromCoords: [48, 18], toCoords: [50, 19] },
      { type: 'water', fromCoords: [47, 17], toCoords: [48, 18] },
      { type: 'forest', fromCoords: [68, 6], toCoords: [76, 10] },
      { type: 'forest', fromCoords: [70, 10], toCoords: [75, 11] },
      { type: 'forest', fromCoords: [69, 5], toCoords: [72, 6] },
      { type: 'forest', fromCoords: [67, 7], toCoords: [68, 9] },
      { type: 'forest', fromCoords: [76, 7], toCoords: [77, 8] },
      { type: 'forest', fromCoords: [74, 18], toCoords: [82, 23] },
      { type: 'forest', fromCoords: [76, 17], toCoords: [81, 18] },
      { type: 'forest', fromCoords: [82, 20], toCoords: [83, 22] },
      { type: 'forest', fromCoords: [73, 21], toCoords: [74, 22] },
      { type: 'forest', fromCoords: [73, 20], toCoords: [74, 21] },
      { type: 'forest', fromCoords: [51, 8], toCoords: [54, 16] },
      { type: 'forest', fromCoords: [52, 7], toCoords: [56, 8] },
      { type: 'forest', fromCoords: [54, 8], toCoords: [55, 11] },
      { type: 'forest', fromCoords: [53, 6], toCoords: [57, 7] },
      { type: 'forest', fromCoords: [54, 14], toCoords: [55, 16] },
      { type: 'forest', fromCoords: [52, 16], toCoords: [54, 17] },
      { type: 'forest', fromCoords: [50, 10], toCoords: [51, 13] },
      { type: 'water', fromCoords: [0, 0], toCoords: [42, 27] },
      { type: 'water', fromCoords: [42, 2], toCoords: [43, 7] },
      { type: 'water', fromCoords: [43, 5], toCoords: [44, 9] },
      { type: 'water', fromCoords: [44, 8], toCoords: [45, 11] },
      { type: 'hill', fromCoords: [71, 26], toCoords: [73, 27] },
      { type: 'water', fromCoords: [70, 25], toCoords: [72, 26] },
      { type: 'water', fromCoords: [70, 24], toCoords: [71, 25] },
      { type: 'water', fromCoords: [70, 26], toCoords: [71, 27] },
      { type: 'hill', fromCoords: [66, 1], toCoords: [83, 2] },
      { type: 'hill', fromCoords: [75, 2], toCoords: [83, 3] },
    ],
    discovered: false,
  }
}

const mapMinusThreeMinusOneState: MapState = {
  map: [],
  discovered: false,
}

export function getMapMinusThreeMinusOneState() {
  return mapMinusThreeMinusOneState
}

export function updateMapMinusThreeMinusOneState(
  changes:
    | Partial<typeof mapMinusThreeMinusOneState>
    | ((
        state: typeof mapMinusThreeMinusOneState
      ) => Partial<typeof mapMinusThreeMinusOneState>)
) {
  if (typeof changes === 'function') {
    Object.assign(
      mapMinusThreeMinusOneState,
      changes(mapMinusThreeMinusOneState)
    )
  } else {
    Object.assign(mapMinusThreeMinusOneState, changes)
  }
}

export function drawMapMinusThreeMinusOne() {
  const { map } = mapMinusThreeMinusOneState
  drawBackgroundFromMap(map)
}

export function handleMapMinusThreeMinusOneInput() {
  const { map } = mapMinusThreeMinusOneState
  const restrictedCoords = deriveRestrictedCoordsFromMap(map, '[-3,-1]')

  handlePlayerMovement(restrictedCoords)
  handleMapMinusThreeMinusOneExit()
}

export function handleMapMinusThreeMinusOneExit() {
  const { player, blocksHorizontal, blocksVertical } = getGameState()
  if (!isPlayerInitialised(player)) return

  const [pCoordsX, pCoordsY] = player.coordinates
  if (pCoordsY === 0) {
    if (
      (isKeyCurrentlyDown(['w', 'arrowup']) ||
        isButtonCurrentlyDown('dpadUp')) &&
      player.faceDirection === 'up'
    ) {
      updateWildernessState({
        mapId: '[-3,0]',
      })
      const { discovered } = getMapMinusThreeZeroState()
      if (!discovered) {
        updateMapMinusThreeZeroState({
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
        mapId: '[-2,-1]',
      })
      const { discovered } = getMapMinusTwoMinusOneState()
      if (!discovered) {
        updateMapMinusTwoMinusOneState({
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
