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
  const { ctx, status } = state

  if (status === 'active') {
    ctx.fillStyle = 'red'
    ctx.fillRect(state.width - 110, 10, 100, 100)
  }
}
