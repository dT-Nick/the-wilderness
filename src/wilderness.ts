import { Enemy } from './classes/Enemy.js'
import { FloorItem } from './classes/FloorItem.js'
import {
  generateEliteWitch,
  generateKaurismakiDaemon,
  generateKaurismakiKing,
  generateNightWitch,
  generateSettlementZombie,
  handleEnemyInteraction,
} from './enemy.js'
import { getEntityXAndYValuesFromCoords } from './helpers/coordinates.js'
import { generateSlug } from './helpers/functions.js'
import { handleSettingsTriggerInputs } from './input.js'
import { handleItemPickup } from './item.js'
import { handlePlayerMovement } from './player.js'
import {
  BlockType,
  addNotification,
  getBlockPropertiesFromName,
  getCanvasState,
  getCurrentMap,
  getGameState,
  getLoopState,
  getMapsState,
  getQuestState,
  getSettlementState,
  getWildernessState,
  isInitialised,
  isPlayerInitialised,
  updateBattleState,
  updateGameState,
  updateMessageState,
  updateQuestState,
  updateWildernessState,
} from './state.js'
import { handleMapExit } from './wilderness-maps/index.js'
import { handleMapMinusOneMinusOneInput } from './wilderness-maps/map-[-1,-1].js'
import { handleMapMinusOneZeroInput } from './wilderness-maps/map-[-1,0].js'
import { handleMapMinusOneOneInput } from './wilderness-maps/map-[-1,1].js'
import { handleMapMinusTwoMinusOneInput } from './wilderness-maps/map-[-2,-1].js'
import { handleMapMinusTwoZeroInput } from './wilderness-maps/map-[-2,0].js'
import { handleMapMinusThreeMinusOneInput } from './wilderness-maps/map-[-3,-1].js'
import { handleMapMinusThreeZeroInput } from './wilderness-maps/map-[-3,0].js'
import { handleMapZeroInput } from './wilderness-maps/map-[0,0].js'
import { handleMapZeroOneInput } from './wilderness-maps/map-[0,1].js'
import { handleMapZeroTwoInput } from './wilderness-maps/map-[0,2].js'
import { handleMapZeroThreeInput } from './wilderness-maps/map-[0,3].js'
import { handleMapOneZeroInput } from './wilderness-maps/map-[1,0].js'
import { handleMapOneOneInput } from './wilderness-maps/map-[1,1].js'

export type MapDesign = Array<{
  type: BlockType['name']
  fromCoords: [number, number]
  toCoords: [number, number]
}>

export interface MapState {
  map: MapDesign
  discovered: boolean
}

export function drawWilderness() {
  const { design } = getCurrentMap()

  drawBackgroundFromMap(design)
}

export function drawWildernessClock() {
  const { wildernessTime } = getWildernessState()
  const { ctx, scale, width, verticalOffset } = getCanvasState()

  if (!isInitialised(ctx)) return

  ctx.font = `bold ${Math.ceil(14 * scale)}px Arial`
  ctx.fillStyle = 'yellow'
  ctx.textAlign = 'right'
  ctx.textBaseline = 'bottom'

  const minutes = Math.floor(wildernessTime / 1000 / 60)
  const seconds = Math.floor((wildernessTime / 1000) % 60)

  const paddedMins = minutes.toString().padStart(2, '0')
  const paddedSecs = seconds.toString().padStart(2, '0')

  ctx.fillText(
    `Time spent in wilderness: ${paddedMins}:${paddedSecs}`,
    width - 10 * scale,
    verticalOffset / 2 - 10 * scale
  )
}

