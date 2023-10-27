import { generateSlug } from './helpers/functions.js'
import { isButtonCurrentlyDown, isKeyCurrentlyDown } from './input.js'
import {
  getGameState,
  getDeltaFrames,
  updateGameState,
  updateBattleState,
  getBattleState,
  isPlayerInitialised,
} from './state.js'
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

  constructor(startX: number, startY: number, size: number) {
    super(startX, startY, size, 100, 'down')

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

    return blockSize / (isSprintDown ? 3 : 4)
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
    if (!this.currentDamage) return
    super.takeDamage()
    if (this.currentHealth <= this.prevHealth - this.currentDamage) {
      updateBattleState({
        lastMove: 'enemy',
        playerMenu: 'main',
      })
    }
  }

  public heal(amount: number) {
    this.currentHeal = amount
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

  constructor(
    name: string,
    health: number,
    startX: number,
    startY: number,
    size: number,
    mapId: number | string
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
    this.mapId = mapId
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
    if (!isPlayerInitialised(player)) return

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
  }
}

export class Item {
  id: string
  name: string
  isConsumable: boolean
  isEquipable: boolean

  constructor(name: string, isConsumable: boolean, isEquipable: boolean) {
    this.id = generateSlug(name)
    this.name = name
    this.isConsumable = isConsumable
    this.isEquipable = isEquipable
  }
}

export class ConsumableItem extends Item {
  effect: () => void

  constructor(name: string, effect: () => void) {
    super(name, true, false)
    this.effect = effect
  }

  public consume() {
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
    super(name, false, true)
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
  faceDirection: 'up' | 'down' | 'left' | 'right'
  colour: string

  constructor(
    name: string,
    x: number,
    y: number,
    width: number,
    height: number,
    maxHealth: number,
    faceDirection?: 'up' | 'down' | 'left' | 'right'
  ) {
    this.id = buildingId++
    this.name = name
    this.isPlaced = false
    this.maxHealth = maxHealth
    this.currentHealth = maxHealth
    this.prevX = x
    this.prevY = y
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.faceDirection = faceDirection ?? 'down'
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
    const restrictedCoords = deriveRestrictedCoordsFromMap(map)
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

  public place() {
    this.prevX = this.x
    this.prevY = this.y
    this.isPlaced = true
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
