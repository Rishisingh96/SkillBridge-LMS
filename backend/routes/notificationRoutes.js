import express from "express";

import {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
} from "../controller/notificationController.js";

import isAuth from "../middleware/isAuth.js";

const router = express.Router();

router.get(
  "/",
  isAuth,
  getMyNotifications
);

router.get(
  "/unread-count",
  isAuth,
  getUnreadCount
);

router.patch(
  "/:notificationId/read",
  isAuth,
  markAsRead
);

router.patch(
  "/read-all",
  isAuth,
  markAllAsRead
);

router.delete(
  "/:notificationId",
  isAuth,
  deleteNotification
);

router.delete(
  "/",
  isAuth,
  deleteAllNotifications
);

// Test route commented out - createNotification function not implemented
// router.post("/test", async (req, res) => {
//   try {
//     const notification = await createNotification(req.body);
//     res.status(201).json({
//       success: true,
//       notification,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// });

export default router;