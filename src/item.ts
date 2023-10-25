import { Entity } from './entity.js'
import { isKeyDownEvent } from './input.js'
import {
  getCanvasState,
  getGameState,
  isInitialised,
  updateGameState,
} from './state.js'

export class FloorItem extends Entity {
  itemId: number

  constructor(startX, startY, size, itemId) {
    super(startX, startY, size)
    this.itemId = itemId
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

export function drawFloorItems() {
  const { floorItems, blockSize } = getGameState()
  const { ctx, scale, verticalOffset } = getCanvasState()

  if (isInitialised(ctx)) {
    for (const floorItem of floorItems) {
      ctx.fillStyle = 'orange'

      ctx.fillRect(
        (floorItem.x + blockSize / 2 - floorItem.size / 2) * scale,
        (floorItem.y + blockSize / 2 - floorItem.size / 2) * scale +
          verticalOffset / 2,
        floorItem.size * scale,
        floorItem.size * scale
      )
    }
  }
}

export function handleItemPickup() {
  const { player, floorItems } = getGameState()

  if (isKeyDownEvent('e')) {
    for (const floorItem of floorItems) {
      const {
        faceDirection,
        coordinates: [pCoordsX, pCoordsY],
      } = player
      const {
        coordinates: [iCoordsX, iCoordsY],
      } = floorItem

      const isOnPickupBlock =
        (faceDirection === 'up' &&
          iCoordsX === pCoordsX &&
          iCoordsY === pCoordsY - 1) ||
        (faceDirection === 'down' &&
          iCoordsX === pCoordsX &&
          iCoordsY === pCoordsY + 1) ||
        (faceDirection === 'left' &&
          iCoordsX === pCoordsX - 1 &&
          iCoordsY === pCoordsY) ||
        (faceDirection === 'right' &&
          iCoordsX === pCoordsX + 1 &&
          iCoordsY === pCoordsY)

      if (isOnPickupBlock) {
        floorItem.pickUpItem()
      }
    }
  }
}
