import {
  calculateCombatLevelFromMeleeRangedAndMagic,
  calculateDamage,
  calculateLevelFromExperience,
} from '../helpers/functions.js'
import {
  getDeltaFrames,
  getGameState,
  isPlayerInitialised,
  updateMessageState,
} from '../state.js'
import { Entity } from './Entity.js'

export class LivingBeing extends Entity {
  currentHealth: number
  prevHealth: number
  currentDamage: number | null
  faceDirection: 'up' | 'down' | 'left' | 'right'
  baseStats: {
    meleeAttack: number
    meleeDefence: number
    health: number
    magicAttack: number
    magicDefence: number
    rangedAttack: number
    rangedDefence: number
  }
  experience: {
    melee: number
    magic: number
    ranged: number
  }
  prevExperience: {
    melee: number
    magic: number
    ranged: number
  }

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
      meleeAttack: 10,
      meleeDefence: 10,
      magicAttack: 10,
      magicDefence: 10,
      rangedAttack: 10,
      rangedDefence: 10,
      health,
    }
    this.experience = {
      melee: 0,
      magic: 0,
      ranged: 0,
    }
    this.prevExperience = {
      melee: 0,
      magic: 0,
      ranged: 0,
    }
  }

  get currentMeleeLevel() {
    return calculateLevelFromExperience(this.experience.melee)
  }

  get currentMagicLevel() {
    return calculateLevelFromExperience(this.experience.magic)
  }

  get currentRangedLevel() {
    return calculateLevelFromExperience(this.experience.ranged)
  }

  get currentCombatLevel() {
    return calculateCombatLevelFromMeleeRangedAndMagic(
      this.experience.melee,
      this.experience.ranged,
      this.experience.magic
    )
  }

  get meleeAttack() {
    return (
      this.baseStats.meleeAttack +
      (this.currentMeleeLevel - 1) * Math.floor(this.baseStats.meleeAttack / 2)
    )
  }

  get meleeDefence() {
    return (
      this.baseStats.meleeDefence +
      (this.currentMeleeLevel - 1) * Math.floor(this.baseStats.meleeDefence / 2)
    )
  }

  get magicAttack() {
    return (
      this.baseStats.magicAttack +
      (this.currentMagicLevel - 1) * Math.floor(this.baseStats.magicAttack / 2)
    )
  }

  get magicDefence() {
    return (
      this.baseStats.magicDefence +
      (this.currentMagicLevel - 1) * Math.floor(this.baseStats.magicDefence / 2)
    )
  }

  get rangedAttack() {
    return (
      this.baseStats.rangedAttack +
      (this.currentRangedLevel - 1) *
        Math.floor(this.baseStats.rangedAttack / 2)
    )
  }

  get rangedDefence() {
    return (
      this.baseStats.rangedDefence +
      (this.currentRangedLevel - 1) *
        Math.floor(this.baseStats.rangedDefence / 2)
    )
  }

  get maxHealth() {
    return (
      this.baseStats.health +
      (this.currentMeleeLevel +
        this.currentMagicLevel +
        this.currentRangedLevel -
        3) *
        10
    )
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

  public takeHit(
    damage: number,
    type: 'melee' | 'magic' | 'ranged',
    attack: number,
    defence: number,
    enemyOrPlayer: 'player' | 'enemy',
    enemyName: string
  ) {
    const { player } = getGameState()
    if (!isPlayerInitialised(player)) return
    const { damage: modifiedDamage, isCrit } = calculateDamage(
      attack,
      defence,
      damage
    )

    if (modifiedDamage === 0) {
      if (enemyOrPlayer === 'player') {
        updateMessageState({
          message: `The ${enemyName} missed their attack!`,
        })
      } else {
        updateMessageState({
          message: `You missed your attack!`,
        })
      }
    } else {
      if (enemyOrPlayer === 'player') {
        updateMessageState({
          message:
            (isCrit ? 'Critical hit! ' : '') +
            `The ${enemyName} attacked you causing ${modifiedDamage} damage!`,
        })
      } else {
        player.gainExperience(
          ((modifiedDamage > this.maxHealth ? this.maxHealth : modifiedDamage) *
            this.currentCombatLevel) /
            2,
          type
        )

        updateMessageState({
          message:
            (isCrit ? 'Critical hit! ' : '') +
            `You attacked the ${enemyName} causing ${modifiedDamage} damage!`,
        })
      }
    }

    this.currentDamage = modifiedDamage
  }
}
