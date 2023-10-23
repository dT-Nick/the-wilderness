import { Enemy } from './enemy.js'
import { Player } from './player.js'

type WindowState = {
  height: number
  width: number
  scale: number
  keysDown: Array<string>
  prevKeysDown: Array<string>
  prevMouseDown: boolean
  mouseDown: boolean
  mouseX: number
  mouseY: number
  blocksHorizontal: number
  blockSize: number
  blocksVertical: number
  verticalOffset: number
}

type State =
  | ({
      status: 'inactive'
      lastFrameTime: null
      deltaTime: null
      ctx: null
      player: null
      enemy: null
    } & WindowState)
  | ({
      status: 'active' | 'paused'
      lastFrameTime: number
      deltaTime: number
      ctx: CanvasRenderingContext2D
      player: Player
      enemy: Enemy
    } & WindowState)

const defaultStateValues: State = {
  status: 'inactive',
  lastFrameTime: null,
  deltaTime: null,
  ctx: null,
  height: window.innerHeight,
  width: window.innerWidth,
  scale: window.innerWidth / 1920,
  keysDown: [],
  prevKeysDown: [],
  prevMouseDown: false,
  mouseDown: false,
  player: null,
  enemy: null,
  mouseX: 0,
  mouseY: 0,
  blocksHorizontal: 33,
  blocksVertical: 11,
  verticalOffset: 0,
  blockSize: 0,
}

class GameState {
  state: State
  constructor() {
    this.state = defaultStateValues
  }

  public updateValues(stateValues: Partial<State>) {
    Object.assign(this.state, stateValues)
  }
}

export const gameState = new GameState()

export function updateState(
  newValues: Partial<State> | ((state: State) => Partial<State>)
) {
  if (typeof newValues === 'function') {
    return gameState.updateValues({ ...newValues(gameState.state) })
  } else {
    gameState.updateValues({
      ...newValues,
    })
  }
}

type BattleStateType = {
  selectedMove: number
  enemyId: number
  turns: number
  lastMove: null | 'player' | 'enemy'
  status: 'play' | 'wait'
  waitStart: null | number
  waitLengthMs: number
}

const defaultBattleStateValues: BattleStateType = {
  selectedMove: 1,
  enemyId: 1,
  turns: 0,
  lastMove: null,
  status: 'play',
  waitStart: null,
  waitLengthMs: 0,
}

export class BattleState {
  state: BattleStateType
  constructor() {
    this.state = defaultBattleStateValues
  }

  public updateValues(stateValues: Partial<BattleStateType>) {
    Object.assign(this.state, stateValues)
  }

  get isWaiting() {
    if (
      this.state.waitStart &&
      this.state.waitStart + this.state.waitLengthMs < Date.now()
    ) {
      this.state.status = 'play'
    }
    return this.state.status === 'wait'
  }
}

export function updateBattleState(
  newValues:
    | Partial<BattleStateType>
    | ((state: BattleStateType) => Partial<BattleStateType>)
) {
  if (typeof newValues === 'function') {
    return battleState.updateValues({ ...newValues(battleState.state) })
  } else {
    battleState.updateValues({
      ...newValues,
    })
  }
}

export const battleState = new BattleState()
