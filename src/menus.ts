import { calculateExperienceFromLevel } from './helpers/functions.js'
import { isButtonDownEvent, isKeyDownEvent } from './input.js'
import { saveGame } from './save.js'
import {
  constants,
  getCanvasState,
  getGameState,
  getSettingsState,
  getSettlementState,
  getStartMenuState,
  getWildernessState,
  isInitialised,
  isPlayerInitialised,
  updateGameState,
  updateSettingsState,
} from './state.js'

export function drawStartMenu() {
  const { ctx, width, height, scale } = getCanvasState()
  const { selectedButton } = getStartMenuState()
  const { startMenuButtonSize } = constants

  if (isInitialised(ctx)) {
    const buttonStartX =
      width / 2 -
      (startMenuButtonSize * scale) / 2 -
      (startMenuButtonSize * scale) / 2 -
      10 * scale
    const buttonStartY = height / 2 - (startMenuButtonSize * scale) / 2

    ctx.fillStyle = 'green'
    ctx.strokeStyle = 'white'
    ctx.lineWidth = 2
    ctx.fillRect(
      buttonStartX,
      buttonStartY,
      startMenuButtonSize * scale,
      startMenuButtonSize * scale
    )
    if (selectedButton === 0) {
      ctx.strokeRect(
        buttonStartX,
        buttonStartY,
        startMenuButtonSize * scale,
        startMenuButtonSize * scale
      )
    }

    ctx.fillStyle = 'white'
    ctx.font = `${Math.ceil(50 * scale)}px Arial`
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    ctx.fillText(
      'NEW',
      buttonStartX + (startMenuButtonSize * scale) / 2,
      buttonStartY + (startMenuButtonSize * scale) / 2,
      startMenuButtonSize * scale
    )

    const buttonLoadX =
      width / 2 -
      (startMenuButtonSize * scale) / 2 +
      (startMenuButtonSize * scale) / 2 +
      10 * scale
    const buttonLoadY = height / 2 - (startMenuButtonSize * scale) / 2

    ctx.fillStyle = 'darkblue'
    ctx.strokeStyle = 'white'
    ctx.lineWidth = 2
    ctx.fillRect(
      buttonLoadX,
      buttonLoadY,
      startMenuButtonSize * scale,
      startMenuButtonSize * scale
    )
    if (selectedButton === 1) {
      ctx.strokeRect(
        buttonLoadX,
        buttonLoadY,
        startMenuButtonSize * scale,
        startMenuButtonSize * scale
      )
    }

    ctx.fillStyle = 'white'
    ctx.font = `${Math.ceil(50 * scale)}px Arial`
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    ctx.fillText(
      'LOAD',
      buttonLoadX + (startMenuButtonSize * scale) / 2,
      buttonLoadY + (startMenuButtonSize * scale) / 2,
      startMenuButtonSize * scale
    )
  }
}

export function drawSettingsMenu() {
  const { ctx, width, height, verticalOffset, scale } = getCanvasState()
  const { selectedMenu } = getSettingsState()
  if (!isInitialised(ctx)) return
  ctx.fillStyle = '#333'
  ctx.fillRect(0, verticalOffset / 2, width, height - verticalOffset)

  const statsAndDetailsMargin = 10 * scale
  const statsAndDetailsWidth = width * (3 / 4) - 2 * statsAndDetailsMargin
  const statsAndDetailsHeight =
    height - verticalOffset - 2 * statsAndDetailsMargin
  const statsAndDetailsX = statsAndDetailsMargin
  const startsAndDetailsY = verticalOffset / 2 + statsAndDetailsMargin

  ctx.strokeStyle = 'white'
  ctx.fillStyle = 'black'
  ctx.lineWidth = 2
  ctx.strokeRect(
    statsAndDetailsX,
    startsAndDetailsY,
    statsAndDetailsWidth,
    statsAndDetailsHeight
  )
  ctx.fillRect(
    statsAndDetailsX,
    startsAndDetailsY,
    statsAndDetailsWidth,
    statsAndDetailsHeight
  )

  const optionsMargin = 10 * scale
  const optionsWidth = width * (1 / 4) - optionsMargin
  const optionsX = width - optionsWidth - optionsMargin
  const optionsY = verticalOffset / 2 + optionsMargin

  const buttonWidth = optionsWidth
  const buttonHeight = 70 * scale

  const buttons = ['Map', 'Inventory', 'Save']

  buttons.forEach((button, index) => {
    const buttonX = optionsX
    const buttonY = optionsY + index * buttonHeight + optionsMargin * index

    ctx.strokeStyle = selectedMenu === index ? 'orangered' : 'white'
    ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight)

    ctx.fillStyle = selectedMenu === index ? 'orangered' : 'white'
    ctx.font = `${30 * scale}px Arial`
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    ctx.fillText(
      button,
      buttonX + buttonWidth / 2,
      buttonY + buttonHeight / 2,
      buttonWidth
    )
  })
}

