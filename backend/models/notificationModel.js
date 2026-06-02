import mongoose from "mongoose";
import { NOTIFICATION_TYPES } from "../utils/notificationTypes.js";

const notificationSchema = new mongoose.Schema(
  {
    // Recipient
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    recipientRole: {
      type: String,
      enum: ["student", "educator", "admin"],
      required: true,
    },

    // Sender (optional)
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Notification Content
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    // Notification Type
    type: {
      type: String,
      required: true,
      enum: Object.values(NOTIFICATION_TYPES),
    },

    // Category
    category: {
      type: String,
      enum: [
        "course",
        "module",
        "lecture",
        "quiz",
        "assignment",
        "certificate",
        "live_class",
        "discussion",
        "review",
        "payment",
        "user",
        "admin",
        "security",
        "promotion",
        "system",
      ],
      default: "system",
    },

    // Frontend Redirect URL
    actionUrl: {
      type: String,
      default: "",
    },

    // Related Resource
    resourceType: {
      type: String,
      enum: [
        "course",
        "module",
        "lecture",
        "quiz",
        "assignment",
        "certificate",
        "review",
        "payment",
        "live_class",
        "user",
      ],
      default: null,
    },

    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    // Read Status
    isRead: {
      type: Boolean,
      default: false,
    },

    readAt: {
      type: Date,
      default: null,
    },

    // Notification Channels
    channels: {
      inApp: {
        type: Boolean,
        default: true,
      },

      email: {
        type: Boolean,
        default: false,
      },

      push: {
        type: Boolean,
        default: false,
      },

      sms: {
        type: Boolean,
        default: false,
      },
    },

    // Delivery Tracking
    deliveryStatus: {
      inApp: {
        type: String,
        enum: ["pending", "sent", "failed"],
        default: "sent",
      },

      email: {
        type: String,
        enum: ["pending", "sent", "failed"],
        default: "pending",
      },

      push: {
        type: String,
        enum: ["pending", "sent", "failed"],
        default: "pending",
      },

      sms: {
        type: String,
        enum: ["pending", "sent", "failed"],
        default: "pending",
      },
    },

    // Priority
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },

    // Additional Dynamic Data
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // Expiry Support
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/* ========================================
   INDEXES
======================================== */

notificationSchema.index({
  recipient: 1,
  isRead: 1,
  createdAt: -1,
});

notificationSchema.index({
  recipient: 1,
  createdAt: -1,
});

notificationSchema.index({
  type: 1,
});

notificationSchema.index({
  category: 1,
});

notificationSchema.index({
  priority: 1,
});

notificationSchema.index({
  createdAt: -1,
});

/* ========================================
   TTL INDEX
======================================== */

notificationSchema.index(
  { expiresAt: 1 },
  {
    expireAfterSeconds: 0,
  }
);

const Notification = mongoose.model(
  "Notification",
  notificationSchema
);

export default Notification;