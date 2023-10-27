import { generateBackgroundGrid } from './background.js'
import {
  BlockType,
  getBlockPropertiesFromName,
  getCanvasState,
  getGameState,
  getSettlementState,
  getWildernessState,
  isInitialised,
  isPlayerInitialised,
  updateBattleState,
  updateGameState,
} from './state.js'
import { drawMapZero } from './wilderness-maps/map-0.js'
import { drawMapMinusOneZero } from './wilderness-maps/map-[-1,0].js'
import { drawMapMinusOneOne } from './wilderness-maps/map-[-1,1].js'
import { drawMapZeroOne } from './wilderness-maps/map-[0,1].js'
import { drawMapOneZero } from './wilderness-maps/map-[1,0].js'
import { drawMapOneOne } from './wilderness-maps/map-[1,1].js'

export interface MapState {
  map: Array<{
    type: BlockType['name']
    fromCoords: [number, number]
    toCoords: [number, number]
  }>
  discovered: boolean
}

export function drawWilderness() {
  const { mapId } = getWildernessState()

  switch (mapId) {
    case 0: {
      drawMapZero()
      break
    }
    case '[-1,0]': {
      drawMapMinusOneZero()
      break
    }
    case '[0,1]': {
      drawMapZeroOne()
      break
    }
    case '[1,0]': {
      drawMapOneZero()
      break
    }
    case '[1,1]': {
      drawMapOneOne()
      break
    }
    case '[-1,1]': {
      drawMapMinusOneOne()
      break
    }
    default: {
      throw new Error(`Unknown mapId: ${mapId}`)
    }
  }
}

export function deriveRestrictedCoordsFromMap(map: MapState['map']) {
  const { enemies, status } = getGameState()
  const { mapId } = getWildernessState()
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

  for (const enemy of enemies.filter(
    (e) => e.mapId === mapId && status === 'wilderness'
  )) {
    restrictedCoords.push(enemy.coordinates)
  }

  if (status === 'settlement') {
    const { buildings } = getSettlementState()

    for (let building of buildings.filter((b) => b.isPlaced)) {
      const { fromCoords, toCoords } = building.coordinates
      for (let x = fromCoords[0]; x <= toCoords[0] - 1; x++) {
        for (let y = fromCoords[1]; y <= toCoords[1] - 1; y++) {
          restrictedCoords.push([x, y])
        }
      }
    }
  }

  return restrictedCoords
}

export function drawBackgroundFromMap(map: MapState['map']) {
  const { blockSize, blocksHorizontal, blocksVertical } = getGameState()
  const { ctx, verticalOffset, scale, width, height } = getCanvasState()

  if (!isInitialised(ctx)) return

  const { colour, name } = getBlockPropertiesFromName('grass')
  ctx.fillStyle = colour
  ctx.fillRect(
    0,
    verticalOffset / 2,
    blocksHorizontal * (blockSize * scale),
    blocksVertical * (blockSize * scale)
  )

  map.forEach(({ type, fromCoords, toCoords }) => {
    const { colour } = getBlockPropertiesFromName(type)

    ctx.fillStyle = colour
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
  const { mapId } = getWildernessState()
  if (!isPlayerInitialised(player)) return

  for (const enemy of enemies.filter((e) => e.mapId === mapId)) {
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
        playerMenu: 'main',
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
