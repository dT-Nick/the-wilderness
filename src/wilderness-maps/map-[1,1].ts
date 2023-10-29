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
import { getMapZeroOneState, updateMapZeroOneState } from './map-[0,1].js'
import { getMapOneZeroState, updateMapOneZeroState } from './map-[1,0].js'

export function generateMapOneOneState(): MapState {
  const { blocksVertical, blocksHorizontal } = getGameState()

  return {
    map: [
      {
        type: 'forest',
        fromCoords: [51, 26],
        toCoords: [61, 27],
      },
      {
        type: 'forest',
        fromCoords: [53, 25],
        toCoords: [60, 26],
      },
      {
        type: 'forest',
        fromCoords: [55, 24],
        toCoords: [58, 25],
      },
      {
        type: 'water',
        fromCoords: [0, 0],
        toCoords: [70, 4],
      },
      {
        type: 'water',
        fromCoords: [0, 4],
        toCoords: [1, 11],
      },
      {
        type: 'water',
        fromCoords: [1, 4],
        toCoords: [19, 7],
      },
      {
        type: 'water',
        fromCoords: [19, 4],
        toCoords: [43, 6],
      },
      {
        type: 'water',
        fromCoords: [43, 4],
        toCoords: [60, 5],
      },
      {
        type: 'water',
        fromCoords: [1, 7],
        toCoords: [9, 9],
      },
      {
        type: 'water',
        fromCoords: [1, 9],
        toCoords: [6, 10],
      },
      {
        type: 'water',
        fromCoords: [9, 7],
        toCoords: [15, 8],
      },
      {
        type: 'wall',
        fromCoords: [75, 10],
        toCoords: [76, 20],
      },
      {
        type: 'wall',
        fromCoords: [73, 20],
        toCoords: [76, 21],
      },
      {
        type: 'wall',
        fromCoords: [71, 21],
        toCoords: [74, 22],
      },
      {
        type: 'wall',
        fromCoords: [75, 9],
        toCoords: [76, 10],
      },
      {
        type: 'wall',
        fromCoords: [76, 0],
        toCoords: [77, 10],
      },
      {
        type: 'water',
        fromCoords: [74, 21],
        toCoords: [76, 27],
      },
      {
        type: 'water',
        fromCoords: [71, 22],
        toCoords: [74, 27],
      },
      {
        type: 'wall',
        fromCoords: [70, 21],
        toCoords: [71, 27],
      },
      {
        type: 'water',
        fromCoords: [70, 0],
        toCoords: [76, 4],
      },
      {
        type: 'water',
        fromCoords: [71, 4],
        toCoords: [76, 6],
      },
      {
        type: 'water',
        fromCoords: [74, 6],
        toCoords: [76, 9],
      },
      {
        type: 'forest',
        fromCoords: [28, 11],
        toCoords: [36, 15],
      },
      {
        type: 'forest',
        fromCoords: [36, 13],
        toCoords: [37, 16],
      },
      {
        type: 'forest',
        fromCoords: [30, 15],
        toCoords: [36, 16],
      },
      {
        type: 'forest',
        fromCoords: [33, 16],
        toCoords: [36, 17],
      },
      {
        type: 'forest',
        fromCoords: [27, 12],
        toCoords: [28, 14],
      },
      {
        type: 'wood',
        fromCoords: [76, 15],
        toCoords: [83, 18],
      },
      {
        type: 'water',
        fromCoords: [77, 0],
        toCoords: [83, 15],
      },
      {
        type: 'water',
        fromCoords: [76, 10],
        toCoords: [77, 15],
      },
      {
        type: 'water',
        fromCoords: [76, 18],
        toCoords: [83, 27],
      },
      {
        type: 'forest',
        fromCoords: [4, 11],
        toCoords: [10, 16],
      },
      {
        type: 'forest',
        fromCoords: [5, 16],
        toCoords: [13, 17],
      },
      {
        type: 'forest',
        fromCoords: [10, 12],
        toCoords: [12, 16],
      },
      {
        type: 'forest',
        fromCoords: [7, 17],
        toCoords: [12, 18],
      },
      {
        type: 'forest',
        fromCoords: [20, 20],
        toCoords: [25, 23],
      },
      {
        type: 'forest',
        fromCoords: [21, 19],
        toCoords: [25, 20],
      },
      {
        type: 'forest',
        fromCoords: [19, 21],
        toCoords: [20, 23],
      },
      {
        type: 'forest',
        fromCoords: [25, 20],
        toCoords: [26, 22],
      },
      {
        type: 'forest',
        fromCoords: [57, 8],
        toCoords: [69, 15],
      },
      {
        type: 'forest',
        fromCoords: [56, 15],
        toCoords: [63, 18],
      },
      {
        type: 'forest',
        fromCoords: [63, 15],
        toCoords: [64, 16],
      },
      {
        type: 'forest',
        fromCoords: [60, 7],
        toCoords: [66, 8],
      },
      {
        type: 'forest',
        fromCoords: [62, 6],
        toCoords: [65, 7],
      },
      {
        type: 'forest',
        fromCoords: [55, 18],
        toCoords: [60, 19],
      },
      {
        type: 'forest',
        fromCoords: [56, 19],
        toCoords: [58, 20],
      },
      {
        type: 'forest',
        fromCoords: [56, 10],
        toCoords: [57, 13],
      },
      {
        type: 'forest',
        fromCoords: [55, 11],
        toCoords: [56, 12],
      },
      {
        type: 'forest',
        fromCoords: [69, 10],
        toCoords: [70, 13],
      },
      {
        type: 'forest',
        fromCoords: [70, 11],
        toCoords: [71, 12],
      },
    ],
    discovered: false,
  }
}

const mapOneOneState: MapState = {
  map: [],
  discovered: false,
}

export function getMapOneOneState() {
  return mapOneOneState
}

export function updateMapOneOneState(
  changes:
    | Partial<typeof mapOneOneState>
    | ((state: typeof mapOneOneState) => Partial<typeof mapOneOneState>)
) {
  if (typeof changes === 'function') {
    Object.assign(mapOneOneState, changes(mapOneOneState))
  } else {
    Object.assign(mapOneOneState, changes)
  }
}

export function drawMapOneOne() {
  const { map } = mapOneOneState
  drawBackgroundFromMap(map)
}

export function handleMapOneOneInput() {
  const { map } = mapOneOneState
  const restrictedCoords = deriveRestrictedCoordsFromMap(map, '[1,1]')

  handlePlayerMovement(restrictedCoords)
  handleMapOneOneExit()
}

export function handleMapOneOneExit() {
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
      player.goToCoordinates(blocksHorizontal - 1, pCoordsY)
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
      player.goToCoordinates(pCoordsX, 0)
      player.stopMoving()
    }
  }
}
