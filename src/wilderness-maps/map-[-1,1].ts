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
import {
  getMapMinusOneZeroState,
  updateMapMinusOneZeroState,
} from './map-[-1,0].js'
import { getMapZeroOneState, updateMapZeroOneState } from './map-[0,1].js'

export function generateMapMinusOneOneState(): MapState {
  const { blocksVertical, blocksHorizontal } = getGameState()

  return {
    map: [
      {
        type: 'water',
        fromCoords: [70, 17],
        toCoords: [83, 18],
      },
      {
        type: 'water',
        fromCoords: [69, 17],
        toCoords: [70, 27],
      },
      {
        type: 'water',
        fromCoords: [0, 0],
        toCoords: [83, 17],
      },
      {
        type: 'water',
        fromCoords: [0, 17],
        toCoords: [69, 27],
      },
      {
        type: 'water',
        fromCoords: [70, 18],
        toCoords: [81, 19],
      },
      {
        type: 'water',
        fromCoords: [70, 19],
        toCoords: [77, 20],
      },
      {
        type: 'water',
        fromCoords: [70, 20],
        toCoords: [75, 21],
      },
      {
        type: 'water',
        fromCoords: [77, 19],
        toCoords: [80, 20],
      },
      {
        type: 'water',
        fromCoords: [75, 20],
        toCoords: [78, 21],
      },
      {
        type: 'water',
        fromCoords: [70, 21],
        toCoords: [76, 22],
      },
      {
        type: 'water',
        fromCoords: [70, 22],
        toCoords: [74, 23],
      },
      {
        type: 'water',
        fromCoords: [70, 23],
        toCoords: [73, 24],
      },
      {
        type: 'water',
        fromCoords: [70, 24],
        toCoords: [72, 25],
      },
      {
        type: 'water',
        fromCoords: [70, 25],
        toCoords: [71, 26],
      },
    ],
    discovered: false,
  }
}

const mapMinusOneOneState: MapState = {
  map: [],
  discovered: false,
}

export function getMapMinusOneOneState() {
  return mapMinusOneOneState
}

export function updateMapMinusOneOneState(
  changes:
    | Partial<typeof mapMinusOneOneState>
    | ((
        state: typeof mapMinusOneOneState
      ) => Partial<typeof mapMinusOneOneState>)
) {
  if (typeof changes === 'function') {
    Object.assign(mapMinusOneOneState, changes(mapMinusOneOneState))
  } else {
    Object.assign(mapMinusOneOneState, changes)
  }
}

export function drawMapMinusOneOne() {
  const { map } = mapMinusOneOneState
  drawBackgroundFromMap(map)
}

export function handleMapMinusOneOneInput() {
  const { map } = mapMinusOneOneState
  const restrictedCoords = deriveRestrictedCoordsFromMap(map)

  handlePlayerMovement(restrictedCoords)
  handleMapMinusOneOneExit()
}

export function handleMapMinusOneOneExit() {
  const { player, blocksHorizontal, blocksVertical } = getGameState()
  if (!isPlayerInitialised(player)) return

  const [pCoordsX, pCoordsY] = player.coordinates
  if (pCoordsX === blocksHorizontal - 1) {
    if (
      isKeyCurrentlyDown(['d', 'arrowright']) &&
      player.faceDirection === 'right'
    ) {
      updateWildernessState({
        mapId: '[0,1]',
      })
      const { discovered } = getMapZeroOneState()
      if (!discovered) {
        updateMapZeroOneState({
          discovered: true,
        })
      }
      player.goToCoordinates(0, pCoordsY)
      player.stopMoving()
    }
  }
  if (pCoordsY === blocksVertical - 1) {
    if (
      isKeyCurrentlyDown(['s', 'arrowdown']) &&
      player.faceDirection === 'down'
    ) {
      updateWildernessState({
        mapId: '[-1,0]',
      })
      const { discovered } = getMapMinusOneZeroState()
      if (!discovered) {
        updateMapMinusOneZeroState({
          discovered: true,
        })
      }
      player.goToCoordinates(pCoordsX, 0)
      player.stopMoving()
    }
  }
}
