import { getGameState } from '../state.js'
import { MapState } from '../wilderness.js'

export function generateSettlementMapState(): MapState {
  const { blocksVertical, blocksHorizontal } = getGameState()

  return {
    map: [
      {
        type: 'water',
        fromCoords: [
          blocksHorizontal % 2 === 0
            ? Math.floor(blocksHorizontal / 2) - 10
            : Math.floor(blocksHorizontal / 2) - 9,
          blocksVertical % 2 === 0
            ? Math.floor(blocksVertical / 2) - 5
            : Math.floor(blocksVertical / 2) - 4,
        ],
        toCoords: [
          Math.floor(blocksHorizontal / 2) + 10,
          Math.floor(blocksVertical / 2) + 5,
        ],
      },
      {
        type: 'forest',
        fromCoords: [Math.floor(blocksHorizontal / 2), 0],
        toCoords: [Math.floor(blocksHorizontal / 2) + 1, 1],
      },
    ],
  }
}

const settlementMapState: MapState = {
  map: [],
}

export function getSettlementMapState() {
  return settlementMapState
}

export function updateSettlementMapState(
  changes:
    | Partial<typeof settlementMapState>
    | ((state: typeof settlementMapState) => Partial<typeof settlementMapState>)
) {
  if (typeof changes === 'function') {
    Object.assign(settlementMapState, changes(settlementMapState))
  } else {
    Object.assign(settlementMapState, changes)
  }
}
