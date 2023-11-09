import { Item } from './Item.js'

export class EquipableItem extends Item {
  slot: 'weapon' | 'armour' | 'amulet' | 'shield' | 'bow'
  stats: {
    attack: number
    defence: number
    weight: number
    magic: number
    ranged: number
  }

  constructor(
    name: string,
    slot: 'weapon' | 'armour' | 'amulet' | 'shield' | 'bow',
    stats: {
      attack: number
      defence: number
      weight: number
      magic: number
      ranged: number
    }
  ) {
    super(name, false, true, false)
    this.slot = slot
    this.stats = stats
  }
}
