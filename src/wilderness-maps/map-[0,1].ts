import { handleEnemyInteraction } from '../enemy.js'
import {
  isButtonCurrentlyDown,
  isButtonDownEvent,
  isKeyCurrentlyDown,
  isKeyDownEvent,
} from '../input.js'
import { handleItemPickup, isUsable } from '../item.js'
import { handlePlayerMovement } from '../player.js'
import {
  addNotification,
  getDeltaFrames,
  getGameState,
  getInputState,
  isPlayerInitialised,
  updateGameState,
  updateMessageState,
  updateWildernessState,
} from '../state.js'
import {
  MapState,
  deriveRestrictedCoordsFromMap,
  drawBackgroundFromMap,
} from '../wilderness.js'
import { getMapZeroState, updateMapZeroState } from './map-0.js'
import {
  getMapMinusOneOneState,
  updateMapMinusOneOneState,
} from './map-[-1,1].js'
import { getMapZeroTwoState, updateMapZeroTwoState } from './map-[0,2].js'
import { getMapOneOneState, updateMapOneOneState } from './map-[1,1].js'

export function generateMapZeroOneState(withBridge: boolean = false): MapState {
  const { blocksVertical, blocksHorizontal } = getGameState()

  return {
    map: [
      {
        type: 'water',
        fromCoords: [0, 11],
        toCoords: [26, 12],
      },
      {
        type: 'water',
        fromCoords: [0, 12],
        toCoords: [21, 13],
      },
      {
        type: 'water',
        fromCoords: [0, 13],
        toCoords: [17, 14],
      },
      {
        type: 'water',
        fromCoords: [0, 14],
        toCoords: [12, 15],
      },
      {
        type: 'water',
        fromCoords: [0, 15],
        toCoords: [5, 17],
      },
      {
        type: 'water',
        fromCoords: [0, 17],
        toCoords: [2, 18],
      },
      {
        type: 'water',
        fromCoords: [0, 4],
        toCoords: [23, 5],
      },
      {
        type: 'water',
        fromCoords: [0, 2],
        toCoords: [14, 4],
      },
      {
        type: 'water',
        fromCoords: [0, 0],
        toCoords: [10, 2],
      },
      {
        type: 'water',
        fromCoords: [60, 4],
        toCoords: [83, 5],
      },
      {
        type: 'water',
        fromCoords: [67, 3],
        toCoords: [83, 4],
      },
      {
        type: 'water',
        fromCoords: [74, 2],
        toCoords: [83, 3],
      },
      {
        type: 'water',
        fromCoords: [78, 0],
        toCoords: [83, 2],
      },
      {
        type: 'water',
        fromCoords: [65, 11],
        toCoords: [80, 12],
      },
      {
        type: 'water',
        fromCoords: [71, 12],
        toCoords: [78, 13],
      },
      {
        type: 'wood',
        fromCoords: [42, 9],
        toCoords: [45, 12],
      },
      {
        type: 'wood',
        fromCoords: [42, 4],
        toCoords: [45, 7],
      },
      {
        type: 'water',
        fromCoords: [0, 5],
        toCoords: [42, 11],
      },
      {
        type: 'water',
        fromCoords: [45, 5],
        toCoords: [83, 11],
      },
      {
        type: 'forest',
        fromCoords: [17, 17],
        toCoords: [28, 23],
      },
      {
        type: 'forest',
        fromCoords: [20, 16],
        toCoords: [26, 17],
      },
      {
        type: 'forest',
        fromCoords: [23, 15],
        toCoords: [25, 16],
      },
      {
        type: 'forest',
        fromCoords: [29, 20],
        toCoords: [30, 23],
      },
      {
        type: 'forest',
        fromCoords: [30, 21],
        toCoords: [31, 22],
      },
      {
        type: 'forest',
        fromCoords: [16, 20],
        toCoords: [17, 21],
      },
      {
        type: 'forest',
        fromCoords: [16, 18],
        toCoords: [17, 20],
      },
      {
        type: 'forest',
        fromCoords: [62, 15],
        toCoords: [68, 19],
      },
      {
        type: 'forest',
        fromCoords: [64, 19],
        toCoords: [67, 20],
      },
      {
        type: 'forest',
        fromCoords: [64, 14],
        toCoords: [66, 15],
      },
      {
        type: 'forest',
        fromCoords: [68, 16],
        toCoords: [69, 18],
      },
      {
        type: 'forest',
        fromCoords: [56, 0],
        toCoords: [64, 1],
      },
      {
        type: 'forest',
        fromCoords: [59, 1],
        toCoords: [63, 2],
      },
      {
        type: 'forest',
        fromCoords: [63, 26],
        toCoords: [68, 27],
      },
      {
        type: 'forest',
        fromCoords: [64, 25],
        toCoords: [66, 26],
      },
      {
        type: 'forest',
        fromCoords: [28, 19],
        toCoords: [29, 23],
      },
      {
        type: 'forest',
        fromCoords: [20, 23],
        toCoords: [28, 24],
      },
      {
        type: 'forest',
        fromCoords: [22, 24],
        toCoords: [25, 25],
      },
    ].concat(
      withBridge
        ? [
            {
              type: 'wood',
              fromCoords: [42, 7],
              toCoords: [45, 9],
            },
          ]
        : [
            {
              type: 'water',
              fromCoords: [42, 7],
              toCoords: [45, 9],
            },
          ]
    ) as MapState['map'],
    discovered: false,
  }
}

