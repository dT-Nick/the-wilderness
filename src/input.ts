import {
  constants,
  getCanvasState,
  getInputState,
  getPrevInputState,
  getWildernessState,
  updateGameState,
} from './state.js'
import { handleMapZeroInput } from './wilderness-maps/map-0.js'

export function handleStartMenuInput() {
  const { width, height } = getCanvasState()
  const { mouseX, mouseY } = getInputState()
  const { startMenuButtonSize } = constants
  const mouseDownEvent = isMouseDownEvent()

  if (mouseDownEvent) {
    if (
      mouseX > width / 2 - startMenuButtonSize / 2 &&
      mouseX < width / 2 + startMenuButtonSize / 2 &&
      mouseY > height / 2 - startMenuButtonSize / 2 &&
      mouseY < height / 2 + startMenuButtonSize / 2
    ) {
      updateGameState({
        status: 'wilderness',
      })
    }
  }
}

export function handleWildernessInput() {
  const { mapId } = getWildernessState()

  switch (mapId) {
    case 0: {
      handleMapZeroInput()
      break
    }
    default: {
      throw new Error(`Unknown mapId: ${mapId}`)
    }
  }
}

// export function handleInput() {
//   const { state } = gameState
//   const {
//     status,
//     mouseDown,
//     mouseX,
//     mouseY,
//     width,
//     verticalOffset,
//     scale,
//     player,
//     keysDown,
//     prevMouseDown,
//     blockSize,
//     deltaTime,
//   } = state

//   if (mouseDown && !prevMouseDown) {
//     if (mouseX > width - 54 * scale && mouseX < width - 5 * scale) {
//       if (
//         mouseY > 5 * scale + verticalOffset / 2 &&
//         mouseY < 54 * scale + verticalOffset / 2
//       ) {
//         return true
//       }
//     }

//     updateState({
//       prevMouseDown: true,
//     })
//   }

//   if (!mouseDown && prevMouseDown) {
//     updateState({
//       prevMouseDown: false,
//     })
//   }

//   return false
// }

// export function handleBattleInput() {
//   const { state } = gameState
//   const { state: bState } = battleState
//   const { keysDown, prevKeysDown } = state
//   const isWaiting = battleState.isWaiting
//   if (state.status !== 'inactive' && !isWaiting) {
//     if (isKeyPressed(['arrowup', 'w'])) {
//       if (bState.selectedMove !== 1 && bState.selectedMove !== 2) {
//         updateBattleState({
//           selectedMove: bState.selectedMove === 3 ? 1 : 2,
//         })
//       }
//     }
//     if (isKeyPressed(['arrowdown', 's'])) {
//       if (bState.selectedMove !== 3 && bState.selectedMove !== 4) {
//         updateBattleState({
//           selectedMove: bState.selectedMove === 1 ? 3 : 4,
//         })
//       }
//     }
//     if (isKeyPressed(['arrowleft', 'a'])) {
//       if (bState.selectedMove !== 1 && bState.selectedMove !== 3) {
//         updateBattleState({
//           selectedMove: bState.selectedMove === 2 ? 1 : 3,
//         })
//       }
//     }
//     if (isKeyPressed(['arrowright', 'd'])) {
//       if (bState.selectedMove !== 2 && bState.selectedMove !== 4) {
//         updateBattleState({
//           selectedMove: bState.selectedMove === 1 ? 2 : 4,
//         })
//       }
//     }

//     if (isKeyPressed('enter')) {
//       if (bState.selectedMove === 1) {
//         state.enemy.takeHit(10)
//       }
//       if (bState.selectedMove === 2) {
//         state.enemy.takeHit(20)
//       }
//       if (bState.selectedMove === 3) {
//         state.enemy.takeHit(30)
//       }
//       if (bState.selectedMove === 4) {
//         state.enemy.takeHit(40)
//       }
//     }
//   }
// }

export function isKeyDownEvent(key: string | Array<string>) {
  const { keysDown } = getInputState()
  const { keysDown: prevKeysDown } = getPrevInputState()

  if (Array.isArray(key)) {
    return key.some(
      (k) =>
        keysDown.some((kD) => kD.key === k) &&
        !prevKeysDown.some((kD) => kD.key === k)
    )
  }

  return (
    keysDown.some((kD) => kD.key === key) &&
    !prevKeysDown.some((kD) => kD.key === key)
  )
}

export function isKeyUpEvent(key: string | Array<string>) {
  const { keysDown } = getInputState()
  const { keysDown: prevKeysDown } = getPrevInputState()

  if (Array.isArray(key)) {
    return key.some(
      (k) =>
        !keysDown.some((kD) => kD.key === k) &&
        prevKeysDown.some((kD) => kD.key === k)
    )
  }

  return (
    !keysDown.some((kD) => kD.key === key) &&
    prevKeysDown.some((kD) => kD.key === key)
  )
}

export function isMouseUpEvent() {
  const { mouse } = getInputState()
  const { mouse: prevMouse } = getPrevInputState()

  return !mouse.isDown && prevMouse.isDown
}

export function isMouseDownEvent() {
  const { mouse } = getInputState()
  const { mouse: prevMouse } = getPrevInputState()

  return mouse.isDown && !prevMouse.isDown
}

export function isHoveringOn(
  startX: number,
  startY: number,
  width: number,
  height: number
) {
  const { mouseX, mouseY } = getInputState()

  return (
    mouseX >= startX &&
    mouseX <= startX + width &&
    mouseY >= startY &&
    mouseY <= startY + height
  )
}
