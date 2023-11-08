import { Building } from './classes/Building.js'
import { ConsumableItem } from './classes/ConsumableItem.js'
import { Enemy } from './classes/Enemy.js'
import { EquipableItem } from './classes/EquipableItem.js'
import { FloorItem } from './classes/FloorItem.js'
import { type Player } from './classes/Player.js'
import { QuestItem } from './classes/QuestItem.js'
import { generateMapZeroDesign } from './wilderness-maps/map-[0,0].js'
import { generateMapMinusOneMinusOneDesign } from './wilderness-maps/map-[-1,-1].js'
import { generateMapMinusOneZeroDesign } from './wilderness-maps/map-[-1,0].js'
import { generateMapMinusOneOneDesign } from './wilderness-maps/map-[-1,1].js'
import { generateMapMinusTwoMinusOneDesign } from './wilderness-maps/map-[-2,-1].js'
import { generateMapMinusTwoZeroDesign } from './wilderness-maps/map-[-2,0].js'
import { generateMapMinusThreeMinusOneDesign } from './wilderness-maps/map-[-3,-1].js'
import { generateMapMinusThreeZeroDesign } from './wilderness-maps/map-[-3,0].js'
import { generateMapZeroOneDesign } from './wilderness-maps/map-[0,1].js'
import { generateMapZeroTwoDesign } from './wilderness-maps/map-[0,2].js'
import { generateMapZeroThreeDesign } from './wilderness-maps/map-[0,3].js'
import { generateMapOneZeroDesign } from './wilderness-maps/map-[1,0].js'
import { generateMapOneOneDesign } from './wilderness-maps/map-[1,1].js'
import { generateSettlementMapDesign } from './wilderness-maps/settlement.js'
import { MapDesign } from './wilderness.js'

export const constants: {
  playerSize: number
  startMenuButtonSize: number
  startingScene: 'settlement' | 'map-creator' | 'settings' | 'inventory'
  messageTime: number
} = {
  playerSize: 20,
  startMenuButtonSize: 200,
  startingScene: 'settlement',
  messageTime: 2500,
}

// ##############################

interface CanvasState {
  height: number
  width: number
  scale: number
  verticalOffset: number
  ctx: CanvasRenderingContext2D | null
}

const canvasState: CanvasState = {
  height: window.innerHeight,
  width: window.innerWidth,
  scale: window.innerWidth / 1920,
  verticalOffset: 0,
  ctx: null,
}

export function getCanvasState() {
  return canvasState
}

export function updateCanvasState(
  changes:
    | Partial<CanvasState>
    | ((state: CanvasState) => Partial<typeof state>)
) {
  if (typeof changes === 'function') {
    Object.assign(canvasState, changes(canvasState))
  } else {
    Object.assign(canvasState, changes)
  }
}

// ##############################

interface InputState {
  keysDown: Array<{
    key: string
    time: number
  }>
  touches: Array<{
    identifier: number
    type:
      | 'buttonA'
      | 'buttonB'
      | 'buttonY'
      | 'buttonX'
      | 'dpadLeft'
      | 'dpadRight'
      | 'dpadUp'
      | 'dpadDown'
      | 'start'
  }>
  showGamepad: boolean
  mouse: {
    isDown: boolean
    time: number
  }
  mouseX: number
  mouseY: number
}

const inputState: InputState = {
  keysDown: [],
  touches: [],
  showGamepad: false,
  mouse: {
    isDown: false,
    time: 0,
  },
  mouseX: 0,
  mouseY: 0,
}

export function getInputState() {
  return inputState
}

export function updateInputState(
  changes:
    | Partial<typeof inputState>
    | ((state: typeof inputState) => Partial<typeof state>)
) {
  if (typeof changes === 'function') {
    Object.assign(inputState, changes(inputState))
  } else {
    Object.assign(inputState, changes)
  }
}

const previousInputState: InputState = {
  keysDown: [],
  touches: [],
  showGamepad: false,
  mouse: {
    isDown: false,
    time: 0,
  },
  mouseX: 0,
  mouseY: 0,
}

export function getPrevInputState() {
  return previousInputState
}

export function updatePrevInputState() {
  Object.assign(previousInputState, inputState)
}

// ##############################

interface LoopState {
  lastFrameTime: number
  deltaTime: number
}

const loopState: LoopState = {
  lastFrameTime: 0,
  deltaTime: 0,
}

