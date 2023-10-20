import { gameState } from './state.js'

export function generateBackgroundGrid() {
  const { state } = gameState
  const {
    ctx,
    status,
    blocksHorizontal,
    blocksVertical,
    blockSize,
    verticalOffset,
    scale,
  } = state

  if (status !== 'inactive') {
    ctx.fillStyle = 'white'
    for (let i = 0; i < blocksHorizontal + 1; i++) {
      if (blocksHorizontal % 2 === 0) {
        ctx.fillRect(
          i * (blockSize * scale) + (blockSize * scale) / 2,
          verticalOffset / 2,
          1,
          blocksVertical * (blockSize * scale)
        )
      } else {
        ctx.fillRect(
          i * (blockSize * scale),
          verticalOffset / 2,
          1,
          blocksVertical * (blockSize * scale)
        )
      }
    }
    for (let j = 0; j < blocksVertical + 1; j++) {
      if (blocksVertical % 2 === 0) {
        ctx.fillRect(
          0,
          j * (blockSize * scale) +
            (blockSize * scale) / 2 +
            verticalOffset / 2,
          blocksHorizontal * (blockSize * scale),
          1
        )
      } else {
        ctx.fillRect(
          0,
          j * (blockSize * scale) + verticalOffset / 2,
          blocksHorizontal * (blockSize * scale),
          1
        )
      }
    }
  }
}
