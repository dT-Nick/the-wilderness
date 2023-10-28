import { getCanvasState, getNotificationState, isInitialised } from './state.js'

export function drawNotifications() {
  const { ctx, verticalOffset, scale } = getCanvasState()
  if (!isInitialised(ctx)) return
  const { notifications } = getNotificationState()
  const notificationHeight = 20 * scale
  const notificationPadding = 5 * scale
  const notificationX = notificationPadding
  const notificationY = notificationPadding + verticalOffset / 2
  ctx.font = `bold ${14 * scale}px Arial`
  ctx.shadowColor = 'black'
  ctx.shadowBlur = 7
  ctx.fillStyle = 'yellow'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'

  notifications.forEach((notification, i) => {
    const notificationYOffset = notificationHeight * i
    ctx.fillText(
      notification.text,
      notificationX + notificationPadding,
      notificationY + notificationYOffset + notificationPadding
    )
  })

  ctx.shadowBlur = 0
}
