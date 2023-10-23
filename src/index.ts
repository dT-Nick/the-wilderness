import { generateBackgroundGrid } from './background.js'
import { generateBattle } from './battle.js'
import { Enemy } from './enemy.js'
import { startListeners, stopListeners } from './event-listeners.js'
import { handleBattleInput, handleInput } from './input.js'
import {
  generateExitMenu,
  generateStartMenu,
  handleMenuInput,
} from './menus.js'
import { Player, generatePlayer } from './player.js'
import { gameState, updateState } from './state.js'
import { generateWorld } from './world.js'

document.addEventListener('DOMContentLoaded', function () {
  const { state } = gameState

  const resizeObserver = new ResizeObserver((entries) => {
    const { width, height } = entries[0].contentRect
    const canvas = document.querySelector('canvas')
    if (!canvas) throw new Error('Canvas not found')

    if (state.status !== 'inactive') {
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = state.width
      tempCanvas.height = state.height
      const tempCtx = tempCanvas.getContext('2d')
      if (!tempCtx) throw new Error('Could not get temp canvas context')
      tempCtx.drawImage(state.ctx.canvas, 0, 0)

      canvas.width = width
      canvas.height = height

      state.ctx.drawImage(tempCtx.canvas, 0, 0, width, height)
    } else {
      canvas.width = width
      canvas.height = height
    }

    updateState((c) => ({
      width,
      height,
      scale: width / 1920,
      verticalOffset:
        height - c.blocksVertical * ((width - 1) / c.blocksHorizontal),
    }))
  })

  function initialise() {
    const root = document.getElementById('root')
    if (!root) throw new Error('Root element not found')

    resizeObserver.observe(root)

    const canvas = document.createElement('canvas')
    canvas.width = state.width
    canvas.height = state.height
    root.appendChild(canvas)
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Could not get canvas context')

    const blockSize = 1919 / state.blocksHorizontal
    const verticalOffset = state.height - 11 * (blockSize * state.scale)

    updateState({
      status: 'paused',
      lastFrameTime: Date.now(),
      ctx,
      player: new Player(
        1920 / 2 - 10,
        (1920 * ((state.height - verticalOffset) / state.width)) / 2 - 10,
        20
      ),
      enemy: new Enemy(
        1,
        'Kaurismaki Daemon',
        100,
        1920 / 2 - 10,
        (1920 * ((state.height - verticalOffset) / state.width)) / 2 - 10
      ),
      verticalOffset,
      blockSize,
    })
    startListeners()
    startMenuLoop()
  }

  initialise()
})

export function startMenuLoop() {
  const { state } = gameState
  const { status, ctx } = state
  if (status !== 'paused') return
  ctx.clearRect(0, 0, state.width, state.height)
  generateStartMenu()
  handleMenuInput()
  return requestAnimationFrame(startMenuLoop)
}

export function startGameLoop() {
  updateState({
    status: 'active',
    lastFrameTime: Date.now(),
  })

  runGameLoop()
}

export function runGameLoop() {
  const { state } = gameState
  const { lastFrameTime, status, ctx } = state
  if (status === 'active') {
    const now = Date.now()
    const deltaTime = now - lastFrameTime
    updateState({
      deltaTime,
    })
    if (state.status === 'active') {
      updateState({
        lastFrameTime: now,
      })
      const endGame = handleInput()
      handleBattleInput()
      ctx.clearRect(0, 0, state.width, state.height)
      // generateWorld()
      generateBattle()
      // generateExitMenu()

      if (endGame) return stopGameLoop()
    }
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

  startMenuLoop()
}
