import { battleState, gameState, updateBattleState } from './state.js'

export class Enemy {
  id: number
  name: string
  maxHealth: number
  prevHealth: number
  currentHealth: number
  currentDamage: number
  x: number
  y: number

  constructor(
    id: number,
    name: string,
    maxHealth: number,
    x: number,
    y: number
  ) {
    this.id = id
    this.name = name
    this.prevHealth = maxHealth
    this.maxHealth = maxHealth
    this.currentHealth = maxHealth
    this.currentDamage = 0
    this.x = x
    this.y = y
  }

  public takeDamage() {
    const { state } = gameState
    const { state: bState } = battleState
    const { deltaTime, status } = state
    if (!this.currentDamage) return

    if (status !== 'inactive') {
      const deltaFrames = deltaTime / (1000 / 60)
      if (this.currentHealth <= this.prevHealth - this.currentDamage) {
        const newHealth = this.prevHealth - this.currentDamage
        this.currentHealth = newHealth
        this.prevHealth = newHealth
        this.currentDamage = 0
        updateBattleState({
          lastMove: 'player',
          status: 'wait',
          waitLengthMs: 1000,
          waitStart: Date.now(),
        })
      } else {
        this.currentHealth -= 0.5 * deltaFrames
      }
    }
  }

  public takeHit(damage: number) {
    this.currentDamage = damage
  }

  public hitPlayer(damage: number) {
    const { state } = gameState
    const { state: bState } = battleState
    if (
      state.status !== 'inactive' &&
      !battleState.isWaiting &&
      bState.lastMove === 'player' &&
      bState.status === 'play' &&
      state.player.currentDamage === 0
    ) {
      state.player.takeHit(damage)
    }
  }

  get coordinates() {
    const { state } = gameState
    const { blockSize } = state

    return [Math.ceil(this.x / blockSize), Math.ceil(this.y / blockSize)]
  }
}
