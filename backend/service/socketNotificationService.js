let ioInstance = null;

/**
 * Initialize Socket.IO
 */
export const initializeSocket = (io) => {
  ioInstance = io;
};

/**
 * Get Socket Instance
 */
export const getIO = () => {
  if (!ioInstance) {
    throw new Error(
      "Socket.IO not initialized"
    );
  }

  return ioInstance;
};

/**
 * Emit Notification
 */
export const emitNotification = (
  userId,
  notification
) => {
  if (!ioInstance) return;

  ioInstance
    .to(`user:${userId}`)
    .emit(
      "new-notification",
      notification
    );
};

/**
 * Emit Unread Count
 */
export const emitUnreadCount = (
  userId,
  count
) => {
  if (!ioInstance) return;

  ioInstance
    .to(`user:${userId}`)
    .emit(
      "unread-count",
      count
    );
};