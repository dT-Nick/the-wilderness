import { Item } from './classes.js'
import { isButtonDownEvent, isKeyDownEvent } from './input.js'
import { getItemViaId, isConsumable } from './item.js'
import {
  addNotification,
  getCanvasState,
  getGameState,
  getSettingsState,
  isInitialised,
  updateGameState,
  updateSettingsState,
} from './state.js'

export function drawInventorySettings() {
  const { ctx, width, height, verticalOffset, scale } = getCanvasState()
  const { selectedInventoryTopMenu, selectedInventoryItem } = getSettingsState()
  if (!isInitialised(ctx)) return

  ctx.fillStyle = '#333'
  ctx.fillRect(0, verticalOffset / 2, width, height - verticalOffset)

  const topMenuButtons = ['Consumables', 'Equipables', 'Quest items']

  const topMenuMargin = 10 * scale
  const topMenuButtonSpacer = 10 * scale
  const topMenuButtonWidth =
    (width - 2 * topMenuMargin - 2 * topMenuButtonSpacer) / 3
  const topMenuButtonHeight = 90 * scale
  const topMenuX = topMenuMargin
  const topMenuY = verticalOffset / 2 + topMenuMargin
  const topMenuButtonFontSize = Math.ceil(30 * scale)

  ctx.strokeStyle = 'white'
  ctx.fillStyle = 'white'
  ctx.font = `${topMenuButtonFontSize}px Arial`
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'center'

  for (let i = 0; i < topMenuButtons.length; i++) {
    const buttonX = topMenuX + i * (topMenuButtonWidth + topMenuButtonSpacer)
    const buttonY = topMenuY

    ctx.strokeStyle = selectedInventoryTopMenu === i ? 'orangered' : 'white'

    ctx.strokeRect(buttonX, buttonY, topMenuButtonWidth, topMenuButtonHeight)

    ctx.fillStyle = selectedInventoryTopMenu === i ? 'orangered' : 'white'
    ctx.fillText(
      topMenuButtons[i],
      buttonX + topMenuButtonWidth / 2,
      buttonY + topMenuButtonHeight / 2,
      topMenuButtonWidth
    )
  }

  const { inventory } = getGameState()
  const mappedInventory = inventory.map((i) => ({
    ...getItemViaId(i.itemId),
    inventoryId: i.id,
  }))

  let items: Array<Item & { inventoryId: number }> = []
  if (selectedInventoryTopMenu === 0) {
    items = mappedInventory.filter((i) => i.isConsumable)
  } else if (selectedInventoryTopMenu === 1) {
    items = mappedInventory.filter((i) => i.isEquipable)
  } else {
    items = mappedInventory.filter((i) => i.isUsable)
  }

  const inventoryMargin = 10 * scale
  const inventoryX = inventoryMargin
  const inventoryY = topMenuY + topMenuButtonHeight + inventoryMargin
  const inventoryItemSpacer = 10 * scale
  const inventoryItemWidth = width - 2 * inventoryMargin
  const inventoryItemHeight = 50 * scale
  const inventoryItemFontSize = Math.ceil(20 * scale)

  ctx.strokeStyle = 'white'
  ctx.fillStyle = 'white'
  ctx.font = `${inventoryItemFontSize}px Arial`
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'center'

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const buttonX = inventoryX
    const buttonY = inventoryY + i * (inventoryItemHeight + inventoryItemSpacer)

    ctx.strokeStyle = selectedInventoryItem === i ? 'orangered' : 'white'

    ctx.strokeRect(buttonX, buttonY, inventoryItemWidth, inventoryItemHeight)

    ctx.fillStyle = selectedInventoryItem === i ? 'orangered' : 'white'
    ctx.fillText(
      item.name,
      buttonX + inventoryItemWidth / 2,
      buttonY + inventoryItemHeight / 2,
      inventoryItemWidth
    )
  }
}

export function handleInventorySettingsInput() {
  const { selectedInventoryItem, selectedInventoryTopMenu, prevGameStatus } =
    getSettingsState()
  const { inventory } = getGameState()
  const mappedInventory = inventory.map((i) => ({
    ...getItemViaId(i.itemId),
    inventoryId: i.id,
  }))

  let items: Array<Item & { inventoryId: number }> = []
  if (selectedInventoryTopMenu === 0) {
    items = mappedInventory.filter((i) => i.isConsumable)
  } else if (selectedInventoryTopMenu === 1) {
    items = mappedInventory.filter((i) => i.isEquipable)
  } else {
    items = mappedInventory.filter((i) => i.isUsable)
  }

  if (isKeyDownEvent(['w', 'arrowup']) || isButtonDownEvent('dpadUp')) {
    if (items.length > 0) {
      updateSettingsState((c) => ({
        selectedInventoryItem:
          (c.selectedInventoryItem - 1 + items.length) % items.length,
      }))
    }
  }
  if (isKeyDownEvent(['s', 'arrowdown']) || isButtonDownEvent('dpadDown')) {
    if (items.length > 0) {
      updateSettingsState((c) => ({
        selectedInventoryItem: (c.selectedInventoryItem + 1) % items.length,
      }))
    }
  }
  if (isKeyDownEvent(['d', 'arrowright']) || isButtonDownEvent('dpadRight')) {
    updateSettingsState((c) => ({
      selectedInventoryTopMenu: (c.selectedInventoryTopMenu + 1) % 3,
      selectedInventoryItem: 0,
    }))
  }
  if (isKeyDownEvent(['a', 'arrowleft']) || isButtonDownEvent('dpadLeft')) {
    updateSettingsState((c) => ({
      selectedInventoryTopMenu: (c.selectedInventoryTopMenu - 1 + 3) % 3,
      selectedInventoryItem: 0,
    }))
  }

  if (isKeyDownEvent(['e', 'enter']) || isButtonDownEvent('buttonA')) {
    if (items.length > 0) {
      const item = items[selectedInventoryItem]
      if (isConsumable(item)) {
        item.effect()
        updateGameState((c) => ({
          inventory: [...c.inventory.filter((i) => i.id !== item.inventoryId)],
        }))
        addNotification(`You consumed a ${item.name}`)
        updateSettingsState((c) => ({
          selectedInventoryItem:
            c.selectedInventoryItem === 0 ? 0 : c.selectedInventoryItem - 1,
        }))
      }
    }
  }

  if (isKeyDownEvent(['tab', 'escape', 'i']) || isButtonDownEvent('buttonB')) {
    updateGameState((c) => ({
      status: c.prevStatus ?? 'settlement',
      prevStatus: prevGameStatus,
    }))
  }
}
