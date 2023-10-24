import { Enemy } from './enemy.js'
import { startListeners } from './event-listeners.js'
import { handleStartMenuInput, handleWildernessInput } from './input.js'
import { drawStartMenu } from './menus.js'
import { Player, drawPlayer } from './player.js'
import {
  constants,
  getCanvasState,
  getGameState,
  getLoopState,
  isInitialised,
  updateCanvasState,
  updateGameState,
  updateLoopState,
  updatePrevInputState,
} from './state.js'
import { drawWilderness } from './wilderness.js'

document.addEventListener('DOMContentLoaded', function () {
  const canvasState = getCanvasState()
  const gameState = getGameState()

  const resizeObserver = new ResizeObserver((entries) => {
    const { width: nextWidth, height: nextHeight } = entries[0].contentRect
    const canvas = document.querySelector('canvas')
    if (!canvas) throw new Error('Canvas not found')

    const { ctx, width: prevWidth, height: prevHeight } = canvasState
    const { blocksHorizontal, blocksVertical } = gameState

    if (isInitialised(ctx)) {
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = prevWidth
      tempCanvas.height = prevHeight
      const tempCtx = tempCanvas.getContext('2d')
      if (!tempCtx) throw new Error('Could not get temp canvas context')
      tempCtx.drawImage(ctx.canvas, 0, 0)

      canvas.width = nextWidth
      canvas.height = nextHeight

      ctx.drawImage(tempCtx.canvas, 0, 0, nextWidth, nextHeight)
      tempCanvas.remove()
    } else {
      canvas.width = nextWidth
      canvas.height = nextHeight
    }

    updateCanvasState({
      width: nextWidth,
      height: nextHeight,
      scale: nextWidth / 1920,
      verticalOffset:
        nextHeight - blocksVertical * ((nextWidth - 1) / blocksHorizontal),
    })
  })

  function initialise() {
    const { width, height, scale } = canvasState
    const { blocksHorizontal, blocksVertical } = gameState

    const root = document.getElementById('root')
    if (!root) throw new Error('Root element not found')

    resizeObserver.observe(root)

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    root.appendChild(canvas)
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Could not get canvas context')

    const blockSize = 1919 / blocksHorizontal
    const verticalOffset = height - blocksVertical * (blockSize * scale)

    updateCanvasState({
      verticalOffset,
      ctx,
    })

    const playerStartingX = 1920 / 2 - constants.playerSize / 2
    const playerStartingY =
      (1920 * ((height - verticalOffset) / width)) / 2 -
      constants.playerSize / 2

    updateGameState({
      blockSize,
      player: new Player(
        playerStartingX,
        playerStartingY,
        constants.playerSize
      ),
      enemies: [
        new Enemy(
          0,
          'Kaurismaki Daemon',
          100,
          playerStartingX,
          playerStartingY
        ),
      ],
    })

    const startingTimeMs = Date.now()

    updateLoopState({
      lastFrameTime: startingTimeMs,
    })

    startListeners()
    runGameLoop()
  }

  initialise()
})

export function runGameLoop() {
  const { ctx, height, width } = getCanvasState()
  const { lastFrameTime } = getLoopState()

  const now = Date.now()
  const deltaTime = now - lastFrameTime

  updateLoopState({
    lastFrameTime: Date.now(),
    deltaTime,
  })

  if (!isInitialised(ctx)) return requestAnimationFrame(runGameLoop)

  const { status } = getGameState()
  ctx.clearRect(0, 0, width, height)

  switch (status) {
    case 'start-menu': {
      drawStartMenu()
      handleStartMenuInput()

      break
    }
    case 'settlement': {
      break
    }
    case 'wilderness': {
      drawWilderness()
      drawPlayer()
      handleWildernessInput()

      break
    }
    case 'battle': {
      break
    }
    default: {
      throw new Error('Unknown game state')
    }
  }

  updatePrevInputState()
  return requestAnimationFrame(runGameLoop)
}

//   const { state } = gameState
//   const { lastFrameTime, status, ctx } = state
//   if (status === 'active') {
//     const now = Date.now()
//     const deltaTime = now - lastFrameTime
//     updateState({
//       deltaTime,
//     })
//     if (state.status === 'active') {
//       updateState({
//         lastFrameTime: now,
//       })
//       const endGame = handleInput()
//       handleBattleInput()
//       ctx.clearRect(0, 0, state.width, state.height)
//       // generateWorld()
//       generateBattle()
//       // generateExitMenu()

//       if (endGame) return stopGameLoop()
//     }
//     return requestAnimationFrame(runGameLoop)
//   }
// }

// export function stopGameLoop() {
//   const { state } = gameState
//   const { status, width, height } = state
//   if (status === 'inactive') return

//   state.ctx.clearRect(0, 0, width, height)

//   updateState({
//     status: 'paused',
//     mouseDown: false,
//     mouseX: 0,
//     mouseY: 0,
//     keysDown: [],
//   })

//   startMenuLoop()
// }
