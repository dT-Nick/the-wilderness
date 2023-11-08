import { Building } from '../classes/Building.js'
import { Enemy } from '../classes/Enemy.js'
import { FloorItem } from '../classes/FloorItem.js'
import { Player } from '../classes/Player.js'
import { SaveFile } from '../save.js'

export function loadPlayer(props: SaveFile['gameState']['player']) {
  const player = new Player(0, 0, 0)
  if (!props) throw new Error('Player props not found')
  player.load(props)

  return player
}

export function loadEnemy(props: SaveFile['gameState']['enemies'][number]) {
  const enemy = new Enemy('', '', 0, 0, 0, 0, '[0,0]', 0, 0)
  if (!props) throw new Error('Enemy props not found')
  enemy.load(props)

  return enemy
}

export function loadFloorItem(
  props: SaveFile['gameState']['floorItems'][number]
) {
  const item = new FloorItem(0, 0, 0, '', 0)
  if (!props) throw new Error('Item props not found')
  item.load(props)

  return item
}

export function loadBuilding(
  props: SaveFile['settlementState']['buildings'][number]
) {
  const building = new Building('', 0, 0, 0, 0, 0)
  if (!props) throw new Error('Building props not found')
  building.load(props)

  return building
}
