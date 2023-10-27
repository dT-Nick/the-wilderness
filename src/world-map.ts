import { isButtonDownEvent, isKeyDownEvent } from './input.js'
import {
  getBlockPropertiesFromName,
  getCanvasState,
  getGameState,
  getInputState,
  getWildernessState,
  isInitialised,
  isPlayerInitialised,
  updateGameState,
} from './state.js'
import {
  drawMapZero,
  generateMapZeroState,
  getMapZeroState,
} from './wilderness-maps/map-0.js'
import { getMapMinusOneZeroState } from './wilderness-maps/map-[-1,0].js'
import { getMapMinusOneOneState } from './wilderness-maps/map-[-1,1].js'
import {
  generateMapZeroOneState,
  getMapZeroOneState,
} from './wilderness-maps/map-[0,1].js'
import {
  generateMapOneZeroState,
  getMapOneZeroState,
} from './wilderness-maps/map-[1,0].js'
import { getMapOneOneState } from './wilderness-maps/map-[1,1].js'
import { getSettlementMapState } from './wilderness-maps/settlement.js'
import { MapState, drawBackgroundFromMap } from './wilderness.js'

const mapIds: Array<string | number> = [
  'settlement',
  0,
  '[0,1]',
  '[1,0]',
  '[1,1]',
  '[-1,0]',
  '[-1,1]',
]

export function drawWorldMap() {
  const { ctx, width, height, verticalOffset } = getCanvasState()
  if (!isInitialised(ctx)) return

  const highestXCoord =
    Math.max(
      ...mapIds.map((mapId) => {
        if (typeof mapId === 'number') return 0
        if (mapId === 'settlement') return 0
        return Number(mapId.replace(/[\[\]]/g, '').split(',')[0])
      })
    ) + 1
  const lowestXCoord =
    Math.min(
      ...mapIds.map((mapId) => {
        if (typeof mapId === 'number') return 0
        if (mapId === 'settlement') return 0
        return Number(mapId.replace(/[\[\]]/g, '').split(',')[0])
      })
    ) - 1
  const highestYCoord =
    Math.max(
      ...mapIds.map((mapId) => {
        if (typeof mapId === 'number') return 0
        if (mapId === 'settlement') return -1
        return Number(mapId.replace(/[\[\]]/g, '').split(',')[1])
      })
    ) + 1
  const lowestYCoord = -2

  const differenceX = highestXCoord - lowestXCoord
  const differenceY = highestYCoord - lowestYCoord

  ctx.fillStyle = '#222222'
  ctx.fillRect(0, verticalOffset / 2, width, height - verticalOffset)
  const widthOfMap = width / (differenceX + 1)
  const heightOfMap = (height - verticalOffset) / (differenceY + 1)
  for (let i = lowestXCoord; i <= highestXCoord; i++) {
    for (let j = lowestYCoord; j <= highestYCoord; j++) {
      if (
        (i === 0 && j === -1) ||
        (i === 0 && j === 0) ||
        mapIds.some((id) => id === `[${i},${j}]`)
      ) {
        let mapId: string | number = `[${i},${j}]`
        if (i === 0 && j === -1) mapId = 'settlement'
        if (i === 0 && j === 0) mapId = 0

        drawWorldMapSection(
          mapId,
          (i - lowestXCoord) * widthOfMap,
          height - (j - lowestYCoord + 1) * heightOfMap - verticalOffset / 2,
          widthOfMap,
          heightOfMap
        )
      }
    }
  }
}

