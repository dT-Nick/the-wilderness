import { calculateExperienceFromLevel } from '../helpers/functions.js'
import { isButtonCurrentlyDown, isKeyCurrentlyDown } from '../input.js'
import { SaveFile } from '../save.js'
import {
  getBattleState,
  getDeltaFrames,
  getGameState,
  updateBattleState,
  updateMessageState,
} from '../state.js'
import { LivingBeing } from './LivingBeing.js'

export class Player extends LivingBeing {
  prevX: number
  prevY: number
  movementStatus: 'idle' | 'up' | 'down' | 'left' | 'right' | 'stable'
  faceCount: {
    up: number
    down: number
    left: number
    right: number
  }
  currentHeal: number
  currentExperienceGain: {
    melee: number
    magic: number
    ranged: number
  }
  godMode: boolean

  constructor(startX: number, startY: number, size: number) {
    const health = 100
    super(startX, startY, size, health, 'down')

    this.prevX = startX
    this.prevY = startY
    this.faceCount = {
      up: 0,
      down: 8,
      left: 0,
      right: 0,
    }
    this.movementStatus = 'idle'
    this.currentHeal = 0
    this.currentExperienceGain = {
      melee: 0,
      magic: 0,
      ranged: 0,
    }
    this.godMode = false
  }

  public toggleGodMode() {
    this.godMode = !this.godMode
  }

  get meleeAttack() {
    return this.godMode ? 10000 : super.meleeAttack
  }

  get meleeDefence() {
    return this.godMode ? 10000 : super.meleeDefence
  }

  get rangedAttack() {
    return this.godMode ? 10000 : super.rangedAttack
  }

  get rangedDefence() {
    return this.godMode ? 10000 : super.rangedDefence
  }

  get magicAttack() {
    return this.godMode ? 10000 : super.magicAttack
  }

  get magicDefence() {
    return this.godMode ? 10000 : super.magicDefence
  }

  get coordinates() {
    const { blockSize } = getGameState()

    const coords: [number, number] = [
      Math.round(this.prevX / blockSize),
      Math.round(this.prevY / blockSize),
    ]

    return coords
  }

  public goToCoordinates(x: number, y: number) {
    const { blockSize } = getGameState()
    const xCoord = x * blockSize
    const yCoord = y * blockSize

    this.updatePosition(xCoord, yCoord)
    this.prevX = xCoord
    this.prevY = yCoord
    this.faceCount = {
      up: 0,
      down: 0,
      left: 0,
      right: 0,
    }
  }

  get speed() {
    const { blockSize } = getGameState()
    const isSprintDown =
      isKeyCurrentlyDown('shift') || isButtonCurrentlyDown('buttonB')

    return (
      blockSize /
      (isSprintDown ? (this.godMode ? 2 : 8) : this.godMode ? 3 : 12)
    )
  }

  public moveUp() {
    if (this.faceDirection === 'up') {
      if (this.faceCount.up >= 8) {
        this.prevY = this.y
        this.movementStatus = 'up'
      }
    } else {
      super.lookUp()
    }
  }

  public lookUp() {
    super.lookUp()
    this.stopMoving()
  }

  public moveDown() {
    if (this.faceDirection === 'down') {
      if (this.faceCount.down >= 8) {
        this.prevY = this.y
        this.movementStatus = 'down'
      }
    } else {
      super.lookDown()
    }
  }

  public lookDown() {
    super.lookDown()
    this.stopMoving()
  }

  public moveLeft() {
    if (this.faceDirection === 'left') {
      if (this.faceCount.left >= 8) {
        this.prevX = this.x
        this.movementStatus = 'left'
      }
    } else {
      super.lookLeft()
    }
  }

  public lookLeft() {
    super.lookLeft()
    this.stopMoving()
  }

  public moveRight() {
    if (this.faceDirection === 'right') {
      if (this.faceCount.right >= 8) {
        this.prevX = this.x
        this.movementStatus = 'right'
      }
    } else {
      super.lookRight()
    }
  }

  public lookRight() {
    super.lookRight()
    this.stopMoving()
  }

  public keepMoving() {
    this.prevX = this.x
    this.prevY = this.y
    this.movementStatus = 'stable'
    this.faceCount = {
      up: 8,
      down: 8,
      left: 8,
      right: 8,
    }
  }

  public stopMoving() {
    if (this.movementStatus === 'idle') return
    this.prevX = this.x
    this.prevY = this.y
    this.movementStatus = 'idle'
    this.faceCount = {
      up: 0,
      down: 0,
      left: 0,
      right: 0,
      [this.faceDirection]: 8,
    }
  }

  public updateFaceCount(direction: 'up' | 'down' | 'left' | 'right') {
    const deltaFrames = getDeltaFrames()

    if (this.faceCount[direction] < 8) {
      this.faceCount = {
        up: 0,
        down: 0,
        left: 0,
        right: 0,
        [direction]: this.faceCount[direction] + 1 * deltaFrames,
      }
    }
  }

  public takeDamage(instant: boolean = false) {
    if (this.currentDamage === null) return
    super.takeDamage(instant)
    if (this.currentHealth <= 0) {
      this.currentHealth = 0
      updateMessageState({
        message: `You were defeated in battle...`,
      })
      updateBattleState({
        lastMove: 'enemy',
        playerMenu: 'main',
      })

      return
    }
    if (this.currentHealth <= this.prevHealth - this.currentDamage) {
      updateBattleState({
        lastMove: 'enemy',
        playerMenu: 'main',
      })
    }
  }

