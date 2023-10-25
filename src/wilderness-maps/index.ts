import { generateMapZeroState, updateMapZeroState } from './map-0.js'

export function generateMaps() {
  updateMapZeroState(generateMapZeroState())
}
