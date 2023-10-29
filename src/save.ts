import {
  getMapHomeBuildingState,
  updateMapHomeBuildingState,
} from './building-maps/home.js'
import { Player } from './classes.js'
import {
  loadBuilding,
  loadEnemy,
  loadFloorItem,
  loadPlayer,
} from './helpers/load.js'
import { generateGameItems } from './item.js'
import {
  getBattleState,
  getEntireIdState,
  getGameState,
  getLoopState,
  getMessageState,
  getNotificationState,
  getQuestState,
  getSettingsState,
  getSettlementState,
  getWildernessState,
  updateBattleState,
  updateGameState,
  updateIdState,
  updateLoopState,
  updateMessageState,
  updateNotificationState,
  updateQuestState,
  updateSettingsState,
  updateSettlementState,
  updateWildernessState,
} from './state.js'
import { getMapZeroState, updateMapZeroState } from './wilderness-maps/map-0.js'
import {
  getMapMinusOneMinusOneState,
  updateMapMinusOneMinusOneState,
} from './wilderness-maps/map-[-1,-1].js'
import {
  getMapMinusOneZeroState,
  updateMapMinusOneZeroState,
} from './wilderness-maps/map-[-1,0].js'
import {
  getMapMinusOneOneState,
  updateMapMinusOneOneState,
} from './wilderness-maps/map-[-1,1].js'
import {
  getMapMinusTwoMinusOneState,
  updateMapMinusTwoMinusOneState,
} from './wilderness-maps/map-[-2,-1].js'
import {
  getMapMinusTwoZeroState,
  updateMapMinusTwoZeroState,
} from './wilderness-maps/map-[-2,0].js'
import {
  getMapMinusThreeMinusOneState,
  updateMapMinusThreeMinusOneState,
} from './wilderness-maps/map-[-3,-1].js'
import {
  getMapMinusThreeZeroState,
  updateMapMinusThreeZeroState,
} from './wilderness-maps/map-[-3,0].js'
import {
  getMapZeroOneState,
  updateMapZeroOneState,
} from './wilderness-maps/map-[0,1].js'
import {
  getMapZeroTwoState,
  updateMapZeroTwoState,
} from './wilderness-maps/map-[0,2].js'
import {
  getMapZeroThreeState,
  updateMapZeroThreeState,
} from './wilderness-maps/map-[0,3].js'
import {
  getMapOneZeroState,
  updateMapOneZeroState,
} from './wilderness-maps/map-[1,0].js'
import {
  getMapOneOneState,
  updateMapOneOneState,
} from './wilderness-maps/map-[1,1].js'
import {
  getSettlementMapState,
  updateSettlementMapState,
} from './wilderness-maps/settlement.js'

export interface SaveFile {
  loopState: ReturnType<typeof getLoopState>
  gameState: ReturnType<typeof getGameState>
  settlementState: ReturnType<typeof getSettlementState>
  wildernessState: ReturnType<typeof getWildernessState>
  battleState: ReturnType<typeof getBattleState>
  notificationState: ReturnType<typeof getNotificationState>
  messageState: ReturnType<typeof getMessageState>
  questState: ReturnType<typeof getQuestState>
  settingsState: ReturnType<typeof getSettingsState>
  idState: ReturnType<typeof getEntireIdState>
  settlementMapState: ReturnType<typeof getSettlementMapState>
  mapMinusOneMinusOneState: ReturnType<typeof getMapMinusOneMinusOneState>
  mapMinusOneZeroState: ReturnType<typeof getMapMinusOneZeroState>
  mapMinusOneOneState: ReturnType<typeof getMapMinusOneOneState>
  mapMinusTwoMinusOneState: ReturnType<typeof getMapMinusTwoMinusOneState>
  mapMinusTwoZeroState: ReturnType<typeof getMapMinusTwoZeroState>
  mapMinusThreeMinusOneState: ReturnType<typeof getMapMinusThreeMinusOneState>
  mapMinusThreeZeroState: ReturnType<typeof getMapMinusThreeZeroState>
  mapZeroOneState: ReturnType<typeof getMapZeroOneState>
  mapZeroTwoState: ReturnType<typeof getMapZeroTwoState>
  mapZeroThreeState: ReturnType<typeof getMapZeroThreeState>
  mapOneZeroState: ReturnType<typeof getMapOneZeroState>
  mapOneOneState: ReturnType<typeof getMapOneOneState>
  mapZeroState: ReturnType<typeof getMapZeroState>
  mapHomeBuildingState: ReturnType<typeof getMapHomeBuildingState>
}