export function getLoopState() {
  return loopState
}

export function getDeltaFrames() {
  return loopState.deltaTime / (1000 / 60)
}

export function updateLoopState(
  changes:
    | Partial<typeof loopState>
    | ((state: typeof loopState) => Partial<typeof state>)
) {
  if (typeof changes === 'function') {
    Object.assign(loopState, changes(loopState))
  } else {
    Object.assign(loopState, changes)
  }
}

// ##############################

interface GameState {
  status:
    | 'start-menu'
    | 'settlement'
    | 'wilderness'
    | 'battle'
    | 'map-creator'
    | 'world-map'
    | 'building'
    | 'game-over'
    | 'settings'
    | 'inventory'

  prevStatus:
    | null
    | 'start-menu'
    | 'settlement'
    | 'wilderness'
    | 'battle'
    | 'world-map'
    | 'map-creator'
    | 'building'
    | 'game-over'
    | 'settings'
    | 'inventory'

  playTime: number
  player: Player | null
  enemies: Array<Enemy>
  inventory: Array<{
    id: number
    itemId: string
  }>
  floorItems: Array<FloorItem>
  items: Array<ConsumableItem | EquipableItem | QuestItem>
  blocksHorizontal: number
  blocksVertical: number
  blockSize: number
  buildingId: number | null
}

const gameState: GameState = {
  status: 'start-menu',
  prevStatus: null,
  playTime: 0,
  player: null,
  enemies: [],
  inventory: [],
  floorItems: [],
  items: [],
  blocksHorizontal: 83,
  blocksVertical: 27,
  blockSize: 0,
  buildingId: null,
}

export function getGameState() {
  return gameState
}

export function updateGameState(
  changes:
    | Partial<typeof gameState>
    | ((state: typeof gameState) => Partial<typeof state>)
) {
  if (typeof changes === 'function') {
    Object.assign(gameState, changes(gameState))
  } else {
    Object.assign(gameState, changes)
  }
}

// ##############################

interface SettlementState {
  status: 'building' | 'placing' | 'relocating' | 'exploring'
  buildings: Array<Building>
  selectedIndex: number
  selected: null | number
}

const settlementState: SettlementState = {
  status: 'exploring',
  buildings: [],
  selectedIndex: 0,
  selected: null,
}

export function getSettlementState() {
  return settlementState
}

export function updateSettlementState(
  changes:
    | Partial<typeof settlementState>
    | ((state: typeof settlementState) => Partial<typeof state>)
) {
  if (typeof changes === 'function') {
    Object.assign(settlementState, changes(settlementState))
  } else {
    Object.assign(settlementState, changes)
  }
}

// ##############################

interface WildernessState {
  wildernessTime: number
  enemyMovementCycleCount: number
  spawnCycleCount: number
}

const wildernessState: WildernessState = {
  wildernessTime: 0,
  enemyMovementCycleCount: 0,
  spawnCycleCount: 0,
}

export function getWildernessState() {
  return wildernessState
}

export function updateWildernessState(
  changes:
    | Partial<typeof wildernessState>
    | ((state: typeof wildernessState) => Partial<typeof state>)
) {
  if (typeof changes === 'function') {
    Object.assign(wildernessState, changes(wildernessState))
  } else {
    Object.assign(wildernessState, changes)
  }
}

// ##############################

export interface BlockType {
  name:
    | 'grass'
    | 'water'
    | 'mountain'
    | 'forest'
    | 'hill'
    | 'wood'
    | 'wall'
    | 'void'
    | 'carpet'
    | 'hellstone'
  colour: string
  isPassable: boolean
}

interface BlockTypeState {
  blockTypes: Array<BlockType>
}

const blockTypeState: BlockTypeState = {
  blockTypes: [
    {
      name: 'grass',
      colour: '#009900',
      isPassable: true,
    },
    {
      name: 'water',
      colour: '#0000ff',
      isPassable: false,
    },
    {
      name: 'mountain',
      colour: '#ffffff',
      isPassable: false,
    },
    {
      name: 'forest',
      colour: '#006600',
      isPassable: true,
    },
    {
      name: 'hill',
      colour: '#223300',
      isPassable: false,
    },
    {
      name: 'wood',
      colour: '#A1662F',
      isPassable: true,
    },
    {
      name: 'wall',
      colour: '#444455',
      isPassable: false,
    },
    {
      name: 'void',
      colour: '#000000',
      isPassable: false,
    },
    {
      name: 'carpet',
      colour: '#663399',
      isPassable: true,
    },
    {
      name: 'hellstone',
      colour: '#681d1a',
      isPassable: true,
    },
  ],
}

