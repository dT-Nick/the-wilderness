import {
  isButtonCurrentlyDown,
  isButtonDownEvent,
  isKeyCurrentlyDown,
  isKeyDownEvent,
} from '../input.js'
import { handlePlayerMovement } from '../player.js'
import {
  addNotification,
  getCanvasState,
  getCurrentMap,
  getGameState,
  getSettlementState,
  isInitialised,
  isPlayerInitialised,
  updateGameState,
  updateMapsState,
} from '../state.js'
import {
  MapDesign,
  deriveRestrictedCoordsFromMap,
  drawBackgroundFromMap,
} from '../wilderness.js'

export function generateMapHomeBuildingDesign(
  faceDirection: 'left' | 'right' | 'up' | 'down'
): MapDesign {
  if (faceDirection === 'up') {
    return [
      { type: 'carpet', fromCoords: [34, 9], toCoords: [49, 18] },
      { type: 'wall', fromCoords: [51, 6], toCoords: [52, 20] },
      { type: 'void', fromCoords: [0, 0], toCoords: [31, 27] },
      { type: 'void', fromCoords: [52, 0], toCoords: [83, 27] },
      { type: 'void', fromCoords: [31, 0], toCoords: [52, 6] },
      { type: 'void', fromCoords: [31, 21], toCoords: [52, 27] },
      { type: 'wood', fromCoords: [49, 9], toCoords: [51, 18] },
      { type: 'wall', fromCoords: [31, 6], toCoords: [32, 21] },
      { type: 'wall', fromCoords: [32, 20], toCoords: [52, 21] },
      { type: 'wood', fromCoords: [32, 7], toCoords: [34, 20] },
      { type: 'wood', fromCoords: [34, 18], toCoords: [51, 20] },
      { type: 'carpet', fromCoords: [40, 7], toCoords: [43, 9] },
      { type: 'carpet', fromCoords: [41, 6], toCoords: [42, 7] },
      { type: 'wood', fromCoords: [34, 7], toCoords: [40, 9] },
      { type: 'wood', fromCoords: [43, 7], toCoords: [51, 9] },
      { type: 'wall', fromCoords: [32, 6], toCoords: [41, 7] },
      { type: 'wall', fromCoords: [42, 6], toCoords: [51, 7] },
    ]
  }
  if (faceDirection === 'left') {
    return [
      { type: 'wood', fromCoords: [34, 7], toCoords: [51, 9] },
      { type: 'carpet', fromCoords: [34, 9], toCoords: [49, 18] },
      { type: 'wall', fromCoords: [51, 6], toCoords: [52, 20] },
      { type: 'wall', fromCoords: [32, 6], toCoords: [51, 7] },
      { type: 'void', fromCoords: [0, 0], toCoords: [31, 27] },
      { type: 'void', fromCoords: [52, 0], toCoords: [83, 27] },
      { type: 'void', fromCoords: [31, 0], toCoords: [52, 6] },
      { type: 'void', fromCoords: [31, 21], toCoords: [52, 27] },
      { type: 'carpet', fromCoords: [32, 12], toCoords: [34, 15] },
      { type: 'wood', fromCoords: [32, 7], toCoords: [34, 12] },
      { type: 'carpet', fromCoords: [31, 13], toCoords: [32, 14] },
      { type: 'wall', fromCoords: [31, 6], toCoords: [32, 13] },
      { type: 'wood', fromCoords: [32, 18], toCoords: [51, 20] },
      { type: 'wood', fromCoords: [49, 9], toCoords: [51, 18] },
      { type: 'wood', fromCoords: [32, 15], toCoords: [34, 18] },
      { type: 'wall', fromCoords: [31, 20], toCoords: [52, 21] },
      { type: 'wall', fromCoords: [31, 14], toCoords: [32, 20] },
    ]
  }
  if (faceDirection === 'down') {
    return [
      { type: 'wood', fromCoords: [34, 7], toCoords: [51, 9] },
      { type: 'wood', fromCoords: [49, 9], toCoords: [51, 20] },
      { type: 'wood', fromCoords: [32, 7], toCoords: [34, 20] },
      { type: 'carpet', fromCoords: [34, 9], toCoords: [49, 18] },
      { type: 'carpet', fromCoords: [40, 18], toCoords: [43, 20] },
      { type: 'wood', fromCoords: [34, 18], toCoords: [40, 20] },
      { type: 'wood', fromCoords: [43, 18], toCoords: [49, 20] },
      { type: 'wall', fromCoords: [31, 6], toCoords: [32, 21] },
      { type: 'wall', fromCoords: [32, 20], toCoords: [41, 21] },
      { type: 'wall', fromCoords: [42, 20], toCoords: [52, 21] },
      { type: 'wall', fromCoords: [51, 6], toCoords: [52, 20] },
      { type: 'wall', fromCoords: [32, 6], toCoords: [51, 7] },
      { type: 'void', fromCoords: [0, 0], toCoords: [31, 27] },
      { type: 'void', fromCoords: [52, 0], toCoords: [83, 27] },
      { type: 'void', fromCoords: [31, 0], toCoords: [52, 6] },
      { type: 'void', fromCoords: [31, 21], toCoords: [52, 27] },
      { type: 'carpet', fromCoords: [41, 20], toCoords: [42, 21] },
    ]
  }
  return [
    { type: 'carpet', fromCoords: [34, 9], toCoords: [49, 18] },
    { type: 'void', fromCoords: [0, 0], toCoords: [31, 27] },
    { type: 'void', fromCoords: [52, 0], toCoords: [83, 27] },
    { type: 'void', fromCoords: [31, 0], toCoords: [52, 6] },
    { type: 'void', fromCoords: [31, 21], toCoords: [52, 27] },
    { type: 'wall', fromCoords: [32, 20], toCoords: [52, 21] },
    { type: 'wood', fromCoords: [34, 18], toCoords: [51, 20] },
    { type: 'carpet', fromCoords: [49, 12], toCoords: [51, 15] },
    { type: 'wood', fromCoords: [49, 9], toCoords: [51, 12] },
    { type: 'wood', fromCoords: [49, 15], toCoords: [51, 18] },
    { type: 'wood', fromCoords: [32, 7], toCoords: [51, 9] },
    { type: 'wood', fromCoords: [32, 9], toCoords: [34, 20] },
    { type: 'wall', fromCoords: [31, 6], toCoords: [52, 7] },
    { type: 'wall', fromCoords: [51, 7], toCoords: [52, 13] },
    { type: 'wall', fromCoords: [51, 14], toCoords: [52, 20] },
    { type: 'wall', fromCoords: [31, 7], toCoords: [32, 21] },
    { type: 'carpet', fromCoords: [51, 13], toCoords: [52, 14] },
  ]
}

