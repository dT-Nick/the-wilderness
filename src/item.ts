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
    new EquipableItem('Wooden Sword', 'weapon', {
      attack: 5,
      defence: 2,
      weight: 2,
      magic: 0,
      ranged: 0,
    }),
    new EquipableItem('Gold Sword', 'weapon', {
      attack: 7,
      defence: 2,
      weight: 4,
      magic: 0,
      ranged: 0,
    }),
    new EquipableItem('Steel Sword', 'weapon', {
      attack: 10,
      defence: 3,
      weight: 4,
      magic: 0,
      ranged: 0,
    }),
    new EquipableItem('Dragon Sword', 'weapon', {
      attack: 20,
      defence: 3,
      weight: 6,
      magic: 0,
      ranged: 0,
    }),
    new EquipableItem('Kaurisk Godsword', 'weapon', {
      attack: 40,
      defence: 20,
      weight: 2,
      magic: 0,
      ranged: 0,
    }),
    new EquipableItem('Oak Bow', 'weapon', {
      attack: 0,
      defence: 2,
      weight: 2,
      magic: 0,
      ranged: 5,
    }),
    new EquipableItem('Maple Bow', 'weapon', {
      attack: 0,
      defence: 3,
      weight: 2,
      magic: 0,
      ranged: 7,
    }),
    new EquipableItem('Yew Bow', 'weapon', {
      attack: 0,
      defence: 5,
      weight: 2,
      magic: 0,
      ranged: 10,
    }),
    new EquipableItem('Unholy Bow', 'weapon', {
      attack: 0,
      defence: 10,
      weight: 3,
      magic: 0,
      ranged: 20,
    }),
    new EquipableItem('Kaurisk Compound Bow', 'weapon', {
      attack: 0,
      defence: 20,
      weight: 1,
      magic: 0,
      ranged: 40,
    }),
    new EquipableItem('Wooden Shield', 'shield', {
      attack: 0,
      defence: 3,
      weight: 4,
      magic: 0,
      ranged: 0,
    }),
    new EquipableItem('Gold Shield', 'shield', {
      attack: 0,
      defence: 4,
      weight: 6,
      magic: 0,
      ranged: 0,
    }),
    new EquipableItem('Steel Shield', 'shield', {
      attack: 0,
      defence: 5,
      weight: 6,
      magic: 0,
      ranged: 0,
    }),
    new EquipableItem('Dragon Shield', 'shield', {
      attack: 0,
      defence: 7,
      weight: 7,
      magic: 0,
      ranged: 0,
    }),
    new EquipableItem('Kaurisk Shield', 'shield', {
      attack: 0,
      defence: 10,
      weight: 3,
      magic: 0,
      ranged: 0,
    }),

    new EquipableItem('Leather Armour', 'armour', {
      attack: 0,
      defence: 5,
      weight: 2,
      magic: 0,
      ranged: 0,
    }),
    new EquipableItem('Gold Armour', 'armour', {
      attack: 0,
      defence: 7,
      weight: 4,
      magic: 0,
      ranged: 0,
    }),
    new EquipableItem('Steel Armour', 'armour', {
      attack: 0,
      defence: 10,
      weight: 6,
      magic: 0,
      ranged: 0,
    }),
    new EquipableItem('Dragon Armour', 'armour', {
      attack: 0,
      defence: 20,
      weight: 7,
      magic: 0,
      ranged: 0,
    }),
    new EquipableItem('Kaurisk Platebody', 'armour', {
      attack: 20,
      defence: 40,
      weight: 3,
      magic: 0,
      ranged: 0,
    }),
    new EquipableItem('Wooden Amulet', 'armour', {
      attack: 4,
      defence: 3,
      weight: 1,
      magic: 0,
      ranged: 0,
    }),
    new EquipableItem('Gold Amulet', 'armour', {
      attack: 5,
      defence: 4,
      weight: 1,
      magic: 0,
      ranged: 0,
    }),
    new EquipableItem('Steel Amulet', 'armour', {
      attack: 7,
      defence: 5,
      weight: 1,
      magic: 0,
      ranged: 0,
    }),
    new EquipableItem('Dragon Amulet', 'armour', {
      attack: 10,
      defence: 7,
      weight: 1,
      magic: 0,
      ranged: 0,
    }),
    new EquipableItem('Kaurisk Ornament', 'armour', {
      attack: 30,
      defence: 20,
      weight: 1,
      magic: 0,
      ranged: 0,
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