export function getBlockTypeState() {
  return blockTypeState
}

export function getBlockPropertiesFromName(name: string) {
  const blockType = blockTypeState.blockTypes.find(
    (block) => block.name === name
  )
  if (!blockType) {
    throw new Error(`Unknown block name: ${name}`)
  }
  return blockType
}

// ##############################

interface BattleState {
  enemyId: number | null
  lastMove: null | 'player' | 'enemy'
  turns: number
  status: 'play' | 'wait'
  playerMenu: 'main' | 'moves' | 'items'
  waitStart: null | number
  waitLengthMs: number
  selectedMove: number
  selectedOption: number
  selectedItem: number
}

const battleState: BattleState = {
  enemyId: null,
  lastMove: null,
  turns: 0,
  status: 'play',
  playerMenu: 'main',
  waitStart: null,
  waitLengthMs: 0,
  selectedMove: 1,
  selectedOption: 1,
  selectedItem: 1,
}

export function getBattleState() {
  return battleState
}

export function updateBattleState(
  changes:
    | Partial<typeof battleState>
    | ((state: typeof battleState) => Partial<typeof state>)
) {
  if (typeof changes === 'function') {
    Object.assign(battleState, changes(battleState))
  } else {
    Object.assign(battleState, changes)
  }
}

// ##############################

interface NotificationState {
  notifications: Array<{
    text: string
    startTime: number
  }>
}

const notificationState: NotificationState = {
  notifications: [],
}

export function getNotificationState() {
  return notificationState
}

export function updateNotificationState(
  changes:
    | Partial<typeof notificationState>
    | ((state: typeof notificationState) => Partial<typeof state>)
) {
  if (typeof changes === 'function') {
    Object.assign(notificationState, changes(notificationState))
  } else {
    Object.assign(notificationState, changes)
  }
}

export function addNotification(text: string) {
  const { status } = getGameState()
  const { lastFrameTime } = getLoopState()
  if (status === 'game-over') return
  updateNotificationState((c) => ({
    notifications: [
      ...c.notifications,
      {
        text,
        startTime: lastFrameTime,
      },
    ],
  }))
}

export function removeTimedOutNotifications() {
  updateNotificationState((c) => ({
    notifications: c.notifications.filter(
      (n) => n.startTime + constants.messageTime > Date.now()
    ),
  }))
}

// ##############################

interface MessageState {
  message: null | string
}

const messageState: MessageState = {
  message: null,
}

export function getMessageState() {
  return messageState
}

export function updateMessageState(
  changes:
    | Partial<typeof messageState>
    | ((state: typeof messageState) => Partial<typeof state>)
) {
  if (typeof changes === 'function') {
    Object.assign(messageState, changes(messageState))
  } else {
    Object.assign(messageState, changes)
  }
}

export function isMessageActive(message?: string | null): message is string {
  const { message: activeMessage } = getMessageState()

  return activeMessage !== null
}

export function clearMessage() {
  updateMessageState({ message: null })
}

// ##############################

interface QuestState {
  hasBridgeSpawned: boolean
}

const questState: QuestState = {
  hasBridgeSpawned: false,
}

export function getQuestState() {
  return questState
}

export function updateQuestState(
  changes:
    | Partial<typeof questState>
    | ((state: typeof questState) => Partial<typeof state>)
) {
  if (typeof changes === 'function') {
    Object.assign(questState, changes(questState))
  } else {
    Object.assign(questState, changes)
  }
}

// ##############################

interface SettingsState {
  selectedMenu: number
  selectedInventoryTopMenu: number
  selectedInventoryItem: number
  prevGameStatus:
    | null
    | 'start-menu'
    | 'settlement'
    | 'wilderness'
    | 'battle'
    | 'world-map'
    | 'map-creator'
    | 'building'
    | 'game-over'
    | 'settings'
    | 'inventory'
}

const settingsState: SettingsState = {
  selectedMenu: 0,
  selectedInventoryTopMenu: 0,
  selectedInventoryItem: 0,
  prevGameStatus: null,
}

export function getSettingsState() {
  return settingsState
}

