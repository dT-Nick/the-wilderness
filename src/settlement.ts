import { handlePlayerMovement } from './player.js'
import {
  deriveRestrictedCoordsFromMap,
  drawBackgroundFromMap,
} from './wilderness.js'
import { getSettlementMapState } from './wilderness-maps/settlement.js'
import { getGameState, isPlayerInitialised, updateGameState } from './state.js'
import { handleSettingsTriggerInputs, isKeyCurrentlyDown } from './input.js'
import { getMapZeroState, updateMapZeroState } from './wilderness-maps/map-0.js'

export function drawSettlementMap() {
  const { map } = getSettlementMapState()
  drawBackgroundFromMap(map)
}

export function handleSettlementInput() {
  const { map } = getSettlementMapState()
  const restrictedCoords = deriveRestrictedCoordsFromMap(map)

  handlePlayerMovement(restrictedCoords)
  handleSettingsTriggerInputs()
  handleSettlementExit()
}

export function handleSettlementExit() {
  const { player, blocksHorizontal, blocksVertical } = getGameState()
  if (!isPlayerInitialised(player)) return

  const [pCoordsX, pCoordsY] = player.coordinates
  if (pCoordsX === Math.floor(blocksHorizontal / 2) && pCoordsY === 0) {
    if (isKeyCurrentlyDown(['w', 'arrowup']) && player.faceDirection === 'up') {
      updateGameState({
        status: 'wilderness',
      })
      const { discovered } = getMapZeroState()
      if (!discovered) {
        updateMapZeroState({
          discovered: true,
        })
      }
      player.goToCoordinates(
        Math.floor(blocksHorizontal / 2),
        blocksVertical - 1
      )
      player.stopMoving()
    }
  }
}
