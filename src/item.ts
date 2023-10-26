import { ConsumableItem, EquipableItem, type Item } from './classes.js'
import { generateSlug } from './helpers/functions.js'
import { isKeyDownEvent } from './input.js'
import {
  getCanvasState,
  getGameState,
  isInitialised,
  isPlayerInitialised,
  updateBattleState,
  updateGameState,
} from './state.js'

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
  if (!isPlayerInitialised(player)) return

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

// ###########################

export function generateGameItems() {
  return [
    new ConsumableItem('Small Potion', () => {
      const { player } = getGameState()
      if (!isPlayerInitialised(player)) return

      player.heal(20)
    }),
    new ConsumableItem('Medium Potion', () => {
      const { player } = getGameState()
      if (!isPlayerInitialised(player)) return

      player.heal(50)
    }),
    new ConsumableItem('Large Potion', () => {
      const { player } = getGameState()
      if (!isPlayerInitialised(player)) return

      player.heal(100)
    }),
  ]
}

export function getItemViaId(id: string) {
  const { items } = getGameState()
  const item = items.find((i) => i.id === id)
  if (!item) throw new Error(`Item with id ${id} not found`)
  return item
}

export function activateConsumable(id: string, entityId: number) {
  const item = getItemViaId(id)
  if (!isConsumable(item)) return

  item.effect()
  updateBattleState({
    playerMenu: 'main',
  })
  updateGameState((c) => ({
    inventory: [...c.inventory.filter((i) => i.id !== entityId)],
  }))
}

export function isConsumable(item: Item): item is ConsumableItem {
  return item.isConsumable
}

export function isEquipable(item: Item): item is EquipableItem {
  return item.isEquipable
}
