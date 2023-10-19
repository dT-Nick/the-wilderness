import { startListeners, stopListeners } from './event-listeners.js'
import { gameState, updateState } from './state.js'

document.addEventListener('DOMContentLoaded', function () {
  const { state } = gameState

  function initialise() {
    const root = document.getElementById('root')
    if (!root) throw new Error('Root element not found')

    const canvas = document.createElement('canvas')
    canvas.width = state.width
    canvas.height = state.height
    root.appendChild(canvas)
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Could not get canvas context')

    updateState({
      status: 'active',
      lastFrameTime: performance.now(),
      ctx,
    })

    startGameLoop()
  }

  function startGameLoop() {
    startListeners()
    runGameLoop()
  }

  function stopGameLoop() {
    const { status, width, height } = state
    if (status === 'inactive') return

    state.ctx.clearRect(0, 0, width, height)
    stopListeners()
    updateState({
      status: 'inactive',
      lastFrameTime: null,
      ctx: null,
    })
  }

  function runGameLoop() {
    const { lastFrameTime, status, ctx } = state
    if (status === 'active') {
      const now = performance.now()
      const deltaTime = now - lastFrameTime
      if (deltaTime > 1000 / 60 && state.status === 'active') {
        ctx.clearRect(0, 0, 800, 600)
        if (deltaTime < 17) {
          ctx.fillStyle = 'blue'
        } else {
          ctx.fillStyle = 'red'
        }
        if (state.keysDown.size > 0) {
          ctx.fillStyle = 'green'
          console.log(state.keysDown)
        }
        ctx.fillRect(0, 0, 100, 100)
      }
      state.lastFrameTime = performance.now()
      return requestAnimationFrame(runGameLoop)
    }
  }

  initialise()

  setTimeout(() => {
    stopGameLoop()
  }, 10000)
})
