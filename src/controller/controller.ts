import { getCanvasState, getInputState, isInitialised } from '../state.js'

export function drawController() {
  const { ctx, width, height } = getCanvasState()
  if (!isInitialised(ctx)) return

  const { touches } = getInputState()

  // Draw D-pad
  const dpadHeight = 45
  const dpadWidth = 30
  const dpadPadding = 20
  const dpadInbetweenPadding = 0
  const dpadX = dpadPadding
  const dpadY = height - dpadPadding - dpadHeight

  ctx.fillStyle = touches.find((t) => t.type === 'dpadUp') ? 'white' : 'gray'
  ctx.fillRect(
    dpadX + dpadHeight + dpadInbetweenPadding,
    dpadY - 2 * dpadInbetweenPadding - dpadHeight - dpadWidth,
    dpadWidth,
    dpadHeight
  )

  ctx.fillStyle = touches.find((t) => t.type === 'dpadLeft') ? 'white' : 'gray'
  ctx.fillRect(
    dpadX,
    dpadY - dpadInbetweenPadding - dpadWidth,
    dpadHeight,
    dpadWidth
  )

  ctx.fillStyle = touches.find((t) => t.type === 'dpadDown') ? 'white' : 'gray'
  ctx.fillRect(
    dpadX + dpadHeight + dpadInbetweenPadding,
    dpadY,
    dpadWidth,
    dpadHeight
  )

  ctx.fillStyle = touches.find((t) => t.type === 'dpadRight') ? 'white' : 'gray'
  ctx.fillRect(
    dpadX + dpadHeight + 2 * dpadInbetweenPadding + dpadWidth,
    dpadY - dpadInbetweenPadding - dpadWidth,
    dpadHeight,
    dpadWidth
  )

  // Draw A, B, X, Y buttons
  const buttonSize = 30
  const buttonPadding = 20
  const inbetweenPadding = 10
  const buttonX = width - buttonPadding - buttonSize
  const buttonY = height - buttonPadding - buttonSize

  // bold font
  ctx.font = 'bold 16px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = touches.find((t) => t.type === 'buttonX')
    ? 'blue'
    : 'darkblue'
  ctx.fillRect(
    buttonX - buttonSize - inbetweenPadding,
    buttonY - (buttonSize + inbetweenPadding) * 2,
    buttonSize,
    buttonSize
  )
  ctx.fillStyle = 'black'
  ctx.fillText(
    'X',
    buttonX - buttonSize - inbetweenPadding + buttonSize / 2,
    buttonY - (buttonSize + inbetweenPadding) * 2 + buttonSize / 2 + 1
  )
  ctx.fillStyle = touches.find((t) => t.type === 'buttonY')
    ? 'yellow'
    : '#8B8000'
  ctx.fillRect(
    buttonX - (buttonSize + inbetweenPadding) * 2,
    buttonY - buttonSize - inbetweenPadding,
    buttonSize,
    buttonSize
  )
  ctx.fillStyle = 'black'
  ctx.fillText(
    'Y',
    buttonX - (buttonSize + inbetweenPadding) * 2 + buttonSize / 2,
    buttonY - buttonSize - inbetweenPadding + buttonSize / 2 + 1
  )

  ctx.fillStyle = touches.find((t) => t.type === 'buttonB') ? 'red' : 'darkred'
  ctx.fillRect(
    buttonX - buttonSize - inbetweenPadding,
    buttonY,
    buttonSize,
    buttonSize
  )
  ctx.fillStyle = 'black'
  ctx.fillText(
    'B',
    buttonX - buttonSize - inbetweenPadding + buttonSize / 2,
    buttonY + buttonSize / 2 + 1
  )

  ctx.fillStyle = touches.find((t) => t.type === 'buttonA')
    ? 'lime'
    : 'darkgreen'
  ctx.fillRect(
    buttonX,
    buttonY - buttonSize - inbetweenPadding,
    buttonSize,
    buttonSize
  )
  ctx.fillStyle = 'black'
  ctx.fillText(
    'A',
    buttonX + buttonSize / 2,
    buttonY - buttonSize - inbetweenPadding + buttonSize / 2 + 1
  )

  // Draw start and select buttons
  const startSelectWidth = 80
  const startSelectHeight = 30
  const startSelectPadding = 20
  const startSelectY = height - startSelectPadding - startSelectHeight / 2 - 50
  const startSelectX = width / 2 - startSelectWidth / 2
  ctx.fillStyle = touches.find((t) => t.type === 'start') ? 'white' : 'gray'
  ctx.fillRect(startSelectX, startSelectY, startSelectWidth, startSelectHeight)
}

