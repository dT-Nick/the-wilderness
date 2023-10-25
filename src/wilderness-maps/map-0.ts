import { handleItemPickup } from '../item.js'
import { handlePlayerMovement } from '../player.js'
import { getDeltaFrames, getGameState, getInputState } from '../state.js'
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
        fromCoords: [10, 3],
        toCoords: [18, 9],
      },
      {
        type: 'forest',
        fromCoords: [19, 10],
        toCoords: [27, 16],
      },
      {
        type: 'water',
        fromCoords: [28, 17],
        toCoords: [36, 23],
      },
      {
        type: 'mountain',
        fromCoords: [37, 24],
        toCoords: [45, 27],
      },
      {
        type: 'forest',
        fromCoords: [46, 1],
        toCoords: [54, 7],
      },
      {
        type: 'water',
        fromCoords: [55, 8],
        toCoords: [63, 14],
      },
      {
        type: 'mountain',
        fromCoords: [64, 15],
        toCoords: [72, 21],
      },
      {
        type: 'forest',
        fromCoords: [73, 22],
        toCoords: [81, 27],
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
  handleItemPickup()
}
