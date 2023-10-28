import { isButtonDownEvent, isKeyDownEvent } from './input.js'
import {
  clearMessage,
  getCanvasState,
  getGameState,
  getMessageState,
  isInitialised,
  isMessageActive,
} from './state.js'

export function drawMessage() {
  const { status } = getGameState()
  const { ctx, width, height, scale, verticalOffset } = getCanvasState()
  const { message } = getMessageState()
  if (!isInitialised(ctx) || !isMessageActive(message)) return

  if (status === 'battle') {
    const messageHeight = 110 * scale
    const messageMargin = 10 * scale
    const messagePadding = 10 * scale
    const messagePopupWidth = width - messageMargin * 2

    ctx.font = `${Math.floor(25 * scale)}px monospace`
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    ctx.lineWidth = 1
    ctx.strokeStyle = 'white'
    ctx.fillStyle = 'black'

    ctx.fillRect(
      messageMargin,
      height - messageHeight - messageMargin - verticalOffset / 2,
      messagePopupWidth,
      messageHeight
    )
    ctx.strokeRect(
      messageMargin,
      height - messageHeight - messageMargin - verticalOffset / 2,
      messagePopupWidth,
      messageHeight
    )

    ctx.fillStyle = 'white'

    ctx.fillText(
      message,
      width / 2,
      height - messageHeight / 2 - messageMargin - verticalOffset / 2,
      messagePopupWidth - messagePadding * 2
    )
  } else {
    ctx.font = `bold ${14 * scale}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    const messageWidth = ctx.measureText(message).width

    const messagePadding = 20 * scale
    const messageMargin = 20 * scale
    const messagePopupWidth = messageWidth + messagePadding * 2 * scale
    const messagePopupHeight = 50 * scale
    ctx.shadowColor = 'black'
    ctx.shadowBlur = 4
    ctx.fillStyle = '#d8e2dc'
    ctx.fillRect(
      width / 2 - messagePopupWidth / 2,
      height - verticalOffset / 2 - messageMargin - messagePopupHeight,
      messagePopupWidth,
      messagePopupHeight
    )
    ctx.shadowBlur = 0

    ctx.fillStyle = '#3e5748'
    ctx.fillText(
      message,
      width / 2,
      height - verticalOffset / 2 - messageMargin - messagePopupHeight / 2,
      messagePopupWidth - messagePadding * 2
    )
  }
}

export function handleMessageInput() {
  if (
    isKeyDownEvent(['e', 'enter', 'tab', 'escape']) ||
    isButtonDownEvent(['buttonA', 'buttonB'])
  ) {
    clearMessage()
  }
}
