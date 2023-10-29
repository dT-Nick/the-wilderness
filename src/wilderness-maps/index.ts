import { generateMapZeroState, updateMapZeroState } from './map-0.js'
import {
  generateMapMinusOneMinusOneState,
  updateMapMinusOneMinusOneState,
} from './map-[-1,-1].js'
import {
  generateMapMinusOneZeroState,
  updateMapMinusOneZeroState,
} from './map-[-1,0].js'
import {
  generateMapMinusOneOneState,
  updateMapMinusOneOneState,
} from './map-[-1,1].js'
import {
  generateMapMinusTwoMinusOneState,
  updateMapMinusTwoMinusOneState,
} from './map-[-2,-1].js'
import {
  generateMapMinusTwoZeroState,
  updateMapMinusTwoZeroState,
} from './map-[-2,0].js'
import {
  generateMapMinusThreeMinusOneState,
  updateMapMinusThreeMinusOneState,
} from './map-[-3,-1].js'
import {
  generateMapMinusThreeZeroState,
  updateMapMinusThreeZeroState,
} from './map-[-3,0].js'
import { generateMapZeroOneState, updateMapZeroOneState } from './map-[0,1].js'
import { generateMapZeroTwoState, updateMapZeroTwoState } from './map-[0,2].js'
import {
  generateMapZeroThreeState,
  updateMapZeroThreeState,
} from './map-[0,3].js'
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
  updateMapMinusTwoZeroState(generateMapMinusTwoZeroState())
  updateMapMinusThreeZeroState(generateMapMinusThreeZeroState())
  updateMapMinusThreeMinusOneState(generateMapMinusThreeMinusOneState())
  updateMapMinusTwoMinusOneState(generateMapMinusTwoMinusOneState())
  updateMapMinusOneMinusOneState(generateMapMinusOneMinusOneState())
  updateMapZeroTwoState(generateMapZeroTwoState())
  updateMapZeroThreeState(generateMapZeroThreeState())

  updateSettlementMapState(generateSettlementMapState())
}