  public takeHit(damage: number, type: 'melee' | 'ranged' | 'magic') {
    const { enemies } = getGameState()
    const { enemyId } = getBattleState()
    const enemy = enemies.find((e) => e.id === enemyId)
    if (!enemy) return

    super.takeHit(
      damage,
      type,
      enemy[`${type}Attack`],
      this[`${type}Defence`],
      'player',
      enemy.name
    )

    updateBattleState({
      playerMenu: 'main',
    })
  }

  public heal(amount: number) {
    this.currentHeal = amount

    const actualHeal =
      this.prevHealth + amount > this.maxHealth
        ? this.maxHealth - this.prevHealth
        : amount
    updateMessageState({
      message: `You healed ${actualHeal} health!`,
    })
  }

  public gainExperience(amount: number, type: 'melee' | 'ranged' | 'magic') {
    this.currentExperienceGain = {
      ...this.currentExperienceGain,
      [type]: this.currentExperienceGain[type] + amount,
    }
  }

  get currentlyGainingExperience() {
    return (
      this.currentExperienceGain.magic > 0 ||
      this.currentExperienceGain.melee > 0 ||
      this.currentExperienceGain.ranged > 0
    )
  }

  public addExperience(instant: boolean = false) {
    if (
      this.currentExperienceGain.magic === 0 &&
      this.currentExperienceGain.melee === 0 &&
      this.currentExperienceGain.ranged === 0
    )
      return
    const deltaFrames = getDeltaFrames()
    if (this.currentExperienceGain.melee) {
      const experienceAtNextMeleeLevel = calculateExperienceFromLevel(
        this.currentMeleeLevel
      )
      const experienceIncrease =
        (this.currentExperienceGain.melee / 100) * deltaFrames
      const meleeExperienceAfterIncrease =
        this.experience.melee + experienceIncrease

      this.experience.melee += experienceIncrease

      if (meleeExperienceAfterIncrease >= experienceAtNextMeleeLevel) {
        this.currentHealth += 10
        this.prevHealth += 10
      }
    }
    if (this.currentExperienceGain.ranged) {
      const experienceAtNextRangedLevel = calculateExperienceFromLevel(
        this.currentRangedLevel
      )
      const experienceIncrease =
        (this.currentExperienceGain.ranged / 100) * deltaFrames
      const rangedExperienceAfterIncrease =
        this.experience.ranged + experienceIncrease

      this.experience.ranged += experienceIncrease

      if (rangedExperienceAfterIncrease >= experienceAtNextRangedLevel) {
        this.currentHealth += 10
        this.prevHealth += 10
      }
    }
    if (this.currentExperienceGain.magic) {
      const experienceAtNextMagicLevel = calculateExperienceFromLevel(
        this.currentMagicLevel
      )
      const experienceIncrease =
        (this.currentExperienceGain.magic / 100) * deltaFrames
      const magicExperienceAfterIncrease =
        this.experience.magic + experienceIncrease

      this.experience.magic += experienceIncrease

      if (magicExperienceAfterIncrease >= experienceAtNextMagicLevel) {
        this.currentHealth += 10
        this.prevHealth += 10
      }
    }

    if (
      this.experience.melee >=
        this.prevExperience.melee + this.currentExperienceGain.melee ||
      instant
    ) {
      const newExperience =
        this.prevExperience.melee + this.currentExperienceGain.melee
      this.experience.melee = newExperience
      this.prevExperience.melee = newExperience
      this.currentExperienceGain.melee = 0
    }
    if (
      this.experience.ranged >=
      this.prevExperience.ranged + this.currentExperienceGain.ranged
    ) {
      const newExperience =
        this.prevExperience.ranged + this.currentExperienceGain.ranged
      this.experience.ranged = newExperience
      this.prevExperience.ranged = newExperience
      this.currentExperienceGain.ranged = 0
    }
    if (
      this.experience.magic >=
      this.prevExperience.magic + this.currentExperienceGain.magic
    ) {
      const newExperience =
        this.prevExperience.magic + this.currentExperienceGain.magic
      this.experience.magic = newExperience
      this.prevExperience.magic = newExperience
      this.currentExperienceGain.magic = 0
    }

    if (
      this.currentExperienceGain.magic === 0 &&
      this.currentExperienceGain.melee === 0 &&
      this.currentExperienceGain.ranged === 0
    ) {
      updateBattleState({
        status: 'wait',
        waitLengthMs: 2000,
        waitStart: Date.now(),
      })
    }
  }

  public addHealth(instant: boolean = false) {
    if (!this.currentHeal) return

    const deltaFrames = getDeltaFrames()
    const healthIncrease = (this.maxHealth / 120) * deltaFrames
    this.currentHealth += healthIncrease

    if (
      this.currentHealth >= this.prevHealth + this.currentHeal ||
      this.currentHealth >= this.maxHealth ||
      instant
    ) {
      const newHealth =
        this.prevHealth + this.currentHeal > this.maxHealth
          ? this.maxHealth
          : this.prevHealth + this.currentHeal
      this.currentHealth = newHealth
      this.prevHealth = newHealth
      this.currentHeal = 0
      updateBattleState({
        lastMove: 'player',
        status: 'wait',
        waitLengthMs: 1000,
        waitStart: Date.now(),
      })
    }
  }

  public load(props: SaveFile['gameState']['player']) {
    if (!props) return
    this.baseStats = props.baseStats
    this.experience = props.experience
    this.prevExperience = props.prevExperience
    this.prevHealth = props.prevHealth
    this.currentHealth = props.currentHealth
    this.prevX = props.prevX
    this.prevY = props.prevY
    this.x = props.x
    this.y = props.y
    this.faceDirection = props.faceDirection
    this.faceCount = props.faceCount
    this.movementStatus = props.movementStatus
    this.currentHeal = props.currentHeal
    this.currentExperienceGain = props.currentExperienceGain
    this.currentDamage = props.currentDamage
    this.id = props.id
    this.size = props.size
  }
}
