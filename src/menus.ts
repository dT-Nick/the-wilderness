import { isButtonDownEvent, isHoveringOn, isKeyDownEvent } from './input.js'
import { saveGame } from './save.js'
import {
  constants,
  getCanvasState,
  getGameState,
  getSettingsState,
  getStartMenuState,
  isInitialised,
  updateGameState,
  updateSettingsState,
} from './state.js'

export function drawStartMenu() {
  const { ctx, width, height, scale } = getCanvasState()
  const { selectedButton } = getStartMenuState()
  const { startMenuButtonSize } = constants

  if (isInitialised(ctx)) {
    const buttonStartX =
      width / 2 -
      (startMenuButtonSize * scale) / 2 -
      (startMenuButtonSize * scale) / 2 -
      10 * scale
    const buttonStartY = height / 2 - (startMenuButtonSize * scale) / 2

    ctx.fillStyle = 'green'
    ctx.strokeStyle = 'white'
    ctx.lineWidth = 2
    ctx.fillRect(
      buttonStartX,
      buttonStartY,
      startMenuButtonSize * scale,
      startMenuButtonSize * scale
    )
    if (selectedButton === 0) {
      ctx.strokeRect(
        buttonStartX,
        buttonStartY,
        startMenuButtonSize * scale,
        startMenuButtonSize * scale
      )
    }

    ctx.fillStyle = 'white'
    ctx.font = '50px Arial'
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    ctx.fillText(
      'NEW',
      buttonStartX + (startMenuButtonSize * scale) / 2,
      buttonStartY + (startMenuButtonSize * scale) / 2,
      startMenuButtonSize * scale
    )

    const buttonLoadX =
      width / 2 -
      (startMenuButtonSize * scale) / 2 +
      (startMenuButtonSize * scale) / 2 +
      10 * scale
    const buttonLoadY = height / 2 - (startMenuButtonSize * scale) / 2

    ctx.fillStyle = 'darkblue'
    ctx.strokeStyle = 'white'
    ctx.lineWidth = 2
    ctx.fillRect(
      buttonLoadX,
      buttonLoadY,
      startMenuButtonSize * scale,
      startMenuButtonSize * scale
    )
    if (selectedButton === 1) {
      ctx.strokeRect(
        buttonLoadX,
        buttonLoadY,
        startMenuButtonSize * scale,
        startMenuButtonSize * scale
      )
    }

    ctx.fillStyle = 'white'
    ctx.font = '50px Arial'
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    ctx.fillText(
      'LOAD',
      buttonLoadX + (startMenuButtonSize * scale) / 2,
      buttonLoadY + (startMenuButtonSize * scale) / 2,
      startMenuButtonSize * scale
    )
  }
}

export function drawSettingsMenu() {
  const { ctx, width, height, verticalOffset, scale } = getCanvasState()
  const { selectedMenu } = getSettingsState()
  if (!isInitialised(ctx)) return
  ctx.fillStyle = '#333'
  ctx.fillRect(0, verticalOffset / 2, width, height - verticalOffset)

  const statsAndDetailsMargin = 10 * scale
  const statsAndDetailsWidth = width * (3 / 4) - 2 * statsAndDetailsMargin
  const statsAndDetailsHeight =
    height - verticalOffset - 2 * statsAndDetailsMargin
  const statsAndDetailsX = statsAndDetailsMargin
  const startsAndDetailsY = verticalOffset / 2 + statsAndDetailsMargin

  ctx.strokeStyle = 'white'
  ctx.lineWidth = 2
  ctx.strokeRect(
    statsAndDetailsX,
    startsAndDetailsY,
    statsAndDetailsWidth,
    statsAndDetailsHeight
  )

  const optionsMargin = 10 * scale
  const optionsWidth = width * (1 / 4) - optionsMargin
  const optionsHeight = height - verticalOffset - 2 * optionsMargin
  const optionsX = width - optionsWidth - optionsMargin
  const optionsY = verticalOffset / 2 + optionsMargin

  const buttonWidth = optionsWidth
  const buttonHeight = 70 * scale

  const buttons = ['Map', 'Inventory', 'Save']

  buttons.forEach((button, index) => {
    const buttonX = optionsX
    const buttonY = optionsY + index * buttonHeight + optionsMargin * index

    ctx.strokeStyle = selectedMenu === index ? 'orangered' : 'white'
    ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight)

    ctx.fillStyle = selectedMenu === index ? 'orangered' : 'white'
    ctx.font = '30px Arial'
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    ctx.fillText(
      button,
      buttonX + buttonWidth / 2,
      buttonY + buttonHeight / 2,
      buttonWidth
    )
  })
}

export function handleSettingsInput() {
  const { selectedMenu } = getSettingsState()
  const { prevStatus } = getGameState()

  if (isKeyDownEvent(['s', 'arrowdown']) || isButtonDownEvent('dpadDown')) {
    updateSettingsState((c) => ({
      selectedMenu: (c.selectedMenu + 1) % 3,
    }))
  }
  if (isKeyDownEvent(['w', 'arrowup']) || isButtonDownEvent('dpadUp')) {
    updateSettingsState((c) => ({
      selectedMenu: (c.selectedMenu - 1 + 3) % 3,
    }))
  }
  if (isKeyDownEvent(['e', 'enter']) || isButtonDownEvent('buttonA')) {
    if (selectedMenu === 0) {
      updateSettingsState({
        prevGameStatus: prevStatus,
      })
      updateGameState({
        status: 'world-map',
        prevStatus: 'settings',
      })
    }
    if (selectedMenu === 1) {
      updateSettingsState({
        prevGameStatus: prevStatus,
      })
      updateGameState({
        status: 'inventory',
        prevStatus: 'settings',
      })
    }
    if (selectedMenu === 2) {
      saveGame()
    }
  }

  if (
    isKeyDownEvent(['escape', 'tab']) ||
    isButtonDownEvent(['buttonB', 'start'])
  ) {
    updateGameState((c) => ({
      status: c.prevStatus ?? 'settlement',
    }))
  }
}
