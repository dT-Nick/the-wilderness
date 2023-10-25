import { LivingBeing } from './living-being.js'
import {
  getBattleState,
  getCanvasState,
  getDeltaFrames,
  getGameState,
  isInitialised,
  updateBattleState,
  updateGameState,
} from './state.js'

export class Enemy extends LivingBeing {
  name: string

  constructor(
    name: string,
    health: number,
    startX: number,
    startY: number,
    size: number
  ) {
    const directionRng = Math.random()
    let faceDirection: 'left' | 'up' | 'right' | 'down' = 'left'
    if (directionRng < 0.25) {
      faceDirection = 'up'
    } else if (directionRng < 0.5) {
      faceDirection = 'right'
    } else if (directionRng < 0.75) {
      faceDirection = 'down'
    }
    super(startX, startY, size, health, faceDirection)
    this.name = name
  }

  public takeDamage() {
    if (!this.currentDamage) return
    super.takeDamage()

    if (this.currentHealth <= 0) {
      this.currentHealth = 0
      updateGameState((c) => ({
        enemies: [...c.enemies.filter((e) => e.id !== this.id)],
        status: 'wilderness',
      }))

      return
    }
    if (this.currentHealth <= this.prevHealth - this.currentDamage) {
      updateBattleState({
        lastMove: 'player',
        status: 'wait',
        waitLengthMs: 1000,
        waitStart: Date.now(),
      })
    }
  }

  public hitPlayer(damage: number) {
    const { player } = getGameState()
    const { lastMove, status } = getBattleState()
    if (
      lastMove === 'player' &&
      status === 'play' &&
      player.currentDamage === 0
    ) {
      player.takeHit(damage)
    }
  }
}

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
