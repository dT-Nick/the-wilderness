import { Enemy, FloorItem, Player } from './classes.js'
import { drawBattle, handleBattleScenarios } from './battle.js'
import { drawEnemies } from './enemy.js'
import { startListeners } from './event-listeners.js'
import { getEntityXAndYValuesFromCoords } from './helpers/coordinates.js'
import {
  generateFixedMeasurementsTool,
  generateMeasurementsTool,
} from './helpers/tools.js'
import {
  handleBattleInput,
  handleStartMenuInput,
  handleWildernessInput,
} from './input.js'
import { drawFloorItems, generateGameItems } from './item.js'
import { drawStartMenu } from './menus.js'
import { drawPlayer } from './player.js'
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
import { generateMaps } from './wilderness-maps/index.js'
import { drawWilderness, handleWildernessScenarios } from './wilderness.js'
import { drawSettlementMap, handleSettlementInput } from './settlement.js'
import {
  drawMapCreator,
  handleMapCreatorInput,
} from './map-creator/map-creator.js'
import { generateBackgroundGrid } from './background.js'

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
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) throw new Error('Could not get canvas context')

    const blockSize = 1920 / blocksHorizontal
    const verticalOffset = height - blocksVertical * (blockSize * scale)

    updateCanvasState({
      verticalOffset,
      ctx,
    })

    generateMaps()

    const [playerStartingX, playerStartingY] = getEntityXAndYValuesFromCoords(
      41,
      1,
      blockSize
    )
    const [enemyStartingX, enemyStartingY] = getEntityXAndYValuesFromCoords(
      10,
      10,
      blockSize
    )

    updateGameState({
      blockSize,
      player: new Player(playerStartingX, playerStartingY, blockSize * (3 / 4)),
      items: generateGameItems(),
      floorItems: [
        new FloorItem(
          getEntityXAndYValuesFromCoords(12, 12, blockSize)[0],
          getEntityXAndYValuesFromCoords(12, 12, blockSize)[1],
          blockSize * (3 / 4),
          'small-potion',
          0
        ),
        new FloorItem(
          getEntityXAndYValuesFromCoords(13, 13, blockSize)[0],
          getEntityXAndYValuesFromCoords(13, 13, blockSize)[1],
          blockSize * (3 / 4),
          'large-potion',
          0
        ),
        new FloorItem(
          getEntityXAndYValuesFromCoords(35, 6, blockSize)[0],
          getEntityXAndYValuesFromCoords(35, 6, blockSize)[1],
          blockSize * (3 / 4),
          'medium-potion',
          0
        ),
        new FloorItem(
          getEntityXAndYValuesFromCoords(66, 18, blockSize)[0],
          getEntityXAndYValuesFromCoords(66, 18, blockSize)[1],
          blockSize * (3 / 4),
          'large-potion',
          '[-1,0]'
        ),
      ],
      enemies: [
        new Enemy(
          'Kaurismaki Daemon',
          100,
          enemyStartingX,
          enemyStartingY,
          blockSize * (3 / 4),
          0
        ),
        new Enemy(
          'Kaurismaki Daemon',
          100,
          getEntityXAndYValuesFromCoords(37, 5, blockSize)[0],
          getEntityXAndYValuesFromCoords(37, 5, blockSize)[1],
          blockSize * (3 / 4),
          0
        ),
        new Enemy(
          'Kaurismaki Daemon',
          100,
          getEntityXAndYValuesFromCoords(65, 17, blockSize)[0],
          getEntityXAndYValuesFromCoords(65, 17, blockSize)[1],
          blockSize * (3 / 4),
          '[-1,0]'
        ),
        new Enemy(
          'Kaurismaki Daemon',
          100,
          getEntityXAndYValuesFromCoords(65, 19, blockSize)[0],
          getEntityXAndYValuesFromCoords(65, 19, blockSize)[1],
          blockSize * (3 / 4),
          '[-1,0]'
        ),
        new Enemy(
          'Kaurismaki Daemon',
          100,
          getEntityXAndYValuesFromCoords(67, 17, blockSize)[0],
          getEntityXAndYValuesFromCoords(67, 17, blockSize)[1],
          blockSize * (3 / 4),
          '[-1,0]'
        ),
        new Enemy(
          'Kaurismaki Daemon',
          100,
          getEntityXAndYValuesFromCoords(67, 19, blockSize)[0],
          getEntityXAndYValuesFromCoords(67, 19, blockSize)[1],
          blockSize * (3 / 4),
          '[-1,0]'
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
      handleStartMenuInput()
      drawStartMenu()

      break
    }
    case 'settlement': {
      handleSettlementInput()

      drawSettlementMap()
      drawPlayer()

      // handleSettlementScenarios()
      break
    }
    case 'wilderness': {
      handleWildernessInput()

      drawWilderness()
      drawFloorItems()
      drawEnemies()
      drawPlayer()

      handleWildernessScenarios()

      break
    }
    case 'battle': {
      handleBattleInput()

      drawBattle()

      handleBattleScenarios()

      break
    }
    case 'map-creator': {
      handleMapCreatorInput()

      drawMapCreator()
      generateFixedMeasurementsTool()
      generateBackgroundGrid()

      break
    }
    default: {
      throw new Error('Unknown game state')
    }
  }

  updatePrevInputState()
  // generateBackgroundGrid()
  // generateMeasurementsTool()
  // generateFixedMeasurementsTool()
  return requestAnimationFrame(runGameLoop)
}
