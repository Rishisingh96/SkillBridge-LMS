import Notification from "../models/notificationModel.js";
import { emitNotification } from "./socketNotificationService.js";

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
    // Auto-set expiresAt to 15 days from now if not provided
    const expiryDate = expiresAt || (() => {
      const date = new Date();
      date.setDate(date.getDate() + 15);
      return date;
    })();

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

      expiresAt: expiryDate,
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

/**
 * Delete Old Notifications (older than 15 days)
 */
export const deleteOldNotifications = async () => {
  try {
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

    const result = await Notification.deleteMany({
      createdAt: { $lt: fifteenDaysAgo },
    });

    console.log(`Deleted ${result.deletedCount} old notifications (older than 15 days)`);
    return result.deletedCount;
  } catch (error) {
    console.error("Error deleting old notifications:", error);
    throw error;
  }
};