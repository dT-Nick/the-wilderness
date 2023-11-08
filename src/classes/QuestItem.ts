import { Item } from './Item.js'

export class QuestItem extends Item {
  effect: () => void

  constructor(name: string, effect: () => void) {
    super(name, false, false, true)
    this.effect = effect
  }

  public use() {
    this.effect()
  }
}
