import { updateInputState } from './state.js'

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

  updateInputState((prevInputState) => ({
    keysDown: [
      ...prevInputState.keysDown.filter((k) => k.key !== key),
      {
        key,
        time: 0,
      },
    ],
  }))
}

function handleKeyUp(e: KeyboardEvent) {
  const key = e.key.toLowerCase()

  updateInputState((prevInputState) => ({
    keysDown: prevInputState.keysDown.filter((k) => k.key !== key),
  }))
}

function handleMouseDown(e: MouseEvent) {
  updateInputState({
    mouse: {
      isDown: true,
      time: 0,
    },
  })
}

function handleMouseUp(e: MouseEvent) {
  updateInputState({
    mouse: {
      isDown: false,
      time: 0,
    },
  })
}

function handleMouseMove(e: MouseEvent) {
  updateInputState({
    mouseX: e.clientX,
    mouseY: e.clientY,
  })
}
