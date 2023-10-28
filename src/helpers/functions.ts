import { updateMessageState } from '../state.js'

export function generateSlug(name: string) {
  return name.toLowerCase().replace(' ', '-')
}

export function getOppositeDirection(
  direction: 'up' | 'left' | 'down' | 'right'
) {
  switch (direction) {
    case 'up':
      return 'down'
    case 'left':
      return 'right'
    case 'down':
      return 'up'
    case 'right':
      return 'left'
  }
}

export function calculateDamage(
  attackersAttack: number,
  defendersDefense: number,
  damage: number
) {
  const isAttackerStronger = attackersAttack > defendersDefense
  const diff = Math.abs(attackersAttack - defendersDefense)
  const randomExtra = Math.floor(Math.random() * diff)

  const critMultiplier = Math.random() < 0.1 ? 1.5 : 1

  const modifiedDamage = isAttackerStronger
    ? damage * critMultiplier + randomExtra
    : damage * critMultiplier - randomExtra

  return {
    damage: Math.floor(modifiedDamage > 0 ? modifiedDamage : 0),
    isCrit: critMultiplier === 1.5,
  }
}

const levelMultiplier = 1.25
const maxLevel = 35
const baseExperience = 100

export function calculateLevelFromExperience(experience: number) {
  let level = 1
  let experienceNeeded = baseExperience

  while (experience >= experienceNeeded) {
    level++
    experienceNeeded = Math.floor(
      experienceNeeded * levelMultiplier + baseExperience
    )
  }
  if (level > maxLevel) return maxLevel

  return level
}

export function calculateExperienceFromLevel(level: number) {
  let experience = baseExperience
  for (let i = 1; i < level; i++) {
    experience = Math.floor(experience * levelMultiplier + baseExperience)
  }
  return experience
}

export function calculateExperienceGainedFromBattle(
  playerLevel: number,
  enemyLevel: number
) {
  const defaultExperience = calculateExperienceFromLevel(enemyLevel) / 10
  const levelDifference = enemyLevel - playerLevel
  // if player is higher leveled, remove experience for each level difference, and vice versa
  const experience =
    defaultExperience + (levelDifference * defaultExperience) / 10

  if (experience < 0) return 0
  return Math.floor(experience)
}
