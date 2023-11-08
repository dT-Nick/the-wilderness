import { calculateLevelFromExperience } from '../helpers/functions.js'
import { getDeltaFrames } from '../state.js'
import { Entity } from './Entity.js'

export class LivingBeing extends Entity {
  currentHealth: number
  prevHealth: number
  currentDamage: number | null
  faceDirection: 'up' | 'down' | 'left' | 'right'
  baseStats: {
    attack: number
    defence: number
    health: number
  }
  experience: number
  prevExperience: number

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
    this.faceDirection = faceDirection ?? 'down'

    this.currentDamage = null
    this.baseStats = {
      attack: 10,
      defence: 10,
      health,
    }
    this.experience = 0
    this.prevExperience = 0
  }

  get currentLevel() {
    return calculateLevelFromExperience(this.experience)
  }

  get attack() {
    return (
      this.baseStats.attack +
      (this.currentLevel - 1) * Math.floor(this.baseStats.attack / 2)
    )
  }

  get defence() {
    return (
      this.baseStats.defence +
      (this.currentLevel - 1) * Math.floor(this.baseStats.defence / 2)
    )
  }

  get maxHealth() {
    return this.baseStats.health + (this.currentLevel - 1) * 10
  }

  get coordinatesOfBlockInFront() {
    const [x, y] = this.coordinates
    switch (this.faceDirection) {
      case 'up':
        return { x, y: y - 1 }
      case 'down':
        return { x, y: y + 1 }
      case 'left':
        return { x: x - 1, y }
      case 'right':
        return { x: x + 1, y }
      default: {
        throw new Error('Invalid direction')
      }
    }
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

  public takeDamage(instant: boolean = false) {
    if (this.currentDamage === null) return
    const deltaFrames = getDeltaFrames()
    const healthDecrease = (this.maxHealth / 120) * deltaFrames

    this.currentHealth -= healthDecrease

    if (
      this.currentHealth <= this.prevHealth - this.currentDamage ||
      this.currentHealth <= 0 ||
      instant
    ) {
      const newHealth =
        this.prevHealth - this.currentDamage > 0
          ? this.prevHealth - this.currentDamage
          : 0
      this.currentHealth = newHealth
      this.prevHealth = newHealth
      this.currentDamage = null
    }
  }

  public restoreHealth() {
    this.currentHealth = this.maxHealth
    this.prevHealth = this.maxHealth
  }

  public takeHit(damage: number) {
    this.currentDamage = damage
  }
}
