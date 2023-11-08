import {
  getCoordsFromXAndYValues,
  getXAndYValuesFromCoords,
} from '../helpers/coordinates.js'
import {
  isKeyCurrentlyDown,
  isKeyDownEvent,
  isMouseDownEvent,
  isMouseUpEvent,
} from '../input.js'
import {
  BlockType,
  getBlockPropertiesFromName,
  getBlockTypeState,
  getCanvasState,
  getGameState,
  getInputState,
  isInitialised,
} from '../state.js'
import { generateMapZeroThreeDesign } from '../wilderness-maps/map-[0,3].js'
import { MapState, drawBackgroundFromMap } from '../wilderness.js'

interface BuilderState extends MapState {
  currentType: BlockType['name']
  fillFromCoords: [number, number] | null
  fillToCoords: [number, number] | null
  isDragging: boolean
}

const builderState: BuilderState = {
  map: generateMapZeroThreeDesign(),
  discovered: true,
  currentType: 'water',
  fillFromCoords: null,
  fillToCoords: null,
  isDragging: false,
}

export function getBuilderState() {
  return builderState
}

export function updateBuilderState(
  changes:
    | Partial<typeof builderState>
    | ((state: typeof builderState) => Partial<typeof state>)
) {
  if (typeof changes === 'function') {
    Object.assign(builderState, changes(builderState))
  } else {
    Object.assign(builderState, changes)
  }
}

export function handleMapCreatorInput() {
  const { verticalOffset, scale } = getCanvasState()
  const { blockSize, blocksHorizontal, blocksVertical } = getGameState()
  const { map, fillFromCoords, fillToCoords, isDragging } = getBuilderState()
  const { blockTypes } = getBlockTypeState()

  if (isMouseDownEvent()) {
    const { mouseX, mouseY } = getInputState()
    if (isKeyCurrentlyDown(['control', 'command'])) {
      for (let i = 0; i < blockTypes.length; i++) {
        const { name } = blockTypes[i]
        if (
          mouseX >= 20 &&
          mouseX <= 80 &&
          mouseY >= 20 + 60 * i + verticalOffset / 2 &&
          mouseY <= 70 + 60 * i + verticalOffset / 2
        ) {
          updateBuilderState((c) => ({
            ...c,
            currentType: name,
          }))
        }
      }
    } else {
      const [xCoord, yCoord] = getCoordsFromXAndYValues(
        mouseX,
        mouseY,
        blockSize,
        verticalOffset,
        scale
      )

      if (
        xCoord >= 0 &&
        yCoord >= 0 &&
        xCoord < blocksHorizontal &&
        yCoord < blocksVertical
      ) {
        updateBuilderState({
          fillFromCoords: [xCoord, yCoord],
          fillToCoords: [xCoord + 1, yCoord + 1],
          isDragging: true,
        })
      }
    }
  }

  if (isDragging) {
    const { mouseX, mouseY } = getInputState()
    const [xCoord, yCoord] = getCoordsFromXAndYValues(
      mouseX,
      mouseY,
      blockSize,
      verticalOffset,
      scale
    )

    if (
      xCoord >= 0 &&
      yCoord >= 0 &&
      xCoord < blocksHorizontal &&
      yCoord < blocksVertical
    ) {
      if (
        (fillFromCoords?.[0] ?? 0) < xCoord + 1 &&
        (fillFromCoords?.[1] ?? 0) < yCoord + 1
      ) {
        updateBuilderState({
          fillToCoords: [xCoord + 1, yCoord + 1],
        })
      } else {
        updateBuilderState({
          fillToCoords: null,
        })
      }
    }
  }

  if (isMouseUpEvent()) {
    if (!isKeyCurrentlyDown(['control', 'command'])) {
      const areFillFromCoordsWithinRange =
        fillFromCoords &&
        fillFromCoords?.[0] >= 0 &&
        fillFromCoords?.[1] >= 0 &&
        fillFromCoords?.[0] < blocksHorizontal &&
        fillFromCoords?.[1] < blocksVertical
      const areFillToCoordsWithinRange =
        fillToCoords &&
        fillToCoords?.[0] > 0 &&
        fillToCoords?.[1] > 0 &&
        fillToCoords?.[0] <= blocksHorizontal &&
        fillToCoords?.[1] <= blocksVertical
      const areFillCoordsWithinRange =
        areFillFromCoordsWithinRange && areFillToCoordsWithinRange

      if (!areFillCoordsWithinRange) {
        updateBuilderState((c) => ({
          ...c,
          fillFromCoords: null,
          fillToCoords: null,
          isDragging: false,
        }))
      } else {
        // check if any blocks are in range by seeing if the block overlaps in any way with the fill coords
        const blocksInRange = map.filter((block) => {
          const [x1, y1] = block.fromCoords
          const [x2, y2] = block.toCoords
          const [x3, y3] = fillFromCoords!
          const [x4, y4] = fillToCoords!
          return (
            Math.max(x1, x3) < Math.min(x2, x4) &&
            Math.max(y1, y3) < Math.min(y2, y4)
          )
        })

        const newBlock: MapState['map'][number] = {
          type: builderState.currentType,
          fromCoords: [fillFromCoords?.[0] ?? 0, fillFromCoords?.[1] ?? 0],
          toCoords: [fillToCoords?.[0] ?? 0, fillToCoords?.[1] ?? 0],
        }

        updateBuilderState((c) => ({
          ...c,
          map:
            blocksInRange.length > 0
              ? [
                  ...c.map.filter((block) => {
                    const [x1, y1] = block.fromCoords
                    const [x2, y2] = block.toCoords
                    const [x3, y3] = c.fillFromCoords!
                    const [x4, y4] = c.fillToCoords!
                    return !(
                      Math.max(x1, x3) < Math.min(x2, x4) &&
                      Math.max(y1, y3) < Math.min(y2, y4)
                    )
                  }),
                  newBlock,
                ].filter((block) => block.type !== 'grass')
              : [...c.map, newBlock].filter((block) => block.type !== 'grass'),
          fillFromCoords: null,
          fillToCoords: null,
          isDragging: false,
        }))
      }
    }
  }

  if (isKeyDownEvent('c')) {
    if (isKeyCurrentlyDown(['control', 'command'])) {
      if (window.navigator) {
        navigator.clipboard.writeText(JSON.stringify(map))
      }
    }
  }
}

