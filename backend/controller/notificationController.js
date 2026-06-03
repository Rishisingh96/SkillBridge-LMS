import Notification from "../models/notificationModel.js";

// ========================================
// GET MY NOTIFICATIONS
// ========================================

export const getMyNotifications = async (
  req,
  res
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const skip = (page - 1) * limit;

    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

    const notifications =
      await Notification.find({
        recipient: req.userId,
        createdAt: { $gte: fifteenDaysAgo },
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total =
      await Notification.countDocuments({
        recipient: req.userId,
        createdAt: { $gte: fifteenDaysAgo },
      });

    return res.status(200).json({
      success: true,
      notifications,

      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
};

// ========================================
// GET UNREAD COUNT
// ========================================

export const getUnreadCount = async (
  req,
  res
) => {
  try {
    const count =
      await Notification.countDocuments({
        recipient: req.userId,
        isRead: false,
      });

    return res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to get unread count",
    });
  }
};

// ========================================
// MARK SINGLE AS READ
// ========================================

export const markAsRead = async (
  req,
  res
) => {
  try {
    const { notificationId } = req.params;

    const notification =
      await Notification.findOneAndUpdate(
        {
          _id: notificationId,
          recipient: req.userId,
        },
        {
          isRead: true,
          readAt: new Date(),
        },
        {
          new: true,
        }
      );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      notification,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to mark notification",
    });
  }
};

// ========================================
// MARK ALL AS READ
// ========================================

export const markAllAsRead = async (
  req,
  res
) => {
  try {
    await Notification.updateMany(
      {
        recipient: req.userId,
        isRead: false,
      },
      {
        isRead: true,
        readAt: new Date(),
      }
    );

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to mark notifications",
    });
  }
};

// ========================================
// DELETE ONE
// ========================================

export const deleteNotification =
  async (req, res) => {
    try {
      const { notificationId } = req.params;

      const notification =
        await Notification.findOneAndDelete({
          _id: notificationId,
          recipient: req.userId,
        });

      if (!notification) {
        return res.status(404).json({
          success: false,
          message: "Notification not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Notification deleted",
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message:
          "Failed to delete notification",
      });
    }
  };

// ========================================
// DELETE ALL
// ========================================

export const deleteAllNotifications =
  async (req, res) => {
    try {
      await Notification.deleteMany({
        recipient: req.userId,
      });

      return res.status(200).json({
        success: true,
        message:
          "All notifications deleted",
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message:
          "Failed to delete notifications",
      });
    }
  };