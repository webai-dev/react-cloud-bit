export const getUnseenNotifications = (state, itemId, itemType) => {
  return state.notifications.team.list
    .filter(notification => {
      if (!notification.payload) return;

      const { shareable } = notification.payload;
      return shareable && shareable.id === itemId && notification.type === 'share.' + itemType;
    })
    .filter(
      notification =>
        !!state.notifications.team.unread_notifications.find(
          unread => unread.id === notification.id
        )
    );
};
