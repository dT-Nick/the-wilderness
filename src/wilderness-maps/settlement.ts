import { getGameState } from '../state.js'
import { MapState } from '../wilderness.js'

export function generateSettlementMapState(): MapState {
  const { blocksVertical, blocksHorizontal } = getGameState()

  return {
    map: [
      { type: 'water', fromCoords: [30, 9], toCoords: [53, 18] },
      { type: 'water', fromCoords: [32, 8], toCoords: [51, 9] },
      { type: 'water', fromCoords: [36, 7], toCoords: [47, 8] },
      { type: 'water', fromCoords: [32, 18], toCoords: [51, 19] },
      { type: 'water', fromCoords: [36, 19], toCoords: [47, 20] },
      { type: 'water', fromCoords: [53, 11], toCoords: [54, 16] },
      { type: 'water', fromCoords: [29, 11], toCoords: [30, 16] },
      { type: 'water', fromCoords: [28, 12], toCoords: [29, 15] },
      { type: 'water', fromCoords: [54, 12], toCoords: [55, 15] },
      { type: 'mountain', fromCoords: [6, 0], toCoords: [8, 5] },
      { type: 'mountain', fromCoords: [8, 0], toCoords: [10, 4] },
      { type: 'mountain', fromCoords: [10, 0], toCoords: [11, 3] },
      { type: 'mountain', fromCoords: [11, 0], toCoords: [13, 2] },
      { type: 'mountain', fromCoords: [13, 0], toCoords: [14, 1] },
      { type: 'mountain', fromCoords: [0, 0], toCoords: [1, 15] },
      { type: 'mountain', fromCoords: [1, 0], toCoords: [2, 14] },
      { type: 'mountain', fromCoords: [2, 0], toCoords: [3, 13] },
      { type: 'mountain', fromCoords: [5, 0], toCoords: [6, 6] },
      { type: 'mountain', fromCoords: [3, 0], toCoords: [4, 12] },
      { type: 'mountain', fromCoords: [4, 0], toCoords: [5, 11] },
      { type: 'forest', fromCoords: [57, 18], toCoords: [62, 23] },
      { type: 'forest', fromCoords: [62, 19], toCoords: [64, 22] },
      { type: 'forest', fromCoords: [58, 23], toCoords: [60, 24] },
      { type: 'forest', fromCoords: [66, 6], toCoords: [77, 16] },
      { type: 'forest', fromCoords: [69, 4], toCoords: [76, 6] },
      { type: 'forest', fromCoords: [71, 3], toCoords: [75, 4] },
      { type: 'forest', fromCoords: [68, 16], toCoords: [74, 18] },
      { type: 'forest', fromCoords: [70, 18], toCoords: [72, 19] },
      { type: 'forest', fromCoords: [64, 8], toCoords: [65, 13] },
      { type: 'forest', fromCoords: [65, 7], toCoords: [66, 15] },
      { type: 'forest', fromCoords: [77, 7], toCoords: [78, 14] },
      { type: 'forest', fromCoords: [16, 9], toCoords: [26, 12] },
      { type: 'forest', fromCoords: [18, 8], toCoords: [24, 9] },
      { type: 'forest', fromCoords: [19, 12], toCoords: [25, 13] },
      { type: 'hill', fromCoords: [11, 26], toCoords: [27, 27] },
      { type: 'hill', fromCoords: [13, 25], toCoords: [23, 26] },
      { type: 'hill', fromCoords: [15, 24], toCoords: [20, 25] },
      { type: 'wall', fromCoords: [15, 1], toCoords: [41, 2] },
      { type: 'wall', fromCoords: [40, 0], toCoords: [41, 1] },
      { type: 'wall', fromCoords: [42, 0], toCoords: [43, 1] },
      { type: 'wall', fromCoords: [42, 1], toCoords: [80, 2] },
      { type: 'wall', fromCoords: [79, 2], toCoords: [81, 3] },
      { type: 'wall', fromCoords: [80, 3], toCoords: [82, 4] },
      { type: 'wall', fromCoords: [81, 4], toCoords: [82, 24] },
      { type: 'wall', fromCoords: [80, 23], toCoords: [81, 25] },
      { type: 'wall', fromCoords: [79, 24], toCoords: [80, 26] },
      { type: 'wall', fromCoords: [14, 2], toCoords: [16, 3] },
      { type: 'wall', fromCoords: [12, 3], toCoords: [15, 4] },
      { type: 'wall', fromCoords: [11, 4], toCoords: [13, 5] },
      { type: 'wall', fromCoords: [9, 5], toCoords: [12, 6] },
      { type: 'wall', fromCoords: [7, 6], toCoords: [10, 7] },
      { type: 'wall', fromCoords: [6, 7], toCoords: [8, 8] },
      { type: 'wall', fromCoords: [6, 8], toCoords: [7, 12] },
      { type: 'wall', fromCoords: [5, 12], toCoords: [7, 13] },
      { type: 'wall', fromCoords: [4, 13], toCoords: [6, 14] },
      { type: 'wall', fromCoords: [3, 14], toCoords: [5, 15] },
      { type: 'wall', fromCoords: [2, 15], toCoords: [4, 16] },
      { type: 'wall', fromCoords: [1, 16], toCoords: [3, 17] },
      { type: 'wall', fromCoords: [1, 17], toCoords: [2, 24] },
      { type: 'wall', fromCoords: [2, 23], toCoords: [3, 25] },
      { type: 'wall', fromCoords: [3, 24], toCoords: [4, 26] },
      { type: 'wall', fromCoords: [4, 25], toCoords: [13, 26] },
      { type: 'wall', fromCoords: [23, 25], toCoords: [79, 26] },
      { type: 'wood', fromCoords: [28, 15], toCoords: [29, 17] },
      { type: 'wood', fromCoords: [29, 16], toCoords: [30, 19] },
      { type: 'wood', fromCoords: [30, 18], toCoords: [32, 19] },
      { type: 'wood', fromCoords: [31, 19], toCoords: [36, 20] },
      { type: 'wood', fromCoords: [35, 20], toCoords: [48, 21] },
      { type: 'wood', fromCoords: [47, 19], toCoords: [52, 20] },
      { type: 'wood', fromCoords: [51, 18], toCoords: [54, 19] },
      { type: 'wood', fromCoords: [53, 16], toCoords: [54, 18] },
      { type: 'wood', fromCoords: [54, 15], toCoords: [55, 17] },
      { type: 'wood', fromCoords: [55, 11], toCoords: [56, 16] },
      { type: 'wood', fromCoords: [54, 10], toCoords: [55, 12] },
      { type: 'wood', fromCoords: [53, 8], toCoords: [54, 11] },
      { type: 'wood', fromCoords: [51, 8], toCoords: [53, 9] },
      { type: 'wood', fromCoords: [47, 7], toCoords: [52, 8] },
      { type: 'wood', fromCoords: [35, 6], toCoords: [48, 7] },
      { type: 'wood', fromCoords: [31, 7], toCoords: [36, 8] },
      { type: 'wood', fromCoords: [30, 8], toCoords: [32, 9] },
      { type: 'wood', fromCoords: [29, 8], toCoords: [30, 11] },
      { type: 'wood', fromCoords: [28, 10], toCoords: [29, 12] },
      { type: 'wood', fromCoords: [27, 11], toCoords: [28, 16] },
      { type: 'hill', fromCoords: [14, 0], toCoords: [40, 1] },
      { type: 'hill', fromCoords: [13, 1], toCoords: [15, 2] },
      { type: 'hill', fromCoords: [12, 2], toCoords: [14, 3] },
      { type: 'hill', fromCoords: [11, 2], toCoords: [12, 4] },
      { type: 'hill', fromCoords: [10, 3], toCoords: [11, 5] },
      { type: 'hill', fromCoords: [8, 4], toCoords: [10, 5] },
      { type: 'hill', fromCoords: [5, 6], toCoords: [6, 12] },
      { type: 'hill', fromCoords: [6, 5], toCoords: [7, 7] },
      { type: 'hill', fromCoords: [7, 5], toCoords: [9, 6] },
      { type: 'hill', fromCoords: [4, 11], toCoords: [5, 13] },
      { type: 'hill', fromCoords: [3, 12], toCoords: [4, 14] },
      { type: 'hill', fromCoords: [2, 13], toCoords: [3, 15] },
      { type: 'hill', fromCoords: [1, 14], toCoords: [2, 16] },
      { type: 'hill', fromCoords: [0, 15], toCoords: [1, 17] },
      { type: 'hill', fromCoords: [81, 24], toCoords: [83, 25] },
      { type: 'hill', fromCoords: [82, 0], toCoords: [83, 24] },
      { type: 'hill', fromCoords: [81, 0], toCoords: [82, 3] },
      { type: 'hill', fromCoords: [80, 0], toCoords: [81, 2] },
      { type: 'hill', fromCoords: [43, 0], toCoords: [80, 1] },
      { type: 'hill', fromCoords: [80, 25], toCoords: [83, 27] },
      { type: 'hill', fromCoords: [27, 26], toCoords: [80, 27] },
      { type: 'hill', fromCoords: [0, 26], toCoords: [11, 27] },
      { type: 'hill', fromCoords: [0, 17], toCoords: [1, 26] },
      { type: 'hill', fromCoords: [1, 24], toCoords: [2, 26] },
      { type: 'hill', fromCoords: [2, 25], toCoords: [3, 26] },
      { type: 'forest', fromCoords: [41, 0], toCoords: [42, 2] },
    ],
    discovered: true,
  }
}

const settlementMapState: MapState = {
  map: [],
  discovered: true,
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
