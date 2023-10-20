import { updateState } from './state.js'

export function startListeners() {
  document.addEventListener('keydown', handleKeyDown)
  document.addEventListener('keyup', handleKeyUp)

  document.addEventListener('mousedown', handleMouseDown)
  document.addEventListener('mouseup', handleMouseUp)
  document.addEventListener('mousemove', handleMouseMove)
}

export function stopListeners() {
  document.removeEventListener('keydown', handleKeyDown)
  document.removeEventListener('keyup', handleKeyUp)

  document.removeEventListener('mousedown', handleMouseDown)
  document.removeEventListener('mouseup', handleMouseUp)
  document.removeEventListener('mousemove', handleMouseMove)
}

function handleKeyDown(e: KeyboardEvent) {
  const key = e.key.toLowerCase()
  updateState((currentState) => ({
    prevKeysDown: currentState.keysDown,
    keysDown: currentState.keysDown.includes(key)
      ? currentState.keysDown
      : [...currentState.keysDown, key],
  }))
}

function handleKeyUp(e: KeyboardEvent) {
  const key = e.key.toLowerCase()
  updateState((currentState) => {
    return {
      prevKeysDown: currentState.keysDown,
      keysDown: currentState.keysDown.filter((k) => k !== key),
    }
  })
}

function handleMouseDown(e: MouseEvent) {
  updateState({
    mouseDown: true,
  })
}

function handleMouseUp(e: MouseEvent) {
  updateState({
    mouseDown: false,
  })
}

function handleMouseMove(e: MouseEvent) {
  updateState({
    mouseX: e.clientX,
    mouseY: e.clientY,
  })
}
