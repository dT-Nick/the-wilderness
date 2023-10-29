import {
  generateMapHomeBuildingState,
  updateMapHomeBuildingState,
} from './building-maps/home.js'
import {
  calculateDamage,
  calculateExperienceFromLevel,
  calculateExperienceGainedFromBattle,
  calculateLevelFromExperience,
  generateSlug,
} from './helpers/functions.js'
import { isButtonCurrentlyDown, isKeyCurrentlyDown } from './input.js'
import {
  deriveExtendedRestrictedCoordsFromRestrictedCoordsArray,
  takeSettlementDamage,
} from './settlement.js'
import {
  getGameState,
  getDeltaFrames,
  updateGameState,
  updateBattleState,
  getBattleState,
  isPlayerInitialised,
  addNotification,
  updateMessageState,
} from './state.js'
import { getMapZeroState } from './wilderness-maps/map-0.js'
import { getSettlementMapState } from './wilderness-maps/settlement.js'
import { deriveRestrictedCoordsFromMap } from './wilderness.js'

let entityId = 0

export class Entity {
  x: number
  y: number
  size: number
  id: number

  constructor(startX: number, startY: number, size: number) {
    this.x = startX
    this.y = startY
    this.size = size
    this.id = entityId++
  }

  get coordinates() {
    const { blockSize } = getGameState()

    const coords: [number, number] = [
      Math.round(this.x / blockSize),
      Math.round(this.y / blockSize),
    ]

    return coords
  }

  public updatePosition(x: number, y: number) {
    this.x = x
    this.y = y
  }
}

