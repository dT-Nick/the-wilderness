// import { battleState, gameState } from './state.js'

import {
  calculateDamage,
  calculateExperienceFromLevel,
  calculateExperienceGainedFromBattle,
} from './helpers/functions.js'
import { getItemViaId } from './item.js'
import {
  getBattleState,
  getCanvasState,
  getGameState,
  getSettlementState,
  isInitialised,
  isMessageActive,
  isPlayerInitialised,
  updateBattleState,
  updateGameState,
  updateMessageState,
  updateSettlementState,
  updateWildernessState,
} from './state.js'
import { handleEnemyMovementCycle } from './wilderness.js'

export function drawBattle() {
  drawPlayerInfo()
  drawEnemyInfo()

  drawOptions()
}

export function drawPlayerInfo() {
  const { ctx, scale, verticalOffset, height } = getCanvasState()
  const { player } = getGameState()

  if (isInitialised(ctx) && isPlayerInitialised(player)) {
    const spacingBetweenElements = 10 * scale

    const nameHeight = 17 * scale
    const nameX = 10 * scale
    const nameY = 10 * scale + verticalOffset / 2
    const nameMaxWidth = 400 * scale
    ctx.fillStyle = 'white'
    ctx.font = `${Math.floor(20 * scale)}px Arial`
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.fillText('Player', nameX, nameY, nameMaxWidth)

    // health bar
    const healthBarWidth = 400 * scale
    const healthBarHeight = 15 * scale
    const healthBarX = 10 * scale
    const healthBarY =
      10 * scale + verticalOffset / 2 + nameHeight + spacingBetweenElements

    const healthBarFillWidth =
      (player.currentHealth / player.maxHealth) * healthBarWidth

    ctx.fillStyle = '#333333'
    ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight)
    ctx.fillStyle = 'red'
    ctx.fillRect(healthBarX, healthBarY, healthBarFillWidth, healthBarHeight)

    const experienceBarWidth = 400 * scale
    const experienceBarHeight = 10 * scale
    const experienceBarX = 10 * scale
    const experienceBarY = healthBarY + healthBarHeight + spacingBetweenElements
    const experienceAtStartOfLevel = calculateExperienceFromLevel(
      player.currentLevel - 1
    )
    const experienceAtEndOfLevel = calculateExperienceFromLevel(
      player.currentLevel
    )

    const experienceBarFillWidth =
      ((player.experience - experienceAtStartOfLevel) /
        (experienceAtEndOfLevel - experienceAtStartOfLevel)) *
      experienceBarWidth

    ctx.fillStyle = '#333333'
    ctx.fillRect(
      experienceBarX,
      experienceBarY,
      experienceBarWidth,
      experienceBarHeight
    )
    ctx.fillStyle = 'green'
    ctx.fillRect(
      experienceBarX,
      experienceBarY,
      experienceBarFillWidth,
      experienceBarHeight
    )

    const levelBoxHeight = healthBarHeight + experienceBarHeight + 10 * scale
    const levelBoxWidth = levelBoxHeight
    const levelBoxX = healthBarX + healthBarWidth + 10 * scale
    const levelBoxY = healthBarY

    ctx.lineWidth = 2
    ctx.strokeStyle = 'white'
    ctx.strokeRect(levelBoxX, levelBoxY, levelBoxWidth, levelBoxHeight)

    ctx.fillStyle = 'white'
    ctx.font = `${Math.floor(25 * scale)}px monospace`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(
      player.currentLevel.toString(),
      levelBoxX + levelBoxWidth / 2,
      levelBoxY + levelBoxHeight / 2 + 2
    )

    const imageHeight = 280 * scale
    const imageWidth = 200 * scale

    ctx.drawImage(
      document.getElementById('player-image') as HTMLImageElement,
      10 * scale,
      height / 2 - imageHeight / 2 - 50 * scale,
      imageWidth,
      imageHeight
    )
  }
}

