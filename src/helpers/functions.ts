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
