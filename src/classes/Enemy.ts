import {
  calculateDamage,
  calculateExperienceFromLevel,
  calculateExperienceGainedFromBattle,
} from '../helpers/functions.js'
import { SaveFile } from '../save.js'
import { takeSettlementDamage } from '../settlement.js'
import {
  updateGameState,
  getGameState,
  isPlayerInitialised,
  updateMessageState,
  updateBattleState,
  getBattleState,
  getMapById,
} from '../state.js'
import { deriveRestrictedCoordsFromMap } from '../wilderness.js'
import { LivingBeing } from './LivingBeing.js'

export class Enemy extends LivingBeing {
  name: string
  mapId: number | string
  playerPrompted: boolean
  pictureId: string

  constructor(
    name: string,
    pictureId: string,
    level: number,
    startX: number,
    startY: number,
    size: number,
    mapId: string,
    health: number = 100,
    attack: number = 10,
    defence: number = 10,
    faceDirection?: 'up' | 'down' | 'left' | 'right'
  ) {
    super(startX, startY, size, health, faceDirection)
    this.baseStats = {
      attack,
      defence,
      health,
    }
    this.experience = calculateExperienceFromLevel(level - 1)
    this.pictureId = pictureId
    this.prevExperience = this.experience
    this.currentHealth = this.maxHealth
    this.prevHealth = this.maxHealth
    this.name = name
    this.mapId = mapId
    this.playerPrompted = false
  }

  public updatePlayerPrompted(bool: boolean) {
    this.playerPrompted = bool
  }

  public moveTowardsSettlement() {
    const settlementEntryCoords = [41, 24]
    const [eCoordsX, eCoordsY] = this.coordinates

    if (
      eCoordsX === settlementEntryCoords[0] &&
      eCoordsY === settlementEntryCoords[1]
    ) {
      takeSettlementDamage()
      updateGameState((c) => ({
        enemies: [...c.enemies.filter((e) => e.id !== this.id)],
      }))
      return
    }

    const distanceFromSettlementEntry = [
      Math.abs(eCoordsX - settlementEntryCoords[0]),
      Math.abs(eCoordsY - settlementEntryCoords[1]),
    ]

    const isXDistanceGreater =
      distanceFromSettlementEntry[0] > distanceFromSettlementEntry[1]

    if (isXDistanceGreater) {
      if (eCoordsX > settlementEntryCoords[0]) {
        this.moveLeft()
      } else {
        this.moveRight()
      }
    } else {
      if (eCoordsY > settlementEntryCoords[1]) {
        this.moveUp()
      } else {
        this.moveDown()
      }
    }
  }

  public moveRight() {
    const { blockSize } = getGameState()
    const { design } = getMapById('[0,0]')
    const restrictedCoords = deriveRestrictedCoordsFromMap(design, this.mapId)

    const [eCoordsX, eCoordsY] = this.coordinates

    if (
      restrictedCoords.some((c) => c[0] === eCoordsX + 1 && c[1] === eCoordsY)
    ) {
      return
    }

    this.faceDirection = 'right'
    this.x += blockSize
  }

  public moveLeft() {
    const { blockSize } = getGameState()
    const { design } = getMapById('[0,0]')
    const restrictedCoords = deriveRestrictedCoordsFromMap(design, this.mapId)

    const [eCoordsX, eCoordsY] = this.coordinates

    if (
      restrictedCoords.some((c) => c[0] === eCoordsX - 1 && c[1] === eCoordsY)
    ) {
      return
    }

    this.faceDirection = 'left'
    this.x -= blockSize
  }

  public moveUp() {
    const { blockSize } = getGameState()
    const { design } = getMapById('[0,0]')
    const restrictedCoords = deriveRestrictedCoordsFromMap(design, this.mapId)

    const [eCoordsX, eCoordsY] = this.coordinates

    if (
      restrictedCoords.some((c) => c[0] === eCoordsX && c[1] === eCoordsY - 1)
    ) {
      return
    }

    this.faceDirection = 'up'
    this.y -= blockSize
  }

  public moveDown() {
    const { blockSize } = getGameState()
    const { design } = getMapById('[0,0]')
    const restrictedCoords = deriveRestrictedCoordsFromMap(design, this.mapId)

    const [eCoordsX, eCoordsY] = this.coordinates

    if (
      restrictedCoords.some((c) => c[0] === eCoordsX && c[1] === eCoordsY + 1)
    ) {
      return
    }

    this.faceDirection = 'down'
    this.y += blockSize
  }

  public takeDamage() {
    if (this.currentDamage === null) return
    super.takeDamage()

    if (this.currentHealth <= 0) {
      this.currentHealth = 0

      const { player } = getGameState()
      if (!isPlayerInitialised(player)) return

      const experienceGained = calculateExperienceGainedFromBattle(
        player.currentLevel,
        this.currentLevel
      )
      updateMessageState({
        message: `You defeated the ${
          this.name
        } and gained ${experienceGained.toLocaleString()} experience!`,
      })
      player.gainExperience(experienceGained)

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
    if (!isPlayerInitialised(player)) return

    const { lastMove, status } = getBattleState()
    if (
      lastMove === 'player' &&
      status === 'play' &&
      player.currentDamage === null
    ) {
      player.takeHit(damage)
    }
  }

  public takeHit(damage: number) {
    const { player } = getGameState()
    if (!isPlayerInitialised(player)) return
    const { damage: modifiedDamage, isCrit } = calculateDamage(
      player.attack,
      this.defence,
      damage
    )

    super.takeHit(modifiedDamage)
    if (modifiedDamage === 0) {
      updateMessageState({
        message: `You missed your attack!`,
      })
    } else {
      updateMessageState({
        message:
          (isCrit ? 'Critical hit! ' : '') +
          `You attacked the ${this.name} causing ${modifiedDamage} damage!`,
      })
    }
  }

  public load(props: SaveFile['gameState']['enemies'][number]) {
    if (!props) return
    this.baseStats = props.baseStats
    this.experience = props.experience
    this.prevExperience = props.prevExperience
    this.prevHealth = props.prevHealth
    this.currentHealth = props.currentHealth
    this.x = props.x
    this.y = props.y
    this.faceDirection = props.faceDirection
    this.currentDamage = props.currentDamage
    this.id = props.id
    this.size = props.size
    this.name = props.name
    this.mapId = props.mapId
    this.playerPrompted = props.playerPrompted
    this.pictureId = props.pictureId
  }
}
