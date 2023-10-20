import { generateBackgroundGrid } from './background.js'
import { generatePlayer } from './player.js'

export function generateWorld() {
  generateBackgroundGrid()
  generatePlayer()
}