export function deriveRestrictedCoordsFromMap(
  map: MapState['map'],
  mapId: string | number,
  extraCoordinates: Array<[number, number]> = []
) {
  const { enemies, status, player } = getGameState()
  const restrictedCoords: Array<[number, number]> = extraCoordinates

  for (
    let blockRangeIndex = 0;
    blockRangeIndex < map.length;
    blockRangeIndex++
  ) {
    const blockRange = map[blockRangeIndex]
    const { isPassable } = getBlockPropertiesFromName(blockRange.type)

    if (isPassable) continue

    const { fromCoords, toCoords } = blockRange
    for (let x = fromCoords[0]; x <= toCoords[0] - 1; x++) {
      for (let y = fromCoords[1]; y <= toCoords[1] - 1; y++) {
        restrictedCoords.push([x, y])
      }
    }
  }

  for (const enemy of enemies.filter(
    (e) => e.mapId === mapId && status === 'wilderness'
  )) {
    restrictedCoords.push(enemy.coordinates)
  }

  if (status === 'settlement') {
    const { buildings } = getSettlementState()

    for (let building of buildings.filter((b) => b.isPlaced)) {
      const { fromCoords, toCoords } = building.coordinates
      for (let x = fromCoords[0]; x <= toCoords[0] - 1; x++) {
        for (let y = fromCoords[1]; y <= toCoords[1] - 1; y++) {
          restrictedCoords.push([x, y])
        }
      }
    }
  }

  if (isPlayerInitialised(player)) {
    const { coordinates } = player
    restrictedCoords.push(coordinates)
  }

  return restrictedCoords
}

export function drawBackgroundFromMap(map: MapState['map']) {
  const { blockSize, blocksHorizontal, blocksVertical } = getGameState()
  const { ctx, verticalOffset, scale } = getCanvasState()

  if (!isInitialised(ctx)) return

  const { colour } = getBlockPropertiesFromName('grass')
  ctx.fillStyle = colour
  ctx.fillRect(
    0,
    verticalOffset / 2,
    blocksHorizontal * (blockSize * scale),
    blocksVertical * (blockSize * scale)
  )

  map.forEach(({ type, fromCoords, toCoords }) => {
    const { colour } = getBlockPropertiesFromName(type)

    ctx.fillStyle = colour
    const fromX = fromCoords[0] * (blockSize * scale)
    const fromY = fromCoords[1] * (blockSize * scale) + verticalOffset / 2

    const width = (toCoords[0] - fromCoords[0]) * (blockSize * scale)
    const height = (toCoords[1] - fromCoords[1]) * (blockSize * scale)

    ctx.fillRect(fromX, fromY, width, height)
  })

  // generateBackgroundGrid()
}

export function updateWildernessClock() {
  const { deltaTime } = getLoopState()
  updateWildernessState((c) => ({
    wildernessTime: c.wildernessTime + deltaTime,
  }))
}

export function handleWildernessInput() {
  const map = getCurrentMap()

  switch (map.id) {
    case '[0,0]': {
      handleMapZeroInput()
      break
    }
    case '[-1,0]': {
      handleMapMinusOneZeroInput()
      break
    }
    case '[-2,0]': {
      handleMapMinusTwoZeroInput()
      break
    }
    case '[-3,0]': {
      handleMapMinusThreeZeroInput()
      break
    }
    case '[0,1]': {
      handleMapZeroOneInput()
      break
    }
    case '[0,2]': {
      handleMapZeroTwoInput()
      break
    }
    case '[0,3]': {
      handleMapZeroThreeInput()
      break
    }
    case '[1,0]': {
      handleMapOneZeroInput()
      break
    }
    case '[1,1]': {
      handleMapOneOneInput()
      break
    }
    case '[-1,1]': {
      handleMapMinusOneOneInput()
      break
    }
    case '[-1,-1]': {
      handleMapMinusOneMinusOneInput()
      break
    }
    case '[-2,-1]': {
      handleMapMinusTwoMinusOneInput()
      break
    }
    case '[-3,-1]': {
      handleMapMinusThreeMinusOneInput()
      break
    }
    default: {
      throw new Error(`Unknown mapId: ${map.id}`)
    }
  }

  const restrictedCoords = deriveRestrictedCoordsFromMap(map.design, map.id)

  handleSettingsTriggerInputs()
  handlePlayerMovement(restrictedCoords)
  handleMapExit()
  handleItemPickup()
  handleEnemyInteraction()
}