export function isControllerButtonCoords(x: number, y: number) {
  const { width, height } = getCanvasState()
  const buttonSize = 30
  const buttonPadding = 20
  const inbetweenPadding = 10
  const buttonX = width - buttonPadding - buttonSize
  const buttonY = height - buttonPadding - buttonSize

  if (
    x >= buttonX - buttonSize - inbetweenPadding &&
    x <= buttonX - inbetweenPadding &&
    y >= buttonY - (buttonSize + inbetweenPadding) * 2 &&
    y <= buttonY - buttonSize - inbetweenPadding * 2
  ) {
    return 'buttonX'
  }
  if (
    x >= buttonX - (buttonSize + inbetweenPadding) * 2 &&
    x <= buttonX - buttonSize - inbetweenPadding * 2 &&
    y >= buttonY - buttonSize - inbetweenPadding &&
    y <= buttonY - inbetweenPadding
  ) {
    return 'buttonY'
  }
  if (
    x >= buttonX - buttonSize - inbetweenPadding &&
    x <= buttonX - inbetweenPadding &&
    y >= buttonY &&
    y <= buttonY + buttonSize
  ) {
    return 'buttonB'
  }
  if (
    x >= buttonX &&
    x <= buttonX + buttonSize &&
    y >= buttonY - buttonSize - inbetweenPadding &&
    y <= buttonY - inbetweenPadding
  ) {
    return 'buttonA'
  }

  const startSelectWidth = 80
  const startSelectHeight = 30
  const startSelectPadding = 20
  const startSelectY = height - startSelectPadding - startSelectHeight / 2 - 50
  const startSelectX = width / 2 - startSelectWidth / 2

  if (
    x >= startSelectX &&
    x <= startSelectX + startSelectWidth &&
    y >= startSelectY &&
    y <= startSelectY + startSelectHeight
  ) {
    return 'start'
  }
  // dpad buttons
  const dpadHeight = 45
  const dpadWidth = 30
  const dpadPadding = 20
  const dpadInbetweenPadding = 0
  const dpadX = dpadPadding
  const dpadY = height - dpadPadding - dpadHeight

  if (
    x >= dpadX + dpadHeight + dpadInbetweenPadding &&
    x <= dpadX + dpadHeight + dpadInbetweenPadding + dpadWidth &&
    y >= dpadY - 2 * dpadInbetweenPadding - dpadHeight - dpadWidth &&
    y <= dpadY - 2 * dpadInbetweenPadding - dpadWidth
  ) {
    return 'dpadUp'
  }
  if (
    x >= dpadX &&
    x <= dpadX + dpadHeight &&
    y >= dpadY - dpadInbetweenPadding - dpadWidth &&
    y <= dpadY - dpadInbetweenPadding
  ) {
    return 'dpadLeft'
  }
  if (
    x >= dpadX + dpadHeight + dpadInbetweenPadding &&
    x <= dpadX + dpadHeight + dpadInbetweenPadding + dpadWidth &&
    y >= dpadY &&
    y <= dpadY + dpadHeight
  ) {
    return 'dpadDown'
  }
  if (
    x >= dpadX + dpadHeight + 2 * dpadInbetweenPadding + dpadWidth &&
    x <= dpadX + 2 * dpadHeight + 2 * dpadInbetweenPadding + dpadWidth &&
    y >= dpadY - dpadInbetweenPadding - dpadWidth &&
    y <= dpadY - dpadInbetweenPadding
  ) {
    return 'dpadRight'
  }

  return false
}
