import { Enemy } from './enemy.js'
import { Player } from './player.js'

export const constants = {
  playerSize: 20,
  startMenuButtonSize: 200,
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
  changes: Partial<CanvasState> | ((state: CanvasState) => Partial<CanvasState>)
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
  mouse: {
    isDown: boolean
    time: number
  }
  mouseX: number
  mouseY: number
}

const inputState: InputState = {
  keysDown: [],
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
    | ((state: typeof inputState) => Partial<typeof inputState>)
) {
  if (typeof changes === 'function') {
    Object.assign(inputState, changes(inputState))
  } else {
    Object.assign(inputState, changes)
  }
}

const previousInputState: InputState = {
  keysDown: [],
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
    | ((state: typeof loopState) => Partial<typeof loopState>)
) {
  if (typeof changes === 'function') {
    Object.assign(loopState, changes(loopState))
  } else {
    Object.assign(loopState, changes)
  }
}

// ##############################

interface GameState {
  status: 'start-menu' | 'settlement' | 'wilderness' | 'battle'
  playTime: number
  player: Player
  enemies: Array<Enemy>
  blocksHorizontal: number
  blocksVertical: number
  blockSize: number
}

const gameState: GameState = {
  status: 'start-menu',
  playTime: 0,
  player: new Player(0, 0, constants.playerSize),
  enemies: [],
  blocksHorizontal: 165,
  blocksVertical: 55,
  blockSize: 0,
}

export function getGameState() {
  return gameState
}

export function updateGameState(
  changes:
    | Partial<typeof gameState>
    | ((state: typeof gameState) => Partial<typeof gameState>)
) {
  if (typeof changes === 'function') {
    Object.assign(gameState, changes(gameState))
  } else {
    Object.assign(gameState, changes)
  }
}

// ##############################

interface HomeState {
  status: 'building' | 'relocating' | 'exploring'
  buildings: Array<{}>
  inventory: Array<{}>
  selected: null | {
    buildingId: number
    coords: { x: number; y: number }
  }
}

let buildingId = 0

function getBuildingId() {
  return buildingId++
}

const homeState: HomeState = {
  status: 'building',
  buildings: [],
  inventory: [],
  selected: null,
}

export function getHomeState() {
  return homeState
}

export function updateHomeState(
  changes:
    | Partial<typeof homeState>
    | ((state: typeof homeState) => Partial<typeof homeState>)
) {
  if (typeof changes === 'function') {
    Object.assign(homeState, changes(homeState))
  } else {
    Object.assign(homeState, changes)
  }
}

// ##############################

interface WildernessState {
  mapId: number
}

const wildernessState: WildernessState = {
  mapId: 0,
}

export function getWildernessState() {
  return wildernessState
}

export function updateWildernessState(
  changes:
    | Partial<typeof wildernessState>
    | ((state: typeof wildernessState) => Partial<typeof wildernessState>)
) {
  if (typeof changes === 'function') {
    Object.assign(wildernessState, changes(wildernessState))
  } else {
    Object.assign(wildernessState, changes)
  }
}

// ##############################

export function isInitialised(
  ctx: CanvasRenderingContext2D | null
): ctx is CanvasRenderingContext2D {
  return ctx !== null
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