export function handleWildernessScenarios() {
  handleEnemyEncounter()
  handleEnemyMovementCycle()
  handleSpawnCycle()
}

export function handleEnemyMovementCycle(bypassTime: boolean = false) {
  const { wildernessTime, enemyMovementCycleCount } = getWildernessState()
  const { enemies } = getGameState()

  const thirtySecondsPassed = Math.floor(wildernessTime / 1000 / 30)

  if (thirtySecondsPassed <= enemyMovementCycleCount && !bypassTime) return
  // move enemies
  const enemiesInMapZero = enemies.filter((e) => e.mapId === '[0,0]')

  for (let enemy of enemiesInMapZero) {
    enemy.moveTowardsSettlement()
  }

  updateWildernessState({
    enemyMovementCycleCount: thirtySecondsPassed,
  })
  if (enemiesInMapZero.length > 0) {
    addNotification('Enemies have moved!')
  }
}

function handleSpawnCycle() {
  const { wildernessTime, spawnCycleCount } = getWildernessState()

  const tenMinutesPassed = Math.floor(wildernessTime / 1000 / 60 / 10)

  if (tenMinutesPassed <= spawnCycleCount) return
  updateWildernessState({
    spawnCycleCount: tenMinutesPassed,
  })
  spawnItemsAndEnemies()
  addNotification('More enemies and items have spawned!')
}

function handleEnemyEncounter() {
  const { player, enemies } = getGameState()
  const { id: mapId } = getCurrentMap()
  if (!isPlayerInitialised(player)) return

  for (const enemy of enemies.filter((e) => e.mapId === mapId)) {
    const {
      faceDirection: eFaceDirection,
      coordinates: [eCoordsX, eCoordsY],
    } = enemy
    const {
      coordinates: [pCoordsX, pCoordsY],
    } = player

    const isOnAttackBlock =
      (eFaceDirection === 'up' &&
        pCoordsX === eCoordsX &&
        pCoordsY < eCoordsY &&
        pCoordsY >= eCoordsY - 3) ||
      (eFaceDirection === 'down' &&
        pCoordsX === eCoordsX &&
        pCoordsY > eCoordsY &&
        pCoordsY <= eCoordsY + 3) ||
      (eFaceDirection === 'left' &&
        pCoordsX < eCoordsX &&
        pCoordsX >= eCoordsX - 3 &&
        pCoordsY === eCoordsY) ||
      (eFaceDirection === 'right' &&
        pCoordsX > eCoordsX &&
        pCoordsX <= eCoordsX + 3 &&
        pCoordsY === eCoordsY)

    if (isOnAttackBlock) {
      if (enemy.playerPrompted) {
        updateBattleState({
          lastMove: null,
          enemyId: enemy.id,
          status: 'play',
          playerMenu: 'main',
          turns: 0,
          waitLengthMs: 0,
          waitStart: null,
        })
        updateGameState({
          status: 'battle',
        })
      } else {
        updateMessageState({
          message: `You have encountered a ${enemy.name}!`,
        })
        enemy.updatePlayerPrompted(true)
      }
    }
  }
}

