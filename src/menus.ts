import { startGameLoop } from './index.js'
import { gameState } from './state.js'

export function generateStartMenu() {
  const { state } = gameState
  const { ctx, status } = state

  if (status !== 'inactive') {
    document.addEventListener('mousedown', handleMouseDown)
    ctx.fillStyle = 'green'
    ctx.clearRect(0, 0, state.width, state.height)
    ctx.fillRect(state.width / 2 - 100, state.height / 2 - 100, 200, 200)

    function handleMouseDown(e: MouseEvent) {
      if (status === 'inactive')
        return document.removeEventListener('mousedown', handleMouseDown)

      if (
        e.clientX > state.width / 2 - 100 &&
        e.clientX < state.width / 2 + 100
      ) {
        if (
          e.clientY > state.height / 2 - 100 &&
          e.clientY < state.height / 2 + 100
        ) {
          document.removeEventListener('mousedown', handleMouseDown)
          ctx.clearRect(0, 0, state.width, state.height)
          startGameLoop()
        }
      }
    }
  }
}

export function generateExitMenu() {
  const { state } = gameState
  const { ctx, status, verticalOffset, mouseX, mouseY } = state

  if (status === 'active') {
    if (
      mouseX > state.width - 55 &&
      mouseX < state.width - 5 &&
      mouseY > 5 + verticalOffset / 2 &&
      mouseY < 55 + verticalOffset / 2
    ) {
      ctx.fillStyle = 'orangered'
    } else {
      ctx.fillStyle = 'red'
    }
    ctx.fillRect(state.width - 55, 5 + verticalOffset / 2, 50, 50)
  }
}
