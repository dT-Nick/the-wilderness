import { Building, Enemy, FloorItem, Player } from './classes.js'
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
  isKeyCurrentlyDown,
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
  isMessageActive,
  removeTimedOutNotifications,
  updateCanvasState,
  updateGameState,
  updateLoopState,
  updatePrevInputState,
  updateSettlementState,
} from './state.js'
import { generateMaps } from './wilderness-maps/index.js'
import {
  drawWilderness,
  drawWildernessClock,
  handleWildernessScenarios,
  spawnItemsAndEnemies,
  updateWildernessClock,
} from './wilderness.js'
import {
  drawBuildingSelectionPanel,
  drawBuildings,
  drawSettlementMap,
  handleSettlementInput,
} from './settlement.js'
import {
  drawMapCreator,
  handleMapCreatorInput,
} from './map-creator/map-creator.js'
import { generateBackgroundGrid } from './background.js'
import { drawWorldMap, handleWorldMapInput } from './world-map.js'
import { drawController } from './controller/controller.js'
import { drawBuildingInterior, handleBuildingInput } from './building.js'
import { drawGameOverScreen } from './game-over.js'
import { drawNotifications } from './notifications.js'
import { drawMessage, handleMessageInput } from './message.js'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('service-worker.js')
      .then((registration) => {
        const data = {
          type: 'CACHE_URLS',
          payload: [
            location.href,
            ...performance.getEntriesByType('resource').map((r) => r.name),
          ],
        }
        registration.installing?.postMessage(data)
      })
      .catch((err) => console.log('Service worker registration failed: ', err))
  })
}

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
      floorItems: [],
      enemies: [],
    })

    spawnItemsAndEnemies(true)

    updateSettlementState({
      buildings: [
        new Building(
          'home',
          getEntityXAndYValuesFromCoords(39, 4, blockSize)[0],
          getEntityXAndYValuesFromCoords(39, 4, blockSize)[1],
          blockSize * 5,
          blockSize * 3,
          2
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

  const currentFrameTime = Date.now()
  const deltaTime = currentFrameTime - lastFrameTime

  updateLoopState({
    lastFrameTime: currentFrameTime,
    deltaTime,
  })

  if (!isInitialised(ctx)) return requestAnimationFrame(runGameLoop)

  const { status, player } = getGameState()
  ctx.clearRect(0, 0, width, height)

  removeTimedOutNotifications()

  switch (status) {
    case 'start-menu': {
      handleStartMenuInput()
      drawStartMenu()

      break
    }
    case 'settlement': {
      if (isMessageActive()) {
        handleMessageInput()
      } else {
        handleSettlementInput()
      }

      drawSettlementMap()
      drawBuildings()
      drawPlayer()
      drawBuildingSelectionPanel()
      drawNotifications()

      // if (lastExitTime < currentFrameTime - 500) {
      //   handleSettlementScenarios()
      // }
      break
    }
    case 'building': {
      if (isMessageActive()) {
        handleMessageInput()
      } else {
        handleBuildingInput()
      }

      drawBuildingInterior()
      drawPlayer()
      drawNotifications()

      // if (lastExitTime < currentFrameTime - 500) {
      //   handleBuildingScenarios()
      // }
      break
    }
    case 'wilderness': {
      if (isMessageActive()) {
        handleMessageInput()
      } else {
        handleWildernessInput()
      }

      drawWilderness()
      drawFloorItems()
      drawEnemies()
      drawPlayer()
      drawWildernessClock()
      drawNotifications()

      if (!isMessageActive()) {
        updateWildernessClock()
        handleWildernessScenarios()
      }

      break
    }
    case 'battle': {
      if (isMessageActive()) {
        handleMessageInput()
      } else {
        handleBattleInput()
      }

      drawBattle()

      if (!isMessageActive()) {
        handleBattleScenarios()
      }

      break
    }
    case 'map-creator': {
      handleMapCreatorInput()

      drawMapCreator()
      if (!isKeyCurrentlyDown('alt')) {
        generateBackgroundGrid()
        generateFixedMeasurementsTool()
      }

      break
    }
    case 'world-map': {
      drawWorldMap()
      handleWorldMapInput()
      break
    }
    case 'game-over': {
      drawGameOverScreen()
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
  drawMessage()
  drawController()
  return requestAnimationFrame(runGameLoop)
}