export function spawnItemsAndEnemies(initialSpawn: boolean = false) {
  const { enemies, blockSize, floorItems, items } = getGameState()
  const { maps } = getMapsState()

  for (let mapIndex = 0; mapIndex < maps.length; mapIndex++) {
    const map = maps[mapIndex]
    const { design, id } = map
    if (!id.includes('[')) continue
    if (!map.isDiscovered && !initialSpawn) continue

    const currentEnemies = enemies.filter((e) => e.mapId === id)
    const currentItems = floorItems.filter((i) => i.mapId === id)
    let newEnemyCount: number = 0
    let newItemCount: number = 0
    let zombieRatioThreshhold: number = 0.5
    let daemonRatioThreshhold: number = 0.9
    let witchRatioThreshhold: number = 1
    let enemyLevel: number | (() => number) = 0
    let extraRestrictedCoords: Array<[number, number]> = []

    switch (id) {
      case '[-1,-1]': {
        newEnemyCount =
          Math.round(Math.random() * 2) + 6 - currentEnemies.length
        newItemCount = Math.round(Math.random() * 3) - currentItems.length
        enemyLevel = () => Math.ceil(Math.random() * 4)
        extraRestrictedCoords = [
          [60, 9],
          [57, 8],
          [57, 10],
        ]
        break
      }
      case '[-1,0]': {
        newEnemyCount =
          Math.round(Math.random() * 3) + 2 - currentEnemies.length
        newItemCount = Math.round(Math.random() * 3) - currentItems.length
        enemyLevel = () => Math.ceil(Math.random() * 3)
        break
      }
      case '[-1,1]': {
        newEnemyCount = 1 - currentEnemies.length
        newItemCount = 0
        enemyLevel = () => Math.ceil(Math.random() * 3)
        break
      }
      case '[-2,-1]': {
        newEnemyCount =
          Math.round(Math.random() * 2) + 6 - currentEnemies.length
        newItemCount = Math.round(Math.random() * 3) - currentItems.length
        enemyLevel = () => Math.ceil(Math.random() * 4) + 2
        break
      }
      case '[-2,0]': {
        newEnemyCount =
          Math.round(Math.random() * 2) + 2 - currentEnemies.length
        newItemCount = Math.round(Math.random() * 3) - currentItems.length
        enemyLevel = () => Math.ceil(Math.random() * 4)
        break
      }
      case '[-3,-1]': {
        newEnemyCount =
          Math.round(Math.random() * 2) + 6 - currentEnemies.length
        newItemCount = Math.round(Math.random() * 3) - currentItems.length
        enemyLevel = () => Math.ceil(Math.random() * 4) + 1
        break
      }
      case '[-3,0]': {
        newEnemyCount = Math.round(Math.random() * 3) - currentEnemies.length
        newItemCount = Math.round(Math.random() * 3) - currentItems.length
        enemyLevel = () => Math.ceil(Math.random() * 4)
        break
      }
      case '[0,0]': {
        newEnemyCount =
          Math.round(Math.random() * 5) + 2 - currentEnemies.length
        newItemCount = Math.round(Math.random() * 3) - currentItems.length
        enemyLevel = 1
        break
      }
      case '[0,1]': {
        newEnemyCount =
          Math.round(Math.random() * 3) + 2 - currentEnemies.length
        newItemCount = Math.round(Math.random() * 3) - currentItems.length
        enemyLevel = () => Math.ceil(Math.random() * 3)
        break
      }
      case '[0,2]': {
        newEnemyCount =
          Math.round(Math.random() * 9) + 4 - currentEnemies.length
        newItemCount = Math.round(Math.random() * 3) - currentItems.length
        zombieRatioThreshhold = 0.3
        daemonRatioThreshhold = 0.7
        witchRatioThreshhold = 1
        enemyLevel = () => Math.ceil(Math.random() * 8) + 10
        break
      }
      case '[0,3]': {
        if (initialSpawn) {
          respawnKaurismakiFinalIsland()
        }
        break
      }
      case '[1,0]': {
        newEnemyCount =
          Math.round(Math.random() * 3) + 2 - currentEnemies.length
        newItemCount = Math.round(Math.random() * 3) - currentItems.length
        enemyLevel = () => Math.ceil(Math.random() * 3)
        break
      }
      case '[1,1]': {
        newEnemyCount =
          Math.round(Math.random() * 3) + 2 - currentEnemies.length
        newItemCount = Math.round(Math.random() * 3) - currentItems.length
        enemyLevel = () => Math.ceil(Math.random() * 3)
        break
      }
      default: {
        throw new Error('Map not found')
      }
    }
    for (let i = 0; i < newEnemyCount; i++) {
      const restrictedCoords = deriveRestrictedCoordsFromMap(
        design,
        id,
        extraRestrictedCoords
      )
      const {
        coords: [x, y],
        direction,
      } = generateEntitySpawnDirectionAndCoords(restrictedCoords)

      const enemyTypeRng = Math.random()
      let newEnemy: Enemy
      if (enemyTypeRng < zombieRatioThreshhold) {
        newEnemy = generateSettlementZombie(
          typeof enemyLevel === 'function' ? enemyLevel() : enemyLevel,
          getEntityXAndYValuesFromCoords(x, y, blockSize)[0],
          getEntityXAndYValuesFromCoords(x, y, blockSize)[1],
          id,
          direction
        )
      } else if (enemyTypeRng < daemonRatioThreshhold) {
        newEnemy = generateKaurismakiDaemon(
          typeof enemyLevel === 'function' ? enemyLevel() : enemyLevel,
          getEntityXAndYValuesFromCoords(x, y, blockSize)[0],
          getEntityXAndYValuesFromCoords(x, y, blockSize)[1],
          id,
          direction
        )
      } else if (enemyTypeRng < witchRatioThreshhold) {
        newEnemy = generateNightWitch(
          typeof enemyLevel === 'function' ? enemyLevel() : enemyLevel,
          getEntityXAndYValuesFromCoords(x, y, blockSize)[0],
          getEntityXAndYValuesFromCoords(x, y, blockSize)[1],
          id,
          direction
        )
      }

      updateGameState((c) => ({
        enemies: [...c.enemies, newEnemy],
      }))
    }
    for (let i = 0; i < newItemCount; i++) {
      const restrictedCoords = deriveRestrictedCoordsFromMap(design, id, [
        ...floorItems.map((item) => item.coordinates),
        ...extraRestrictedCoords,
      ])
      const {
        coords: [x, y],
      } = generateEntitySpawnDirectionAndCoords(restrictedCoords)

      const consumableItems = items.filter((i) => i.isConsumable)

      const randomItemName =
        consumableItems[Math.floor(Math.random() * consumableItems.length)].name

      const newItem = new FloorItem(
        getEntityXAndYValuesFromCoords(x, y, blockSize)[0],
        getEntityXAndYValuesFromCoords(x, y, blockSize)[1],
        blockSize * (1 / 2),
        generateSlug(randomItemName),
        id
      )

      updateGameState((c) => ({
        floorItems: [...c.floorItems, newItem],
      }))
    }
  }

  const { hasBridgeSpawned } = getQuestState()
  if (!hasBridgeSpawned) {
    const { spawnCycleCount } = getWildernessState()

    const spawnChance = Math.random() * 10

    if (spawnChance > 10 - spawnCycleCount) {
      const firstNewEnemy = generateNightWitch(
        10,
        getEntityXAndYValuesFromCoords(57, 8, blockSize)[0],
        getEntityXAndYValuesFromCoords(57, 8, blockSize)[1],
        '[-1,-1]',
        'down'
      )
      const secondNewEnemy = generateNightWitch(
        10,
        getEntityXAndYValuesFromCoords(57, 10, blockSize)[0],
        getEntityXAndYValuesFromCoords(57, 10, blockSize)[1],
        '[-1,-1]',
        'up'
      )

      updateGameState((c) => ({
        enemies: [...c.enemies, firstNewEnemy, secondNewEnemy],
        floorItems: [
          ...c.floorItems,
          new FloorItem(
            getEntityXAndYValuesFromCoords(60, 9, blockSize)[0],
            getEntityXAndYValuesFromCoords(60, 9, blockSize)[1],
            blockSize * (1 / 2),
            'bridge-pieces',
            '[-1,-1]'
          ),
        ],
      }))
      updateQuestState({
        hasBridgeSpawned: true,
      })
      updateMessageState({
        message:
          'Sensors have detected some weird energy signatures west of your settlement...',
      })
    }
  }
}

