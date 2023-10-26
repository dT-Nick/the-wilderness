import { isKeyDownEvent } from './input.js'
import {
  getBattleState,
  getCanvasState,
  getDeltaFrames,
  getGameState,
  isInitialised,
  isPlayerInitialised,
  updateBattleState,
  updateGameState,
} from './state.js'

export function drawEnemies() {
  const { enemies, blockSize } = getGameState()
  const { ctx, scale, verticalOffset } = getCanvasState()

  if (isInitialised(ctx)) {
    for (const enemy of enemies) {
      const gradient = ctx.createLinearGradient(
        enemy.x * scale,
        enemy.y * scale + verticalOffset / 2,
        enemy.x * scale,
        enemy.y * scale + enemy.size * scale + verticalOffset / 2
      )

      gradient.addColorStop(0, 'orangered')
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
  if (!isPlayerInitialised(player)) return

  if (isKeyDownEvent('e')) {
    for (const enemy of enemies) {
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
