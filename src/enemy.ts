import { Enemy } from './classes.js'
import { getColourFromEnemyName } from './helpers/functions.js'
import { isKeyDownEvent } from './input.js'
import {
  getBattleState,
  getCanvasState,
  getDeltaFrames,
  getGameState,
  getWildernessState,
  isInitialised,
  isPlayerInitialised,
  updateBattleState,
  updateGameState,
} from './state.js'

export function drawEnemies() {
  const { enemies, blockSize, status } = getGameState()
  const { ctx, scale, verticalOffset } = getCanvasState()
  const { mapId } = getWildernessState()

  if (isInitialised(ctx)) {
    for (const enemy of enemies.filter(
      (e) => e.mapId === mapId && status === 'wilderness'
    )) {
      const gradient = ctx.createLinearGradient(
        enemy.x * scale,
        enemy.y * scale + verticalOffset / 2,
        enemy.x * scale,
        enemy.y * scale + enemy.size * scale + verticalOffset / 2
      )

      gradient.addColorStop(0, getColourFromEnemyName(enemy.name))
      gradient.addColorStop(1, 'white')
      ctx.fillStyle = gradient

      ctx.save()
      if (enemy.faceDirection === 'up') {
        ctx.translate(
          (enemy.x + blockSize / 2) * scale,
          (enemy.y + blockSize / 2) * scale + verticalOffset / 2
        )
        ctx.rotate(Math.PI)
        ctx.translate(
          (-enemy.x - blockSize / 2) * scale,
          (-enemy.y - blockSize / 2) * scale - verticalOffset / 2
        )
      }
      if (enemy.faceDirection === 'left') {
        ctx.translate(
          (enemy.x + blockSize / 2) * scale,
          (enemy.y + blockSize / 2) * scale + verticalOffset / 2
        )
        ctx.rotate(Math.PI / 2)
        ctx.translate(
          (-enemy.x - blockSize / 2) * scale,
          (-enemy.y - blockSize / 2) * scale - verticalOffset / 2
        )
      }
      if (enemy.faceDirection === 'right') {
        ctx.translate(
          (enemy.x + blockSize / 2) * scale,
          (enemy.y + blockSize / 2) * scale + verticalOffset / 2
        )
        ctx.rotate(Math.PI * 1.5)
        ctx.translate(
          (-enemy.x - blockSize / 2) * scale,
          (-enemy.y - blockSize / 2) * scale - verticalOffset / 2
        )
      }
      ctx.fillRect(
        (enemy.x + blockSize / 2 - enemy.size / 2) * scale,
        (enemy.y + blockSize / 2 - enemy.size / 2) * scale + verticalOffset / 2,
        enemy.size * scale,
        enemy.size * scale
      )
      ctx.restore()
    }
  }
}

export function handleEnemyInteraction() {
  const { player, enemies } = getGameState()
  const { mapId } = getWildernessState()
  if (!isPlayerInitialised(player)) return

  if (isKeyDownEvent('e')) {
    for (const enemy of enemies.filter((e) => e.mapId === mapId)) {
      const {
        faceDirection,
        coordinates: [pCoordsX, pCoordsY],
      } = player
      const {
        coordinates: [eCoordsX, eCoordsY],
      } = enemy

      const isOnPickupBlock =
        (faceDirection === 'up' &&
          eCoordsX === pCoordsX &&
          eCoordsY === pCoordsY - 1) ||
        (faceDirection === 'down' &&
          eCoordsX === pCoordsX &&
          eCoordsY === pCoordsY + 1) ||
        (faceDirection === 'left' &&
          eCoordsX === pCoordsX - 1 &&
          eCoordsY === pCoordsY) ||
        (faceDirection === 'right' &&
          eCoordsX === pCoordsX + 1 &&
          eCoordsY === pCoordsY)

      if (isOnPickupBlock) {
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
}

export function generateKaurismakiDaemon(
  level: number,
  startX: number,
  startY: number,
  mapId: number | string,
  faceDirection?: 'up' | 'down' | 'left' | 'right'
) {
  const { blockSize } = getGameState()

  return new Enemy(
    'Kaurismaki Daemon',
    'demon-image',
    level,
    startX,
    startY,
    blockSize * (3 / 4),
    mapId,
    100,
    Math.floor(Math.random() * 4 + 8),
    Math.floor(Math.random() * 4 + 4),
    faceDirection
  )
}

export function generateSettlementZombie(
  level: number,
  startX: number,
  startY: number,
  mapId: number | string,
  faceDirection?: 'up' | 'down' | 'left' | 'right'
) {
  const { blockSize } = getGameState()

  return new Enemy(
    'Settlement Zombie',
    'zombie-image',
    level,
    startX,
    startY,
    blockSize * (3 / 4),
    mapId,
    70,
    Math.floor(Math.random() * 4 + 10),
    Math.floor(Math.random() * 6 + 2),
    faceDirection
  )
}

export function generateNightWitch(
  level: number,
  startX: number,
  startY: number,
  mapId: number | string,
  faceDirection?: 'up' | 'down' | 'left' | 'right'
) {
  const { blockSize } = getGameState()

  return new Enemy(
    'Night Witch',
    'witch-image',
    level,
    startX,
    startY,
    blockSize * (3 / 4),
    mapId,
    120,
    Math.floor(Math.random() * 4 + 4),
    Math.floor(Math.random() * 4 + 12),
    faceDirection
  )
}

export function generateEliteWitch(
  level: number,
  startX: number,
  startY: number,
  mapId: number | string,
  faceDirection?: 'up' | 'down' | 'left' | 'right'
) {
  const { blockSize } = getGameState()

  return new Enemy(
    'Elite Witch',
    'witch-image',
    level,
    startX,
    startY,
    blockSize * (3 / 4),
    mapId,
    200,
    Math.floor(Math.random() * 4 + 13),
    Math.floor(Math.random() * 4 + 15),
    faceDirection
  )
}

export function generateKaurismakiKing(
  startX: number,
  startY: number,
  mapId: number | string,
  faceDirection?: 'up' | 'down' | 'left' | 'right'
) {
  const { blockSize } = getGameState()

  return new Enemy(
    'Kaurismaki King',
    'demon-image',
    30,
    startX,
    startY,
    blockSize * (3 / 4),
    mapId,
    1000,
    25,
    25,
    faceDirection
  )
}