function generateEntitySpawnDirectionAndCoords(
  restrictedCoords: Array<[number, number]>
) {
  const { blocksHorizontal, blocksVertical } = getGameState()

  const x = Math.floor(Math.random() * blocksHorizontal)
  const y = Math.floor(Math.random() * blocksVertical)

  const isOnRestrictedCoords = restrictedCoords.some(
    ([rX, rY]) => rX === x && rY === y
  )
  let availableDirections: Array<'up' | 'down' | 'left' | 'right'> = [
    'up',
    'down',
    'left',
    'right',
  ]

  if (
    restrictedCoords.some(([rX, rY]) => rX === x && rY === y - 1) ||
    y - 1 < 0
  ) {
    availableDirections = availableDirections.filter((d) => d !== 'up')
  }
  if (
    restrictedCoords.some(([rX, rY]) => rX === x && rY === y + 1) ||
    y + 1 > blocksVertical - 1
  ) {
    availableDirections = availableDirections.filter((d) => d !== 'down')
  }
  if (
    restrictedCoords.some(([rX, rY]) => rX === x - 1 && rY === y) ||
    x - 1 < 0
  ) {
    availableDirections = availableDirections.filter((d) => d !== 'left')
  }
  if (
    restrictedCoords.some(([rX, rY]) => rX === x + 1 && rY === y) ||
    x + 1 > blocksHorizontal - 1
  ) {
    availableDirections = availableDirections.filter((d) => d !== 'right')
  }

  const directionIndex = Math.floor(Math.random() * availableDirections.length)
  const direction =
    availableDirections[
      directionIndex >= availableDirections.length
        ? availableDirections.length - 1
        : directionIndex
    ] ?? 'down'

  if (isOnRestrictedCoords)
    return generateEntitySpawnDirectionAndCoords(restrictedCoords)

  return {
    direction,
    coords: [x, y],
  }
}