export function updateSettingsState(
  changes:
    | Partial<typeof settingsState>
    | ((state: typeof settingsState) => Partial<typeof state>)
) {
  if (typeof changes === 'function') {
    Object.assign(settingsState, changes(settingsState))
  } else {
    Object.assign(settingsState, changes)
  }
}

// ##############################

interface IdState {
  entityId: number
  buildingId: number
}

const idState: IdState = {
  entityId: 0,
  buildingId: 0,
}

export function getIdState(type: 'entityId' | 'buildingId') {
  updateIdState((c) => ({
    [type]: c[type] + 1,
  }))

  return idState[type]
}

export function getEntireIdState() {
  return idState
}

export function updateIdState(
  changes:
    | Partial<typeof idState>
    | ((state: typeof idState) => Partial<typeof state>)
) {
  if (typeof changes === 'function') {
    Object.assign(idState, changes(idState))
  } else {
    Object.assign(idState, changes)
  }
}

// ##############################

interface StartMenuState {
  selectedButton: number
}

const startMenuState: StartMenuState = {
  selectedButton: 0,
}

export function getStartMenuState() {
  return startMenuState
}

export function updateStartMenuState(
  changes:
    | Partial<typeof startMenuState>
    | ((state: typeof startMenuState) => Partial<typeof state>)
) {
  if (typeof changes === 'function') {
    Object.assign(startMenuState, changes(startMenuState))
  } else {
    Object.assign(startMenuState, changes)
  }
}

// ##############################

type MapsState = {
  currentMapId: string
  maps: Array<{
    id: string
    name: string
    isDiscovered: boolean
    design: MapDesign
  }>
}

export const mapsState: MapsState = {
  currentMapId: 'settlement',
  maps: [
    {
      id: '[-1,-1]',
      name: 'Wilderness',
      isDiscovered: false,
      design: generateMapMinusOneMinusOneDesign(),
    },
    {
      id: '[-1,0]',
      name: 'Wilderness',
      isDiscovered: false,
      design: generateMapMinusOneZeroDesign(),
    },
    {
      id: '[-1,1]',
      name: 'Wilderness',
      isDiscovered: false,
      design: generateMapMinusOneOneDesign(),
    },
    {
      id: '[-2,-1]',
      name: 'Wilderness',
      isDiscovered: false,
      design: generateMapMinusTwoMinusOneDesign(),
    },
    {
      id: '[-2,0]',
      name: 'Wilderness',
      isDiscovered: false,
      design: generateMapMinusTwoZeroDesign(),
    },
    {
      id: '[-3,-1]',
      name: 'Wilderness',
      isDiscovered: false,
      design: generateMapMinusThreeMinusOneDesign(),
    },
    {
      id: '[-3,0]',
      name: 'Wilderness',
      isDiscovered: false,
      design: generateMapMinusThreeZeroDesign(),
    },
    {
      id: '[0,0]',
      name: 'Defence zone',
      isDiscovered: false,
      design: generateMapZeroDesign(),
    },
    {
      id: '[0,1]',
      name: 'Wilderness',
      isDiscovered: false,
      design: generateMapZeroOneDesign(),
    },
    {
      id: '[0,2]',
      name: 'Wilderness',
      isDiscovered: false,
      design: generateMapZeroTwoDesign(),
    },
    {
      id: '[0,3]',
      name: 'Wilderness',
      isDiscovered: false,
      design: generateMapZeroThreeDesign(),
    },
    {
      id: '[1,0]',
      name: 'Wilderness',
      isDiscovered: false,
      design: generateMapOneZeroDesign(),
    },
    {
      id: '[1,1]',
      name: 'Wilderness',
      isDiscovered: false,
      design: generateMapOneOneDesign(),
    },
    {
      id: 'settlement',
      name: 'Settlement',
      isDiscovered: true,
      design: generateSettlementMapDesign(),
    },
    {
      id: 'home',
      name: 'Home',
      isDiscovered: true,
      design: [],
    },
  ],
}

export function getMapsState() {
  return mapsState
}

export function getCurrentMap() {
  const map = mapsState.maps.find((m) => m.id === mapsState.currentMapId)
  if (!map) {
    throw new Error(`Unknown map id: ${mapsState.currentMapId}`)
  }
  return map
}

