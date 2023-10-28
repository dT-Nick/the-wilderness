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
import { getMapZeroState, updateMapZeroState } from './map-0.js'
import {
  getMapMinusOneOneState,
  updateMapMinusOneOneState,
} from './map-[-1,1].js'

export function generateMapMinusOneZeroState(): MapState {
  const { blocksVertical, blocksHorizontal } = getGameState()

  return {
    map: [
      {
        type: 'water',
        fromCoords: [0, 0],
        toCoords: [28, 9],
      },
      {
        type: 'water',
        fromCoords: [28, 0],
        toCoords: [65, 2],
      },
      {
        type: 'water',
        fromCoords: [65, 0],
        toCoords: [70, 1],
      },
      {
        type: 'water',
        fromCoords: [28, 2],
        toCoords: [63, 4],
      },
      {
        type: 'water',
        fromCoords: [28, 4],
        toCoords: [60, 5],
      },
      {
        type: 'water',
        fromCoords: [28, 5],
        toCoords: [54, 6],
      },
      {
        type: 'water',
        fromCoords: [28, 6],
        toCoords: [45, 7],
      },
      {
        type: 'water',
        fromCoords: [28, 7],
        toCoords: [35, 8],
      },
      {
        type: 'water',
        fromCoords: [0, 9],
        toCoords: [20, 10],
      },
      {
        type: 'water',
        fromCoords: [0, 10],
        toCoords: [15, 11],
      },
      {
        type: 'water',
        fromCoords: [0, 11],
        toCoords: [9, 12],
      },
      {
        type: 'water',
        fromCoords: [0, 12],
        toCoords: [3, 13],
      },
      {
        type: 'forest',
        fromCoords: [58, 13],
        toCoords: [64, 14],
      },
      {
        type: 'forest',
        fromCoords: [58, 21],
        toCoords: [64, 22],
      },
      {
        type: 'forest',
        fromCoords: [54, 18],
        toCoords: [55, 20],
      },
      {
        type: 'forest',
        fromCoords: [60, 22],
        toCoords: [62, 23],
      },
      {
        type: 'forest',
        fromCoords: [55, 16],
        toCoords: [56, 21],
      },
      {
        type: 'forest',
        fromCoords: [71, 16],
        toCoords: [72, 17],
      },
      {
        type: 'forest',
        fromCoords: [56, 14],
        toCoords: [68, 19],
      },
      {
        type: 'forest',
        fromCoords: [56, 19],
        toCoords: [66, 21],
      },
      {
        type: 'forest',
        fromCoords: [68, 15],
        toCoords: [71, 18],
      },
      {
        type: 'forest',
        fromCoords: [21, 16],
        toCoords: [27, 20],
      },
      {
        type: 'forest',
        fromCoords: [27, 17],
        toCoords: [28, 19],
      },
      {
        type: 'forest',
        fromCoords: [23, 15],
        toCoords: [26, 16],
      },
      {
        type: 'forest',
        fromCoords: [22, 20],
        toCoords: [25, 21],
      },
      {
        type: 'forest',
        fromCoords: [20, 18],
        toCoords: [21, 20],
      },
      {
        type: 'mountain',
        fromCoords: [81, 15],
        toCoords: [83, 27],
      },
      {
        type: 'mountain',
        fromCoords: [78, 16],
        toCoords: [81, 27],
      },
      {
        type: 'mountain',
        fromCoords: [76, 17],
        toCoords: [78, 27],
      },
      {
        type: 'mountain',
        fromCoords: [75, 18],
        toCoords: [76, 27],
      },
      {
        type: 'mountain',
        fromCoords: [73, 19],
        toCoords: [75, 27],
      },
      {
        type: 'mountain',
        fromCoords: [72, 21],
        toCoords: [73, 27],
      },
      {
        type: 'mountain',
        fromCoords: [70, 22],
        toCoords: [72, 27],
      },
      {
        type: 'mountain',
        fromCoords: [69, 23],
        toCoords: [70, 27],
      },
      {
        type: 'mountain',
        fromCoords: [68, 24],
        toCoords: [69, 27],
      },
      {
        type: 'mountain',
        fromCoords: [67, 26],
        toCoords: [68, 27],
      },
      {
        type: 'hill',
        fromCoords: [0, 26],
        toCoords: [67, 27],
      },
      {
        type: 'hill',
        fromCoords: [38, 24],
        toCoords: [48, 25],
      },
      {
        type: 'hill',
        fromCoords: [42, 23],
        toCoords: [47, 24],
      },
      {
        type: 'hill',
        fromCoords: [20, 24],
        toCoords: [29, 25],
      },
      {
        type: 'hill',
        fromCoords: [0, 24],
        toCoords: [3, 25],
      },
      {
        type: 'hill',
        fromCoords: [35, 25],
        toCoords: [52, 26],
      },
      {
        type: 'hill',
        fromCoords: [57, 25],
        toCoords: [68, 26],
      },
      {
        type: 'hill',
        fromCoords: [19, 25],
        toCoords: [33, 26],
      },
      {
        type: 'hill',
        fromCoords: [0, 25],
        toCoords: [7, 26],
      },
    ],
    discovered: false,
  }
}

const mapMinusOneZeroState: MapState = {
  map: [],
  discovered: false,
}

export function getMapMinusOneZeroState() {
  return mapMinusOneZeroState
}

export function updateMapMinusOneZeroState(
  changes:
    | Partial<typeof mapMinusOneZeroState>
    | ((
        state: typeof mapMinusOneZeroState
      ) => Partial<typeof mapMinusOneZeroState>)
) {
  if (typeof changes === 'function') {
    Object.assign(mapMinusOneZeroState, changes(mapMinusOneZeroState))
  } else {
    Object.assign(mapMinusOneZeroState, changes)
  }
}

export function drawMapMinusOneZero() {
  const { map } = mapMinusOneZeroState
  drawBackgroundFromMap(map)
}

export function handleMapMinusOneZeroInput() {
  const { map } = mapMinusOneZeroState
  const restrictedCoords = deriveRestrictedCoordsFromMap(map)

  handlePlayerMovement(restrictedCoords)
  handleMapMinusOneZeroExit()
}

export function handleMapMinusOneZeroExit() {
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
        mapId: 0,
      })
      const { discovered } = getMapZeroState()
      if (!discovered) {
        updateMapZeroState({
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
  if (pCoordsY === 0) {
    if (
      (isKeyCurrentlyDown(['w', 'arrowup']) ||
        isButtonCurrentlyDown('dpadUp')) &&
      player.faceDirection === 'up'
    ) {
      updateWildernessState({
        mapId: '[-1,1]',
      })
      const { discovered } = getMapMinusOneOneState()
      if (!discovered) {
        updateMapMinusOneOneState({
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
