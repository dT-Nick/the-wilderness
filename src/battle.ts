import { battleState, gameState } from './state.js'

export function generateBattle() {
  generatePlayerInfo()
  generateEnemyInfo()
  generateMoves()
}

export function generatePlayerInfo() {
  const { state } = gameState
  const { ctx, player, status, scale, verticalOffset } = state

  if (status !== 'inactive') {
    ctx.fillStyle = 'white'
    ctx.font = `${Math.floor(22 * scale)}px monospace`
    ctx.fillText(
      `Health: ${Math.ceil(player.currentHealth)}`,
      10,
      20 + verticalOffset / 2
    )

    player.takeDamage()
  }
}

export function generateEnemyInfo() {
  const { state } = gameState
  const { state: bState } = battleState
  const { ctx, enemy, status, scale, verticalOffset, width } = state

  if (status !== 'inactive') {
    ctx.fillStyle = 'white'
    ctx.font = `${Math.floor(22 * scale)}px monospace`
    ctx.fillText(
      `Health: ${Math.ceil(enemy.currentHealth)}`,
      width - 10 - 150 * scale,
      20 + verticalOffset / 2
    )
    if (bState.lastMove === 'enemy' || bState.lastMove === null) {
      enemy.takeDamage()
    } else {
      enemy.hitPlayer(20)
    }
  }
}

function getMovesColour(
  lastMove: 'player' | 'enemy' | null,
  isDamageApplying: boolean,
  isWaiting: boolean,
  selectedMove: number,
  move: number
) {
  if (lastMove === 'player' || isDamageApplying || isWaiting) {
    return 'lightgrey'
  }
  if (selectedMove === move) {
    return 'orangered'
  }
  return 'white'
}

export function generateMoves() {
  const { state } = gameState
  const { state: bState } = battleState
  const { lastMove, selectedMove } = bState
  const { ctx, status, scale, verticalOffset, height, width, enemy } = state

  if (status !== 'inactive') {
    const isDamageApplying = enemy.currentDamage > 0
    const isWaiting = battleState.isWaiting

    ctx.lineWidth = 4
    ctx.font = `${Math.floor(22 * scale)}px monospace`
    ctx.textBaseline = 'middle'

    let colour = getMovesColour(
      lastMove,
      isDamageApplying,
      isWaiting,
      selectedMove,
      1
    )
    ctx.fillStyle = colour
    ctx.strokeStyle = colour
    ctx.strokeRect(
      10,
      height - 120 - verticalOffset / 2,
      (width - 20) / 2 - 5,
      50
    )
    ctx.fillText('Attack one', 25, height - 95 - verticalOffset / 2)

    colour = getMovesColour(
      lastMove,
      isDamageApplying,
      isWaiting,
      selectedMove,
      2
    )
    ctx.fillStyle = colour
    ctx.strokeStyle = colour
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

    colour = getMovesColour(
      lastMove,
      isDamageApplying,
      isWaiting,
      selectedMove,
      3
    )
    ctx.fillStyle = colour
    ctx.strokeStyle = colour
    ctx.strokeRect(
      10,
      height - 60 - verticalOffset / 2,
      (width - 20) / 2 - 5,
      50
    )
    ctx.fillText('Attack three', 25, height - 35 - verticalOffset / 2)

    colour = getMovesColour(
      lastMove,
      isDamageApplying,
      isWaiting,
      selectedMove,
      4
    )
    ctx.fillStyle = colour
    ctx.strokeStyle = colour
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
  }
}
