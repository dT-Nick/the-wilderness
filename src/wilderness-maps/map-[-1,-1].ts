import { MapDesign } from '../wilderness.js'

export function generateMapMinusOneMinusOneDesign(): MapDesign {
  return [
    { type: 'hill', fromCoords: [18, 22], toCoords: [24, 23] },
    { type: 'hill', fromCoords: [4, 3], toCoords: [22, 4] },
    { type: 'hill', fromCoords: [11, 4], toCoords: [15, 5] },
    { type: 'hill', fromCoords: [0, 2], toCoords: [29, 3] },
    { type: 'hill', fromCoords: [46, 2], toCoords: [62, 3] },
    { type: 'hill', fromCoords: [51, 3], toCoords: [60, 4] },
    { type: 'hill', fromCoords: [54, 4], toCoords: [57, 5] },
    { type: 'hill', fromCoords: [0, 3], toCoords: [4, 4] },
    { type: 'mountain', fromCoords: [72, 0], toCoords: [83, 15] },
    { type: 'mountain', fromCoords: [3, 25], toCoords: [24, 26] },
    { type: 'mountain', fromCoords: [8, 24], toCoords: [24, 25] },
    { type: 'mountain', fromCoords: [16, 23], toCoords: [24, 24] },
    { type: 'hill', fromCoords: [0, 25], toCoords: [3, 26] },
    { type: 'hill', fromCoords: [82, 23], toCoords: [83, 27] },
    { type: 'hill', fromCoords: [81, 24], toCoords: [82, 27] },
    { type: 'hill', fromCoords: [80, 25], toCoords: [81, 27] },
    { type: 'hill', fromCoords: [78, 26], toCoords: [80, 27] },
    { type: 'mountain', fromCoords: [0, 26], toCoords: [78, 27] },
    { type: 'mountain', fromCoords: [24, 23], toCoords: [78, 26] },
    { type: 'mountain', fromCoords: [78, 23], toCoords: [80, 26] },
    { type: 'mountain', fromCoords: [80, 23], toCoords: [82, 24] },
    { type: 'mountain', fromCoords: [80, 24], toCoords: [81, 25] },
    { type: 'mountain', fromCoords: [67, 15], toCoords: [83, 23] },
    { type: 'mountain', fromCoords: [49, 19], toCoords: [67, 23] },
    { type: 'mountain', fromCoords: [30, 21], toCoords: [49, 23] },
    { type: 'mountain', fromCoords: [24, 22], toCoords: [30, 23] },
    { type: 'mountain', fromCoords: [40, 20], toCoords: [49, 21] },
    { type: 'mountain', fromCoords: [58, 18], toCoords: [67, 19] },
    { type: 'mountain', fromCoords: [63, 17], toCoords: [67, 18] },
    { type: 'mountain', fromCoords: [65, 16], toCoords: [67, 17] },
    { type: 'mountain', fromCoords: [68, 14], toCoords: [72, 15] },
    { type: 'mountain', fromCoords: [69, 13], toCoords: [72, 14] },
    { type: 'mountain', fromCoords: [70, 0], toCoords: [72, 13] },
    { type: 'mountain', fromCoords: [67, 0], toCoords: [70, 1] },
    { type: 'mountain', fromCoords: [68, 1], toCoords: [70, 4] },
    { type: 'mountain', fromCoords: [69, 4], toCoords: [70, 7] },
    { type: 'hill', fromCoords: [0, 0], toCoords: [67, 2] },
    { type: 'hill', fromCoords: [65, 2], toCoords: [68, 6] },
    { type: 'hill', fromCoords: [67, 6], toCoords: [69, 14] },
    { type: 'hill', fromCoords: [69, 7], toCoords: [70, 13] },
    { type: 'hill', fromCoords: [68, 4], toCoords: [69, 6] },
    { type: 'hill', fromCoords: [67, 1], toCoords: [68, 2] },
    { type: 'hill', fromCoords: [2, 24], toCoords: [8, 25] },
    { type: 'hill', fromCoords: [5, 23], toCoords: [16, 24] },
    { type: 'hill', fromCoords: [10, 22], toCoords: [18, 23] },
    { type: 'hill', fromCoords: [16, 21], toCoords: [30, 22] },
    { type: 'hill', fromCoords: [20, 20], toCoords: [25, 21] },
    { type: 'hill', fromCoords: [28, 20], toCoords: [40, 21] },
    { type: 'hill', fromCoords: [36, 19], toCoords: [49, 20] },
    { type: 'hill', fromCoords: [41, 18], toCoords: [58, 19] },
    { type: 'hill', fromCoords: [43, 17], toCoords: [49, 18] },
    { type: 'hill', fromCoords: [45, 16], toCoords: [47, 17] },
    { type: 'hill', fromCoords: [59, 16], toCoords: [65, 17] },
    { type: 'hill', fromCoords: [54, 17], toCoords: [63, 18] },
    { type: 'hill', fromCoords: [62, 15], toCoords: [67, 16] },
    { type: 'hill', fromCoords: [64, 14], toCoords: [68, 15] },
    { type: 'hill', fromCoords: [65, 13], toCoords: [67, 14] },
    { type: 'hill', fromCoords: [66, 12], toCoords: [67, 13] },
    { type: 'hill', fromCoords: [66, 6], toCoords: [67, 7] },
    { type: 'hill', fromCoords: [64, 2], toCoords: [65, 5] },
    { type: 'hill', fromCoords: [63, 2], toCoords: [64, 3] },
    { type: 'forest', fromCoords: [3, 16], toCoords: [8, 20] },
    { type: 'forest', fromCoords: [21, 6], toCoords: [31, 10] },
    { type: 'forest', fromCoords: [41, 11], toCoords: [45, 14] },
    { type: 'water', fromCoords: [58, 6], toCoords: [64, 7] },
    { type: 'water', fromCoords: [60, 5], toCoords: [63, 6] },
    { type: 'water', fromCoords: [57, 7], toCoords: [65, 8] },
    { type: 'water', fromCoords: [57, 11], toCoords: [65, 12] },
    { type: 'water', fromCoords: [59, 13], toCoords: [63, 14] },
    { type: 'wood', fromCoords: [56, 8], toCoords: [62, 11] },
    { type: 'water', fromCoords: [62, 8], toCoords: [65, 11] },
    { type: 'water', fromCoords: [58, 12], toCoords: [64, 13] },
    { type: 'forest', fromCoords: [22, 10], toCoords: [30, 11] },
    { type: 'forest', fromCoords: [24, 11], toCoords: [26, 12] },
    { type: 'forest', fromCoords: [25, 5], toCoords: [31, 6] },
    { type: 'forest', fromCoords: [27, 4], toCoords: [29, 5] },
    { type: 'forest', fromCoords: [20, 7], toCoords: [21, 9] },
    { type: 'forest', fromCoords: [31, 7], toCoords: [32, 9] },
    { type: 'forest', fromCoords: [43, 14], toCoords: [45, 15] },
    { type: 'forest', fromCoords: [41, 10], toCoords: [42, 11] },
    { type: 'forest', fromCoords: [45, 12], toCoords: [46, 13] },
    { type: 'forest', fromCoords: [40, 12], toCoords: [41, 14] },
    { type: 'forest', fromCoords: [4, 15], toCoords: [7, 16] },
    { type: 'forest', fromCoords: [8, 17], toCoords: [9, 19] },
    { type: 'forest', fromCoords: [6, 20], toCoords: [8, 21] },
    { type: 'forest', fromCoords: [2, 18], toCoords: [3, 20] },
    { type: 'forest', fromCoords: [3, 20], toCoords: [4, 21] },
  ]
}

export function handleMapMinusOneMinusOneInput() {}