export function respawnKaurismakiFinalIsland() {
  const { blockSize } = getGameState()

  const firstWitch = generateEliteWitch(
    20,
    getEntityXAndYValuesFromCoords(40, 18, blockSize)[0],
    getEntityXAndYValuesFromCoords(40, 18, blockSize)[1],
    '[0,3]',
    'right'
  )
  const secondWitch = generateEliteWitch(
    21,
    getEntityXAndYValuesFromCoords(42, 17, blockSize)[0],
    getEntityXAndYValuesFromCoords(42, 17, blockSize)[1],
    '[0,3]',
    'left'
  )
  const thirdWitch = generateEliteWitch(
    22,
    getEntityXAndYValuesFromCoords(40, 16, blockSize)[0],
    getEntityXAndYValuesFromCoords(40, 16, blockSize)[1],
    '[0,3]',
    'right'
  )
  const fourthWitch = generateEliteWitch(
    23,
    getEntityXAndYValuesFromCoords(42, 15, blockSize)[0],
    getEntityXAndYValuesFromCoords(42, 15, blockSize)[1],
    '[0,3]',
    'left'
  )
  const fifthWitch = generateEliteWitch(
    24,
    getEntityXAndYValuesFromCoords(40, 14, blockSize)[0],
    getEntityXAndYValuesFromCoords(40, 14, blockSize)[1],
    '[0,3]',
    'right'
  )
  const sixthWitch = generateEliteWitch(
    25,
    getEntityXAndYValuesFromCoords(42, 13, blockSize)[0],
    getEntityXAndYValuesFromCoords(42, 13, blockSize)[1],
    '[0,3]',
    'left'
  )
  const seventhWitch = generateEliteWitch(
    26,
    getEntityXAndYValuesFromCoords(40, 12, blockSize)[0],
    getEntityXAndYValuesFromCoords(40, 12, blockSize)[1],
    '[0,3]',
    'right'
  )

  const kaurismakiKing = generateKaurismakiKing(
    getEntityXAndYValuesFromCoords(41, 5, blockSize)[0],
    getEntityXAndYValuesFromCoords(41, 5, blockSize)[1],
    '[0,3]',
    'down'
  )

  updateGameState((c) => ({
    enemies: [
      ...c.enemies.filter((e) => e.mapId !== '[0,3]'),
      firstWitch,
      secondWitch,
      thirdWitch,
      fourthWitch,
      fifthWitch,
      sixthWitch,
      seventhWitch,
      kaurismakiKing,
    ],
  }))
}
