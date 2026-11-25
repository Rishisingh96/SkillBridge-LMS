import http from "http";
import dotenv from "dotenv";
import connectDb from "./config/connectDB.js";
import app from "./app.js";

// Socket
import { initializeSocketServer } from "./sockets/index.js";
import { initializeSocket } from "./service/socketNotificationService.js";

// Notification Cleanup
import { deleteOldNotifications } from "./service/notificationService.js";

dotenv.config();

const port = process.env.PORT || 8000;

// ======================================
// HTTP SERVER
// ======================================
const server = http.createServer(app);

// ======================================
// SOCKET.IO
// ======================================
const io = initializeSocketServer(server);
initializeSocket(io);

// START SERVER
server.listen(port, async () => {
  try {
    await connectDb();
    console.log(`🚀 Server running on port ${port}`);

    // Run cleanup once on server startup (after DB is connected)
    try {
      await deleteOldNotifications();
    } catch (error) {
      console.error("Failed to delete old notifications on startup:", error);
    }

    // Run notification cleanup once daily (every 24 hours)
    // Delete notifications older than 15 days
    setInterval(async () => {
      try {
        await deleteOldNotifications();
      } catch (error) {
        console.error("Failed to delete old notifications:", error);
      }
    }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
  } catch (error) {
    console.error("Database Connection Failed:", error);
  }
});
