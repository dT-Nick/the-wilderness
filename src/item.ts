import { ConsumableItem } from './classes/ConsumableItem.js'
import { EquipableItem } from './classes/EquipableItem.js'
import { Item } from './classes/Item.js'
import { QuestItem } from './classes/QuestItem.js'
import { getColourFromItemSlug } from './helpers/functions.js'
import { isButtonDownEvent, isKeyDownEvent } from './input.js'
import {
  getCanvasState,
  getCurrentMap,
  getGameState,
  isInitialised,
  isPlayerInitialised,
  updateBattleState,
  updateGameState,
  updateMap,
} from './state.js'
import { generateMapZeroOneDesign } from './wilderness-maps/map-[0,1].js'

export function drawFloorItems() {
  const { floorItems, blockSize } = getGameState()
  const { ctx, scale, verticalOffset } = getCanvasState()
  const { id: mapId } = getCurrentMap()

  if (isInitialised(ctx)) {
    for (const floorItem of floorItems.filter((fI) => fI.mapId === mapId)) {
      const itemDetails = getItemViaId(floorItem.itemId)
      ctx.fillStyle = getColourFromItemSlug(itemDetails.id)

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
  const { id: mapId } = getCurrentMap()
  if (!isPlayerInitialised(player)) return

  if (isKeyDownEvent(['e', 'enter']) || isButtonDownEvent('buttonA')) {
    for (const floorItem of floorItems.filter((fI) => fI.mapId === mapId)) {
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
    new QuestItem('Bridge Pieces', () => {
      const design = generateMapZeroOneDesign(true)
      updateMap('[0,1]', {
        design,
      })
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
  updateBattleState((c) => ({
    playerMenu: 'main',
    selectedItem: c.selectedItem - 1 < 1 ? 1 : c.selectedItem - 1,
  }))
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

export function isUsable(item: Item): item is QuestItem {
  return item.isUsable
}
