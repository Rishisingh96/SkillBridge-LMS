import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

// Routes
import authRouter from "./routes/authRoute.js";
import userRouter from "./routes/userRoute.js";
import courseRoute from "./routes/courseRoute.js";
import paymentRouter from "./routes/paymentRoute.js";
import reviewRoter from "./routes/reviewRoute.js";
import adminRouter from "./routes/adminRoute.js";
import couponRouter from "./routes/coupon.routes.js";
import enrollmentRouter from "./routes/enrollmentRoute.js";
import notification from "./routes/notificationRoutes.js";
import certificateRouter from "./routes/certificateRoute.js";
import blogRouter from "./routes/blogRoute.js";
import seoRouter from "./routes/seoRoute.js";
import chatbotRouter from "./routes/chatbotRoute.js";

// Models (preload schemas)
import "./models/moduleModel.js";
import "./models/lectureModel.js";
import "./models/blogCategoryModel.js";
import "./models/blogCourseModel.js";
import "./models/blogModelModel.js";
import "./models/blogTopicModel.js";
import "./models/chatboatModel.js";

// Middleware
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [process.env.FRONTEND_URL, "http://localhost:5173", "https://skillbridgelearnbyrishi.vercel.app"],
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
app.use("/api/notification", notification);
app.use("/api/certificate", certificateRouter);
app.use("/", seoRouter);
app.use("/api/blog", blogRouter);
app.use("/api/chatbot", chatbotRouter);

// HEALTH CHECK
app.get("/", (req, res) => {
  res.send("Hello from Server");
});

// ======================================
// ERROR HANDLER
// ======================================
app.use(errorHandler);

export default app;