export function getMapById(mapId: string) {
  const map = mapsState.maps.find((m) => m.id === mapId)
  if (!map) {
    throw new Error(`Unknown map id: ${mapId}`)
  }
  return map
}

export function updateMapsState(
  changes:
    | Partial<typeof mapsState>
    | ((state: typeof mapsState) => Partial<typeof state>)
) {
  if (typeof changes === 'function') {
    Object.assign(mapsState, changes(mapsState))
  } else {
    Object.assign(mapsState, changes)
  }
}

export function updateMap(
  mapId: string,
  updates: Partial<MapsState['maps'][number]>
) {
  updateMapsState((c) => ({
    maps: c.maps.map((m) => {
      if (m.id === mapId) {
        return {
          ...m,
          ...updates,
        }
      }
      return m
    }),
  }))
}

// ##############################

export function isInitialised(
  ctx: CanvasRenderingContext2D | null
): ctx is CanvasRenderingContext2D {
  return ctx !== null
}

export function isPlayerInitialised(player: Player | null): player is Player {
  return player !== null
}

// type WindowState = {
//   height: number
//   width: number
//   scale: number
//   keysDown: Array<string>
//   prevKeysDown: Array<string>
//   prevMouseDown: boolean
//   mouseDown: boolean
//   mouseX: number
//   mouseY: number
//   blocksHorizontal: number
//   blockSize: number
//   blocksVertical: number
//   verticalOffset: number
// }

// type State =
//   | ({
//       status: 'inactive'
//       lastFrameTime: null
//       deltaTime: null
//       ctx: null
//       player: null
//       enemy: null
//     } & WindowState)
//   | ({
//       status: 'active' | 'paused'
//       lastFrameTime: number
//       deltaTime: number
//       ctx: CanvasRenderingContext2D
//       player: Player
//       enemy: Enemy
//     } & WindowState)

// const defaultStateValues: State = {
//   status: 'inactive',
//   lastFrameTime: null,
//   deltaTime: null,
//   ctx: null,
//   height: window.innerHeight,
//   width: window.innerWidth,
//   scale: window.innerWidth / 1920,
//   keysDown: [],
//   prevKeysDown: [],
//   prevMouseDown: false,
//   mouseDown: false,
//   player: null,
//   enemy: null,
//   mouseX: 0,
//   mouseY: 0,
//   blocksHorizontal: 33,
//   blocksVertical: 11,
//   verticalOffset: 0,
//   blockSize: 0,
// }

// class GameState {
//   state: State
//   constructor() {
//     this.state = defaultStateValues
//   }

//   public updateValues(stateValues: Partial<State>) {
//     Object.assign(this.state, stateValues)
//   }
// }

// export const gameState = new GameState()

// export function updateState(
//   newValues: Partial<State> | ((state: State) => Partial<State>)
// ) {
//   if (typeof newValues === 'function') {
//     return gameState.updateValues({ ...newValues(gameState.state) })
//   } else {
//     gameState.updateValues({
//       ...newValues,
//     })
//   }
// }

// type BattleStateType = {
//   selectedMove: number
//   enemyId: number
//   turns: number
//   lastMove: null | 'player' | 'enemy'
//   status: 'play' | 'wait'
//   waitStart: null | number
//   waitLengthMs: number
// }

// const defaultBattleStateValues: BattleStateType = {
//   selectedMove: 1,
//   enemyId: 1,
//   turns: 0,
//   lastMove: null,
//   status: 'play',
//   waitStart: null,
//   waitLengthMs: 0,
// }

// export class BattleState {
//   state: BattleStateType
//   constructor() {
//     this.state = defaultBattleStateValues
//   }

//   public updateValues(stateValues: Partial<BattleStateType>) {
//     Object.assign(this.state, stateValues)
//   }

//   get isWaiting() {
//     if (
//       this.state.waitStart &&
//       this.state.waitStart + this.state.waitLengthMs < Date.now()
//     ) {
//       this.state.status = 'play'
//     }
//     return this.state.status === 'wait'
//   }
// }

// export function updateBattleState(
//   newValues:
//     | Partial<BattleStateType>
//     | ((state: BattleStateType) => Partial<BattleStateType>)
// ) {
//   if (typeof newValues === 'function') {
//     return battleState.updateValues({ ...newValues(battleState.state) })
//   } else {
//     battleState.updateValues({
//       ...newValues,
//     })
//   }
// }

// export const battleState = new BattleState()
