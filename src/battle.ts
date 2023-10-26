// import { battleState, gameState } from './state.js'

import { getItemViaId } from './item.js'
import {
  getBattleState,
  getCanvasState,
  getGameState,
  isInitialised,
  isPlayerInitialised,
  updateBattleState,
} from './state.js'

export function drawBattle() {
  drawPlayerInfo()
  drawEnemyInfo()

  drawOptions()
}

export function drawPlayerInfo() {
  const { ctx, scale, verticalOffset } = getCanvasState()
  const { player } = getGameState()

  if (isInitialised(ctx) && isPlayerInitialised(player)) {
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = 'white'
    ctx.font = `${Math.floor(22 * scale)}px monospace`
    ctx.fillText(
      `Health: ${Math.ceil(player.currentHealth)}`,
      10,
      20 + verticalOffset / 2
    )
  }
}

export function drawEnemyInfo() {
  const { ctx, scale, verticalOffset, width } = getCanvasState()
  const { enemies } = getGameState()
  const { enemyId, lastMove } = getBattleState()

  if (isInitialised(ctx)) {
    const enemy = enemies.find((e) => e.id === enemyId)
    if (!enemy) throw new Error(`No enemy found with id: ${enemyId}`)

    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = 'white'
    ctx.font = `${Math.floor(22 * scale)}px monospace`
    ctx.fillText(
      `Health: ${Math.ceil(enemy.currentHealth)}`,
      width - 10 - 150 * scale,
      20 + verticalOffset / 2
    )
  }
}

function drawOptions() {
  const { playerMenu } = getBattleState()

  switch (playerMenu) {
    case 'main': {
      drawMainOptions()
      break
    }
    case 'moves': {
      drawMoves()
      break
    }
    case 'items': {
      drawInventory()
      break
    }
    default: {
      throw new Error(`Unknown playerMenu: ${playerMenu}`)
    }
  }
}

function getOptionsColour(
  lastMove: 'player' | 'enemy' | null,
  isDamageApplying: boolean,
  isWaiting: boolean,
  selectedOption: number,
  optionIndex: number
) {
  if (lastMove === 'player' || isDamageApplying || isWaiting) {
    return 'darkgrey'
  }
  if (selectedOption === optionIndex) {
    return 'orangered'
  }
  return 'white'
}

function drawMainOptions() {
  const { ctx, scale, verticalOffset, width, height } = getCanvasState()
  const { lastMove, status, selectedOption } = getBattleState()

  if (isInitialised(ctx)) {
    ctx.lineWidth = 1
    ctx.font = `${Math.floor(22 * scale)}px monospace`
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'

    const widthOfBox = (width - 30) / 2

    let colour = getOptionsColour(lastMove, false, false, selectedOption, 1)
    ctx.fillStyle = colour
    ctx.strokeStyle = colour
    ctx.strokeRect(10, height - 120 - verticalOffset / 2, widthOfBox, 110)
    ctx.fillText(
      'Attack',
      widthOfBox / 2 + 10,
      height - 65 - verticalOffset / 2
    )

    colour = getOptionsColour(lastMove, false, false, selectedOption, 2)
    ctx.fillStyle = colour
    ctx.strokeStyle = colour
    ctx.strokeRect(
      widthOfBox + 20,
      height - 120 - verticalOffset / 2,
      widthOfBox,
      110
    )
    ctx.fillText(
      'Items',
      widthOfBox + widthOfBox / 2 + 20,
      height - 65 - verticalOffset / 2
    )
  }
}

export function drawMoves() {
  const { ctx, scale, verticalOffset, height, width } = getCanvasState()
  const { lastMove, selectedMove, enemyId, status } = getBattleState()
  const { enemies } = getGameState()

  if (isInitialised(ctx)) {
    const enemy = enemies.find((e) => e.id === enemyId)
    if (!enemy) throw new Error(`No enemy found with id: ${enemyId}`)

    const isDamageApplying = enemy.currentDamage > 0
    const isWaiting = status === 'wait'

    ctx.lineWidth = 1
    ctx.font = `${Math.floor(22 * scale)}px monospace`
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'

    let colour = getOptionsColour(
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

    colour = getOptionsColour(
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

    colour = getOptionsColour(
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

    colour = getOptionsColour(
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

export function drawInventory() {
  const { ctx, scale, verticalOffset, height, width } = getCanvasState()
  const { lastMove, selectedItem, enemyId, status } = getBattleState()
  const { inventory } = getGameState()
  if (!isInitialised(ctx)) return

  const items = inventory.map((item) => getItemViaId(item.itemId))

  ctx.fillStyle = '#333'
  ctx.fillRect(0, 0, width, height)

  for (let i = 0; i < items.length; i++) {
    const item = items[i]

    const colour = getOptionsColour(lastMove, false, false, selectedItem, i + 1)
    ctx.fillStyle = colour
    ctx.strokeStyle = colour
    ctx.strokeRect(10, 10 + 60 * i, width - 20, 50)
    ctx.fillText(item.name, 25, 35 + 60 * i)
  }
}

export function handleBattleScenarios() {
  const { player, enemies } = getGameState()
  if (!isPlayerInitialised(player)) return
  const { enemyId, lastMove, status } = getBattleState()

  const enemy = enemies.find((e) => e.id === enemyId)
  if (!enemy) throw new Error(`No enemy found with id: ${enemyId}`)

  if (status === 'wait') {
    const { waitStart, waitLengthMs } = getBattleState()
    if (waitStart && waitLengthMs) {
      const now = Date.now()
      const timePassed = now - waitStart
      if (timePassed >= waitLengthMs) {
        updateBattleState({
          status: 'play',
          waitStart: null,
          waitLengthMs: 0,
        })
      }
    }
  }
  if (status === 'play') {
    if (lastMove === 'player') {
      if (player.currentDamage > 0) {
        player.takeDamage()
      } else {
        enemy.hitPlayer(Math.ceil(Math.random() * 25))
      }
    }

    if (lastMove !== 'player' && enemy.currentDamage) {
      enemy.takeDamage()
    }
    if (player.currentHeal > 0) {
      player.addHealth()
    }
  }
}
