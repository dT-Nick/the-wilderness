import { isHoveringOn } from './input.js'
import { constants, getCanvasState, isInitialised } from './state.js'

export function drawStartMenu() {
  const { ctx, width, height } = getCanvasState()
  const { startMenuButtonSize } = constants

  if (isInitialised(ctx)) {
    const buttonStartX = width / 2 - startMenuButtonSize / 2
    const buttonStartY = height / 2 - startMenuButtonSize / 2
    const isHoveringOnButton = isHoveringOn(
      buttonStartX,
      buttonStartY,
      startMenuButtonSize,
      startMenuButtonSize
    )

    ctx.fillStyle = isHoveringOnButton ? 'limegreen' : 'green'

    ctx.roundRect(
      buttonStartX,
      buttonStartY,
      startMenuButtonSize,
      startMenuButtonSize,
      10
    )
    ctx.fill()

    ctx.fillStyle = isHoveringOnButton ? 'black' : 'white'
    ctx.font = '50px Arial'
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    ctx.fillText(
      'GO',
      buttonStartX + startMenuButtonSize / 2,
      buttonStartY + startMenuButtonSize / 2,
      startMenuButtonSize
    )
  }
}
