import { isKeyCurrentlyDown, isButtonCurrentlyDown } from '../input.js'
import {
  addNotification,
  getCurrentMap,
  getGameState,
  getMapsState,
  isPlayerInitialised,
  updateGameState,
  updateMapsState,
} from '../state.js'

export function handleMapExit() {
  const currentMap = getCurrentMap()
  const { maps } = getMapsState()

  const { player, blocksHorizontal, blocksVertical } = getGameState()
  if (!isPlayerInitialised(player)) return

  const [pCoordsX, pCoordsY] = player.coordinates
  if (pCoordsY === blocksVertical - 1) {
    if (
      (isKeyCurrentlyDown(['s', 'arrowdown']) ||
        isButtonCurrentlyDown('dpadDown')) &&
      player.faceDirection === 'down'
    ) {
      if (currentMap.id === '[0,0]') {
        updateGameState({
          status: 'settlement',
        })
        updateMapsState({
          currentMapId: 'settlement',
        })
      } else {
        const [mapX, mapY] = currentMap.id
          .replace(/\[|\]/g, '')
          .split(',')
          .map(Number)
        const newMap = maps.find((m) => m.id === `[${mapX},${mapY - 1}]`)
        if (!newMap) return
        if (!newMap.isDiscovered) {
          addNotification(
            'New area discovered! This area has been added to the world map'
          )
        }
        updateMapsState((c) => ({
          currentMapId: newMap.id,
          maps: c.maps.map((m) => {
            if (m.id === newMap.id) {
              return {
                ...m,
                isDiscovered: true,
              }
            }
            return m
          }),
        }))
      }
      player.goToCoordinates(player.coordinates[0], 0)
      player.stopMoving()
    }
  }

  if (pCoordsX === 0) {
    if (
      (isKeyCurrentlyDown(['a', 'arrowleft']) ||
        isButtonCurrentlyDown('dpadLeft')) &&
      player.faceDirection === 'left'
    ) {
      const [mapX, mapY] = currentMap.id
        .replace(/\[|\]/g, '')
        .split(',')
        .map(Number)
      const newMap = maps.find((m) => m.id === `[${mapX - 1},${mapY}]`)
      console.log(newMap)
      if (!newMap) return
      if (!newMap.isDiscovered) {
        addNotification(
          'New area discovered! This area has been added to the world map'
        )
      }
      updateMapsState((c) => ({
        currentMapId: newMap.id,
        maps: c.maps.map((m) => {
          console.log(m.id, newMap.id)
          if (m.id === newMap.id) {
            console.log('okay...')
            return {
              ...m,
              isDiscovered: true,
            }
          }
          return m
        }),
      }))
      player.goToCoordinates(blocksHorizontal - 1, player.coordinates[1])
      player.stopMoving()
    }
  }

  if (pCoordsY === 0) {
    if (
      (isKeyCurrentlyDown(['w', 'arrowup']) ||
        isButtonCurrentlyDown('dpadUp')) &&
      player.faceDirection === 'up'
    ) {
      const [mapX, mapY] = currentMap.id
        .replace(/\[|\]/g, '')
        .split(',')
        .map(Number)
      const newMap = maps.find((m) => m.id === `[${mapX},${mapY + 1}]`)
      if (!newMap) return
      if (!newMap.isDiscovered) {
        addNotification(
          'New area discovered! This area has been added to the world map'
        )
      }
      updateMapsState((c) => ({
        currentMapId: newMap.id,
        maps: c.maps.map((m) => {
          if (m.id === newMap.id) {
            return {
              ...m,
              isDiscovered: true,
            }
          }
          return m
        }),
      }))
      player.goToCoordinates(player.coordinates[0], blocksVertical - 1)
      player.stopMoving()
    }
  }

  if (pCoordsX === blocksHorizontal - 1) {
    if (
      (isKeyCurrentlyDown(['d', 'arrowright']) ||
        isButtonCurrentlyDown('dpadRight')) &&
      player.faceDirection === 'right'
    ) {
      const [mapX, mapY] = currentMap.id
        .replace(/\[|\]/g, '')
        .split(',')
        .map(Number)
      const newMap = maps.find((m) => m.id === `[${mapX + 1},${mapY}]`)
      if (!newMap) return
      if (!newMap.isDiscovered) {
        addNotification(
          'New area discovered! This area has been added to the world map'
        )
      }
      updateMapsState((c) => ({
        currentMapId: newMap.id,
        maps: c.maps.map((m) => {
          if (m.id === newMap.id) {
            return {
              ...m,
              isDiscovered: true,
            }
          }
          return m
        }),
      }))
      player.goToCoordinates(0, player.coordinates[1])
      player.stopMoving()
    }
  }
}
