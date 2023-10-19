type WindowState = {
  height: number
  width: number
  keysDown: Set<string>
}

type State =
  | ({
      status: 'inactive'
      lastFrameTime: null
      ctx: null
    } & WindowState)
  | ({
      status: 'active'
      lastFrameTime: number
      ctx: CanvasRenderingContext2D
    } & WindowState)

const defaultStateValues: State = {
  status: 'inactive',
  lastFrameTime: null,
  ctx: null,
  height: window.innerHeight - 50,
  width: window.innerWidth - 50,
  keysDown: new Set(),
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