export function drawMapCreator() {
  const { ctx } = getCanvasState()
  if (!isInitialised(ctx)) return
  const { map } = getBuilderState()
  drawBackgroundFromMap(map)

  if (isKeyCurrentlyDown(['control', 'command'])) {
    drawBlockTypeSelector()
  } else {
    drawCurrentPaintedBlock()
  }
}

function drawCurrentPaintedBlock() {
  const { ctx, scale, verticalOffset } = getCanvasState()
  if (!isInitialised(ctx)) return
  const { currentType, isDragging } = getBuilderState()

  const { blockSize } = getGameState()
  const { mouseX, mouseY } = getInputState()
  const [xCoord, yCoord] = getCoordsFromXAndYValues(
    mouseX,
    mouseY,
    blockSize,
    verticalOffset,
    scale
  )
  const [xValue, yValue] = getXAndYValuesFromCoords(
    xCoord,
    yCoord,
    blockSize,
    scale
  )

  const { colour } = getBlockPropertiesFromName(currentType)

  ctx.fillStyle = colour
  ctx.strokeStyle = 'white'
  ctx.lineWidth = 3
  if (!isDragging) {
    ctx.fillRect(
      xValue,
      yValue + verticalOffset / 2,
      blockSize * scale,
      blockSize * scale
    )
    ctx.strokeRect(
      xValue,
      yValue + verticalOffset / 2,
      blockSize * scale,
      blockSize * scale
    )
  }

  const { fillFromCoords, fillToCoords } = getBuilderState()

  if (fillFromCoords && fillToCoords) {
    const [x1, y1] = getXAndYValuesFromCoords(
      fillFromCoords[0],
      fillFromCoords[1],
      blockSize,
      scale
    )
    const [x2, y2] = getXAndYValuesFromCoords(
      fillToCoords[0],
      fillToCoords[1],
      blockSize,
      scale
    )
    ctx.fillRect(x1, y1 + verticalOffset / 2, x2 - x1, y2 - y1)
    ctx.strokeRect(x1, y1 + verticalOffset / 2, x2 - x1, y2 - y1)
  }

  ctx.fillStyle = 'white'
  ctx.font = '16px serif'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.fillText(`[${xCoord}, ${yCoord}]`, 10, 20)
}

function drawBlockTypeSelector() {
  const { ctx, height, verticalOffset } = getCanvasState()
  if (!isInitialised(ctx)) return
  const { blockTypes } = getBlockTypeState()
  const { mouseX, mouseY } = getInputState()

  ctx.fillStyle = 'white'

  ctx.fillRect(10, 10 + verticalOffset / 2, 80, height - verticalOffset - 20)

  for (let i = 0; i < blockTypes.length; i++) {
    const { colour } = blockTypes[i]
    ctx.fillStyle = colour
    if (
      mouseX >= 20 &&
      mouseX <= 80 &&
      mouseY >= 20 + 60 * i + verticalOffset / 2 &&
      mouseY <= 70 + 60 * i + verticalOffset / 2
    ) {
      ctx.strokeStyle = 'black'
      ctx.lineWidth = 2
      ctx.strokeRect(20, 20 + 60 * i + verticalOffset / 2, 60, 50)
    }
    ctx.fillRect(20, 20 + 60 * i + verticalOffset / 2, 60, 50)
  }
}