export function drawStatisticsAndPlayerDetails() {
  const { ctx, scale, verticalOffset, height, width } = getCanvasState()
  const { buildings } = getSettlementState()
  const { player, playTime } = getGameState()
  const { wildernessTime } = getWildernessState()

  if (isInitialised(ctx) && isPlayerInitialised(player)) {
    const spacingBetweenElements = 10 * scale

    // health bar
    const experienceBarHeight = 10 * scale
    const healthBarHeight = 25 * scale + spacingBetweenElements
    const healthBarWidth =
      width * (3 / 4) -
      spacingBetweenElements * 3 -
      healthBarHeight -
      experienceBarHeight -
      spacingBetweenElements
    const healthBarX = 20 * scale
    const healthBarY = 20 * scale + verticalOffset / 2

    const healthBarFillWidth =
      (player.currentHealth / player.maxHealth) * healthBarWidth

    ctx.fillStyle = '#333333'
    ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight)
    ctx.fillStyle = 'red'
    ctx.fillRect(healthBarX, healthBarY, healthBarFillWidth, healthBarHeight)

    const levelBoxHeight = healthBarHeight
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
      player.currentCombatLevel.toString(),
      levelBoxX + levelBoxWidth / 2,
      levelBoxY + levelBoxHeight / 2 + 2
    )

    const imageHeight = 280 * scale
    const imageWidth = 200 * scale
    const imageNudgeY = 30 * scale

    ctx.drawImage(
      document.getElementById('player-image') as HTMLImageElement,
      (healthBarWidth + levelBoxWidth + spacingBetweenElements) / 2 -
        imageWidth / 2,
      healthBarY + healthBarHeight + 10 * scale - imageNudgeY,
      imageWidth,
      imageHeight
    )

    const detailsX = 20 * scale
    const detailsY =
      healthBarY + healthBarHeight + (imageHeight - imageNudgeY) + 20 * scale
    const detailsWidth = healthBarWidth + levelBoxWidth + spacingBetweenElements
    const detailsHeight =
      height -
      verticalOffset -
      healthBarHeight -
      (imageHeight - imageNudgeY) -
      spacingBetweenElements * 6

    ctx.fillStyle = '#333333'
    ctx.fillRect(detailsX, detailsY, detailsWidth, detailsHeight)

    const textHeight = 20 * scale
    ctx.fillStyle = 'white'
    ctx.font = `${Math.floor(20 * scale)}px monospace`
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.fillText(
      `Name: Player`,
      detailsX + 10 * scale,
      detailsY + spacingBetweenElements
    )
    ctx.fillText(
      `Max Health: ${player.maxHealth}`,
      detailsX + 10 * scale,
      detailsY + textHeight + spacingBetweenElements * 2
    )
    const settlementHealthMax =
      buildings.reduce((acc, b) => (b.isPlaced ? acc + b.maxHealth : acc), 0) +
      1
    const settlementHealthCurrent =
      buildings.reduce(
        (acc, b) => (b.isPlaced ? acc + b.currentHealth : acc),
        0
      ) + 1

    ctx.fillText(
      `Settlement Health: ${settlementHealthCurrent}/${settlementHealthMax}`,
      detailsX + 10 * scale,
      detailsY + textHeight * 2 + spacingBetweenElements * 3
    )

    const playTimeMinutes = Math.floor(playTime / 60 / 1000)
      .toString()
      .padStart(2, '0')
    const playTimeSeconds = Math.floor((playTime / 1000) % 60)
      .toString()
      .padStart(2, '0')
    ctx.textBaseline = 'bottom'
    ctx.fillText(
      `Game time: ${playTimeMinutes}:${playTimeSeconds}`,
      detailsX + 10 * scale,
      height - verticalOffset / 2 - spacingBetweenElements * 3
    )

    const wildernessTimeMinutes = Math.floor(wildernessTime / 60 / 1000)
      .toString()
      .padStart(2, '0')
    const wildernessTimeSeconds = Math.floor((wildernessTime / 1000) % 60)
      .toString()
      .padStart(2, '0')

    ctx.fillText(
      `Wilderness time: ${wildernessTimeMinutes}:${wildernessTimeSeconds}`,
      detailsX + 10 * scale,
      height - verticalOffset / 2 - spacingBetweenElements * 4 - textHeight
    )

    const statExperienceBarHeight = 30 * scale
    const statExperienceBarWidth =
      (detailsWidth - spacingBetweenElements * 2) * (2 / 3) -
      statExperienceBarHeight -
      spacingBetweenElements
    const statExperienceBarX = detailsX + detailsWidth * (1 / 3)
    const statLevelBoxSize = statExperienceBarHeight
    const statLevelBoxX =
      statExperienceBarX + statExperienceBarWidth + spacingBetweenElements

    const meleeStatExperienceBarY =
      detailsY +
      detailsHeight / 3 -
      detailsHeight / 6 -
      statExperienceBarHeight / 2
    const meleeStatExperienceBarFillWidth =
      ((player.experience.melee -
        calculateExperienceFromLevel(player.currentMeleeLevel - 1)) /
        (calculateExperienceFromLevel(player.currentMeleeLevel) -
          calculateExperienceFromLevel(player.currentMeleeLevel - 1))) *
      statExperienceBarWidth

    console.log(meleeStatExperienceBarFillWidth)

    ctx.fillStyle = '#444444'
    ctx.fillRect(
      statExperienceBarX,
      meleeStatExperienceBarY,
      statExperienceBarWidth,
      statExperienceBarHeight
    )
    ctx.fillStyle = '#912700'
    ctx.fillRect(
      statExperienceBarX,
      meleeStatExperienceBarY,
      meleeStatExperienceBarFillWidth,
      statExperienceBarHeight
    )

    ctx.lineWidth = 2
    ctx.strokeStyle = 'white'
    ctx.strokeRect(
      statLevelBoxX,
      meleeStatExperienceBarY,
      statLevelBoxSize,
      statLevelBoxSize
    )

    ctx.fillStyle = 'white'
    ctx.font = `${Math.floor(20 * scale)}px monospace`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(
      player.currentMeleeLevel.toString(),
      statLevelBoxX + statLevelBoxSize / 2,
      meleeStatExperienceBarY + statLevelBoxSize / 2 + 2
    )

    ctx.font = `${Math.floor(14 * scale)}px monospace`
    ctx.textAlign = 'left'
    ctx.textBaseline = 'bottom'
    ctx.fillText(
      `Melee`,
      statExperienceBarX,
      meleeStatExperienceBarY - 5 * scale
    )

    const rangedStatExperienceBarY =
      detailsY + detailsHeight / 2 - statExperienceBarHeight / 2
    const rangedStatExperienceBarFillWidth =
      ((player.experience.ranged -
        calculateExperienceFromLevel(player.currentRangedLevel - 1)) /
        (calculateExperienceFromLevel(player.currentRangedLevel) -
          calculateExperienceFromLevel(player.currentRangedLevel - 1))) *
      statExperienceBarWidth

    ctx.fillStyle = '#444444'
    ctx.fillRect(
      statExperienceBarX,
      rangedStatExperienceBarY,
      statExperienceBarWidth,
      statExperienceBarHeight
    )
    ctx.fillStyle = 'green'
    ctx.fillRect(
      statExperienceBarX,
      rangedStatExperienceBarY,
      rangedStatExperienceBarFillWidth,
      statExperienceBarHeight
    )

    ctx.lineWidth = 2
    ctx.strokeStyle = 'white'
    ctx.strokeRect(
      statLevelBoxX,
      rangedStatExperienceBarY,
      statLevelBoxSize,
      statLevelBoxSize
    )

    ctx.fillStyle = 'white'
    ctx.font = `${Math.floor(20 * scale)}px monospace`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(
      player.currentRangedLevel.toString(),
      statLevelBoxX + statLevelBoxSize / 2,
      rangedStatExperienceBarY + statLevelBoxSize / 2 + 2
    )

    ctx.font = `${Math.floor(14 * scale)}px monospace`
    ctx.textAlign = 'left'
    ctx.textBaseline = 'bottom'
    ctx.fillText(
      `Ranged`,
      statExperienceBarX,
      rangedStatExperienceBarY - 5 * scale
    )

    const magicStatExperienceBarY =
      detailsY + detailsHeight - detailsHeight / 6 - statExperienceBarHeight / 2
    const magicStatExperienceBarFillWidth =
      ((player.experience.magic -
        calculateExperienceFromLevel(player.currentMagicLevel - 1)) /
        (calculateExperienceFromLevel(player.currentMagicLevel) -
          calculateExperienceFromLevel(player.currentMagicLevel - 1))) *
      statExperienceBarWidth

    ctx.fillStyle = '#444444'
    ctx.fillRect(
      statExperienceBarX,
      magicStatExperienceBarY,
      statExperienceBarWidth,
      statExperienceBarHeight
    )
    ctx.fillStyle = '#0070a8'
    ctx.fillRect(
      statExperienceBarX,
      magicStatExperienceBarY,
      magicStatExperienceBarFillWidth,
      statExperienceBarHeight
    )

    ctx.lineWidth = 2
    ctx.strokeStyle = 'white'
    ctx.strokeRect(
      statLevelBoxX,
      magicStatExperienceBarY,
      statLevelBoxSize,
      statLevelBoxSize
    )

    ctx.fillStyle = 'white'
    ctx.font = `${Math.floor(20 * scale)}px monospace`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(
      player.currentMagicLevel.toString(),
      statLevelBoxX + statLevelBoxSize / 2,
      magicStatExperienceBarY + statLevelBoxSize / 2 + 2
    )

    ctx.font = `${Math.floor(14 * scale)}px monospace`
    ctx.textAlign = 'left'
    ctx.textBaseline = 'bottom'
    ctx.fillText(
      `Magic`,
      statExperienceBarX,
      magicStatExperienceBarY - 5 * scale
    )
  }
}

