import { generateBackgroundGrid } from './background.js'
import { startListeners, stopListeners } from './event-listeners.js'
import { handleInput } from './input.js'
import { generateExitMenu, generateStartMenu } from './menus.js'
import { Player, generatePlayer } from './player.js'
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
      status: 'paused',
      lastFrameTime: Date.now(),
      ctx,
      player: new Player(state.width / 2 - 10, state.height / 2 - 10),
      blocksHorizontal: 33,
      blocksVertical: Math.floor(state.height / ((state.width - 1) / 33)),
      verticalOffset: state.height % ((state.width - 1) / 33),
      blockSize: (state.width - 1) / 33,
    })
    generateStartMenu()
  }

  initialise()
})

export function startGameLoop() {
  updateState({
    status: 'active',
    lastFrameTime: Date.now(),
  })

  startListeners()
  runGameLoop()
}

export function runGameLoop() {
  const { state } = gameState
  const { lastFrameTime, status, ctx } = state
  if (status === 'active') {
    const now = Date.now()
    const deltaTime = now - lastFrameTime
    if (deltaTime > 1000 / 60 && state.status === 'active') {
      ctx.clearRect(0, 0, state.width, state.height)
      generateBackgroundGrid()
      generatePlayer()
      generateExitMenu()
      handleInput()
    }
    state.lastFrameTime = Date.now()
    return requestAnimationFrame(runGameLoop)
  }
}

export function stopGameLoop() {
  const { state } = gameState
  const { status, width, height } = state
  if (status === 'inactive') return

  state.ctx.clearRect(0, 0, width, height)

  updateState({
    status: 'paused',
    mouseDown: false,
    mouseX: 0,
    mouseY: 0,
    keysDown: [],
  })

  stopListeners()
  generateStartMenu()
}
