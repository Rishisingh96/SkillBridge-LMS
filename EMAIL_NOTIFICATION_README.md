# 📧 Email Service & Notification System - Complete Implementation Guide

## 📚 Table of Contents
1. [Overview](#overview)
2. [Email Service Implementation (Nodemailer)](#email-service-implementation-nodemailer)
3. [Notification System Architecture](#notification-system-architecture)
4. [Socket.io Implementation](#socketio-implementation)
5. [Backend Data Flow](#backend-data-flow)
6. [Frontend Data Flow](#frontend-data-flow)
7. [Complete End-to-End Flow](#complete-end-to-end-flow)
8. [File Structure](#file-structure)
9. [Environment Variables](#environment-variables)
10. [API Endpoints](#api-endpoints)
11. [Testing & Debugging](#testing--debugging)

---

## 🎯 Overview

This document explains the complete implementation of **Email Service** and **Real-time Notification System** in SkillBridge LMS using **Nodemailer** and **Socket.io**.

### Key Features Implemented:
- ✅ **Email Service** with Nodemailer (Gmail SMTP)
- ✅ **Real-time Notifications** using Socket.io
- ✅ **In-app Notifications** with MongoDB persistence
- ✅ **Unread Count Tracking**
- ✅ **Mark as Read/Unread Functionality**
- ✅ **Notification Categories & Priority Levels**
- ✅ **Auto-cleanup of Old Notifications** (15 days)
- ✅ **Browser Notifications** (with permission)

---

## 📧 Email Service Implementation (Nodemailer)

### What is Nodemailer?
Nodemailer is a module for Node.js applications to allow easy email sending. It uses SMTP (Simple Mail Transfer Protocol) to send emails through email service providers like Gmail, Outlook, etc.

### Implementation Location
`backend/config/sendMail.js`

### Setup & Configuration

#### 1. Install Dependencies
```bash
npm install nodemailer dotenv
```

#### 2. Environment Variables (.env)
```env
USER_EMAIL=your-email@gmail.com
USER_PASSWORD=your-app-password  # Gmail App Password (not regular password)
ADMIN_EMAIL=admin@skillbridge.com
```

#### 3. Transporter Setup
```javascript
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Create SMTP transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD,
  },
});
```

### Email Functions Implemented

#### 1. OTP Verification Email
```javascript
const sendMail = async(to, otp) => {
  await transporter.sendMail({
    from: process.env.USER_EMAIL,
    to: to,
    subject: "Verify Your Email - SkillBridge LMS",
    html: `HTML template with OTP`,
  });
}
```
**Usage:** Called during user registration to send OTP for email verification.

#### 2. Welcome Email
```javascript
const sendWelcomeEmail = async(to, userName) => {
  await transporter.sendMail({
    from: process.env.USER_EMAIL,
    to: to,
    subject: "Welcome to SkillBridge LMS! 🎉",
    html: `Welcome email template`,
  });
}
```
**Usage:** Called after successful email verification.

#### 3. Admin Notification for New User
```javascript
const sendAdminNewUserNotification = async (userData) => {
  await transporter.sendMail({
    from: process.env.USER_EMAIL,
    to: process.env.ADMIN_EMAIL,
    subject: "🆕 New User Registration - SkillBridge LMS",
    html: `User registration details`,
  });
}
```
**Usage:** Notifies admin when a new user registers.

#### 4. Enrollment Confirmation Email
```javascript
const sendEnrollmentConfirmationEmail = async (to, userName, courseTitle, startDate, endDate) => {
  await transporter.sendMail({
    from: process.env.USER_EMAIL,
    to: to,
    subject: "🎓 Course Enrollment Confirmed - SkillBridge LMS",
    html: `Enrollment confirmation template`,
  });
}
```
**Usage:** Sent when a student enrolls in a course.

### How Email Service Works

```
User Action (Registration/Enrollment)
    ↓
Controller Function
    ↓
sendMail() / sendWelcomeEmail() / sendEnrollmentConfirmationEmail()
    ↓
Nodemailer Transporter
    ↓
Gmail SMTP Server
    ↓
User's Email Inbox
```

### Gmail App Password Setup
1. Go to Google Account Settings
2. Enable 2-Factor Authentication
3. Go to Security → App Passwords
4. Generate new app password for "Mail"
5. Use this password in `.env` file (not your regular password)

---

## 🔔 Notification System Architecture

### Components Overview

#### Backend Components:
- **Model:** `backend/models/notificationModel.js` - MongoDB schema
- **Service:** `backend/service/notificationService.js` - Business logic
- **Socket Service:** `backend/service/socketNotificationService.js` - Real-time emission
- **Helpers:** `backend/helpers/notificationHelpers.js` - Pre-defined templates
- **Controller:** `backend/controller/notificationController.js` - API endpoints
- **Routes:** `backend/routes/notificationRoutes.js` - Route definitions
- **Socket Server:** `backend/sockets/index.js` - WebSocket setup

#### Frontend Components:
- **Context:** `frontend/src/context/SocketContext.jsx` - Socket connection management
- **UI Component:** `frontend/src/components/ui/NotificationBell.jsx` - Notification bell UI

### Notification Data Model

```javascript
{
  recipient: ObjectId,           // User receiving notification
  recipientRole: String,         // student/educator/admin
  sender: ObjectId,              // User sending notification (optional)
  title: String,                 // Notification heading
  message: String,               // Detailed message
  type: String,                 // course_enrolled, lecture_added, etc.
  category: String,              // course, lecture, quiz, system
  actionUrl: String,             // Frontend redirect URL
  resourceType: String,          // Related resource type
  resourceId: ObjectId,          // Related resource ID
  isRead: Boolean,               // Read status
  channels: {                   // Delivery channels
    inApp: Boolean,
    email: Boolean,
    push: Boolean,
    sms: Boolean
  },
  priority: String,              // low/medium/high/critical
  metadata: Object,             // Additional data
  expiresAt: Date,               // Auto-delete date (15 days)
  createdAt: Date,
  readAt: Date
}
```

---

## 🔌 Socket.io Implementation

### What is Socket.io?
Socket.io is a JavaScript library for real-time web applications. It enables bidirectional communication between web clients and servers. Unlike HTTP (request-response), Socket.io maintains a persistent connection allowing real-time data transfer.

### Socket.io vs HTTP

| Feature | HTTP | Socket.io |
|---------|------|-----------|
| Connection | Request-Response | Persistent Connection |
| Real-time | No (requires polling) | Yes |
| Bidirectional | No | Yes |
| Overhead | High (headers each request) | Low (once connected) |
| Use Case | REST APIs | Real-time updates |

### Backend Socket Implementation

#### 1. Socket Server Setup
**File:** `backend/sockets/index.js`

```javascript
import { Server } from "socket.io";

export const initializeSocketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket Connected:", socket.id);

    // User joins their personal room
    socket.on("join", (userId) => {
      socket.join(`user:${userId}`);
      console.log(`User Joined Room: user:${userId}`);
    });

    socket.on("disconnect", () => {
      console.log("Socket Disconnected:", socket.id);
    });
  });

  return io;
};
```

**Key Concepts:**
- **Room:** Each user joins a room named `user:${userId}`
- **Private Notifications:** Only notifications for specific user go to their room
- **Connection Management:** Handles connect/disconnect events

#### 2. Socket Notification Service
**File:** `backend/service/socketNotificationService.js`

```javascript
let ioInstance = null;

// Initialize socket instance
export const initializeSocket = (io) => {
  ioInstance = io;
};

// Get socket instance
export const getIO = () => {
  if (!ioInstance) {
    throw new Error("Socket.IO not initialized");
  }
  return ioInstance;
};

// Emit notification to specific user
export const emitNotification = (userId, notification) => {
  if (!ioInstance) return;
  ioInstance.to(`user:${userId}`).emit("new-notification", notification);
};

// Emit unread count update
export const emitUnreadCount = (userId, count) => {
  if (!ioInstance) return;
  ioInstance.to(`user:${userId}`).emit("unread-count", count);
};
```

#### 3. Socket Initialization in Main Server
**File:** `backend/index.js`

```javascript
import http from "http";
import { initializeSocketServer } from "./sockets/index.js";
import { initializeSocket } from "./service/socketNotificationService.js";

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = initializeSocketServer(server);
initializeSocket(io);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

### Frontend Socket Implementation

#### 1. Socket Context Provider
**File:** `frontend/src/context/SocketContext.jsx`

```javascript
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [latestNotification, setLatestNotification] = useState(null);
  
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (userData?._id) {
      // Connect to socket server
      const socketInstance = io("http://localhost:5000", {
        withCredentials: true,
        transports: ["websocket", "polling"],
      });

      socketInstance.on("connect", () => {
        console.log("Socket connected:", socketInstance.id);
        setIsConnected(true);
        
        // Join user's room
        socketInstance.emit("join", userData._id);
      });

      socketInstance.on("disconnect", () => {
        console.log("Socket disconnected");
        setIsConnected(false);
      });

      // Listen for new notifications
      socketInstance.on("new-notification", (notification) => {
        console.log("New notification received:", notification);
        setLatestNotification(notification);
        
        // Show browser notification
        if (Notification.permission === "granted") {
          new Notification(notification.title, {
            body: notification.message,
            icon: "/favicon.svg",
          });
        }
      });

      // Listen for unread count updates
      socketInstance.on("unread-count", (count) => {
        console.log("Unread count updated:", count);
        setUnreadCount(count);
      });

      setSocket(socketInstance);

      // Cleanup on unmount
      return () => {
        socketInstance.disconnect();
        setSocket(null);
        setIsConnected(false);
      };
    }
  }, [userData?._id]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, unreadCount, latestNotification }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
```

#### 2. Wrap App with SocketProvider
**File:** `frontend/src/App.jsx`

```javascript
import { SocketProvider } from "./context/SocketContext";

function App() {
  return (
    <SocketProvider>
      <YourAppComponents />
    </SocketProvider>
  );
}
```

#### 3. Use Socket in Components
**File:** `frontend/src/components/ui/NotificationBell.jsx`

```javascript
import { useSocket } from "../../context/SocketContext";

const NotificationBell = () => {
  const { unreadCount, latestNotification } = useSocket();
  
  return (
    <div>
      <Bell />
      {unreadCount > 0 && <Badge>{unreadCount}</Badge>}
    </div>
  );
};
```

---

## 🔄 Backend Data Flow

### Notification Creation Flow

```
User Action (e.g., Course Enrollment)
    ↓
Controller (enrollMentController.js)
    ↓
Helper Function (notificationHelpers.js)
    ↓
Notification Service (notificationService.js)
    ↓
MongoDB Save (notificationModel.js)
    ↓
Socket Emit (socketNotificationService.js)
    ↓
Socket.io Server (sockets/index.js)
    ↓
User's Room (user:${userId})
    ↓
Frontend Client
```

### Detailed Flow Example: Course Enrollment

#### 1. User Enrolls in Course
```javascript
// frontend: POST /api/enrollment
{
  courseId: "123",
  paymentId: "pay_456"
}
```

#### 2. Backend Controller
**File:** `backend/controller/enrollMentController.js`

```javascript
export const createEnrollment = async (req, res) => {
  // 1. Create enrollment
  const enrollment = await Enrollment.create({
    student: req.userId,
    course: courseId,
    // ... other fields
  });

  // 2. Send email notification
  await sendEnrollmentConfirmationEmail(
    studentEmail,
    studentName,
    courseTitle,
    startDate,
    endDate
  );

  // 3. Create in-app notification for student
  await notifyCourseEnrollment({
    studentId: req.userId,
    courseId,
    courseTitle
  });

  // 4. Notify educator
  await notifyCourseEnrollmentToCreatorAndAdmin({
    studentName,
    courseId,
    courseTitle,
    educatorId
  });

  return res.json({ success: true, enrollment });
};
```

#### 3. Helper Function
**File:** `backend/helpers/notificationHelpers.js`

```javascript
export const notifyCourseEnrollment = async ({
  studentId,
  courseId,
  courseTitle,
}) => {
  return await createBulkNotifications({
    recipient: studentId,
    recipientRole: "student",
    title: "Course Enrolled Successfully",
    message: `You have successfully enrolled in ${courseTitle}.`,
    type: "course_enrolled",
    category: "course",
    actionUrl: `/course/${courseId}`,
    resourceType: "course",
    resourceId: courseId,
    priority: "high",
  });
};
```

#### 4. Notification Service
**File:** `backend/service/notificationService.js`

```javascript
export const createNotification = async ({
  recipient,
  recipientRole,
  title,
  message,
  type,
  category,
  actionUrl,
  resourceType,
  resourceId,
  priority,
  channels,
  expiresAt,
}) => {
  try {
    // Auto-set expiry to 15 days
    const expiryDate = expiresAt || (() => {
      const date = new Date();
      date.setDate(date.getDate() + 15);
      return date;
    })();

    // Save to MongoDB
    const notification = await Notification.create({
      recipient,
      recipientRole,
      title,
      message,
      type,
      category,
      actionUrl,
      resourceType,
      resourceId,
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
    console.error("Create Notification Error:", error);
    throw error;
  }
};
```

#### 5. Socket Notification Service
**File:** `backend/service/socketNotificationService.js`

```javascript
export const emitNotification = (userId, notification) => {
  if (!ioInstance) return;
  
  // Emit to user's specific room
  ioInstance.to(`user:${userId}`).emit("new-notification", notification);
};
```

#### 6. Socket.io Server
**File:** `backend/sockets/index.js`

```javascript
io.on("connection", (socket) => {
  socket.on("join", (userId) => {
    socket.join(`user:${userId}`);
  });
});

// When emitNotification is called:
// ioInstance.to(`user:${userId}`).emit("new-notification", notification);
// This sends the notification to the specific user's room
```

---

## 🎨 Frontend Data Flow

### Notification Reception Flow

```
Socket.io Server emits event
    ↓
SocketContext receives event
    ↓
Update state (unreadCount, latestNotification)
    ↓
NotificationBell re-renders
    ↓
UI updates (badge count, animation)
    ↓
Browser notification (if permission granted)
```

### Detailed Flow

#### 1. Socket Connection
```javascript
// frontend/src/context/SocketContext.jsx
useEffect(() => {
  if (userData?._id) {
    const socketInstance = io("http://localhost:5000", {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    // On connect
    socketInstance.on("connect", () => {
      socketInstance.emit("join", userData._id);
    });

    // Listen for new notifications
    socketInstance.on("new-notification", (notification) => {
      setLatestNotification(notification);
      
      // Browser notification
      if (Notification.permission === "granted") {
        new Notification(notification.title, {
          body: notification.message,
          icon: "/favicon.svg",
        });
      }
    });

    // Listen for unread count
    socketInstance.on("unread-count", (count) => {
      setUnreadCount(count);
    });
  }
}, [userData?._id]);
```

#### 2. UI Updates
```javascript
// frontend/src/components/ui/NotificationBell.jsx
const NotificationBell = () => {
  const { unreadCount, latestNotification } = useSocket();
  
  return (
    <div>
      <Bell />
      {/* Badge updates automatically */}
      {unreadCount > 0 && (
        <Badge>{unreadCount > 9 ? "9+" : unreadCount}</Badge>
      )}
    </div>
  );
};
```

#### 3. User Interaction
```javascript
// Fetch notifications on bell click
const handleBellClick = async () => {
  const response = await axios.get(`${BASE_URL }/api/notification?limit=5`);
  setNotifications(response.data.notifications);
};

// Mark as read
const handleMarkAsRead = async (notificationId) => {
  await axios.patch(`${BASE_URL }/api/notification/${notificationId}/read`);
  await fetchNotifications();
};

// Navigate on notification click
const handleNotificationClick = (notification) => {
  if (notification.actionUrl) {
    navigate(notification.actionUrl);
  }
};
```

---

## 🚀 Complete End-to-End Flow

### Scenario: Student Enrolls in Course

#### Step 1: Student Enrolls
```
Frontend: POST /api/enrollment
Body: { courseId: "123", paymentId: "pay_456" }
```

#### Step 2: Backend Processes Enrollment
```javascript
// backend/controller/enrollMentController.js
export const createEnrollment = async (req, res) => {
  const enrollment = await Enrollment.create({...});
  
  // Send email
  await sendEnrollmentConfirmationEmail(...);
  
  // Create notification
  await notifyCourseEnrollment({...});
  
  return res.json({ success: true, enrollment });
};
```

#### Step 3: Email Sent via Nodemailer
```
sendEnrollmentConfirmationEmail()
    ↓
Nodemailer Transporter
    ↓
Gmail SMTP
    ↓
Student's Email
```

#### Step 4: Notification Saved to MongoDB
```
createNotification()
    ↓
Notification.create({...})
    ↓
MongoDB: notifications collection
```

#### Step 5: Socket.io Emits Real-time
```
emitNotification(userId, notification)
    ↓
ioInstance.to(`user:${userId}`).emit("new-notification", notification)
    ↓
Socket.io Server → Room: user:studentId
```

#### Step 6: Frontend Receives Notification
```
SocketContext: socket.on("new-notification", (notification) => {
  setLatestNotification(notification);
  
  // Browser notification
  new Notification(notification.title, {...});
})
```

#### Step 7: UI Updates Automatically
```
NotificationBell re-renders
    ↓
Badge count increases
    ↓
Bell animates
    ↓
Browser notification shows
```

#### Step 8: User Clicks Notification
```
handleNotificationClick(notification)
    ↓
navigate(notification.actionUrl)  // /course/123
    ↓
User navigates to course page
```

---

## 📁 File Structure

### Backend
```
backend/
├── config/
│   └── sendMail.js                    # Nodemailer configuration & email functions
├── models/
│   └── notificationModel.js           # MongoDB schema for notifications
├── service/
│   ├── notificationService.js         # Notification CRUD operations
│   ├── socketNotificationService.js   # Socket.io emission functions
│   ├── emailNotificationService.js    # Email notification service
│   └── pushNotificationService.js     # Push notification service
├── helpers/
│   └── notificationHelpers.js         # Pre-defined notification templates
├── controller/
│   └── notificationController.js      # API endpoint handlers
├── routes/
│   └── notificationRoutes.js          # API route definitions
├── sockets/
│   ├── index.js                       # Socket.io server setup
│   └── notificationSocket.js           # Notification socket handlers
├── utils/
│   ├── notificationTypes.js            # Notification type constants
│   └── notificationTemplates.js       # Notification templates
└── index.js                           # Main server (socket initialization)
```

### Frontend
```
frontend/
└── src/
    ├── context/
    │   └── SocketContext.jsx          # Socket.io context provider
    └── components/
        └── ui/
            ├── NotificationBell.jsx   # Notification bell UI component
            └── StudentNotification.jsx # Student notification page
```

---

## 🔐 Environment Variables

### Backend (.env)
```env
# Server
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skillbridge-lms

# Email Service (Nodemailer)
USER_EMAIL=your-email@gmail.com
USER_PASSWORD=your-app-password
ADMIN_EMAIL=admin@skillbridge.com

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_SERVER_URL=http://localhost:5000
```

---

## 📡 API Endpoints

### Notification APIs

#### Get User Notifications
```http
GET /api/notification?page=1&limit=20
Headers: 
  Cookie: token=xyz

Response:
{
  "success": true,
  "notifications": [
    {
      "_id": "notif123",
      "title": "Course Enrolled Successfully",
      "message": "You have enrolled in React Masterclass",
      "type": "course_enrolled",
      "category": "course",
      "actionUrl": "/course/123",
      "isRead": false,
      "priority": "high",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "pages": 3
  }
}
```

#### Get Unread Count
```http
GET /api/notification/unread-count
Headers: 
  Cookie: token=xyz

Response:
{
  "success": true,
  "count": 5
}
```

#### Mark as Read
```http
PATCH /api/notification/:notificationId/read
Headers: 
  Cookie: token=xyz

Response:
{
  "success": true,
  "notification": {...}
}
```

#### Mark All as Read
```http
PATCH /api/notification/read-all
Headers: 
  Cookie: token=xyz

Response:
{
  "success": true,
  "message": "All notifications marked as read"
}
```

#### Delete Notification
```http
DELETE /api/notification/:notificationId
Headers: 
  Cookie: token=xyz

Response:
{
  "success": true,
  "message": "Notification deleted"
}
```

#### Delete All Notifications
```http
DELETE /api/notification
Headers: 
  Cookie: token=xyz

Response:
{
  "success": true,
  "message": "All notifications deleted"
}
```

### Socket.io Events

#### Client → Server
```javascript
// Join user room
socket.emit("join", userId);
```

#### Server → Client
```javascript
// New notification
socket.on("new-notification", (notification) => {
  // Handle notification
});

// Unread count update
socket.on("unread-count", (count) => {
  // Update unread count
});
```

---

## 🧪 Testing & Debugging

### Testing Email Service

#### Test OTP Email
```javascript
import sendMail from "./config/sendMail.js";

await sendMail("test@example.com", "123456");
```

#### Test Welcome Email
```javascript
import { sendWelcomeEmail } from "./config/sendMail.js";

await sendWelcomeEmail("test@example.com", "John Doe");
```

### Testing Socket.io Connection

#### Frontend Console
```javascript
// Check connection status
console.log("Connected:", socket.connected);
console.log("Socket ID:", socket.id);

// Monitor all events
socket.onAny((event, ...args) => {
  console.log(`Event: ${event}`, args);
});
```

#### Backend Console
```javascript
// Check connected users
io.sockets.adapter.rooms.get("user:123");

// Check all connected sockets
io.sockets.sockets.forEach(socket => {
  console.log("Socket ID:", socket.id);
});
```

### Enable Socket.io Debugging

#### Frontend
```javascript
localStorage.debug = 'socket.io-client:*';
```

#### Backend
```bash
DEBUG=socket.io:* node backend/index.js
```

### Common Issues & Solutions

#### 1. Gmail Authentication Error
**Problem:** `Invalid login` error
**Solution:** Use App Password, not regular password. Enable 2FA.

#### 2. Socket.io Connection Refused
**Problem:** Frontend cannot connect to socket server
**Solution:** Check CORS configuration in `backend/sockets/index.js`

#### 3. Notifications Not Received
**Problem:** User doesn't receive notifications
**Solution:** 
- Check if user joined room: `socket.emit("join", userId)`
- Check socket instance initialization
- Verify user ID matches

#### 4. Browser Notifications Not Showing
**Problem:** No browser notification
**Solution:** Request notification permission:
```javascript
Notification.requestPermission().then(permission => {
  if (permission === "granted") {
    console.log("Notification permission granted");
  }
});
```

---

## 📊 Notification Types

### Student Notifications
- `course_enrolled` - Course enrollment confirmation
- `lecture_added` - New lecture added to enrolled course
- `module_added` - New module added
- `quiz_available` - New quiz available
- `quiz_result` - Quiz result available
- `certificate_ready` - Certificate ready for download
- `assignment_due` - Assignment due reminder
- `assignment_graded` - Assignment graded
- `live_class_scheduled` - Live class scheduled
- `live_class_reminder` - Live class reminder

### Educator Notifications
- `new_enrollment` - New student enrolled
- `new_review` - New course review
- `new_rating` - New course rating
- `course_purchase` - Course purchased
- `student_question` - Student asked question
- `assignment_submission` - Assignment submitted
- `quiz_submission` - Quiz submitted
- `payout_processed` - Payout processed

### Admin Notifications
- `new_user_registered` - New user registered
- `educator_application` - New educator application
- `course_review_request` - Course review requested
- `course_approved` - Course approved
- `course_rejected` - Course rejected
- `reported_course` - Course reported
- `reported_user` - User reported
- `revenue_report` - Revenue report available
- `system_alert` - System alert

### Priority Levels
- `low` - Informational notifications
- `medium` - Standard notifications
- `high` - Important notifications
- `critical` - Urgent notifications

---

## 🎯 Best Practices

### 1. Error Handling
```javascript
try {
  await createNotification(data);
} catch (error) {
  console.error("Notification failed:", error);
  // Don't fail main operation if notification fails
}
```

### 2. Rate Limiting
```javascript
// Don't spam notifications
if (recentNotifications > 10) {
  return; // Skip notification
}
```

### 3. Batch Notifications
```javascript
// Send multiple notifications at once
await createBulkNotifications(notificationsArray);
```

### 4. Auto-cleanup
```javascript
// Delete old notifications (already implemented)
setInterval(async () => {
  await deleteOldNotifications();
}, 24 * 60 * 60 * 1000); // Every 24 hours
```

### 5. Use TTL Index
```javascript
// Auto-delete expired notifications
notificationSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);
```

---

## 📚 Summary

### Email Service (Nodemailer)
- ✅ Uses Gmail SMTP for email delivery
- ✅ Functions: OTP, Welcome, Admin Notification, Enrollment Confirmation
- ✅ HTML email templates with professional design
- ✅ Configured via environment variables

### Notification System (Socket.io)
- ✅ Real-time notifications using WebSocket
- ✅ MongoDB persistence for notifications
- ✅ Room-based private messaging
- ✅ Browser notifications integration
- ✅ Unread count tracking
- ✅ Auto-cleanup of old notifications (15 days)
- ✅ Priority levels and categories
- ✅ Action URLs for navigation

### Architecture
- **Backend:** Express.js + Socket.io + MongoDB + Nodemailer
- **Frontend:** React + Socket.io-client + Context API
- **Communication:** REST API + WebSocket
- **Data Flow:** Controller → Service → MongoDB → Socket.io → Frontend

---

## 🔗 Related Documentation
- [NOTIFICATION_IMPLEMENTATION_GUIDE.md](./NOTIFICATION_IMPLEMENTATION_GUIDE.md) - Detailed notification implementation
- [Socket.io Documentation](https://socket.io/docs/)
- [Nodemailer Documentation](https://nodemailer.com/)

---

**Last Updated:** January 2024
**Version:** 1.0.0
