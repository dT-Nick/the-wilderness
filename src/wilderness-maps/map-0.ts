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
  updateWildernessState,
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
        type: 'mountain',
        fromCoords: [0, 26],
        toCoords: [14, 27],
      },
      {
        type: 'mountain',
        fromCoords: [0, 24],
        toCoords: [13, 26],
      },
      {
        type: 'mountain',
        fromCoords: [0, 21],
        toCoords: [12, 24],
      },
      {
        type: 'mountain',
        fromCoords: [0, 19],
        toCoords: [11, 21],
      },
      {
        type: 'mountain',
        fromCoords: [0, 18],
        toCoords: [10, 19],
      },
      {
        type: 'mountain',
        fromCoords: [0, 17],
        toCoords: [8, 18],
      },
      {
        type: 'mountain',
        fromCoords: [0, 16],
        toCoords: [5, 17],
      },
      {
        type: 'mountain',
        fromCoords: [0, 15],
        toCoords: [2, 16],
      },
      {
        type: 'water',
        fromCoords: [20, 10],
        toCoords: [25, 11],
      },
      {
        type: 'water',
        fromCoords: [20, 4],
        toCoords: [25, 5],
      },
      {
        type: 'water',
        fromCoords: [18, 5],
        toCoords: [27, 10],
      },
      {
        type: 'water',
        fromCoords: [27, 6],
        toCoords: [28, 8],
      },
      {
        type: 'water',
        fromCoords: [17, 7],
        toCoords: [18, 9],
      },
      {
        type: 'water',
        fromCoords: [58, 16],
        toCoords: [64, 19],
      },
      {
        type: 'water',
        fromCoords: [62, 15],
        toCoords: [64, 16],
      },
      {
        type: 'water',
        fromCoords: [64, 15],
        toCoords: [66, 18],
      },
      {
        type: 'water',
        fromCoords: [63, 14],
        toCoords: [66, 15],
      },
      {
        type: 'water',
        fromCoords: [66, 14],
        toCoords: [67, 16],
      },
      {
        type: 'water',
        fromCoords: [59, 19],
        toCoords: [62, 20],
      },
      {
        type: 'water',
        fromCoords: [57, 16],
        toCoords: [58, 18],
      },
      {
        type: 'forest',
        fromCoords: [53, 4],
        toCoords: [63, 8],
      },
      {
        type: 'forest',
        fromCoords: [59, 2],
        toCoords: [63, 4],
      },
      {
        type: 'forest',
        fromCoords: [63, 2],
        toCoords: [65, 6],
      },
      {
        type: 'forest',
        fromCoords: [57, 3],
        toCoords: [59, 4],
      },
      {
        type: 'forest',
        fromCoords: [63, 6],
        toCoords: [64, 7],
      },
      {
        type: 'forest',
        fromCoords: [55, 8],
        toCoords: [64, 9],
      },
      {
        type: 'forest',
        fromCoords: [58, 9],
        toCoords: [64, 10],
      },
      {
        type: 'forest',
        fromCoords: [52, 5],
        toCoords: [53, 7],
      },
      {
        type: 'forest',
        fromCoords: [61, 1],
        toCoords: [65, 2],
      },
      {
        type: 'forest',
        fromCoords: [63, 0],
        toCoords: [65, 1],
      },
      {
        type: 'forest',
        fromCoords: [65, 0],
        toCoords: [66, 3],
      },
      {
        type: 'forest',
        fromCoords: [66, 0],
        toCoords: [67, 2],
      },
      {
        type: 'forest',
        fromCoords: [67, 0],
        toCoords: [68, 1],
      },
      {
        type: 'forest',
        fromCoords: [60, 10],
        toCoords: [62, 11],
      },
      {
        type: 'forest',
        fromCoords: [35, 12],
        toCoords: [46, 15],
      },
      {
        type: 'forest',
        fromCoords: [42, 11],
        toCoords: [46, 12],
      },
      {
        type: 'forest',
        fromCoords: [44, 10],
        toCoords: [45, 11],
      },
      {
        type: 'forest',
        fromCoords: [34, 15],
        toCoords: [40, 16],
      },
      {
        type: 'forest',
        fromCoords: [36, 16],
        toCoords: [38, 17],
      },
      {
        type: 'forest',
        fromCoords: [34, 12],
        toCoords: [35, 15],
      },
      {
        type: 'forest',
        fromCoords: [33, 12],
        toCoords: [34, 14],
      },
      {
        type: 'forest',
        fromCoords: [35, 11],
        toCoords: [38, 12],
      },
      {
        type: 'forest',
        fromCoords: [44, 15],
        toCoords: [47, 16],
      },
      {
        type: 'forest',
        fromCoords: [46, 13],
        toCoords: [47, 15],
      },
      {
        type: 'wall',
        fromCoords: [40, 26],
        toCoords: [41, 27],
      },
      {
        type: 'wall',
        fromCoords: [42, 26],
        toCoords: [43, 27],
      },
      {
        type: 'hill',
        fromCoords: [14, 26],
        toCoords: [40, 27],
      },
      {
        type: 'hill',
        fromCoords: [43, 26],
        toCoords: [83, 27],
      },
      {
        type: 'hill',
        fromCoords: [80, 23],
        toCoords: [83, 24],
      },
      {
        type: 'hill',
        fromCoords: [72, 25],
        toCoords: [83, 26],
      },
      {
        type: 'hill',
        fromCoords: [76, 24],
        toCoords: [83, 25],
      },
      {
        type: 'wall',
        fromCoords: [39, 25],
        toCoords: [41, 26],
      },
      {
        type: 'wall',
        fromCoords: [42, 25],
        toCoords: [44, 26],
      },
      {
        type: 'forest',
        fromCoords: [41, 25],
        toCoords: [42, 27],
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

  if (pCoordsX === 0) {
    if (
      isKeyCurrentlyDown(['a', 'arrowleft']) &&
      player.faceDirection === 'left'
    ) {
      updateWildernessState({
        mapId: '[-1,0]',
      })
      player.goToCoordinates(blocksHorizontal - 1, pCoordsY)
      player.stopMoving()
    }
  }

  if (pCoordsY === 0) {
    if (isKeyCurrentlyDown(['w', 'arrowup']) && player.faceDirection === 'up') {
      updateWildernessState({
        mapId: '[0,1]',
      })
      player.goToCoordinates(pCoordsX, blocksVertical - 1)
      player.stopMoving()
    }
  }

  if (pCoordsX === blocksHorizontal - 1) {
    if (
      isKeyCurrentlyDown(['d', 'arrowright']) &&
      player.faceDirection === 'right'
    ) {
      updateWildernessState({
        mapId: '[1,0]',
      })
      player.goToCoordinates(0, pCoordsY)
      player.stopMoving()
    }
  }
}
