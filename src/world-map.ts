import { isButtonDownEvent, isKeyDownEvent } from './input.js'
import {
  getBlockPropertiesFromName,
  getCanvasState,
  getCurrentMap,
  getGameState,
  getMapsState,
  getSettingsState,
  isInitialised,
  isPlayerInitialised,
  updateGameState,
} from './state.js'
import { MapState } from './wilderness.js'

export function drawWorldMap() {
  const { ctx, width, height, verticalOffset } = getCanvasState()
  const { maps } = getMapsState()
  if (!isInitialised(ctx)) return

  const mapsOnWorldMap = maps.filter(
    (m) => m.id.includes('[') || m.id === 'settlement'
  )
  const mapIds = mapsOnWorldMap.map((m) => m.id)

  const highestXCoord =
    Math.max(
      ...mapIds.map((mapId) => {
        if (mapId === '[0,0]') return 0
        if (mapId === 'settlement') return 0
        return Number(mapId.replace(/[[\]]/g, '').split(',')[0])
      })
    ) + 1
  const lowestXCoord =
    Math.min(
      ...mapIds.map((mapId) => {
        if (mapId === '[0,0]') return 0
        if (mapId === 'settlement') return 0
        return Number(mapId.replace(/[[\]]/g, '').split(',')[0])
      })
    ) - 1
  const highestYCoord =
    Math.max(
      ...mapIds.map((mapId) => {
        if (mapId === '[0,0]') return 0
        if (mapId === 'settlement') return -1
        return Number(mapId.replace(/[[\]]/g, '').split(',')[1])
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
  const { maps } = getMapsState()
  if (!isInitialised(ctx)) return

  const map = maps.find((m) => m.id === mapId)
  if (!map) return

  const { isDiscovered, design } = map
  if (!isDiscovered) {
    ctx.fillStyle = 'black'
    ctx.fillRect(x, y, width, height)
    return
  }
  drawMiniBackgroundFromMap(design, x, y, width, height, map.id)
}

export function drawMiniBackgroundFromMap(
  map: MapState['map'],
  x: number,
  y: number,
  width: number,
  height: number,
  mapId: string | number
) {
  const { blockSize, player, prevStatus } = getGameState()
  if (!isPlayerInitialised(player)) return
  const { id: activeMapId } = getCurrentMap()
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

  const { colour } = getBlockPropertiesFromName('grass')
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
  const { prevGameStatus } = getSettingsState()

  if (
    isKeyDownEvent(['m', 'escape', 'tab']) ||
    isButtonDownEvent(['buttonB', 'buttonY'])
  ) {
    updateGameState((c) => ({
      status: c.prevStatus ?? 'settlement',
      prevStatus: prevGameStatus,
    }))
  }
}
