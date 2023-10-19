import { updateState } from './state.js'

export function startListeners() {
  document.addEventListener('keydown', handleKeyDown)
  document.addEventListener('keyup', handleKeyUp)

  document.addEventListener('mousedown', handleMouseDown)
  document.addEventListener('mouseup', handleMouseUp)
}

export function stopListeners() {
  document.removeEventListener('keydown', handleKeyDown)
  document.removeEventListener('keyup', handleKeyUp)

  document.removeEventListener('mousedown', handleMouseDown)
  document.removeEventListener('mouseup', handleMouseUp)
}

function handleKeyDown(e: KeyboardEvent) {
  updateState((currentState) => ({
    keysDown: new Set([...currentState.keysDown, e.key]),
  }))
}

function handleKeyUp(e: KeyboardEvent) {
  updateState((currentState) => {
    const keysDown = new Set(currentState.keysDown)
    keysDown.delete(e.key)
    return {
      keysDown,
    }
  })
}

function handleMouseDown(e: MouseEvent) {
  console.log('mousedown', e)
}

function handleMouseUp(e: MouseEvent) {
  console.log('mouseup', e)
}