export function drawWorldMapSection(
  mapId: string | number,
  x: number,
  y: number,
  width: number,
  height: number
) {
  const { ctx } = getCanvasState()
  if (!isInitialised(ctx)) return

  if (typeof mapId === 'number') {
    const { map, discovered } = getMapZeroState()
    if (!discovered) {
      ctx.fillStyle = 'black'
      ctx.fillRect(x, y, width, height)
      return
    }
    return drawMiniBackgroundFromMap(map, x, y, width, height, mapId)
  }
  if (mapId === 'settlement') {
    const { map, discovered } = getSettlementMapState()
    if (!discovered) {
      ctx.fillStyle = 'black'
      ctx.fillRect(x, y, width, height)
      return
    }
    return drawMiniBackgroundFromMap(map, x, y, width, height, mapId)
  }
  if (mapId === '[0,1]') {
    const { map, discovered } = getMapZeroOneState()
    if (!discovered) {
      ctx.fillStyle = 'black'
      ctx.fillRect(x, y, width, height)
      return
    }
    return drawMiniBackgroundFromMap(map, x, y, width, height, mapId)
  }
  if (mapId === '[1,0]') {
    const { map, discovered } = getMapOneZeroState()
    if (!discovered) {
      ctx.fillStyle = 'black'
      ctx.fillRect(x, y, width, height)
      return
    }
    return drawMiniBackgroundFromMap(map, x, y, width, height, mapId)
  }
  if (mapId === '[1,1]') {
    const { map, discovered } = getMapOneOneState()
    if (!discovered) {
      ctx.fillStyle = 'black'
      ctx.fillRect(x, y, width, height)
      return
    }
    return drawMiniBackgroundFromMap(map, x, y, width, height, mapId)
  }
  if (mapId === '[-1,0]') {
    const { map, discovered } = getMapMinusOneZeroState()
    if (!discovered) {
      ctx.fillStyle = 'black'
      ctx.fillRect(x, y, width, height)
      return
    }
    return drawMiniBackgroundFromMap(map, x, y, width, height, mapId)
  }
  if (mapId === '[-1,1]') {
    const { map, discovered } = getMapMinusOneOneState()
    if (!discovered) {
      ctx.fillStyle = 'black'
      ctx.fillRect(x, y, width, height)
      return
    }
    return drawMiniBackgroundFromMap(map, x, y, width, height, mapId)
  }
}

export function drawMiniBackgroundFromMap(
  map: MapState['map'],
  x: number,
  y: number,
  width: number,
  height: number,
  mapId: string | number
) {
  const { blockSize, blocksHorizontal, blocksVertical, player, prevStatus } =
    getGameState()
  if (!isPlayerInitialised(player)) return
  const { mapId: activeMapId } = getWildernessState()
  const {
    ctx,
    verticalOffset,
    width: canvasWidth,
    height: canvasHeight,
    scale: canvasScale,
  } = getCanvasState()

  const horizontalScale = width / canvasWidth
  const verticalScale = height / (canvasHeight - verticalOffset)

  if (!isInitialised(ctx)) return

  const { colour, name } = getBlockPropertiesFromName('grass')
  ctx.fillStyle = colour
  ctx.fillRect(x, y, width, height)

  map.forEach(({ type, fromCoords, toCoords }) => {
    const { colour } = getBlockPropertiesFromName(type)

    ctx.fillStyle = colour
    const fromX =
      x + fromCoords[0] * (blockSize * canvasScale * horizontalScale)
    const fromY = y + fromCoords[1] * (blockSize * canvasScale * verticalScale)

    const width =
      (toCoords[0] - fromCoords[0]) *
      (blockSize * canvasScale * horizontalScale)
    const height =
      (toCoords[1] - fromCoords[1]) * (blockSize * canvasScale * verticalScale)

    ctx.fillRect(fromX, fromY, width, height)
  })

  if (
    (mapId === activeMapId && prevStatus === 'wilderness') ||
    (mapId === 'settlement' && prevStatus === 'settlement')
  ) {
    const { x: playerX, y: playerY } = player

    ctx.fillStyle = 'cyan'
    ctx.strokeStyle = 'black'
    ctx.fillRect(
      x +
        playerX * canvasScale * horizontalScale +
        (blockSize * canvasScale * verticalScale) / 2 -
        6.5,
      y +
        playerY * canvasScale * verticalScale +
        (blockSize * canvasScale * verticalScale) / 2 -
        6.5,
      13,
      13
    )
  }

  // generateBackgroundGrid()
}

export function handleWorldMapInput() {
  if (
    isKeyDownEvent(['m', 'escape', 'tab']) ||
    isButtonDownEvent(['buttonB', 'buttonY'])
  ) {
    updateGameState((c) => ({
      status: c.prevStatus ?? 'settlement',
    }))
  }
}
