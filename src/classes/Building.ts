import { generateMapHomeBuildingDesign } from '../building-maps/home.js'
import { isKeyCurrentlyDown, isButtonCurrentlyDown } from '../input.js'
import { SaveFile } from '../save.js'
import { deriveExtendedRestrictedCoordsFromRestrictedCoordsArray } from '../settlement.js'
import {
  addNotification,
  getDeltaFrames,
  getGameState,
  getIdState,
  getMapById,
  updateMap,
} from '../state.js'
import { deriveRestrictedCoordsFromMap } from '../wilderness.js'

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
    this.id = getIdState('buildingId')
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
    const { design } = getMapById('settlement')
    const looseRestrictedCoords = deriveRestrictedCoordsFromMap(
      design,
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
      updateMap('home', {
        design: generateMapHomeBuildingDesign(this.faceDirection),
      })
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

  public load(props: SaveFile['settlementState']['buildings'][number]) {
    if (!props) return
    this.id = props.id
    this.name = props.name
    this.isPlaced = props.isPlaced
    this.maxHealth = props.maxHealth
    this.currentHealth = props.currentHealth
    this.prevX = props.prevX
    this.prevY = props.prevY
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height
    this.faceDirection = props.faceDirection
    this.faceCount = props.faceCount
    this.colour = props.colour
  }
}
