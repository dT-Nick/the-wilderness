import { generateBackgroundGrid } from './background.js'
import { Enemy, FloorItem } from './classes.js'
import { getEntityXAndYValuesFromCoords } from './helpers/coordinates.js'
import { generateSlug } from './helpers/functions.js'
import {
  BlockType,
  addNotification,
  getBlockPropertiesFromName,
  getCanvasState,
  getGameState,
  getLoopState,
  getSettlementState,
  getWildernessState,
  isInitialised,
  isPlayerInitialised,
  updateBattleState,
  updateGameState,
  updateMessageState,
  updateWildernessState,
} from './state.js'
import { drawMapZero, getMapZeroState } from './wilderness-maps/map-0.js'
import {
  drawMapMinusOneZero,
  getMapMinusOneZeroState,
} from './wilderness-maps/map-[-1,0].js'
import {
  drawMapMinusOneOne,
  getMapMinusOneOneState,
} from './wilderness-maps/map-[-1,1].js'
import {
  drawMapZeroOne,
  getMapZeroOneState,
} from './wilderness-maps/map-[0,1].js'
import {
  drawMapOneZero,
  getMapOneZeroState,
} from './wilderness-maps/map-[1,0].js'
import {
  drawMapOneOne,
  getMapOneOneState,
} from './wilderness-maps/map-[1,1].js'

export interface MapState {
  map: Array<{
    type: BlockType['name']
    fromCoords: [number, number]
    toCoords: [number, number]
  }>
  discovered: boolean
}

export function drawWilderness() {
  const { mapId } = getWildernessState()

  switch (mapId) {
    case 0: {
      drawMapZero()
      break
    }
    case '[-1,0]': {
      drawMapMinusOneZero()
      break
    }
    case '[0,1]': {
      drawMapZeroOne()
      break
    }
    case '[1,0]': {
      drawMapOneZero()
      break
    }
    case '[1,1]': {
      drawMapOneOne()
      break
    }
    case '[-1,1]': {
      drawMapMinusOneOne()
      break
    }
    default: {
      throw new Error(`Unknown mapId: ${mapId}`)
    }
  }
}

export function drawWildernessClock() {
  const { wildernessTime } = getWildernessState()
  const { ctx, scale, width, height, verticalOffset } = getCanvasState()

  if (!isInitialised(ctx)) return

  ctx.font = `bold ${14 * scale}px Arial`
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
  extraCoordinates: Array<[number, number]> = []
) {
  const { enemies, status, player } = getGameState()
  const { mapId } = getWildernessState()
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
  const enemiesInMapZero = enemies.filter((e) => e.mapId === 0)

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

  spawnItemsAndEnemies()
  updateWildernessState({
    spawnCycleCount: tenMinutesPassed,
  })
  addNotification('More enemies and items have spawned!')
}

