import { Item } from './Item.js'

export class EquipableItem extends Item {
  slot: 'weapon' | 'armour'
  stats: {
    attack: number
    defence: number
  }

  constructor(
    name: string,
    slot: 'weapon' | 'armour',
    stats: { attack: number; defence: number }
  ) {
    super(name, false, true, false)
    this.slot = slot
    this.stats = stats
  }
}
