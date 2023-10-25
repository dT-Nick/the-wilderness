import { getCanvasState, getInputState, isInitialised } from '../state.js'

export function generateMeasurementsTool() {
  const { mouseX, mouseY } = getInputState()
  const { ctx, verticalOffset } = getCanvasState()

  if (!isInitialised(ctx)) return

  if (
    mouseX > 0 &&
    mouseX < ctx.canvas.width &&
    mouseY > 0 + verticalOffset / 2 &&
    mouseY < ctx.canvas.height - verticalOffset / 2
  ) {
    ctx.fillStyle = 'white'
    ctx.font = '10px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    // draw rulers up, down, left and right from mouse location with ticks every 60 pixels from the mouse point and smaller unlabelled ticks every 10 pixels
    ctx.fillRect(mouseX, 0, 1, ctx.canvas.height)
    ctx.fillRect(0, mouseY, ctx.canvas.width, 1)
    for (let i = 0; i < ctx.canvas.width - mouseX; i += 50) {
      ctx.fillRect(mouseX + i, mouseY - 5, 1, 10)
      if (i !== 0) {
        ctx.fillText(`${i}`, mouseX + i, mouseY - 10)
      }
    }
    for (let i = 0; i < mouseX; i += 50) {
      ctx.fillRect(mouseX - i, mouseY - 5, 1, 10)
      if (i !== 0) {
        ctx.fillText(`${i}`, mouseX - i, mouseY - 10)
      }
    }
    for (let i = 0; i < ctx.canvas.height - mouseY; i += 50) {
      ctx.fillRect(mouseX - 5, mouseY + i, 10, 1)
      if (i !== 0) {
        ctx.fillText(`${i}`, mouseX - 10, mouseY + i)
      }
    }
    for (let i = 0; i < mouseY; i += 50) {
      ctx.fillRect(mouseX - 5, mouseY - i, 10, 1)
      if (i !== 0) {
        ctx.fillText(`${i}`, mouseX - 10, mouseY - i)
      }
    }
    for (let i = 0; i < ctx.canvas.width - mouseX; i += 5) {
      ctx.fillRect(mouseX + i, mouseY - 2, 1, 4)
    }
    for (let i = 0; i < mouseX; i += 5) {
      ctx.fillRect(mouseX - i, mouseY - 2, 1, 4)
    }
    for (let i = 0; i < ctx.canvas.height - mouseY; i += 5) {
      ctx.fillRect(mouseX - 2, mouseY + i, 4, 1)
    }
    for (let i = 0; i < mouseY; i += 5) {
      ctx.fillRect(mouseX - 2, mouseY - i, 4, 1)
    }
  }
}