const mapZeroOneState: MapState = {
  map: [],
  discovered: false,
}

export function getMapZeroOneState() {
  return mapZeroOneState
}

export function updateMapZeroOneState(
  changes:
    | Partial<typeof mapZeroOneState>
    | ((state: typeof mapZeroOneState) => Partial<typeof mapZeroOneState>)
) {
  if (typeof changes === 'function') {
    Object.assign(mapZeroOneState, changes(mapZeroOneState))
  } else {
    Object.assign(mapZeroOneState, changes)
  }
}

export function drawMapZeroOne() {
  const { map } = getMapZeroOneState()
  drawBackgroundFromMap(map)
}

export function handleMapZeroOneInput() {
  const { map } = getMapZeroOneState()
  const bridgeBlocks = map.filter((block) => block.type === 'wood')
  const restrictedCoords = deriveRestrictedCoordsFromMap(map, '[0,1]')

  handlePlayerMovement(restrictedCoords)
  handleMapZeroOneExit()
  handleBuildBridge()
}

function handleBuildBridge() {
  const { inventory, items } = getGameState()
  const bridgeItemDetails = items.find(
    (item) => item.id === 'bridge-pieces' && item.isUsable
  )
  if (!bridgeItemDetails) throw new Error('Bridge item not generated')

  const bridgeItem = inventory.find((i) => i.itemId === bridgeItemDetails.id)
  if (!bridgeItem) return
  if (!isUsable(bridgeItemDetails)) return

  const { player } = getGameState()
  if (!isPlayerInitialised(player)) return

  const [pCoordsX, pCoordsY] = player.coordinates

  if (isKeyDownEvent(['e', 'enter']) || isButtonDownEvent('buttonA')) {
    if (
      pCoordsX >= 42 &&
      pCoordsX < 45 &&
      pCoordsY === 9 &&
      player.faceDirection === 'up'
    ) {
      bridgeItemDetails.effect()
      updateGameState({
        inventory: inventory.filter((i) => i.itemId !== bridgeItem.itemId),
      })
    }
  }
}

export function handleMapZeroOneExit() {
  const { player, blocksHorizontal, blocksVertical } = getGameState()
  if (!isPlayerInitialised(player)) return

  const [pCoordsX, pCoordsY] = player.coordinates
  if (pCoordsY === blocksVertical - 1) {
    if (
      (isKeyCurrentlyDown(['s', 'arrowdown']) ||
        isButtonCurrentlyDown('dpadDown')) &&
      player.faceDirection === 'down'
    ) {
      updateWildernessState({
        mapId: 0,
      })
      const { discovered } = getMapZeroState()
      if (!discovered) {
        updateMapZeroState({
          discovered: true,
        })
        addNotification(
          'New area discovered! This area has been added to the world map'
        )
      }
      player.goToCoordinates(pCoordsX, 0)
      player.stopMoving()
    }
  }
  if (pCoordsX === blocksHorizontal - 1) {
    if (
      (isKeyCurrentlyDown(['d', 'arrowright']) ||
        isButtonCurrentlyDown('dpadRight')) &&
      player.faceDirection === 'right'
    ) {
      updateWildernessState({
        mapId: '[1,1]',
      })
      const { discovered } = getMapOneOneState()
      if (!discovered) {
        updateMapOneOneState({
          discovered: true,
        })
        addNotification(
          'New area discovered! This area has been added to the world map'
        )
      }
      player.goToCoordinates(0, pCoordsY)
      player.stopMoving()
    }
  }
  if (pCoordsX === 0) {
    if (
      (isKeyCurrentlyDown(['a', 'arrowleft']) ||
        isButtonCurrentlyDown('dpadLeft')) &&
      player.faceDirection === 'left'
    ) {
      updateWildernessState({
        mapId: '[-1,1]',
      })
      const { discovered } = getMapMinusOneOneState()
      if (!discovered) {
        updateMapMinusOneOneState({
          discovered: true,
        })
        addNotification(
          'New area discovered! This area has been added to the world map'
        )
      }
      player.goToCoordinates(blocksHorizontal - 1, pCoordsY)
      player.stopMoving()
    }
  }
  if (pCoordsY === 0) {
    if (
      (isKeyCurrentlyDown(['w', 'arrowup']) ||
        isButtonCurrentlyDown('dpadUp')) &&
      player.faceDirection === 'up'
    ) {
      updateWildernessState({
        mapId: '[0,2]',
      })
      const { discovered } = getMapZeroTwoState()
      if (!discovered) {
        updateMapZeroTwoState({
          discovered: true,
        })
        addNotification(
          'New area discovered! This area has been added to the world map'
        )
      }
      player.goToCoordinates(pCoordsX, blocksVertical - 1)
      player.stopMoving()
    }
  }
}
