import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/connectDB.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";

// Routes
import authRouter from "./routes/authRoute.js";
import userRouter from "./routes/userRoute.js";
import courseRoute from "./routes/courseRoute.js";
import paymentRouter from "./routes/paymentRoute.js";
import reviewRoter from "./routes/reviewRoute.js";
import adminRouter from "./routes/adminRoute.js";
import couponRouter from "./routes/coupon.routes.js";
import enrollmentRouter from "./routes/enrollmentRoute.js";
import notification from "./routes/notificationRoutes.js"
import certificateRouter from "./routes/certificateRoute.js"
import blogRouter from "./routes/blogRoute.js"
import seoRouter from "./routes/seoRoute.js"

// Socket
import { initializeSocketServer } from "./sockets/index.js";
import { initializeSocket } from "./service/socketNotificationService.js";

// Notification Cleanup
import { deleteOldNotifications } from "./service/notificationService.js";

// Models
import "./models/moduleModel.js";
import "./models/lectureModel.js";
import "./models/blogCategoryModel.js";
import "./models/blogCourseModel.js";
import "./models/blogModelModel.js";
import "./models/blogTopicModel.js";

// Middleware
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

// ======================================
// MIDDLEWARES
// ======================================
app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ======================================
// ROUTES
// ======================================

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/course", courseRoute);
app.use("/api/order", paymentRouter);
app.use("/api/review", reviewRoter);
app.use("/api/admin", adminRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/enrollment", enrollmentRouter);
app.use("/api/notification", notification)
app.use("/api/certificate", certificateRouter)
app.use("/", seoRouter)
app.use("/api/blog", blogRouter)


// ======================================
// HEALTH CHECK
// ======================================

app.get("/", (req, res) => {
  res.send("Hello from Server");
});

// ======================================
// ERROR HANDLER
// ======================================

app.use(errorHandler);

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