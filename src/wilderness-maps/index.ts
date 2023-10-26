import { generateMapZeroState, updateMapZeroState } from './map-0.js'
import {
  generateMapMinusOneZeroState,
  updateMapMinusOneZeroState,
} from './map-[-1,0].js'
import {
  generateMapMinusOneOneState,
  updateMapMinusOneOneState,
} from './map-[-1,1].js'
import { generateMapZeroOneState, updateMapZeroOneState } from './map-[0,1].js'
import { generateMapOneZeroState, updateMapOneZeroState } from './map-[1,0].js'
import { generateMapOneOneState, updateMapOneOneState } from './map-[1,1].js'
import {
  generateSettlementMapState,
  updateSettlementMapState,
} from './settlement.js'

export function generateMaps() {
  updateMapZeroState(generateMapZeroState())
  updateMapMinusOneZeroState(generateMapMinusOneZeroState())
  updateMapZeroOneState(generateMapZeroOneState())
  updateMapOneZeroState(generateMapOneZeroState())
  updateMapOneOneState(generateMapOneOneState())
  updateMapMinusOneOneState(generateMapMinusOneOneState())

  updateSettlementMapState(generateSettlementMapState())
}
