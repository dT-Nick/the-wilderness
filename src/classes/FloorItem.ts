import { SaveFile } from '../save.js'
import { getGameState, updateGameState, addNotification } from '../state.js'
import { Entity } from './Entity.js'

export class FloorItem extends Entity {
  itemId: string
  mapId: number | string

  constructor(
    startX: number,
    startY: number,
    size: number,
    itemId: string,
    mapId: number | string
  ) {
    super(startX, startY, size)
    this.itemId = itemId
    this.mapId = mapId
  }

  public pickUpItem() {
    const { items } = getGameState()
    const item = items.find((i) => i.id === this.itemId)

    updateGameState((c) => ({
      inventory: [
        ...c.inventory,
        {
          id: this.id,
          itemId: this.itemId,
        },
      ],
      floorItems: [...c.floorItems.filter((i) => i.id !== this.id)],
    }))
    addNotification(`You picked up a ${item?.name ?? 'an item'}`)
  }

  public load(props: SaveFile['gameState']['floorItems'][number]) {
    if (!props) return
    this.x = props.x
    this.y = props.y
    this.itemId = props.itemId
    this.id = props.id
    this.size = props.size
    this.mapId = props.mapId
  }
}