export function drawMapHomeBuilding() {
  const { design } = getCurrentMap()
  drawBackgroundFromMap(design)
  drawFirstAidVisitBlock()
}

export function drawFirstAidVisitBlock() {
  const { ctx, scale, verticalOffset } = getCanvasState()
  if (!isInitialised(ctx)) return
  const { buildingId, blockSize } = getGameState()
  const { buildings } = getSettlementState()
  const building = buildings.find((b) => b.id === buildingId)
  if (!building) return

  const { faceDirection: bFaceDirection } = building

  let firstAidCoords = [0, 0]
  if (bFaceDirection === 'up') {
    firstAidCoords = [41, 19]
  }
  if (bFaceDirection === 'down') {
    firstAidCoords = [41, 7]
  }
  if (bFaceDirection === 'left') {
    firstAidCoords = [50, 13]
  }
  if (bFaceDirection === 'right') {
    firstAidCoords = [32, 13]
  }

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(
    firstAidCoords[0] * (blockSize * scale),
    firstAidCoords[1] * (blockSize * scale) + verticalOffset / 2,
    blockSize * scale,
    blockSize * scale
  )
  // draw a red cross within the block
  const crossLength = (blockSize - 6) * scale
  const crossThickness = 4 * scale

  ctx.fillStyle = '#ff0000'
  ctx.fillRect(
    firstAidCoords[0] * (blockSize * scale) +
      (blockSize / 2) * scale -
      crossLength / 2,
    firstAidCoords[1] * (blockSize * scale) +
      (blockSize / 2) * scale +
      verticalOffset / 2 -
      crossThickness / 2,
    crossLength,
    crossThickness
  )
  ctx.fillRect(
    firstAidCoords[0] * (blockSize * scale) +
      (blockSize / 2) * scale -
      crossThickness / 2,
    firstAidCoords[1] * (blockSize * scale) +
      (blockSize / 2) * scale +
      verticalOffset / 2 -
      crossLength / 2,
    crossThickness,
    crossLength
  )
}

