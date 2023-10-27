import {
  drawMapHomeBuilding,
  handleMapHomeBuildingInput,
} from './building-maps/home.js'
import { handleSettingsTriggerInputs } from './input.js'
import { getGameState, getSettlementState } from './state.js'

export function drawBuildingInterior() {
  const { buildingId } = getGameState()
  const { buildings } = getSettlementState()

  const building = buildings.find((b) => b.id === buildingId)
  if (!building) return

  switch (building.name) {
    case 'home': {
      drawMapHomeBuilding()
      break
    }
    default: {
      throw new Error(`Unknown building name: ${building.name}`)
    }
  }
}

export function handleBuildingInput() {
  const { buildingId } = getGameState()
  const { buildings } = getSettlementState()

  const building = buildings.find((b) => b.id === buildingId)
  if (!building) throw new Error(`Building not found: ${buildingId}`)

  switch (building.name) {
    case 'home': {
      handleMapHomeBuildingInput()
      break
    }
    default: {
      throw new Error(`Unknown building name: ${building.name}`)
    }
  }

  handleSettingsTriggerInputs()
}
