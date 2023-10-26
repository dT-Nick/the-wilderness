import { generateMapZeroState, updateMapZeroState } from './map-0.js'
import {
  generateSettlementMapState,
  updateSettlementMapState,
} from './settlement.js'

export function generateMaps() {
  updateMapZeroState(generateMapZeroState())
  updateSettlementMapState(generateSettlementMapState())
}
