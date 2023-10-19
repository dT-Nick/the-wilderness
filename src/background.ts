import { gameState } from './state.js'

export function generateBackgroundGrid() {
  // 160 blocks wide, 90 blocks tall

  const { state } = gameState
  const {
    ctx,
    status,
    blocksHorizontal,
    blocksVertical,
    blockSize,
    verticalOffset,
  } = state

  if (status !== 'inactive') {
    ctx.fillStyle = 'white'
    for (let i = 0; i < blocksHorizontal + 1; i++) {
      if (blocksHorizontal % 2 === 0) {
        ctx.fillRect(
          i * blockSize + blockSize / 2,
          verticalOffset / 2,
          1,
          blocksVertical * blockSize
        )
      } else {
        ctx.fillRect(
          i * blockSize,
          verticalOffset / 2,
          1,
          blocksVertical * blockSize
        )
      }
    }
    for (let j = 0; j < blocksVertical + 1; j++) {
      if (blocksVertical % 2 === 0) {
        ctx.fillRect(
          0,
          j * blockSize + blockSize / 2 + verticalOffset / 2,
          blocksHorizontal * blockSize,
          1
        )
      } else {
        ctx.fillRect(
          0,
          j * blockSize + verticalOffset / 2,
          blocksHorizontal * blockSize,
          1
        )
      }
    }
  }
}
