import { Item } from './Item.js'

export class ConsumableItem extends Item {
  effect: () => void

  constructor(name: string, effect: () => void) {
    super(name, true, false, false)
    this.effect = effect
  }

  public consume() {
    this.effect()
  }
}
