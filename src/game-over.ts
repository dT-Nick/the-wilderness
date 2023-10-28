import { getCanvasState, isInitialised } from './state.js'

export function drawGameOverScreen() {
  const { ctx, verticalOffset, scale } = getCanvasState()
  if (!isInitialised(ctx)) return

  ctx.fillStyle = 'black'
  ctx.fillRect(
    0,
    0 + verticalOffset / 2,
    ctx.canvas.width,
    ctx.canvas.height - verticalOffset / 2
  )

  ctx.fillStyle = 'white'
  ctx.font = `${scale * 50}px Arial`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('Game Over', ctx.canvas.width / 2, ctx.canvas.height / 2)
}
