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
  getMapsState,
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
  updateMapsState,
  updateMessageState,
  updateNotificationState,
  updateQuestState,
  updateSettingsState,
  updateSettlementState,
  updateWildernessState,
} from './state.js'

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
  mapsState: ReturnType<typeof getMapsState>
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
    mapsState: getMapsState(),
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
  updateMapsState(saveFile.mapsState)

  return true
}