export function drawEnemyInfo() {
  const { ctx, scale, verticalOffset, width, height } = getCanvasState()
  const { enemies } = getGameState()
  const { enemyId, lastMove } = getBattleState()

  if (isInitialised(ctx)) {
    const enemy = enemies.find((e) => e.id === enemyId)
    if (!enemy) throw new Error(`No enemy found with id: ${enemyId}`)

    const spacingBetweenElements = 10 * scale

    const nameHeight = 17 * scale
    const nameX = width - 10 * scale
    const nameY = 10 * scale + verticalOffset / 2
    const nameMaxWidth = 400 * scale

    ctx.font = `${Math.floor(20 * scale)}px Arial`
    ctx.textAlign = 'right'
    ctx.textBaseline = 'top'
    ctx.fillText(enemy.name, nameX, nameY, nameMaxWidth)

    // health bar
    const healthBarWidth = 400 * scale
    const healthBarHeight = 15 * scale
    const healthBarX = width - healthBarWidth - 10 * scale
    const healthBarY =
      10 * scale + verticalOffset / 2 + nameHeight + spacingBetweenElements

    const healthBarFillWidth =
      (enemy.currentHealth / enemy.maxHealth) * healthBarWidth

    ctx.fillStyle = '#333333'
    ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight)
    ctx.fillStyle = 'red'
    ctx.fillRect(
      healthBarX + healthBarWidth - healthBarFillWidth,
      healthBarY,
      healthBarFillWidth,
      healthBarHeight
    )

    const experienceBarWidth = 400 * scale
    const experienceBarHeight = 10 * scale
    const experienceBarX = width - experienceBarWidth - 10 * scale
    const experienceBarY = healthBarY + healthBarHeight + spacingBetweenElements

    ctx.fillStyle = 'gold'
    ctx.fillRect(
      experienceBarX,
      experienceBarY,
      experienceBarWidth,
      experienceBarHeight
    )

    const levelBoxHeight = healthBarHeight + experienceBarHeight + 10 * scale
    const levelBoxWidth = levelBoxHeight
    const levelBoxX = healthBarX - levelBoxWidth - 10 * scale
    const levelBoxY = healthBarY

    ctx.lineWidth = 2
    ctx.strokeStyle = 'white'
    ctx.strokeRect(levelBoxX, levelBoxY, levelBoxWidth, levelBoxHeight)

    ctx.fillStyle = 'white'
    ctx.font = `${Math.floor(25 * scale)}px monospace`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(
      enemy.currentLevel.toString(),
      levelBoxX + levelBoxWidth / 2,
      levelBoxY + levelBoxHeight / 2 + 2
    )

    const imageHeight = 280 * scale
    const imageWidth = 200 * scale

    ctx.drawImage(
      document.getElementById('demon-image') as HTMLImageElement,
      width - imageWidth - 10 * scale,
      height / 2 - imageHeight / 2 - 50 * scale,
      imageWidth,
      imageHeight
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
    ctx.font = `${Math.floor(25 * scale)}px monospace`
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'

    const widthOfBox = (width - 30 * scale) / 2

    let colour = getOptionsColour(lastMove, false, false, selectedOption, 1)
    ctx.fillStyle = colour
    ctx.strokeStyle = colour
    ctx.strokeRect(
      10 * scale,
      height - 120 * scale - verticalOffset / 2,
      widthOfBox,
      110 * scale
    )
    ctx.fillText(
      'Attack',
      widthOfBox / 2 + 10,
      height - 65 * scale - verticalOffset / 2
    )

    colour = getOptionsColour(lastMove, false, false, selectedOption, 2)
    ctx.fillStyle = colour
    ctx.strokeStyle = colour
    ctx.strokeRect(
      widthOfBox + 20 * scale,
      height - 120 * scale - verticalOffset / 2,
      widthOfBox,
      110 * scale
    )
    ctx.fillText(
      'Items',
      widthOfBox + widthOfBox / 2 + 20,
      height - 65 * scale - verticalOffset / 2
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

    const isDamageApplying = enemy.currentDamage !== null
    const isWaiting = status === 'wait'

    ctx.lineWidth = 1
    ctx.font = `${Math.floor(25 * scale)}px monospace`
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
      10 * scale,
      height - 120 * scale - verticalOffset / 2,
      (width - 20 * scale) / 2 - 5 * scale,
      50 * scale
    )
    ctx.fillText(
      'Attack one',
      25 * scale,
      height - 95 * scale - verticalOffset / 2
    )

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
      15 * scale + (width - 20 * scale) / 2,
      height - 120 * scale - verticalOffset / 2,
      (width - 20 * scale) / 2 - 5 * scale,
      50 * scale
    )
    ctx.fillText(
      'Attack two',
      30 * scale + (width - 20 * scale) / 2,
      height - 95 * scale - verticalOffset / 2
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
      10 * scale,
      height - 60 * scale - verticalOffset / 2,
      (width - 20 * scale) / 2 - 5 * scale,
      50 * scale
    )
    ctx.fillText(
      'Attack three',
      25 * scale,
      height - 35 * scale - verticalOffset / 2
    )

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
      15 * scale + (width - 20 * scale) / 2,
      height - 60 * scale - verticalOffset / 2,
      (width - 20 * scale) / 2 - 5 * scale,
      50 * scale
    )
    ctx.fillText(
      'Attack four',
      30 * scale + (width - 20 * scale) / 2,
      height - 35 * scale - verticalOffset / 2
    )
  }
}

