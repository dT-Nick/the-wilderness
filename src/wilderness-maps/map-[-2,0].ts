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
  getMapMinusThreeZeroState,
  updateMapMinusThreeZeroState,
} from './map-[-3,0].js'
import { getMapZeroOneState, updateMapZeroOneState } from './map-[0,1].js'

export function generateMapMinusTwoZeroState(): MapState {
  const { blocksVertical, blocksHorizontal } = getGameState()

  return {
    map: [
      { type: 'water', fromCoords: [0, 0], toCoords: [83, 13] },
      { type: 'water', fromCoords: [0, 13], toCoords: [47, 18] },
      { type: 'water', fromCoords: [0, 18], toCoords: [18, 23] },
      { type: 'water', fromCoords: [47, 13], toCoords: [72, 15] },
      { type: 'water', fromCoords: [47, 15], toCoords: [59, 17] },
      { type: 'water', fromCoords: [59, 15], toCoords: [66, 16] },
      { type: 'water', fromCoords: [72, 13], toCoords: [79, 14] },
      { type: 'water', fromCoords: [18, 18], toCoords: [35, 21] },
      { type: 'water', fromCoords: [18, 21], toCoords: [24, 22] },
      { type: 'water', fromCoords: [35, 18], toCoords: [41, 20] },
      { type: 'water', fromCoords: [41, 18], toCoords: [44, 19] },
      { type: 'hill', fromCoords: [29, 25], toCoords: [34, 26] },
      { type: 'hill', fromCoords: [30, 24], toCoords: [32, 25] },
      { type: 'hill', fromCoords: [0, 26], toCoords: [83, 27] },
      { type: 'hill', fromCoords: [66, 25], toCoords: [83, 26] },
      { type: 'hill', fromCoords: [75, 24], toCoords: [83, 25] },
      { type: 'hill', fromCoords: [42, 25], toCoords: [55, 26] },
      { type: 'hill', fromCoords: [2, 25], toCoords: [10, 26] },
      { type: 'forest', fromCoords: [50, 20], toCoords: [61, 24] },
      { type: 'forest', fromCoords: [54, 19], toCoords: [59, 20] },
      { type: 'forest', fromCoords: [61, 21], toCoords: [62, 23] },
      { type: 'forest', fromCoords: [57, 24], toCoords: [59, 25] },
      { type: 'forest', fromCoords: [49, 21], toCoords: [50, 23] },
      { type: 'forest', fromCoords: [73, 17], toCoords: [81, 21] },
      { type: 'forest', fromCoords: [81, 18], toCoords: [82, 20] },
      { type: 'forest', fromCoords: [71, 21], toCoords: [78, 22] },
      { type: 'forest', fromCoords: [71, 20], toCoords: [73, 21] },
      { type: 'forest', fromCoords: [68, 22], toCoords: [73, 24] },
      { type: 'forest', fromCoords: [69, 21], toCoords: [71, 22] },
      { type: 'forest', fromCoords: [73, 22], toCoords: [75, 23] },
      { type: 'forest', fromCoords: [21, 23], toCoords: [27, 25] },
      { type: 'forest', fromCoords: [19, 24], toCoords: [21, 25] },
      { type: 'forest', fromCoords: [27, 23], toCoords: [28, 24] },
    ],
    discovered: false,
  }
}

const mapMinusTwoZeroState: MapState = {
  map: [],
  discovered: false,
}

export function getMapMinusTwoZeroState() {
  return mapMinusTwoZeroState
}

export function updateMapMinusTwoZeroState(
  changes:
    | Partial<typeof mapMinusTwoZeroState>
    | ((
        state: typeof mapMinusTwoZeroState
      ) => Partial<typeof mapMinusTwoZeroState>)
) {
  if (typeof changes === 'function') {
    Object.assign(mapMinusTwoZeroState, changes(mapMinusTwoZeroState))
  } else {
    Object.assign(mapMinusTwoZeroState, changes)
  }
}

export function drawMapMinusTwoZero() {
  const { map } = mapMinusTwoZeroState
  drawBackgroundFromMap(map)
}

export function handleMapMinusTwoZeroInput() {
  const { map } = mapMinusTwoZeroState
  const restrictedCoords = deriveRestrictedCoordsFromMap(map, '[-2,0]')

  handlePlayerMovement(restrictedCoords)
  handleMapMinusTwoZeroExit()
}

export function handleMapMinusTwoZeroExit() {
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
      player.goToCoordinates(0, pCoordsY)
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
      player.goToCoordinates(blocksHorizontal - 1, pCoordsY)
      player.stopMoving()
    }
  }
}
