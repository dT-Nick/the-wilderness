import { generateBackgroundGrid } from './background.js'
import {
  getBlockPropertiesFromName,
  getCanvasState,
  getGameState,
  getWildernessState,
  isInitialised,
  updateBattleState,
  updateGameState,
} from './state.js'
import { drawMapZero } from './wilderness-maps/map-0.js'

export interface MapState {
  map: Array<{
    type: 'grass' | 'water' | 'mountain' | 'forest' | 'hill'
    fromCoords: [number, number]
    toCoords: [number, number]
  }>
}

export function drawWilderness() {
  const { mapId } = getWildernessState()

  switch (mapId) {
    case 0: {
      drawMapZero()
      break
    }
    default: {
      throw new Error(`Unknown mapId: ${mapId}`)
    }
  }
}

export function deriveRestrictedCoordsFromMap(map: MapState['map']) {
  const { enemies } = getGameState()
  const restrictedCoords: Array<[number, number]> = []

  for (
    let blockRangeIndex = 0;
    blockRangeIndex < map.length;
    blockRangeIndex++
  ) {
    const blockRange = map[blockRangeIndex]
    const { isPassable } = getBlockPropertiesFromName(blockRange.type)

    if (isPassable) continue

    const { fromCoords, toCoords } = blockRange
    for (let x = fromCoords[0]; x <= toCoords[0] - 1; x++) {
      for (let y = fromCoords[1]; y <= toCoords[1] - 1; y++) {
        restrictedCoords.push([x, y])
      }
    }
  }

  for (const enemy of enemies) {
    restrictedCoords.push(enemy.coordinates)
  }

  return restrictedCoords
}

export function drawBackgroundFromMap(map: MapState['map']) {
  const { blockSize, blocksHorizontal, blocksVertical } = getGameState()
  const { ctx, verticalOffset, scale, width, height } = getCanvasState()

  if (!isInitialised(ctx)) return

  const { color, name } = getBlockPropertiesFromName('grass')
  ctx.fillStyle = color
  ctx.fillRect(
    0,
    verticalOffset / 2,
    blocksHorizontal * (blockSize * scale),
    blocksVertical * (blockSize * scale)
  )

  map.forEach(({ type, fromCoords, toCoords }) => {
    const { color } = getBlockPropertiesFromName(type)

    ctx.fillStyle = color
    const fromX = fromCoords[0] * (blockSize * scale)
    const fromY = fromCoords[1] * (blockSize * scale) + verticalOffset / 2

    const width = (toCoords[0] - fromCoords[0]) * (blockSize * scale)
    const height = (toCoords[1] - fromCoords[1]) * (blockSize * scale)

    ctx.fillRect(fromX, fromY, width, height)
  })

  // generateBackgroundGrid()
}

export function handleWildernessScenarios() {
  const { player, enemies } = getGameState()
  for (const enemy of enemies) {
    const {
      faceDirection: eFaceDirection,
      coordinates: [eCoordsX, eCoordsY],
    } = enemy
    const {
      coordinates: [pCoordsX, pCoordsY],
    } = player

    const isOnAttackBlock =
      (eFaceDirection === 'up' &&
        pCoordsX === eCoordsX &&
        pCoordsY === eCoordsY - 1) ||
      (eFaceDirection === 'down' &&
        pCoordsX === eCoordsX &&
        pCoordsY === eCoordsY + 1) ||
      (eFaceDirection === 'left' &&
        pCoordsX === eCoordsX - 1 &&
        pCoordsY === eCoordsY) ||
      (eFaceDirection === 'right' &&
        pCoordsX === eCoordsX + 1 &&
        pCoordsY === eCoordsY)

    if (isOnAttackBlock) {
      updateBattleState({
        lastMove: null,
        enemyId: enemy.id,
        status: 'play',
        turns: 0,
        waitLengthMs: 0,
        waitStart: null,
      })
      updateGameState({
        status: 'battle',
      })
    }
  }
}
