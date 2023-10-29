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

export function generateMapMinusThreeZeroState(): MapState {
  const { blocksVertical, blocksHorizontal } = getGameState()

  return {
    map: [
      { type: 'water', fromCoords: [0, 0], toCoords: [83, 5] },
      { type: 'water', fromCoords: [75, 5], toCoords: [83, 23] },
      { type: 'water', fromCoords: [0, 5], toCoords: [43, 27] },
      { type: 'hill', fromCoords: [66, 25], toCoords: [73, 26] },
      { type: 'water', fromCoords: [57, 23], toCoords: [64, 24] },
      { type: 'water', fromCoords: [59, 22], toCoords: [61, 23] },
      { type: 'water', fromCoords: [43, 5], toCoords: [50, 9] },
      { type: 'water', fromCoords: [69, 5], toCoords: [75, 11] },
      { type: 'water', fromCoords: [72, 11], toCoords: [75, 18] },
      { type: 'water', fromCoords: [71, 11], toCoords: [72, 15] },
      { type: 'water', fromCoords: [74, 18], toCoords: [75, 22] },
      { type: 'water', fromCoords: [73, 18], toCoords: [74, 20] },
      { type: 'water', fromCoords: [64, 5], toCoords: [69, 7] },
      { type: 'water', fromCoords: [61, 5], toCoords: [64, 6] },
      { type: 'water', fromCoords: [50, 5], toCoords: [55, 6] },
      { type: 'water', fromCoords: [50, 6], toCoords: [53, 7] },
      { type: 'water', fromCoords: [50, 7], toCoords: [51, 8] },
      { type: 'water', fromCoords: [43, 9], toCoords: [48, 10] },
      { type: 'water', fromCoords: [43, 10], toCoords: [45, 16] },
      { type: 'water', fromCoords: [43, 16], toCoords: [44, 21] },
      { type: 'water', fromCoords: [68, 7], toCoords: [69, 8] },
      { type: 'water', fromCoords: [68, 8], toCoords: [69, 9] },
      { type: 'water', fromCoords: [67, 7], toCoords: [68, 8] },
      { type: 'water', fromCoords: [45, 10], toCoords: [46, 11] },
      { type: 'water', fromCoords: [45, 11], toCoords: [46, 14] },
      { type: 'water', fromCoords: [46, 10], toCoords: [47, 11] },
      { type: 'hill', fromCoords: [60, 26], toCoords: [83, 27] },
      { type: 'water', fromCoords: [53, 26], toCoords: [60, 27] },
      { type: 'water', fromCoords: [54, 25], toCoords: [66, 26] },
      { type: 'water', fromCoords: [55, 24], toCoords: [65, 25] },
      { type: 'forest', fromCoords: [58, 10], toCoords: [63, 15] },
      { type: 'forest', fromCoords: [59, 15], toCoords: [62, 16] },
      { type: 'forest', fromCoords: [63, 12], toCoords: [64, 14] },
      { type: 'forest', fromCoords: [59, 9], toCoords: [60, 10] },
      { type: 'forest', fromCoords: [57, 12], toCoords: [58, 13] },
      { type: 'forest', fromCoords: [47, 20], toCoords: [50, 27] },
      { type: 'forest', fromCoords: [50, 22], toCoords: [51, 27] },
      { type: 'forest', fromCoords: [46, 22], toCoords: [47, 25] },
      { type: 'forest', fromCoords: [48, 19], toCoords: [49, 20] },
      { type: 'water', fromCoords: [70, 11], toCoords: [71, 13] },
    ],
    discovered: false,
  }
}

const mapMinusThreeZeroState: MapState = {
  map: [],
  discovered: false,
}

export function getMapMinusThreeZeroState() {
  return mapMinusThreeZeroState
}

export function updateMapMinusThreeZeroState(
  changes:
    | Partial<typeof mapMinusThreeZeroState>
    | ((
        state: typeof mapMinusThreeZeroState
      ) => Partial<typeof mapMinusThreeZeroState>)
) {
  if (typeof changes === 'function') {
    Object.assign(mapMinusThreeZeroState, changes(mapMinusThreeZeroState))
  } else {
    Object.assign(mapMinusThreeZeroState, changes)
  }
}

export function drawMapMinusThreeZero() {
  const { map } = mapMinusThreeZeroState
  drawBackgroundFromMap(map)
}

export function handleMapMinusThreeZeroInput() {
  const { map } = mapMinusThreeZeroState
  const restrictedCoords = deriveRestrictedCoordsFromMap(map, '[-3,0]')

  handlePlayerMovement(restrictedCoords)
  handleMapMinusThreeZeroExit()
}

export function handleMapMinusThreeZeroExit() {
  const { player, blocksHorizontal, blocksVertical } = getGameState()
  if (!isPlayerInitialised(player)) return

  const [pCoordsX, pCoordsY] = player.coordinates
  if (pCoordsX === blocksHorizontal - 1) {
    if (
      (isKeyCurrentlyDown(['d', 'arrowright']) ||
        isButtonCurrentlyDown('dpadRight')) &&
      player.faceDirection === 'right'
    ) {
      updateWildernessState({
        mapId: '[-2,0]',
      })
      const { discovered } = getMapMinusTwoZeroState()
      if (!discovered) {
        updateMapMinusTwoZeroState({
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
  if (pCoordsY === blocksVertical - 1) {
    if (
      (isKeyCurrentlyDown(['s', 'arrowdown']) ||
        isButtonCurrentlyDown('dpadDown')) &&
      player.faceDirection === 'down'
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
      player.goToCoordinates(pCoordsX, 0)
      player.stopMoving()
    }
  }
}