export class LivingBeing extends Entity {
  currentHealth: number
  prevHealth: number
  currentDamage: number | null
  faceDirection: 'up' | 'down' | 'left' | 'right'
  baseStats: {
    attack: number
    defense: number
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
      defense: 10,
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

  get defense() {
    return (
      this.baseStats.defense +
      (this.currentLevel - 1) * Math.floor(this.baseStats.defense / 2)
    )
  }

  get maxHealth() {
    return this.baseStats.health + (this.currentLevel - 1) * 10
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
    if (this.currentDamage === null) return
    const deltaFrames = getDeltaFrames()
    this.currentHealth -= 0.5 * deltaFrames

    if (
      this.currentHealth <= this.prevHealth - this.currentDamage ||
      this.currentHealth <= 0
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
  currentExperienceGain: number

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

    return blockSize / (isSprintDown ? 8 : 12)
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

  public takeDamage() {
    if (this.currentDamage === null) return
    super.takeDamage()
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

  public takeHit(damage: number): void {
    const { enemies } = getGameState()
    const { enemyId } = getBattleState()
    const enemy = enemies.find((e) => e.id === enemyId)
    if (!enemy) return

    const { damage: modifiedDamage, isCrit } = calculateDamage(
      enemy.attack,
      this.defense,
      damage
    )

    super.takeHit(modifiedDamage)
    if (modifiedDamage === 0) {
      updateMessageState({
        message: `The ${enemy.name} missed their attack!`,
      })
    } else {
      updateMessageState({
        message:
          (isCrit ? 'Critical hit! ' : '') +
          `The ${enemy.name} attacked you causing ${modifiedDamage} damage!`,
      })
    }
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

  public gainExperience(amount: number) {
    this.currentExperienceGain = amount
  }

  public addExperience() {
    if (!this.currentExperienceGain) return
    const deltaFrames = getDeltaFrames()
    const experienceAtNextLevel = calculateExperienceFromLevel(
      this.currentLevel
    )
    const experienceIncrease = 0.5 * deltaFrames
    const experienceAfterIncrease = this.experience + experienceIncrease

    this.experience += 0.5 * deltaFrames

    if (experienceAfterIncrease >= experienceAtNextLevel) {
      this.currentHealth += 10
      this.prevHealth += 10
    }

    if (this.experience >= this.prevExperience + this.currentExperienceGain) {
      const newExperience = this.prevExperience + this.currentExperienceGain
      this.experience = newExperience
      this.prevExperience = newExperience
      this.currentExperienceGain = 0
      updateBattleState({
        status: 'wait',
        waitLengthMs: 2000,
        waitStart: Date.now(),
      })
    }
  }

  public addHealth() {
    if (!this.currentHeal) return
    const deltaFrames = getDeltaFrames()
    this.currentHealth += 0.5 * deltaFrames

    if (
      this.currentHealth >= this.prevHealth + this.currentHeal ||
      this.currentHealth >= this.maxHealth
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
}

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
    mapId: number | string,
    health: number = 100,
    attack: number = 10,
    defense: number = 10,
    faceDirection?: 'up' | 'down' | 'left' | 'right'
  ) {
    const directionRng = Math.random()
    let rndFaceDirection: 'left' | 'up' | 'right' | 'down' = 'left'
    if (directionRng < 0.25) {
      rndFaceDirection = 'up'
    } else if (directionRng < 0.5) {
      rndFaceDirection = 'right'
    } else if (directionRng < 0.75) {
      rndFaceDirection = 'down'
    }
    super(startX, startY, size, health, faceDirection ?? rndFaceDirection)
    this.baseStats = {
      attack,
      defense,
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
    const { map } = getMapZeroState()
    const restrictedCoords = deriveRestrictedCoordsFromMap(map, this.mapId)

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
    const { map } = getMapZeroState()
    const restrictedCoords = deriveRestrictedCoordsFromMap(map, this.mapId)

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
    const { map } = getMapZeroState()
    const restrictedCoords = deriveRestrictedCoordsFromMap(map, this.mapId)

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
    const { map } = getMapZeroState()
    const restrictedCoords = deriveRestrictedCoordsFromMap(map, this.mapId)

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
      this.defense,
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
}

// ########################

export class FloorItem extends Entity {
  itemId: string
  mapId: number | string

  constructor(
    startX: number,
    startY: number,
    size: number,
    itemId: string,
    mapId: number | string
  ) {
    super(startX, startY, size)
    this.itemId = itemId
    this.mapId = mapId
  }

  public pickUpItem() {
    const { items } = getGameState()
    const item = items.find((i) => i.id === this.itemId)

    updateGameState((c) => ({
      inventory: [
        ...c.inventory,
        {
          id: this.id,
          itemId: this.itemId,
        },
      ],
      floorItems: [...c.floorItems.filter((i) => i.id !== this.id)],
    }))
    addNotification(`You picked up a ${item?.name ?? 'an item'}`)
  }
}

export class Item {
  id: string
  name: string
  isConsumable: boolean
  isEquipable: boolean
  isUsable: boolean

  constructor(
    name: string,
    isConsumable: boolean,
    isEquipable: boolean,
    isUsable: boolean
  ) {
    this.id = generateSlug(name)
    this.name = name
    this.isConsumable = isConsumable
    this.isEquipable = isEquipable
    this.isUsable = isUsable
  }
}

export class ConsumableItem extends Item {
  effect: () => void

  constructor(name: string, effect: () => void) {
    super(name, true, false, false)
    this.effect = effect
  }

  public consume() {
    this.effect()
  }
}

export class QuestItem extends Item {
  effect: () => void

  constructor(name: string, effect: () => void) {
    super(name, false, false, true)
    this.effect = effect
  }

  public use() {
    this.effect()
  }
}

export class EquipableItem extends Item {
  slot: 'weapon' | 'armour'
  stats: {
    attack: number
    defense: number
  }

  constructor(
    name: string,
    slot: 'weapon' | 'armour',
    stats: { attack: number; defense: number }
  ) {
    super(name, false, true, false)
    this.slot = slot
    this.stats = stats
  }
}

// ########################

let buildingId = 0

export class Building {
  id: number
  name: string
  isPlaced: boolean
  maxHealth: number
  currentHealth: number
  prevX: number
  prevY: number
  x: number
  y: number
  width: number
  height: number
  faceCount: number
  faceDirection: 'up' | 'down' | 'left' | 'right'
  colour: string

  constructor(
    name: string,
    x: number,
    y: number,
    width: number,
    height: number,
    maxHealth: number,
    faceDirection?: 'up' | 'down' | 'left' | 'right',
    isPlaced?: boolean
  ) {
    this.id = buildingId++
    this.name = name
    this.isPlaced = isPlaced ?? false
    this.maxHealth = maxHealth
    this.currentHealth = maxHealth
    this.prevX = x
    this.prevY = y
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.faceDirection = faceDirection ?? 'down'
    this.faceCount = 0
    this.colour = 'chocolate'
  }

  get coordinates() {
    const { blockSize } = getGameState()

    const fromCoords: [number, number] = [
      Math.round(this.x / blockSize),
      Math.round(this.y / blockSize),
    ]

    const width =
      this.faceDirection === 'left' || this.faceDirection === 'right'
        ? this.height
        : this.width
    const height =
      this.faceDirection === 'left' || this.faceDirection === 'right'
        ? this.width
        : this.height

    const toCoords: [number, number] = [
      Math.round((this.x + width) / blockSize),
      Math.round((this.y + height) / blockSize),
    ]

    return {
      fromCoords,
      toCoords,
    }
  }

  get isPlaceable() {
    const { map } = getSettlementMapState()
    const looseRestrictedCoords = deriveRestrictedCoordsFromMap(
      map,
      'settlement'
    )
    const restrictedCoords =
      deriveExtendedRestrictedCoordsFromRestrictedCoordsArray(
        looseRestrictedCoords
      )

    const { fromCoords, toCoords } = this.coordinates

    for (let x = fromCoords[0]; x <= toCoords[0] - 1; x++) {
      for (let y = fromCoords[1]; y <= toCoords[1] - 1; y++) {
        if (restrictedCoords.some((c) => c[0] === x && c[1] === y)) {
          return false
        }
      }
    }

    return true
  }

  public takeDamage(amount: number) {
    this.currentHealth -= amount
  }

  public place() {
    this.prevX = this.x
    this.prevY = this.y
    this.isPlaced = true
    if (this.name === 'home') {
      updateMapHomeBuildingState(
        generateMapHomeBuildingState(this.faceDirection)
      )
    }
    addNotification('Building has been placed.')
  }

  public cancelPlacement() {
    this.x = this.prevX
    this.y = this.prevY
    this.isPlaced = false
  }

  public rotateLeft() {
    if (this.faceDirection === 'up') {
      this.faceDirection = 'left'
    } else if (this.faceDirection === 'left') {
      this.faceDirection = 'down'
    } else if (this.faceDirection === 'down') {
      this.faceDirection = 'right'
    } else if (this.faceDirection === 'right') {
      this.faceDirection = 'up'
    }
  }

  public rotateRight() {
    if (this.faceDirection === 'up') {
      this.faceDirection = 'right'
    } else if (this.faceDirection === 'right') {
      this.faceDirection = 'down'
    } else if (this.faceDirection === 'down') {
      this.faceDirection = 'left'
    } else if (this.faceDirection === 'left') {
      this.faceDirection = 'up'
    }
  }

  get faceCountMax() {
    if (isKeyCurrentlyDown('shift') || isButtonCurrentlyDown('buttonB')) {
      return 4
    }
    return 10
  }

  public startMovingRight() {
    const deltaFrames = getDeltaFrames()
    if (this.faceCount > this.faceCountMax) {
      this.faceCount = 0
      this.moveRight()
    } else {
      this.faceCount += 1 * deltaFrames
    }
  }

  public startMovingLeft() {
    const deltaFrames = getDeltaFrames()
    if (this.faceCount > this.faceCountMax) {
      this.faceCount = 0
      this.moveLeft()
    } else {
      this.faceCount += 1 * deltaFrames
    }
  }

  public startMovingUp() {
    const deltaFrames = getDeltaFrames()
    if (this.faceCount > this.faceCountMax) {
      this.faceCount = 0
      this.moveUp()
    } else {
      this.faceCount += 1 * deltaFrames
    }
  }

  public startMovingDown() {
    const deltaFrames = getDeltaFrames()
    if (this.faceCount > this.faceCountMax) {
      this.faceCount = 0
      this.moveDown()
    } else {
      this.faceCount += 1 * deltaFrames
    }
  }

  public stopMoving() {
    this.faceCount = 0
  }

  public moveRight() {
    const { blockSize } = getGameState()

    this.x += blockSize
  }

  public moveLeft() {
    const { blockSize } = getGameState()

    this.x -= blockSize
  }

  public moveUp() {
    const { blockSize } = getGameState()

    this.y -= blockSize
  }

  public moveDown() {
    const { blockSize } = getGameState()

    this.y += blockSize
  }
}
