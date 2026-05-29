# Purchase History Implementation Guide

Complete step-by-step guide for implementing Purchase History feature from backend to frontend.

---

## 📋 Table of Contents

1. [Backend Implementation](#backend-implementation)
   - [Step 1: Create Enrollment Model](#step-1-create-enrollment-model)
   - [Step 2: Create Enrollment Controller](#step-2-create-enrollment-controller)
   - [Step 3: Create Enrollment Routes](#step-3-create-enrollment-routes)
   - [Step 4: Register Routes in Backend](#step-4-register-routes-in-backend)
2. [Frontend Implementation](#frontend-implementation)
   - [Step 5: Create Redux Slice](#step-5-create-redux-slice)
   - [Step 6: Add Slice to Store](#step-6-add-slice-to-store)
   - [Step 7: Create Purchase History Component](#step-7-create-purchase-history-component)
   - [Step 8: Create Invoice Modal](#step-8-create-invoice-modal)
3. [Data Flow](#data-flow)
4. [Testing](#testing)

---

## 🎯 Backend Implementation

### Step 1: Create Enrollment Model

**File:** `backend/models/enrollmentModel.js`

```javascript
import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    // User Reference
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Course Reference
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },

    // Coupon Reference
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      default: null,
    },

    // Snapshot Coupon Code
    couponCode: {
      type: String,
      default: "",
    },

    // Original Course Price
    originalPrice: {
      type: Number,
      required: true,
    },

    // Snapshot Discount
    discountAmount: {
      type: Number,
      default: 0,
    },

    // Final Paid Amount
    pricePaid: {
      type: Number,
      required: true,
    },

    // Student Details
    studentName: {
      type: String,
      required: true,
      trim: true,
    },

    studentEmail: {
      type: String,
      required: true,
      trim: true,
    },

    studentPhone: {
      type: String,
      required: true,
      trim: true,
    },

    // Payment Details
    paymentId: {
      type: String,
      default: "",
    },

    orderId: {
      type: String,
      default: "",
    },

    paymentMethod: {
      type: String,
      default: "razorpay",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    // Subscription Dates
    startDate: {
      type: Date,
      default: Date.now,
    },

    endDate: {
      type: Date,
      required: true,
    },

    // Active / Expired Status
    status: {
      type: String,
      enum: ["active", "expired"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate enrollment
enrollmentSchema.index(
  { user: 1, course: 1 },
  { unique: true }
);

const Enrollment = mongoose.model(
  "Enrollment",
  enrollmentSchema
);

export default Enrollment;
```

**Key Points:**
- `user` and `course` are indexed for faster queries
- `coupon` is optional (null for free courses)
- `originalPrice`, `discountAmount`, `pricePaid` track pricing
- `studentName`, `studentEmail`, `studentPhone` are snapshots
- `paymentId`, `orderId`, `paymentStatus` track payment
- `startDate`, `endDate` define subscription period
- `status` tracks active/expired state

---

### Step 2: Create Enrollment Controller

**File:** `backend/controller/enrollMentController.js`

```javascript
import Course from "../models/courseModel.js";
import Enrollment from "../models/enrollmentModel.js";
import User from "../models/userModel.js";

// ======================================================
// 🔥 FREE COURSE ENROLLMENT
// ======================================================

export const enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.userId;

    // Check User + Course
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user || !course) {
      return res.status(404).json({
        success: false,
        message: "User or Course not found",
      });
    }

    // Block Paid Course
    if (course.price > 0) {
      return res.status(400).json({
        success: false,
        message: "Paid course requires payment",
      });
    }

    // Auto Expire Old Enrollments
    await Enrollment.updateMany(
      {
        user: userId,
        course: courseId,
        endDate: { $lte: new Date() },
        status: "active",
      },
      {
        $set: {
          status: "expired",
        },
      }
    );

    // Check Active Enrollment
    const existingEnrollment = await Enrollment.findOne({
      user: userId,
      course: courseId,
      status: "active",
      endDate: { $gt: new Date() },
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: "Already enrolled in this course",
      });
    }

    // Calculate Validity
    const startDate = new Date();
    const endDate = new Date(startDate);

    const { value = 6, unit = "month" } = course.validity || {};

    if (unit === "day") {
      endDate.setDate(endDate.getDate() + value);
    }

    if (unit === "month") {
      endDate.setMonth(endDate.getMonth() + value);
    }

    if (unit === "year") {
      endDate.setFullYear(endDate.getFullYear() + value);
    }

    // Create New Enrollment
    const enrollment = await Enrollment.create({
      user: userId,
      course: courseId,
      pricePaid: 0,
      startDate,
      endDate,
      status: "active",
    });

    // Update User
    await User.findByIdAndUpdate(userId, {
      $addToSet: {
        enrolledCourses: courseId,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Free course enrolled successfully",
      enrollment,
    });
  } catch (error) {
    console.log("Enroll Course Error:", error);

    return res.status(500).json({
      success: false,
      message: `Enroll error: ${error.message}`,
    });
  }
};

// ======================================================
// 📦 GET USER ENROLLMENTS
// ======================================================

export const getUserEnrollments = async (req, res) => {
  try {
    const userId = req.userId;

    // Auto Update Expired Enrollments
    await Enrollment.updateMany(
      {
        user: userId,
        endDate: { $lte: new Date() },
        status: "active",
      },
      {
        $set: {
          status: "expired",
        },
      }
    );

    // Remove Expired Course IDs from User
    const expiredCourses = await Enrollment.find({
      user: userId,
      status: "expired",
    });

    for (const item of expiredCourses) {
      await User.findByIdAndUpdate(userId, {
        $pull: {
          enrolledCourses: item.course,
        },
      });
    }

    // Get All Enrollments
    const enrollments = await Enrollment.find({
      user: userId,
    })
      .populate("course", "title thumbnail price category level creator")
      .populate("course.creator", "name photoUrl")
      .sort({ createdAt: -1 });

    const now = new Date();

    const result = enrollments.map((enrollment) => {
      const isExpired = now > enrollment.endDate;

      const daysRemaining = Math.max(
        0,
        Math.ceil(
          (new Date(enrollment.endDate) - now) /
            (1000 * 60 * 60 * 24)
        )
      );

      return {
        ...enrollment._doc,
        isExpired,
        isActive: !isExpired,
        status: isExpired ? "expired" : "active",
        daysRemaining,
      };
    });

    return res.status(200).json({
      success: true,
      enrollments: result,
    });
  } catch (error) {
    console.log("Get Enrollment Error:", error);

    return res.status(500).json({
      success: false,
      message: `Error getting enrollments: ${error.message}`,
    });
  }
};

// ======================================================
// 🔍 CHECK ENROLLMENT STATUS
// ======================================================

export const checkEnrollmentStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.userId;

    // Find Latest Enrollment
    const enrollment = await Enrollment.findOne({
      user: userId,
      course: courseId,
    }).sort({ createdAt: -1 });

    // No Enrollment
    if (!enrollment) {
      return res.status(200).json({
        success: true,
        isEnrolled: false,
        isActive: false,
        status: "not_enrolled",
      });
    }

    // Check Expiry
    const now = new Date();
    const isExpired = now > enrollment.endDate;

    // Auto Update Status
    if (isExpired && enrollment.status !== "expired") {
      await Enrollment.findByIdAndUpdate(enrollment._id, {
        status: "expired",
      });

      await User.findByIdAndUpdate(userId, {
        $pull: {
          enrolledCourses: courseId,
        },
      });
    }

    // Expired Response
    if (isExpired) {
      return res.status(200).json({
        success: true,
        isEnrolled: false,
        isActive: false,
        status: "expired",
        message: "Enrollment expired",
      });
    }

    // Days Remaining
    const daysRemaining = Math.max(
      0,
      Math.ceil(
        (new Date(enrollment.endDate) - now) /
          (1000 * 60 * 60 * 24)
      )
    );

    // Active Response
    return res.status(200).json({
      success: true,
      isEnrolled: true,
      isActive: true,
      status: "active",
      startDate: enrollment.startDate,
      endDate: enrollment.endDate,
      daysRemaining,
      enrollment,
    });
  } catch (error) {
    console.log("Check Enrollment Error:", error);

    return res.status(500).json({
      success: false,
      message: `Error checking enrollment: ${error.message}`,
    });
  }
};
```

**Key Points:**
- `enrollCourse` - For free course enrollment
- `getUserEnrollments` - Fetch all enrollments with auto-expiry check
- `checkEnrollmentStatus` - Check if user is enrolled in specific course
- `.populate()` used to get course details
- Auto-updates expired enrollments
- Calculates days remaining

---

### Step 3: Create Enrollment Routes

**File:** `backend/routes/enrollmentRoute.js`

```javascript
import express from "express";
import {
  enrollCourse,
  getUserEnrollments,
  checkEnrollmentStatus,
} from "../controller/enrollMentController.js";
import isAuth from "../middleware/isAuth.js";

const router = express.Router();

// ======================================================
// 🎓 ENROLL FREE COURSE
// ======================================================

router.post("/enroll/:courseId", isAuth, enrollCourse);

// ======================================================
// 📦 GET USER ENROLLMENTS
// ======================================================

router.get("/user", isAuth, getUserEnrollments);

// ======================================================
// 🔍 CHECK ENROLLMENT STATUS
// ======================================================

router.get("/check/:courseId", isAuth, checkEnrollmentStatus);

export default router;
```

**Key Points:**
- All routes protected with `isAuth` middleware
- `POST /enroll/:courseId` - Enroll in free course
- `GET /user` - Get all user enrollments
- `GET /check/:courseId` - Check enrollment status for specific course

---

### Step 4: Register Routes in Backend

**File:** `backend/index.js`

```javascript
import express from 'express'
import dotenv from 'dotenv'
import connectDb from './config/connectDB.js'
import cookieParser from 'cookie-parser'
import authRouter from './routes/authRoute.js'
import cors from 'cors'
import userRouter from './routes/userRoute.js'
import courseRoute from './routes/courseRoute.js'
import paymentRouter from './routes/paymentRoute.js'
import reviewRoter from './routes/reviewRoute.js'
import adminRouter from './routes/adminRoute.js'
import couponRouter from './routes/coupon.routes.js'
import enrollmentRouter from './routes/enrollmentRoute.js'  // ✅ ADD THIS

dotenv.config()

const port = process.env.PORT

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

// Routes
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/course", courseRoute)
app.use("/api/order", paymentRouter)
app.use("/api/review", reviewRoter)
app.use("/api/admin", adminRouter)
app.use("/api/coupon", couponRouter)
app.use("/api/enrollment", enrollmentRouter)  // ✅ ADD THIS

app.get("/", (req, res)=>{
    res.send("Hello from Server")
})

import errorHandler from './middleware/errorHandler.js'
app.use(errorHandler);

app.listen(port, ()=>{
    console.log("Server Started")
    connectDb()
})
```

**Key Points:**
- Import `enrollmentRouter` from routes
- Register route with `/api/enrollment` prefix
- Full API endpoints:
  - `POST /api/enrollment/enroll/:courseId`
  - `GET /api/enrollment/user`
  - `GET /api/enrollment/check/:courseId`

---

## 🎨 Frontend Implementation

### Step 5: Create Redux Slice

**File:** `frontend/src/redux/slices/enrollmentSlice.js`

```javascript
import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import axios from "axios";

// ======================================================
// 🔧 BASE URL CONFIGURATION
// ======================================================

const BASE_URL =
  (import.meta.env.VITE_SERVER_URL?.trim() || "http://localhost:8000") + "/api/enrollment";

// ======================================================
// 📦 INITIAL STATE
// ======================================================

const initialState = {

  // All enrollments
  enrollments: [],

  // Only active courses
  activeEnrollments: [],

  // Expired enrollments
  expiredEnrollments: [],

  // Selected enrollment
  selectedEnrollment: null,

  // Single course enrollment status
  enrollmentStatus: null,

  // Loading state
  loading: false,

  // Error state
  error: null,
};

// ======================================================
// 📚 FETCH USER ENROLLMENTS
// ======================================================

export const fetchUserEnrollments =
  createAsyncThunk(

    "enrollment/fetchUserEnrollments",

    async (_, thunkAPI) => {

      try {

        const response = await axios.get(
          `${BASE_URL}/user`,
          {
            withCredentials: true,
          }
        );

        return response.data.enrollments;

      } catch (error) {

        return thunkAPI.rejectWithValue(

          error.response?.data?.message ||

          "Failed to fetch enrollments"
        );
      }
    }
  );

// ======================================================
// 🔍 CHECK ENROLLMENT STATUS
// ======================================================

export const checkEnrollmentStatus =
  createAsyncThunk(

    "enrollment/checkEnrollmentStatus",

    async (courseId, thunkAPI) => {

      try {

        const response = await axios.get(
          `${BASE_URL}/check/${courseId}`,
          {
            withCredentials: true,
          }
        );

        return response.data;

      } catch (error) {

        return thunkAPI.rejectWithValue(

          error.response?.data?.message ||

          "Failed to check enrollment"
        );
      }
    }
  );

// ======================================================
// 🎓 ENROLL FREE COURSE
// ======================================================

export const enrollFreeCourse =
  createAsyncThunk(

    "enrollment/enrollFreeCourse",

    async (courseId, thunkAPI) => {

      try {

        const response = await axios.post(
          `${BASE_URL}/enroll/${courseId}`,
          {},
          {
            withCredentials: true,
          }
        );

        return response.data.enrollment;

      } catch (error) {

        return thunkAPI.rejectWithValue(

          error.response?.data?.message ||

          "Enrollment failed"
        );
      }
    }
  );

// ======================================================
// 🧹 ENROLLMENT SLICE
// ======================================================

const enrollmentSlice = createSlice({

  name: "enrollment",

  initialState,

  reducers: {

    // Set Selected Enrollment
    setSelectedEnrollment: (
      state,
      action
    ) => {

      state.selectedEnrollment =
        action.payload;
    },

    // Clear All Enrollment Data
    clearEnrollments: (state) => {

      state.enrollments = [];

      state.activeEnrollments = [];

      state.expiredEnrollments = [];

      state.selectedEnrollment = null;

      state.enrollmentStatus = null;

      state.error = null;
    },
  },

  extraReducers: (builder) => {

    // FETCH USER ENROLLMENTS
    builder

      // PENDING
      .addCase(
        fetchUserEnrollments.pending,
        (state) => {

          state.loading = true;

          state.error = null;
        }
      )

      // SUCCESS
      .addCase(
        fetchUserEnrollments.fulfilled,
        (state, action) => {

          state.loading = false;

          state.enrollments =
            action.payload;

          // ACTIVE COURSES
          state.activeEnrollments =
            action.payload.filter(
              (item) =>
                item.status === "active"
            );

          // EXPIRED COURSES
          state.expiredEnrollments =
            action.payload.filter(
              (item) =>
                item.status === "expired"
            );
        }
      )

      // FAILED
      .addCase(
        fetchUserEnrollments.rejected,
        (state, action) => {

          state.loading = false;

          state.error =
            action.payload;
        }
      );

    // CHECK ENROLLMENT STATUS
    builder

      .addCase(
        checkEnrollmentStatus.pending,
        (state) => {

          state.loading = true;

          state.error = null;
        }
      )

      .addCase(
        checkEnrollmentStatus.fulfilled,
        (state, action) => {

          state.loading = false;

          state.enrollmentStatus =
            action.payload;
        }
      )

      .addCase(
        checkEnrollmentStatus.rejected,
        (state, action) => {

          state.loading = false;

          state.error =
            action.payload;
        }
      );

    // FREE COURSE ENROLLMENT
    builder

      .addCase(
        enrollFreeCourse.pending,
        (state) => {

          state.loading = true;

          state.error = null;
        }
      )

      .addCase(
        enrollFreeCourse.fulfilled,
        (state, action) => {

          state.loading = false;

          // Add to top
          state.enrollments.unshift(
            action.payload
          );

          // Add to active list
          state.activeEnrollments.unshift(
            action.payload
          );
        }
      )

      .addCase(
        enrollFreeCourse.rejected,
        (state, action) => {

          state.loading = false;

          state.error =
            action.payload;
        }
      );
  },
});

// ======================================================
// 🚀 EXPORT ACTIONS
// ======================================================

export const {

  setSelectedEnrollment,

  clearEnrollments,

} = enrollmentSlice.actions;

// ======================================================
// 🚀 EXPORT REDUCER
// ======================================================

export default enrollmentSlice.reducer;
```

**Key Points:**
- `BASE_URL` configured with environment variable
- Three async thunks: `fetchUserEnrollments`, `checkEnrollmentStatus`, `enrollFreeCourse`
- State includes: enrollments, activeEnrollments, expiredEnrollments, loading, error
- Auto-separates active and expired enrollments
- `withCredentials: true` for cookie-based auth

---

### Step 6: Add Slice to Store

**File:** `frontend/src/redux/slices/store.js`

```javascript
import { configureStore, combineReducers } from "@reduxjs/toolkit";

import {
  persistStore,
  persistReducer,
} from "redux-persist";

const storage = {
  getItem: (key) => Promise.resolve(localStorage.getItem(key)),
  setItem: (key, value) => Promise.resolve(localStorage.setItem(key, value)),
  removeItem: (key) => Promise.resolve(localStorage.removeItem(key)),
};

import userSlice from "./userSlice";
import courseSlice from "./courseSlice";
import lectureSlice from "./lectureSlice";
import reviewSlice from "./reviewSlice";
import moduleSlice from "./moduleSlice";
import dashboardSlice from "./dashboardSlice";
import commentSlice from "./commentSlice";
import adminSlice from "./adminSlice"
import couponSlice from "./couponSlice"
import progressSlice from "./progressSlice"
import enrollmentSlice from "./enrollmentSlice"  // ✅ ADD THIS

// Combine Reducers
const rootReducer = combineReducers({
  user: userSlice,
  course: courseSlice,
  lecture: lectureSlice,
  module: moduleSlice,
  review: reviewSlice,
  dashboard: dashboardSlice, 
  comment: commentSlice,
  admin: adminSlice,
  coupon: couponSlice,
  progress: progressSlice,
  enrollment: enrollmentSlice,  // ✅ ADD THIS
});

// Persist Config
const persistConfig = {
  key: "root",
  storage: storage,
};

// Persisted Reducer
const persistedReducer = persistReducer(
  persistConfig,
  rootReducer
);

// Store Configuration
export const store = configureStore({  
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Persistor
export const persistor = persistStore(store);
```

**Key Points:**
- Import `enrollmentSlice` from slices
- Add to `rootReducer` with key `enrollment`
- Now accessible via `state.enrollment`

---

### Step 7: Create Purchase History Component

**File:** `frontend/src/pages/student/PurchaseHistory.jsx`

```javascript
import React, {
  useEffect,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  useNavigate,
} from "react-router-dom";

import {
  FaArrowLeft,
} from "react-icons/fa6";

import {
  FaReceipt,
} from "react-icons/fa";

import img from "../../assets/Empty.png";

import Nav from "../../components/navbar/Navbar";

import InvoiceModal from "../../components/student/InvoiceModal";

import {
  fetchUserEnrollments,
} from "../../redux/slices/enrollmentSlice";

const PurchaseHistory = () => {

  const dispatch =
    useDispatch();

  const navigate =
    useNavigate();

  const {enrollments, loading, error,} = useSelector((state) => state.enrollment);

  const [
    selectedInvoice,
    setSelectedInvoice,
  ] = useState(null);

  useEffect(() => {

    dispatch(
      fetchUserEnrollments()
    );

  }, [dispatch]);

  const formatDate = (
    date
  ) => {

    if (!date)
      return "N/A";

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  if (loading) {

    return (

      <>
        <Nav />

        <div
          className="
            min-h-screen
            flex
            items-center
            justify-center
            bg-[#f5f5f7]
          "
        >

          <div
            className="
              w-14
              h-14
              border-4
              border-black
              border-t-transparent
              rounded-full
              animate-spin
            "
          />

        </div>
      </>
    );
  }

  return (

    <>
      <Nav />

      <div
        className="
          min-h-screen
          bg-[#f5f5f7]
          px-4
          md:px-8
          py-7
          pt-[90px]
        "
      >

        <div className="max-w-7xl mx-auto mb-8">

          <button
            onClick={() =>
              navigate(
                "/student/dashboard"
              )
            }
            className="
              w-11
              h-11
              rounded-xl
              bg-white
              border
              border-gray-200
              flex
              items-center
              justify-center
              shadow-sm
              hover:shadow-md
              hover:-translate-x-1
              transition-all
              duration-300
            "
          >

            <FaArrowLeft className="text-[18px]" />

          </button>

          <div className="mt-5">

            <h1
              className="
                text-3xl
                md:text-4xl
                font-bold
                text-gray-900
              "
            >
              Purchase History
            </h1>

            <p
              className="
                text-gray-500
                mt-2
                text-[15px]
              "
            >
              View all your purchased
              courses and payment
              history.
            </p>

          </div>

        </div>

        {!loading &&
        enrollments?.length ===
          0 ? (

          <div
            className="
              max-w-3xl
              mx-auto
              bg-white
              border
              border-gray-200
              rounded-[28px]
              p-10
              text-center
              shadow-sm
            "
          >

            <div
              className="
                w-20
                h-20
                rounded-full
                bg-gray-100
                flex
                items-center
                justify-center
                mx-auto
              "
            >

              <FaReceipt
                className="
                  text-[40px]
                  text-gray-500
                "
              />

            </div>

            <h2
              className="
                text-2xl
                font-bold
                text-gray-900
                mt-6
              "
            >
              No Purchases Yet
            </h2>

            <p
              className="
                text-gray-500
                mt-3
                leading-7
              "
            >
              You haven't purchased
              any course yet.
            </p>

            <button
              onClick={() =>
                navigate("/")
              }
              className="
                mt-7
                bg-black
                text-white
                px-7
                py-3
                rounded-2xl
                font-semibold
                hover:bg-gray-800
                transition-all
                duration-300
              "
            >
              Explore Courses
            </button>

          </div>

        ) : (

          <div
            className="
              max-w-7xl
              mx-auto
              bg-white
              border
              border-gray-200
              rounded-[28px]
              shadow-sm
              overflow-hidden
            "
          >

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead
                  className="
                    bg-gray-50
                    border-b
                    border-gray-200
                  "
                >

                  <tr>

                    <th
                      className="
                        text-left
                        px-6
                        py-4
                        text-sm
                        font-semibold
                        text-gray-700
                      "
                    >
                      Course
                    </th>

                    <th
                      className="
                        text-left
                        px-6
                        py-4
                        text-sm
                        font-semibold
                        text-gray-700
                      "
                    >
                      Purchase Date
                    </th>

                    <th
                      className="
                        text-left
                        px-6
                        py-4
                        text-sm
                        font-semibold
                        text-gray-700
                      "
                    >
                      Amount
                    </th>

                    <th
                      className="
                        text-left
                        px-6
                        py-4
                        text-sm
                        font-semibold
                        text-gray-700
                      "
                    >
                      Status
                    </th>

                    <th
                      className="
                        text-left
                        px-6
                        py-4
                        text-sm
                        font-semibold
                        text-gray-700
                      "
                    >
                      Invoice
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {enrollments?.map(
                    (
                      enrollment,
                      index
                    ) => (

                      <tr
                        key={
                          enrollment?._id ||
                          index
                        }
                        className="
                          border-b
                          border-gray-100
                          hover:bg-gray-50
                          transition-all
                        "
                      >

                        <td className="px-6 py-4">

                          <div
                            className="
                              flex
                              items-center
                              gap-4
                            "
                          >

                            <img
                              src={
                                enrollment
                                  ?.course
                                  ?.thumbnail ||
                                img
                              }
                              alt=""
                              className="
                                w-14
                                h-14
                                rounded-xl
                                object-cover
                              "
                            />

                            <div>

                              <h3
                                className="
                                  font-semibold
                                  text-gray-900
                                "
                              >
                                {
                                  enrollment
                                    ?.course
                                    ?.title
                                }
                              </h3>

                              <p
                                className="
                                  text-sm
                                  text-gray-500
                                  mt-1
                                "
                              >
                                {
                                  enrollment
                                    ?.course
                                    ?.category
                                }
                              </p>

                            </div>

                          </div>

                        </td>

                        <td
                          className="
                            px-6
                            py-4
                            text-sm
                            text-gray-600
                          "
                        >
                          {formatDate(
                            enrollment?.createdAt
                          )}
                        </td>

                        <td
                          className="
                            px-6
                            py-4
                            text-sm
                            font-bold
                            text-gray-900
                          "
                        >
                          ₹
                          {
                            enrollment?.pricePaid
                          }
                        </td>

                        <td className="px-6 py-4">

                          <span
                            className={`
                              inline-flex
                              items-center
                              px-3
                              py-1
                              rounded-full
                              text-xs
                              font-semibold
                              ${
                                enrollment?.status ===
                                "active"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }
                            `}
                          >
                            {
                              enrollment?.status
                            }
                          </span>

                        </td>

                        <td className="px-6 py-4">

                          <button
                            onClick={() =>
                              setSelectedInvoice(
                                enrollment
                              )
                            }
                            className="
                              text-sm
                              font-semibold
                              text-blue-600
                              hover:text-blue-800
                              transition-all
                            "
                          >
                            Download
                          </button>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>
        )}

      </div>

      {selectedInvoice && (

        <InvoiceModal
          enrollment={
            selectedInvoice
          }
          onClose={() =>
            setSelectedInvoice(
              null
            )
          }
        />

      )}
    </>
  );
};

export default PurchaseHistory;
```

**Key Points:**
- Uses `useDispatch` to call `fetchUserEnrollments` on mount
- Uses `useSelector` to get enrollment state
- Displays loading spinner while fetching
- Shows empty state if no enrollments
- Displays table with course details, date, amount, status
- Invoice download button opens modal
- Status badge (green for active, red for expired)

---

### Step 8: Create Invoice Modal

**File:** `frontend/src/components/student/InvoiceModal.jsx`

```javascript
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const InvoiceModal = ({ enrollment, onClose }) => {

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Invoice-${enrollment?._id}`,
  });

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Invoice</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Invoice Content */}
        <div ref={componentRef} className="p-8">
          
          {/* Invoice Header */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              SkillBridge Learning
            </h3>
            <p className="text-gray-600">Invoice #{enrollment?._id?.slice(-8)}</p>
            <p className="text-gray-600">Date: {formatDate(enrollment?.createdAt)}</p>
          </div>

          {/* Student Details */}
          <div className="mb-8 p-4 bg-gray-50 rounded-xl">
            <h4 className="font-semibold text-gray-900 mb-3">Bill To:</h4>
            <p className="text-gray-700">{enrollment?.studentName}</p>
            <p className="text-gray-600">{enrollment?.studentEmail}</p>
            <p className="text-gray-600">{enrollment?.studentPhone}</p>
          </div>

          {/* Course Details */}
          <div className="mb-8">
            <h4 className="font-semibold text-gray-900 mb-3">Course:</h4>
            <div className="flex items-start gap-4">
              <img
                src={enrollment?.course?.thumbnail}
                alt=""
                className="w-20 h-20 rounded-xl object-cover"
              />
              <div>
                <p className="font-semibold text-gray-900">
                  {enrollment?.course?.title}
                </p>
                <p className="text-gray-600">{enrollment?.course?.category}</p>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="mb-8">
            <h4 className="font-semibold text-gray-900 mb-3">Payment Details:</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Original Price:</span>
                <span className="font-semibold">₹{enrollment?.originalPrice}</span>
              </div>
              {enrollment?.discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({enrollment?.couponCode}):</span>
                  <span className="font-semibold">-₹{enrollment?.discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-gray-200 pt-2">
                <span className="font-semibold text-gray-900">Total Paid:</span>
                <span className="font-bold text-xl text-gray-900">₹{enrollment?.pricePaid}</span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="mb-8 p-4 bg-gray-50 rounded-xl">
            <h4 className="font-semibold text-gray-900 mb-3">Payment Information:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium">{enrollment?.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment ID:</span>
                <span className="font-medium">{enrollment?.paymentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-medium">{enrollment?.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium capitalize">{enrollment?.paymentStatus}</span>
              </div>
            </div>
          </div>

          {/* Subscription Details */}
          <div className="mb-8 p-4 bg-blue-50 rounded-xl">
            <h4 className="font-semibold text-gray-900 mb-3">Subscription Details:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Start Date:</span>
                <span className="font-medium">{formatDate(enrollment?.startDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">End Date:</span>
                <span className="font-medium">{formatDate(enrollment?.endDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium capitalize">{enrollment?.status}</span>
              </div>
              {enrollment?.daysRemaining !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Days Remaining:</span>
                  <span className="font-medium">{enrollment?.daysRemaining} days</span>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all"
          >
            Print / Download PDF
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default InvoiceModal;
```

**Key Points:**
- Uses `react-to-print` for PDF generation
- Displays complete invoice details
- Shows student info, course details, payment breakdown
- Includes subscription validity info
- Print/Download PDF button
- Close button to dismiss modal

**Install dependency:**
```bash
npm install react-to-print
```

---

## 🔄 Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     USER ACTION                              │
│            User clicks "Purchase History"                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              PURCHASEHISTORY COMPONENT                       │
│  useEffect(() => {                                          │
│    dispatch(fetchUserEnrollments());                         │
│  }, [dispatch]);                                             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              REDUX SLICE (enrollmentSlice)                   │
│  export const fetchUserEnrollments = createAsyncThunk(...)  │
│  - Makes API call to backend                                 │
│  - axios.get(`${BASE_URL}/user`, { withCredentials: true })  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              BACKEND ROUTE (enrollmentRoute.js)              │
│  router.get("/user", isAuth, getUserEnrollments);            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              MIDDLEWARE (isAuth.js)                          │
│  - Validates JWT token from cookies                         │
│  - Finds user from token                                     │
│  - Attaches userId to req.userId                             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              CONTROLLER (enrollMentController.js)            │
│  export const getUserEnrollments = async (req, res) => {    │
│    - Auto-updates expired enrollments                        │
│    - Fetches all enrollments for user                        │
│    - Populates course details                                │
│    - Calculates days remaining                               │
│    - Returns { success: true, enrollments: result }         │
│  }                                                           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              DATABASE (MongoDB)                              │
│  Enrollment.find({ user: userId })                          │
│    .populate("course", "title thumbnail price ...")          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              RESPONSE BACK TO FRONTEND                       │
│  { success: true, enrollments: [...] }                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              REDUX STATE UPDATE                              │
│  - state.enrollments = action.payload                         │
│  - state.activeEnrollments = filtered(active)                │
│  - state.expiredEnrollments = filtered(expired)              │
│  - state.loading = false                                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              COMPONENT RE-RENDER                             │
│  - useSelector gets updated state                             │
│  - Displays enrollments in table                              │
│  - Shows loading/error states                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧪 Testing

### 1. Backend Testing

```bash
# Start backend server
cd backend
npm run dev
```

Test endpoints using Postman/curl:

```bash
# Get user enrollments (requires auth token in cookies)
GET http://localhost:8000/api/enrollment/user

# Check enrollment status
GET http://localhost:8000/api/enrollment/check/:courseId

# Enroll in free course
POST http://localhost:8000/api/enrollment/enroll/:courseId
```

### 2. Frontend Testing

```bash
# Start frontend server
cd frontend
npm run dev
```

Steps:
1. Login to the application
2. Navigate to Purchase History page
3. Check console for API calls
4. Verify enrollments display correctly
5. Test invoice download/print

### 3. Debugging

Add console logs in:
- `enrollmentSlice.js` - API URL and response
- `PurchaseHistory.jsx` - State updates
- Browser DevTools - Network tab for API calls

---

## 📝 Summary

**Backend Files Created/Modified:**
1. `backend/models/enrollmentModel.js` - Database schema
2. `backend/controller/enrollMentController.js` - Business logic
3. `backend/routes/enrollmentRoute.js` - API endpoints
4. `backend/index.js` - Route registration

**Frontend Files Created/Modified:**
1. `frontend/src/redux/slices/enrollmentSlice.js` - Redux state management
2. `frontend/src/redux/slices/store.js` - Store configuration
3. `frontend/src/pages/student/PurchaseHistory.jsx` - UI component
4. `frontend/src/components/student/InvoiceModal.jsx` - Invoice component

**Key Integrations:**
- MongoDB for data persistence
- Redux Toolkit for state management
- React Router for navigation
- react-to-print for PDF generation
- Cookie-based authentication

**Data Flow:**
User → Component → Redux → API → Middleware → Controller → Database → Response → Redux → Component → UI
