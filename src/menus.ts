import { startGameLoop } from './index.js'
import { gameState } from './state.js'

export function generateStartMenu() {
  const { state } = gameState
  const { ctx, status } = state

  if (status !== 'inactive') {
    ctx.fillStyle = 'green'
    ctx.fillRect(state.width / 2 - 100, state.height / 2 - 100, 200, 200)
  }
}

export function handleMenuInput() {
  const { state } = gameState
  const { status, mouseDown, mouseX, mouseY } = state

  if (status === 'paused') {
    if (mouseDown) {
      if (
        mouseX > state.width / 2 - 100 &&
        mouseX < state.width / 2 + 100 &&
        mouseY > state.height / 2 - 100 &&
        mouseY < state.height / 2 + 100
      ) {
        startGameLoop()
      }
    }
  }
}

export function generateExitMenu() {
  const { state } = gameState
  const { ctx, status, verticalOffset, mouseX, mouseY, scale } = state

  if (status === 'active') {
    if (
      mouseX > state.width - 54 * scale &&
      mouseX < state.width - 5 * scale &&
      mouseY > 5 * scale + verticalOffset / 2 &&
      mouseY < 54 * scale + verticalOffset / 2
    ) {
      ctx.fillStyle = 'orangered'
    } else {
      ctx.fillStyle = 'red'
    }
    ctx.fillRect(
      state.width - 54 * scale,
      5 * scale + verticalOffset / 2,
      49 * scale,
      49 * scale
    )
  }
}