export function drawInventory() {
  const { ctx, scale, verticalOffset, height, width } = getCanvasState()
  const { lastMove, selectedItem, enemyId, status } = getBattleState()
  const { inventory } = getGameState()
  if (!isInitialised(ctx)) return

  const items = inventory.map((item) => getItemViaId(item.itemId))

  ctx.textAlign = 'left'
  ctx.fillStyle = '#333'
  ctx.fillRect(0, verticalOffset / 2, width, height - verticalOffset)

  for (let i = 0; i < items.length; i++) {
    const item = items[i]

    const colour = getOptionsColour(lastMove, false, false, selectedItem, i + 1)
    ctx.fillStyle = colour
    ctx.strokeStyle = colour
    ctx.strokeRect(
      10 * scale,
      10 * scale + 60 * scale * i + verticalOffset / 2,
      width - 20 * scale,
      50 * scale
    )
    ctx.fillText(
      item.name,
      25 * scale,
      35 * scale + 60 * scale * i + verticalOffset / 2
    )
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
      if (player.currentDamage !== null) {
        player.takeDamage()
      } else {
        enemy.hitPlayer(Math.ceil(Math.random() * 25))
      }
    }

    if (lastMove !== 'player' && enemy.currentDamage !== null) {
      enemy.takeDamage()
    }
    if (player.currentHeal > 0) {
      player.addHealth()
    }
    if (player.currentExperienceGain > 0) {
      player.addExperience()
      return
    }
  }
  if (player.currentHealth <= 0 && !isMessageActive()) {
    const { buildings } = getSettlementState()
    const home = buildings.find((b) => b.name === 'home' && b.isPlaced)
    if (!home || home.currentHealth === 0) {
      updateGameState({
        status: 'game-over',
      })
    } else {
      updateGameState({
        status: 'building',
        buildingId: home.id,
      })
      handleEnemyMovementCycle(true)
      player.restoreHealth()
      player.goToCoordinates(41, 13)
      player.stopMoving()
      enemy.restoreHealth()
      updateMessageState({
        message:
          'You awake back in your home... someone must have brought you back',
      })
    }
  }

  if (
    enemy.currentHealth <= 0 &&
    player.currentExperienceGain <= 0 &&
    !isMessageActive() &&
    status !== 'wait'
  ) {
    updateWildernessState((c) => ({
      wildernessTime: c.wildernessTime + 30 * 1000,
    }))
    updateGameState((c) => ({
      enemies: [...c.enemies.filter((e) => e.id !== enemy.id)],
      status: 'wilderness',
    }))
  }
}
