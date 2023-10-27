import { isControllerButtonCoords } from './controller/controller.js'
import { getCanvasState, getInputState, updateInputState } from './state.js'

export function startListeners() {
  document.addEventListener('keydown', handleKeyDown)
  document.addEventListener('keyup', handleKeyUp)

  document.addEventListener('mousedown', handleMouseDown)
  document.addEventListener('mouseup', handleMouseUp)
  document.addEventListener('mousemove', handleMouseMove)

  document.addEventListener('touchstart', handleTouchStart)
  document.addEventListener('touchend', handleTouchEnd)
  document.addEventListener('touchmove', handleTouchMove)
}

export function stopListeners() {
  document.removeEventListener('keydown', handleKeyDown)
  document.removeEventListener('keyup', handleKeyUp)

  document.removeEventListener('mousedown', handleMouseDown)
  document.removeEventListener('mouseup', handleMouseUp)
  document.removeEventListener('mousemove', handleMouseMove)

  document.removeEventListener('touchstart', handleTouchStart)
  document.removeEventListener('touchend', handleTouchEnd)
  document.removeEventListener('touchmove', handleTouchMove)
}

function handleKeyDown(e: KeyboardEvent) {
  e.preventDefault()
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
  e.preventDefault()
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

function handleTouchStart(e: TouchEvent) {
  const { height, verticalOffset } = getCanvasState()
  const { showGamepad } = getInputState()
  e.preventDefault()

  const { changedTouches } = e
  for (let i = 0; i < changedTouches.length; i++) {
    const touch = changedTouches[i]
    if (showGamepad) {
      const button = isControllerButtonCoords(touch.clientX, touch.clientY)
      if (!button) continue
      updateInputState((c) => ({
        touches: [
          ...c.touches,
          {
            identifier: touch.identifier,
            type: button,
          },
        ],
      }))
    } else {
      if (touch.clientY > height - verticalOffset / 2) {
        updateInputState({
          showGamepad: true,
        })
      }
    }
  }
}

function handleTouchEnd(e: TouchEvent) {
  const { changedTouches } = e

  for (let i = 0; i < changedTouches.length; i++) {
    const touch = changedTouches[i]
    updateInputState((c) => ({
      touches: c.touches.filter((t) => t.identifier !== touch.identifier),
    }))
  }
}

function handleTouchMove(e: TouchEvent) {
  console.log('move touch')
  updateInputState({
    mouseX: e.touches[0].clientX,
    mouseY: e.touches[0].clientY,
  })
}
