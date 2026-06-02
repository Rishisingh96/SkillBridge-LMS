import Notification from "../models/notificationModel.js";

/**
 * Create Single Notification
 */
export const createNotification = async ({
  recipient,
  recipientRole,

  sender = null,

  title,
  message,

  type,
  category = "system",

  actionUrl = "",

  resourceType = null,
  resourceId = null,

  metadata = {},

  priority = "medium",

  channels = {
    inApp: true,
    email: false,
    push: false,
    sms: false,
  },

  expiresAt = null,
}) => {
  try {
    const notification = await Notification.create({
      recipient,
      recipientRole,

      sender,

      title,
      message,

      type,
      category,

      actionUrl,

      resourceType,
      resourceId,

      metadata,

      priority,

      channels,

      expiresAt,
    });

    // 🔴 Real-time socket emit
    emitNotification(
      notification.recipient.toString(),
      notification
    );

    return notification;
  } catch (error) {
    console.error(
      "Create Notification Error:",
      error
    );

    throw error;
  }
};


//   Create Multiple Notifications 
export const createBulkNotifications =
  async (notifications) => {
    try {
      return await Notification.insertMany(
        notifications
      );
    } catch (error) {
      console.error(
        "Bulk Notification Error:",
        error
      );

      throw error;
    }
  };


//  Get User Notifications
export const getUserNotifications =
  async ({
    userId,
    page = 1,
    limit = 20,
  }) => {
    const skip = (page - 1) * limit;

    const notifications =
      await Notification.find({
        recipient: userId,
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total =
      await Notification.countDocuments({
        recipient: userId,
      });

    return {
      notifications,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  };

/**
 * Get Unread Count
 */
export const getUnreadCount =
  async (userId) => {
    return await Notification.countDocuments({
      recipient: userId,
      isRead: false,
    });
  };



/**
 * Mark One Notification Read
 */
export const markNotificationRead =
  async (notificationId) => {
    return await Notification.findByIdAndUpdate(
      notificationId,
      {
        isRead: true,
        readAt: new Date(),
      },
      { new: true }
    );
  };



/**
 * Mark All Notifications Read
 */
export const markAllNotificationsRead =
  async (userId) => {
    return await Notification.updateMany(
      {
        recipient: userId,
        isRead: false,
      },
      {
        isRead: true,
        readAt: new Date(),
      }
    );
  };


  
/**
 * Delete Notification
 */
export const deleteNotification =
  async (notificationId) => {
    return await Notification.findByIdAndDelete(
      notificationId
    );
  };

/**
 * Delete All Notifications
 */
export const deleteAllNotifications =
  async (userId) => {
    return await Notification.deleteMany({
      recipient: userId,
    });
  };