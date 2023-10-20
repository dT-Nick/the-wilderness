import { Player } from './player.js'

type WindowState = {
  height: number
  width: number
  scale: number
  keysDown: Array<string>
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
    } & WindowState)
  | ({
      status: 'active' | 'paused'
      lastFrameTime: number
      deltaTime: number
      ctx: CanvasRenderingContext2D
      player: Player
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
  prevMouseDown: false,
  mouseDown: false,
  player: null,
  mouseX: 0,
  mouseY: 0,
  blocksHorizontal: 0,
  blocksVertical: 0,
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
