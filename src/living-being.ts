import { Entity } from './entity.js'
import { getDeltaFrames } from './state.js'

export class LivingBeing extends Entity {
  currentHealth: number
  prevHealth: number
  maxHealth: number
  currentDamage: number
  faceDirection: 'up' | 'down' | 'left' | 'right'

  constructor(
    startX: number,
    startY: number,
    size: number,
    health: number,
    faceDirection?: 'up' | 'down' | 'left' | 'right'
  ) {
    super(startX, startY, size)

    this.prevHealth = health
    this.currentHealth = health
    this.maxHealth = health
    this.faceDirection = faceDirection ?? 'down'

    this.currentDamage = 0
  }

  public lookLeft() {
    this.faceDirection = 'left'
  }

  public lookRight() {
    this.faceDirection = 'right'
  }

  public lookUp() {
    this.faceDirection = 'up'
  }

  public lookDown() {
    this.faceDirection = 'down'
  }

  public takeDamage() {
    if (!this.currentDamage) return
    const deltaFrames = getDeltaFrames()
    this.currentHealth -= 0.5 * deltaFrames

    if (this.currentHealth <= this.prevHealth - this.currentDamage) {
      const newHealth = this.prevHealth - this.currentDamage
      this.currentHealth = newHealth
      this.prevHealth = newHealth
      this.currentDamage = 0
    }
  }

  public takeHit(damage: number) {
    this.currentDamage = damage
  }
}