export function handleSettingsInput() {
  const { selectedMenu } = getSettingsState()
  const { prevStatus, player } = getGameState()
  if (!isPlayerInitialised(player)) return

  if (isKeyDownEvent(['s', 'arrowdown']) || isButtonDownEvent('dpadDown')) {
    updateSettingsState((c) => ({
      selectedMenu: (c.selectedMenu + 1) % 3,
    }))
  }
  if (isKeyDownEvent(['w', 'arrowup']) || isButtonDownEvent('dpadUp')) {
    updateSettingsState((c) => ({
      selectedMenu: (c.selectedMenu - 1 + 3) % 3,
    }))
  }
  if (isKeyDownEvent(['e', 'enter']) || isButtonDownEvent('buttonA')) {
    if (selectedMenu === 0) {
      updateSettingsState({
        prevGameStatus: prevStatus,
      })
      updateGameState({
        status: 'world-map',
        prevStatus: 'settings',
      })
    }
    if (selectedMenu === 1) {
      updateSettingsState({
        prevGameStatus: prevStatus,
      })
      updateGameState({
        status: 'inventory',
        prevStatus: 'settings',
      })
    }
    if (selectedMenu === 2) {
      saveGame()
    }
  }

  if (
    isKeyDownEvent(['escape', 'tab']) ||
    isButtonDownEvent(['buttonB', 'start'])
  ) {
    if (
      prevStatus !== 'settings' &&
      prevStatus !== 'inventory' &&
      prevStatus !== 'world-map'
    ) {
      if (player.currentHeal > 0) {
        player.addHealth(true)
      }
      if (player.currentlyGainingExperience) {
        player.addExperience(true)
      }
      if (player.currentDamage) {
        player.takeDamage(true)
      }
    }
    updateGameState((c) => ({
      status: c.prevStatus ?? 'settlement',
    }))
  }
}

export function handleSettingsScenarios() {
  const { player } = getGameState()
  if (!isPlayerInitialised(player)) return

  if (player.currentHeal > 0) {
    player.addHealth()
  }
  if (player.currentlyGainingExperience) {
    player.addExperience()
  }
  if (player.currentDamage) {
    player.takeDamage()
  }
}
