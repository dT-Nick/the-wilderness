import { battleState, gameState } from './state.js'

export function generateBattle() {
  generateHealth()
  generateMoves()
}

export function generateHealth() {
  const { state } = gameState
  const { ctx, player, status, scale, verticalOffset } = state

  if (status !== 'inactive') {
    ctx.fillStyle = 'white'
    ctx.font = `${Math.floor(22 * scale)}px monospace`
    ctx.fillText(`Health: ${player.health}`, 10, 20 + verticalOffset / 2)
  }
}

export function generateMoves() {
  const { state } = gameState
  const { state: bState } = battleState
  const { ctx, status, scale, verticalOffset, height, width } = state

  if (status !== 'inactive') {
    ctx.lineWidth = 4
    ctx.strokeStyle = 'white'
    ctx.fillStyle = 'white'
    ctx.font = `${Math.floor(22 * scale)}px monospace`
    ctx.textBaseline = 'middle'

    if (bState.selectedMove === 1) {
      ctx.fillStyle = 'orangered'
      ctx.strokeStyle = 'orangered'
    }
    ctx.strokeRect(
      10,
      height - 120 - verticalOffset / 2,
      (width - 20) / 2 - 5,
      50
    )
    ctx.fillText('Attack one', 25, height - 95 - verticalOffset / 2)
    ctx.fillStyle = 'white'
    ctx.strokeStyle = 'white'

    if (bState.selectedMove === 2) {
      ctx.fillStyle = 'orangered'
      ctx.strokeStyle = 'orangered'
    }
    ctx.strokeRect(
      15 + (width - 20) / 2,
      height - 120 - verticalOffset / 2,
      (width - 20) / 2 - 5,
      50
    )
    ctx.fillText(
      'Attack two',
      30 + (width - 20) / 2,
      height - 95 - verticalOffset / 2
    )
    ctx.fillStyle = 'white'
    ctx.strokeStyle = 'white'

    if (bState.selectedMove === 3) {
      ctx.fillStyle = 'orangered'
      ctx.strokeStyle = 'orangered'
    }
    ctx.strokeRect(
      10,
      height - 60 - verticalOffset / 2,
      (width - 20) / 2 - 5,
      50
    )
    ctx.fillText('Attack three', 25, height - 35 - verticalOffset / 2)
    ctx.fillStyle = 'white'
    ctx.strokeStyle = 'white'

    if (bState.selectedMove === 4) {
      ctx.fillStyle = 'orangered'
      ctx.strokeStyle = 'orangered'
    }
    ctx.strokeRect(
      15 + (width - 20) / 2,
      height - 60 - verticalOffset / 2,
      (width - 20) / 2 - 5,
      50
    )
    ctx.fillText(
      'Attack four',
      30 + (width - 20) / 2,
      height - 35 - verticalOffset / 2
    )
    ctx.fillStyle = 'white'
    ctx.strokeStyle = 'white'
  }
}
