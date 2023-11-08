import { generateSlug } from '../helpers/functions.js'

export class Item {
  id: string
  name: string
  isConsumable: boolean
  isEquipable: boolean
  isUsable: boolean

  constructor(
    name: string,
    isConsumable: boolean,
    isEquipable: boolean,
    isUsable: boolean
  ) {
    this.id = generateSlug(name)
    this.name = name
    this.isConsumable = isConsumable
    this.isEquipable = isEquipable
    this.isUsable = isUsable
  }
}