function handleEnemyEncounter() {
  const { player, enemies } = getGameState()
  const { mapId } = getWildernessState()
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
        pCoordsY === eCoordsY - 1) ||
      (eFaceDirection === 'down' &&
        pCoordsX === eCoordsX &&
        pCoordsY === eCoordsY + 1) ||
      (eFaceDirection === 'left' &&
        pCoordsX === eCoordsX - 1 &&
        pCoordsY === eCoordsY) ||
      (eFaceDirection === 'right' &&
        pCoordsX === eCoordsX + 1 &&
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

  const { discovered: mapZeroDiscovered, map: mapZero } = getMapZeroState()
  const { discovered: mapMinusOneZeroDiscovered, map: mapMinusOneZero } =
    getMapMinusOneZeroState()
  const { discovered: mapZeroOneDiscovered, map: mapZeroOne } =
    getMapZeroOneState()
  const { discovered: mapOneZeroDiscovered, map: mapOneZero } =
    getMapOneZeroState()
  const { discovered: mapOneOneDiscovered, map: mapOneOne } =
    getMapOneOneState()
  const { discovered: mapMinusOneOneDiscovered } = getMapMinusOneOneState()

  if (mapZeroDiscovered || initialSpawn) {
    const currentEnemies = enemies.filter((e) => e.mapId === 0)
    const newEnemyCount =
      Math.round(Math.random() * 5) + 2 - currentEnemies.length

    for (let i = 0; i < newEnemyCount; i++) {
      const restrictedCoords = deriveRestrictedCoordsFromMap(mapZero)
      const [x, y] = generateEnemySpawnCoords(restrictedCoords)

      updateGameState((c) => ({
        enemies: [
          ...c.enemies,
          new Enemy(
            'Kaurismaki Daemon',
            100,
            getEntityXAndYValuesFromCoords(x, y, blockSize)[0],
            getEntityXAndYValuesFromCoords(x, y, blockSize)[1],
            blockSize * (3 / 4),
            0
          ),
        ],
      }))
    }

    const currentItems = floorItems.filter((i) => i.mapId === 0)
    const newItemCount = Math.round(Math.random() * 3) - currentItems.length

    for (let i = 0; i < newItemCount; i++) {
      const restrictedCoords = deriveRestrictedCoordsFromMap(mapZero)
      const [x, y] = generateEnemySpawnCoords(restrictedCoords)

      const randomItemName =
        items[Math.floor(Math.random() * items.length)].name

      updateGameState((c) => ({
        floorItems: [
          ...c.floorItems,
          new FloorItem(
            getEntityXAndYValuesFromCoords(x, y, blockSize)[0],
            getEntityXAndYValuesFromCoords(x, y, blockSize)[1],
            blockSize * (3 / 4),
            generateSlug(randomItemName),
            0
          ),
        ],
      }))
    }
  }

  if (mapMinusOneZeroDiscovered || initialSpawn) {
    const currentEnemies = enemies.filter((e) => e.mapId === '[-1,0]')
    const newEnemyCount =
      Math.round(Math.random() * 3) + 2 - currentEnemies.length
    for (let i = 0; i < newEnemyCount; i++) {
      const restrictedCoords = deriveRestrictedCoordsFromMap(mapMinusOneZero)
      const [x, y] = generateEnemySpawnCoords(restrictedCoords)

      updateGameState((c) => ({
        enemies: [
          ...c.enemies,
          new Enemy(
            'Kaurismaki Daemon',
            100,
            getEntityXAndYValuesFromCoords(x, y, blockSize)[0],
            getEntityXAndYValuesFromCoords(x, y, blockSize)[1],
            blockSize * (3 / 4),
            '[-1,0]'
          ),
        ],
      }))
    }

    const currentItems = floorItems.filter((i) => i.mapId === '[-1,0]')
    const newItemCount = Math.round(Math.random() * 3) - currentItems.length
    for (let i = 0; i < newItemCount; i++) {
      const restrictedCoords = deriveRestrictedCoordsFromMap(mapMinusOneZero)
      const [x, y] = generateEnemySpawnCoords(restrictedCoords)

      const randomItemName =
        items[Math.floor(Math.random() * items.length)].name

      updateGameState((c) => ({
        floorItems: [
          ...c.floorItems,
          new FloorItem(
            getEntityXAndYValuesFromCoords(x, y, blockSize)[0],
            getEntityXAndYValuesFromCoords(x, y, blockSize)[1],
            blockSize * (3 / 4),
            generateSlug(randomItemName),
            '[-1,0]'
          ),
        ],
      }))
    }
  }

  if (mapZeroOneDiscovered || initialSpawn) {
    const currentEnemies = enemies.filter((e) => e.mapId === '[0,1]')
    const newEnemyCount =
      Math.round(Math.random() * 3) + 2 - currentEnemies.length

    for (let i = 0; i < newEnemyCount; i++) {
      const restrictedCoords = deriveRestrictedCoordsFromMap(mapZeroOne)
      const [x, y] = generateEnemySpawnCoords(restrictedCoords)

      updateGameState((c) => ({
        enemies: [
          ...c.enemies,
          new Enemy(
            'Kaurismaki Daemon',
            100,
            getEntityXAndYValuesFromCoords(x, y, blockSize)[0],
            getEntityXAndYValuesFromCoords(x, y, blockSize)[1],
            blockSize * (3 / 4),
            '[0,1]'
          ),
        ],
      }))
    }

    const currentItems = floorItems.filter((i) => i.mapId === '[0,1]')
    const newItemCount = Math.round(Math.random() * 3) - currentItems.length
    for (let i = 0; i < newItemCount; i++) {
      const restrictedCoords = deriveRestrictedCoordsFromMap(mapZeroOne)
      const [x, y] = generateEnemySpawnCoords(restrictedCoords)

      const randomItemName =
        items[Math.floor(Math.random() * items.length)].name

      updateGameState((c) => ({
        floorItems: [
          ...c.floorItems,
          new FloorItem(
            getEntityXAndYValuesFromCoords(x, y, blockSize)[0],
            getEntityXAndYValuesFromCoords(x, y, blockSize)[1],
            blockSize * (3 / 4),
            generateSlug(randomItemName),
            '[0,1]'
          ),
        ],
      }))
    }
  }

  if (mapOneZeroDiscovered || initialSpawn) {
    const currentEnemies = enemies.filter((e) => e.mapId === '[1,0]')
    const newEnemyCount =
      Math.round(Math.random() * 3) + 2 - currentEnemies.length

    for (let i = 0; i < newEnemyCount; i++) {
      const restrictedCoords = deriveRestrictedCoordsFromMap(mapOneZero)
      const [x, y] = generateEnemySpawnCoords(restrictedCoords)

      updateGameState((c) => ({
        enemies: [
          ...c.enemies,
          new Enemy(
            'Kaurismaki Daemon',
            100,
            getEntityXAndYValuesFromCoords(x, y, blockSize)[0],
            getEntityXAndYValuesFromCoords(x, y, blockSize)[1],
            blockSize * (3 / 4),
            '[1,0]'
          ),
        ],
      }))
    }

    const currentItems = floorItems.filter((i) => i.mapId === '[1,0]')
    const newItemCount = Math.round(Math.random() * 3) - currentItems.length

    for (let i = 0; i < newItemCount; i++) {
      const restrictedCoords = deriveRestrictedCoordsFromMap(mapOneZero)
      const [x, y] = generateEnemySpawnCoords(restrictedCoords)

      const randomItemName =
        items[Math.floor(Math.random() * items.length)].name

      updateGameState((c) => ({
        floorItems: [
          ...c.floorItems,
          new FloorItem(
            getEntityXAndYValuesFromCoords(x, y, blockSize)[0],
            getEntityXAndYValuesFromCoords(x, y, blockSize)[1],
            blockSize * (3 / 4),
            generateSlug(randomItemName),
            '[1,0]'
          ),
        ],
      }))
    }
  }

  if (mapOneOneDiscovered || initialSpawn) {
    const currentEnemies = enemies.filter((e) => e.mapId === '[1,1]')
    const newEnemyCount =
      Math.round(Math.random() * 3) + 2 - currentEnemies.length

    for (let i = 0; i < newEnemyCount; i++) {
      const restrictedCoords = deriveRestrictedCoordsFromMap(mapOneOne)
      const [x, y] = generateEnemySpawnCoords(restrictedCoords)

      updateGameState((c) => ({
        enemies: [
          ...c.enemies,
          new Enemy(
            'Kaurismaki Daemon',
            100,
            getEntityXAndYValuesFromCoords(x, y, blockSize)[0],
            getEntityXAndYValuesFromCoords(x, y, blockSize)[1],
            blockSize * (3 / 4),
            '[1,1]'
          ),
        ],
      }))
    }

    const currentItems = floorItems.filter((i) => i.mapId === '[1,1]')
    const newItemCount = Math.round(Math.random() * 3) - currentItems.length

    for (let i = 0; i < newItemCount; i++) {
      const restrictedCoords = deriveRestrictedCoordsFromMap(mapOneOne)
      const [x, y] = generateEnemySpawnCoords(restrictedCoords)

      const randomItemName =
        items[Math.floor(Math.random() * items.length)].name

      updateGameState((c) => ({
        floorItems: [
          ...c.floorItems,
          new FloorItem(
            getEntityXAndYValuesFromCoords(x, y, blockSize)[0],
            getEntityXAndYValuesFromCoords(x, y, blockSize)[1],
            blockSize * (3 / 4),
            generateSlug(randomItemName),
            '[1,1]'
          ),
        ],
      }))
    }
  }

  if (mapMinusOneOneDiscovered || initialSpawn) {
    const currentEnemies = enemies.filter((e) => e.mapId === '[-1,1]')
    const newEnemyCount = 1 - currentEnemies.length

    for (let i = 0; i < newEnemyCount; i++) {
      const [x, y] = [78, 23]

      updateGameState((c) => ({
        enemies: [
          ...c.enemies,
          new Enemy(
            'Kaurismaki Daemon',
            100,
            getEntityXAndYValuesFromCoords(x, y, blockSize)[0],
            getEntityXAndYValuesFromCoords(x, y, blockSize)[1],
            blockSize * (3 / 4),
            '[-1,1]'
          ),
        ],
      }))
    }
  }
}

function generateEnemySpawnCoords(restrictedCoords: Array<[number, number]>) {
  const { blocksHorizontal, blocksVertical } = getGameState()

  const x = Math.floor(Math.random() * blocksHorizontal)
  const y = Math.floor(Math.random() * blocksVertical)

  const isOnRestrictedCoords = restrictedCoords.some(
    ([rX, rY]) => rX === x && rY === y
  )

  if (isOnRestrictedCoords) return generateEnemySpawnCoords(restrictedCoords)

  return [x, y]
}