export function saveGame() {
  const saveFile: SaveFile = {
    loopState: getLoopState(),
    gameState: getGameState(),
    settlementState: getSettlementState(),
    wildernessState: getWildernessState(),
    battleState: getBattleState(),
    notificationState: getNotificationState(),
    messageState: getMessageState(),
    questState: getQuestState(),
    settingsState: getSettingsState(),
    idState: getEntireIdState(),
    settlementMapState: getSettlementMapState(),
    mapMinusOneMinusOneState: getMapMinusOneMinusOneState(),
    mapMinusOneZeroState: getMapMinusOneZeroState(),
    mapMinusOneOneState: getMapMinusOneOneState(),
    mapMinusTwoMinusOneState: getMapMinusTwoMinusOneState(),
    mapMinusTwoZeroState: getMapMinusTwoZeroState(),
    mapMinusThreeMinusOneState: getMapMinusThreeMinusOneState(),
    mapMinusThreeZeroState: getMapMinusThreeZeroState(),
    mapZeroOneState: getMapZeroOneState(),
    mapZeroTwoState: getMapZeroTwoState(),
    mapZeroThreeState: getMapZeroThreeState(),
    mapOneZeroState: getMapOneZeroState(),
    mapOneOneState: getMapOneOneState(),
    mapZeroState: getMapZeroState(),
    mapHomeBuildingState: getMapHomeBuildingState(),
  }

  localStorage.setItem('[wilderness] save_file', JSON.stringify(saveFile))

  updateMessageState({
    message: 'Game successfully saved!',
  })
}

export function loadGame() {
  const saveFile: SaveFile = JSON.parse(
    localStorage.getItem('[wilderness] save_file') || '{}'
  )

  if (Object.keys(saveFile).length === 0) {
    updateMessageState({
      message: 'No save file found!',
    })
    return false
  }

  updateLoopState({
    ...saveFile.loopState,
    lastFrameTime: Date.now(),
  })
  updateGameState({
    ...saveFile.gameState,
    status: saveFile.gameState.prevStatus ?? 'settings',
    player: loadPlayer(saveFile.gameState.player),
    enemies: saveFile.gameState.enemies.map((enemy) => loadEnemy(enemy)),
    floorItems: saveFile.gameState.floorItems.map((item) =>
      loadFloorItem(item)
    ),
    items: generateGameItems(),
  })

  updateSettlementState({
    ...saveFile.settlementState,
    buildings: saveFile.settlementState.buildings.map((building) =>
      loadBuilding(building)
    ),
  })
  updateWildernessState(saveFile.wildernessState)
  updateBattleState(saveFile.battleState)
  updateNotificationState(saveFile.notificationState)
  updateMessageState(saveFile.messageState)
  updateQuestState(saveFile.questState)
  updateSettingsState(saveFile.settingsState)
  updateIdState(saveFile.idState)
  updateSettlementMapState(saveFile.settlementMapState)
  updateMapMinusOneMinusOneState(saveFile.mapMinusOneMinusOneState)
  updateMapMinusOneZeroState(saveFile.mapMinusOneZeroState)
  updateMapMinusOneOneState(saveFile.mapMinusOneOneState)
  updateMapMinusTwoMinusOneState(saveFile.mapMinusTwoMinusOneState)
  updateMapMinusTwoZeroState(saveFile.mapMinusTwoZeroState)
  updateMapMinusThreeMinusOneState(saveFile.mapMinusThreeMinusOneState)
  updateMapMinusThreeZeroState(saveFile.mapMinusThreeZeroState)
  updateMapZeroOneState(saveFile.mapZeroOneState)
  updateMapZeroTwoState(saveFile.mapZeroTwoState)
  updateMapZeroThreeState(saveFile.mapZeroThreeState)
  updateMapOneZeroState(saveFile.mapOneZeroState)
  updateMapOneOneState(saveFile.mapOneOneState)
  updateMapZeroState(saveFile.mapZeroState)
  updateMapHomeBuildingState(saveFile.mapHomeBuildingState)

  return true
}
