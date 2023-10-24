import { getWildernessState } from './state.js'
import { drawMapZero } from './wilderness-maps/map-0.js'

export function drawWilderness() {
  const { mapId } = getWildernessState()

  switch (mapId) {
    case 0: {
      drawMapZero()
      break
    }
    default: {
      throw new Error(`Unknown mapId: ${mapId}`)
    }
  }
}