export function handleMapHomeBuildingInput() {
  const { design } = getCurrentMap()
  const { buildingId } = getGameState()
  const { buildings } = getSettlementState()
  const building = buildings.find((b) => b.id === buildingId)
  if (!building) return

  const { faceDirection: bFaceDirection } = building

  let firstAidCoords: [number, number] = [0, 0]
  if (bFaceDirection === 'up') {
    firstAidCoords = [41, 19]
  }
  if (bFaceDirection === 'down') {
    firstAidCoords = [41, 7]
  }
  if (bFaceDirection === 'left') {
    firstAidCoords = [50, 13]
  }
  if (bFaceDirection === 'right') {
    firstAidCoords = [32, 13]
  }

  const restrictedCoords = deriveRestrictedCoordsFromMap(design, 'home', [
    firstAidCoords,
  ])
  handlePlayerMovement(restrictedCoords)
  handleMapHomeBuildingExit()
  handleFirstAidVisit()
}

export function handleMapHomeBuildingExit() {
  const { player, blockSize } = getGameState()
  const { buildings } = getSettlementState()
  if (!isPlayerInitialised(player)) return

  const homeBuilding = buildings.find((b) => b.name === 'home')
  if (!homeBuilding) throw new Error('Home building not found')

  const {
    faceDirection,
    coordinates: { fromCoords: coordinates },
    width,
    height,
  } = homeBuilding

  const [pCoordsX, pCoordsY] = player.coordinates

  let exitCoordsX = 0
  let exitCoordsY = 0
  let keys: Array<string> = []
  let button = ''
  if (faceDirection === 'up') {
    exitCoordsX = 41
    exitCoordsY = 6
    keys = ['w', 'arrowup']
    button = 'dpadUp'
  }
  if (faceDirection === 'down') {
    exitCoordsX = 41
    exitCoordsY = 20
    keys = ['s', 'arrowdown']
    button = 'dpadDown'
  }
  if (faceDirection === 'left') {
    exitCoordsX = 31
    exitCoordsY = 13
    keys = ['a', 'arrowleft']
    button = 'dpadLeft'
  }
  if (faceDirection === 'right') {
    exitCoordsX = 51
    exitCoordsY = 13
    keys = ['d', 'arrowright']
    button = 'dpadRight'
  }

  if (pCoordsX === exitCoordsX && pCoordsY === exitCoordsY) {
    if (
      (isKeyCurrentlyDown(keys) || isButtonCurrentlyDown(button)) &&
      player.faceDirection === faceDirection
    ) {
      updateMapsState({
        currentMapId: 'settlement',
      })
      updateGameState({
        status: 'settlement',
        buildingId: null,
      })

      if (faceDirection === 'up') {
        player.goToCoordinates(
          coordinates[0] + Math.floor(width / blockSize / 2),
          coordinates[1] - 1
        )
      }
      if (faceDirection === 'down') {
        player.goToCoordinates(
          coordinates[0] + Math.floor(width / blockSize / 2),
          coordinates[1] + height / blockSize
        )
      }
      if (faceDirection === 'left') {
        player.goToCoordinates(
          coordinates[0] - 1,
          coordinates[1] + Math.floor(width / blockSize / 2)
        )
      }
      if (faceDirection === 'right') {
        player.goToCoordinates(
          coordinates[0] + height / blockSize,
          coordinates[1] + Math.floor(width / blockSize / 2)
        )
      }
      player.stopMoving()
    }
  }
}

function handleFirstAidVisit() {
  const { player, buildingId } = getGameState()
  if (!isPlayerInitialised(player)) return
  const { buildings } = getSettlementState()
  const building = buildings.find((b) => b.id === buildingId)
  if (!building) return

  const { coordinates, faceDirection: pFaceDirection } = player
  const { faceDirection: bFaceDirection } = building

  let firstAidCoords = [0, 0]
  if (bFaceDirection === 'up') {
    firstAidCoords = [41, 19]
  }
  if (bFaceDirection === 'down') {
    firstAidCoords = [41, 7]
  }
  if (bFaceDirection === 'left') {
    firstAidCoords = [50, 13]
  }
  if (bFaceDirection === 'right') {
    firstAidCoords = [32, 13]
  }

  const [pCoordsX, pCoordsY] = coordinates

  if (isKeyDownEvent(['e', 'enter']) || isButtonDownEvent('buttonA')) {
    if (
      (pCoordsX === firstAidCoords[0] + 1 &&
        pCoordsY === firstAidCoords[1] &&
        pFaceDirection === 'left') ||
      (pCoordsX === firstAidCoords[0] - 1 &&
        pCoordsY === firstAidCoords[1] &&
        pFaceDirection === 'right') ||
      (pCoordsX === firstAidCoords[0] &&
        pCoordsY === firstAidCoords[1] + 1 &&
        pFaceDirection === 'up') ||
      (pCoordsX === firstAidCoords[0] &&
        pCoordsY === firstAidCoords[1] - 1 &&
        pFaceDirection === 'down')
    ) {
      player.restoreHealth()
      addNotification('Your health has been restored')
    }
  }
}
