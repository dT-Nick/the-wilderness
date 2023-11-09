import { calculateExperienceFromLevel } from '../helpers/functions.js'
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
  getIdState,
} from '../state.js'
import { deriveRestrictedCoordsFromMap } from '../wilderness.js'
import { FloorItem } from './FloorItem.js'
import { LivingBeing } from './LivingBeing.js'

export class Enemy extends LivingBeing {
  name: string
  mapId: number | string
  playerPrompted: boolean
  pictureId: string
  inventory: Array<{
    id: number
    itemId: string
  }>

  constructor(
    name: string,
    pictureId: string,
    level: number,
    startX: number,
    startY: number,
    size: number,
    mapId: string,
    health: number = 100,
    meleeAttack: number = 10,
    meleeDefence: number = 10,
    magicAttack: number = 10,
    magicDefence: number = 10,
    rangedAttack: number = 10,
    rangedDefence: number = 10,
    faceDirection?: 'up' | 'down' | 'left' | 'right'
  ) {
    super(startX, startY, size, health, faceDirection)
    this.baseStats = {
      meleeAttack,
      meleeDefence,
      magicAttack,
      magicDefence,
      rangedAttack,
      rangedDefence,
      health,
    }
    const experience = calculateExperienceFromLevel(level - 1)
    this.experience = {
      magic: experience,
      melee: experience,
      ranged: experience,
    }
    this.pictureId = pictureId
    this.prevExperience = this.experience
    this.currentHealth = this.maxHealth
    this.prevHealth = this.maxHealth
    this.name = name
    this.mapId = mapId
    this.playerPrompted = false

    if (this.name === 'Settlement Zombie') {
      this.inventory = [
        {
          itemId: 'wooden-sword',
          id: getIdState('entityId'),
        },
      ]
    } else {
      this.inventory = []
    }
  }

  public dropInventory() {
    const { blockSize } = getGameState()

    updateGameState((c) => ({
      ...c,
      floorItems: [
        ...c.floorItems,
        ...this.inventory.map(
          (i) =>
            new FloorItem(
              this.x,
              this.y,
              blockSize * (1 / 2),
              i.itemId,
              this.mapId
            )
        ),
      ],
    }))
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

      let experienceGainedArray: Array<string> = []
      if (player.currentExperienceGain.melee > 0) {
        experienceGainedArray.push(
          `${player.currentExperienceGain.melee.toLocaleString()} Melee Experience`
        )
      }
      if (player.currentExperienceGain.magic > 0) {
        experienceGainedArray.push(
          `${player.currentExperienceGain.magic.toLocaleString()} Magic Experience`
        )
      }
      if (player.currentExperienceGain.ranged > 0) {
        experienceGainedArray.push(
          `${player.currentExperienceGain.ranged.toLocaleString()} Ranged Experience`
        )
      }
      const experienceGainedString = experienceGainedArray
        .map((e, i) => {
          if (i === experienceGainedArray.length - 1) {
            return i === 0 ? e : `and ${e}`
          }
          return e
        })
        .join(', ')

      updateMessageState({
        message: `You defeated the ${this.name} and gained ${experienceGainedString}!`,
      })

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
      player.takeHit(damage, 'melee')
    }
  }

  public takeHit(damage: number, type: 'melee' | 'magic' | 'ranged') {
    const { player } = getGameState()
    if (!isPlayerInitialised(player)) return

    super.takeHit(
      damage,
      type,
      player[`${type}Attack`],
      this[`${type}Defence`],
      'enemy',
      this.name
    )
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
