# SkillBridge-LMS Backend

A comprehensive Learning Management System (LMS) backend built with Node.js, Express, MongoDB, and Socket.IO. This backend powers a full-featured online learning platform with course management, user authentication, payment integration, real-time notifications, and much more.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Database Models](#database-models)
- [Authentication & Authorization](#authentication--authorization)
- [Socket.IO Integration](#socketio-integration)
- [Notification System](#notification-system)
- [File Upload & Cloudinary](#file-upload--cloudinary)
- [Payment Integration](#payment-integration)
- [Certificate Generation](#certificate-generation)
- [Video Processing](#video-processing)
- [Running the Server](#running-the-server)
- [Scripts](#scripts)
- [Contributing](#contributing)

---

## 🎯 Overview

SkillBridge-LMS Backend is a robust REST API that serves as the foundation for an online learning platform. It supports multiple user roles (Student, Educator, Admin), course creation and management, enrollment tracking, progress monitoring, real-time notifications, and secure payment processing.

### Key Capabilities

- **Multi-role Authentication**: Student, Educator, and Admin roles with specific permissions
- **Course Management**: Create, edit, publish, and organize courses with modules and lectures
- **Enrollment System**: Course enrollment with validity periods and expiration tracking
- **Progress Tracking**: Real-time lecture and quiz completion tracking
- **Real-time Notifications**: Socket.IO powered instant notifications
- **Payment Integration**: Razorpay integration for course purchases
- **Certificate Generation**: PDF certificate generation upon course completion
- **Video Streaming**: HLS video streaming for lecture content
- **Comment System**: Lecture comments with replies, likes, and pinning
- **Quiz System**: Quiz questions within lectures
- **Resource Management**: Upload and manage lecture resources (PDFs, files)

---

## 🛠 Tech Stack

### Core Framework
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Authentication & Security
- **JWT (jsonwebtoken)** - Token-based authentication
- **bcryptjs** - Password hashing
- **cookie-parser** - Cookie management
- **cors** - Cross-origin resource sharing

### Real-time & Notifications
- **Socket.IO** - Real-time bidirectional communication
- **nodemailer** - Email sending

### File Handling & Media
- **multer** - File upload handling
- **cloudinary** - Cloud image/video storage
- **ffmpeg-static** - Video processing
- **fluent-ffmpeg** - Video conversion
- **hls.js** - HTTP Live Streaming

### Payment & PDF
- **razorpay** - Payment gateway
- **pdfkit** - PDF generation for certificates

### Utilities
- **dotenv** - Environment variable management
- **validator** - Data validation

---

## 📁 Project Structure

```
backend/
├── config/                 # Configuration files
│   ├── cloudinary.js       # Cloudinary configuration
│   ├── connectDB.js        # MongoDB connection
│   ├── createAdmin.js      # Admin creation script
│   ├── sendMail.js         # Email configuration
│   └── token.js            # JWT token utilities
├── controller/             # Business logic controllers
│   ├── adminController.js
│   ├── authController.js
│   ├── certificateController.js
│   ├── commentController.js
│   ├── couponController.js
│   ├── courseController.js
│   ├── dashboardController.js
│   ├── enrollMentController.js
│   ├── lectureController.js
│   ├── moduleController.js
│   ├── notificationController.js
│   ├── orderController.js
│   ├── progressController.js
│   ├── quizController.js
│   ├── reviewController.js
│   ├── uploadLectureResource.js
│   └── userController.js
├── middleware/             # Custom middleware
│   ├── errorHandler.js     # Global error handler
│   ├── isAuth.js           # Authentication middleware
│   ├── isRole.js           # Role-based authorization
│   └── multer.js           # File upload configuration
├── models/                 # Database models (Mongoose schemas)
│   ├── certificateModel.js
│   ├── couponModel.js
│   ├── courseModel.js
│   ├── enrollmentModel.js
│   ├── lectureModel.js
│   ├── lectureProgressModel.js
│   ├── moduleModel.js
│   ├── notificationModel.js
│   ├── reviewModel.js
│   └── userModel.js
├── routes/                 # API route definitions
│   ├── adminRoute.js
│   ├── authRoute.js
│   ├── coupon.routes.js
│   ├── courseRoute.js
│   ├── enrollmentRoute.js
│   ├── notificationRoutes.js
│   ├── paymentRoute.js
│   ├── reviewRoute.js
│   └── userRoute.js
├── service/                # Business services
│   ├── emailNotificationService.js
│   ├── notificationService.js
│   ├── pushNotificationService.js
│   └── socketNotificationService.js
├── sockets/                # Socket.IO configuration
│   ├── index.js
│   └── notificationSocket.js
├── utils/                  # Utility functions
│   ├── calculateProgress.js
│   ├── convertToHLS.js
│   ├── generateCertificate.js
│   ├── isCourseActive.js
│   ├── notificationTemplates.js
│   └── notificationTypes.js
├── helpers/                # Helper functions
│   └── notificationHelpers.js
├── uploads/                # Local file storage (temporary)
├── .env                    # Environment variables
├── .gitignore
├── checkCourses.js         # Utility script
├── migrateProgress.js      # Migration script
├── index.js                # Application entry point
├── package.json
└── package-lock.json
```

---

## ✨ Features

### User Management
- User registration with email verification (OTP)
- Google OAuth authentication
- Login with JWT token and cookies
- Password reset via OTP
- Session management (single device login)
- User profile management
- Role-based access control (Student, Educator, Admin)
- Account banning functionality

### Course Management
- Create courses with title, description, category, level
- Course thumbnail upload via Cloudinary
- Course pricing and validity configuration
- Module-based course structure
- Lecture creation within modules
- Video lecture upload and streaming
- Publish/unpublish courses
- Course editing and deletion
- Course search and filtering

### Enrollment System
- Course enrollment with validity tracking
- Enrollment status checking
- User enrollment history
- Course validity expiration handling
- Free course enrollment support

### Learning Features
- Lecture video streaming (HLS)
- Lecture progress tracking
- Quiz questions within lectures
- Quiz completion tracking
- Resume from last watched lecture
- Overall course progress calculation

### Comment System
- Add comments on lectures
- Reply to comments
- Like/unlike comments and replies
- Pin important comments (educator only)
- Delete comments and replies

### Resource Management
- Upload multiple resources per lecture (PDFs, files)
- Download lecture resources
- Remove resources
- Resource management for educators

### Certificate System
- Generate PDF certificates upon course completion
- Download certificates
- Certificate validation
- Custom certificate design with PDFKit

### Notification System
- Real-time notifications via Socket.IO
- In-app notifications
- Email notifications (configurable)
- Push notifications (configurable)
- Notification categories and types
- Mark notifications as read
- Delete notifications
- Auto-cleanup of old notifications (15 days)
- Unread count tracking

### Payment Integration
- Razorpay payment gateway integration
- Order creation and verification
- Coupon code support
- Payment success/failure handling

### Admin Features
- Admin dashboard statistics
- User management
- Course management (all courses)
- Coupon creation and management
- System analytics

### Dashboard Analytics
- Course statistics (enrollments, revenue)
- Recent enrollments tracking
- Educator earnings tracking
- User learning progress

---

## 🚀 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SkillBridge-LMS/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Create a `.env` file in the root directory
   - Copy the environment variables from the example below
   - Fill in your actual values

4. **Start MongoDB**
   - If using local MongoDB, ensure it's running
   - If using MongoDB Atlas, ensure your connection string is correct

5. **Run the server**
   ```bash
   npm run dev
   ```

The server will start on the port specified in your `.env` file (default: 5000).

---

## 🔐 Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/skillbridge

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_password

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Environment Variable Descriptions

- **PORT**: Server port number
- **MONGODB_URI**: MongoDB connection string
- **JWT_SECRET**: Secret key for JWT token signing
- **CLOUDINARY_CLOUD_NAME**: Cloudinary cloud name for media storage
- **CLOUDINARY_API_KEY**: Cloudinary API key
- **CLOUDINARY_API_SECRET**: Cloudinary API secret
- **RAZORPAY_KEY_ID**: Razorpay key ID for payments
- **RAZORPAY_KEY_SECRET**: Razorpay key secret
- **EMAIL_HOST**: SMTP host for email sending
- **EMAIL_PORT**: SMTP port
- **EMAIL_USER**: Email username
- **EMAIL_PASSWORD**: Email password (use app-specific password for Gmail)
- **FRONTEND_URL**: Frontend application URL for CORS configuration

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### POST `/auth/signup`
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST `/auth/login`
Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST `/auth/sendotp`
Send OTP to email for verification.

#### POST `/auth/verifyotp`
Verify OTP for email verification.

#### POST `/auth/resetpassword`
Reset password using OTP.

#### POST `/auth/googleauth`
Authenticate with Google OAuth.

#### GET `/auth/logout`
Logout user and clear session.

#### POST `/auth/clearsession`
Clear user session (single device login).

### User Endpoints

#### GET `/user/profile`
Get user profile (requires authentication).

#### PUT `/user/profile`
Update user profile (requires authentication).

#### GET `/user/dashboard`
Get user dashboard data (requires authentication).

### Course Endpoints

#### POST `/course/create`
Create a new course (Educator only).

**Request Body:**
```json
{
  "title": "Course Title",
  "subTitle": "Course Subtitle",
  "description": "Course description",
  "category": "Programming",
  "level": "beginner",
  "price": 999,
  "validity": {
    "value": 6,
    "unit": "month"
  }
}
```

#### GET `/course/getpublished`
Get all published courses (public).

#### GET `/course/getcourse/:courseId`
Get course details by ID (public).

#### PUT `/course/editcourse/:courseId`
Edit course details (Educator only).

#### DELETE `/course/remove/:courseId`
Delete a course (Educator only).

#### PUT `/course/publish/:courseId`
Publish a course (Educator only).

#### PUT `/course/unpublish/:courseId`
Unpublish a course (Educator only).

#### GET `/course/getcreator`
Get all courses created by the educator (Educator only).

### Module Endpoints

#### POST `/course/create-module/:courseId`
Create a new module in a course (Educator only).

**Request Body:**
```json
{
  "title": "Module Title",
  "description": "Module description"
}
```

#### GET `/course/course-modules/:courseId`
Get all modules of a course.

#### DELETE `/course/remove-module/:moduleId`
Delete a module (Educator only).

#### DELETE `/course/remove-all-modules/:courseId`
Delete all modules of a course (Educator only).

### Lecture Endpoints

#### POST `/course/createlecture/:moduleId`
Create a new lecture in a module (Educator only).

**Request Body:**
```json
{
  "title": "Lecture Title",
  "description": "Lecture description",
  "videoUrl": "video_url_or_file",
  "duration": 3600
}
```

#### GET `/course/courselecture/:moduleId`
Get all lectures of a module (Educator only).

#### POST `/course/editlecture/:lectureId`
Edit lecture details (Educator only).

#### DELETE `/course/removelecture/:lectureId`
Delete a lecture (Educator only).

#### DELETE `/course/remove-lecture-video/:lectureId`
Remove lecture video (Educator only).

#### PUT `/course/mark-lecture-completed/:lectureId`
Mark lecture as completed (Student only).

#### PUT `/course/mark-quiz-completed/:lectureId`
Mark quiz as completed (Student only).

### Resource Endpoints

#### POST `/course/upload-resource/:lectureId`
Upload resources to a lecture (Educator only).

**Request:** `multipart/form-data` with files array.

#### GET `/course/lecture-resources/:lectureId`
Get all resources of a lecture.

#### GET `/course/download-resource/:lectureId/:resourceId`
Download a specific resource.

#### DELETE `/course/removeresource/:lectureId/:resourceId`
Remove a resource (Educator only).

### Quiz Endpoints

#### POST `/course/add-quiz/:lectureId`
Add quiz question to a lecture (Educator only).

**Request Body:**
```json
{
  "question": "Question text",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "correctAnswer": 0
}
```

#### GET `/course/get-quiz/:lectureId`
Get quiz questions of a lecture.

#### DELETE `/course/remove-quiz/:lectureId/:quizId`
Remove a quiz question (Educator only).

### Comment Endpoints

#### POST `/course/comment/:lectureId`
Add a comment to a lecture.

**Request Body:**
```json
{
  "text": "Comment text"
}
```

#### GET `/course/comment/:lectureId`
Get all comments of a lecture.

#### DELETE `/course/comment/:lectureId/:commentId`
Delete a comment.

#### POST `/course/comment/reply/:lectureId/:commentId`
Reply to a comment.

#### DELETE `/course/comment/reply/:lectureId/:commentId/:replyId`
Delete a reply.

#### PUT `/course/comment/like/:lectureId/:commentId`
Like/unlike a comment.

#### PUT `/course/comment/reply/like/:lectureId/:commentId/:replyId`
Like/unlike a reply.

#### PUT `/course/comment/pin/:lectureId/:commentId`
Pin/unpin a comment (Educator only).

### Progress Endpoints

#### POST `/course/progress/update`
Update lecture progress.

**Request Body:**
```json
{
  "courseId": "course_id",
  "lectureId": "lecture_id",
  "watchedDuration": 120
}
```

#### GET `/course/progress/course/:courseId`
Get overall course progress.

#### GET `/course/progress/resume/:courseId`
Get resume point for a course.

### Enrollment Endpoints

#### POST `/course/enroll/:courseId`
Enroll in a course (Student only).

#### GET `/course/check-enrollment/:courseId`
Check enrollment status and validity.

#### GET `/course/user-enrollments`
Get all user enrollments.

### Certificate Endpoints

#### POST `/course/certificate/generate/:courseId`
Generate certificate for completed course.

#### GET `/course/certificate/:courseId`
Get certificate details.

#### GET `/course/certificate/download/:courseId`
Download certificate as PDF.

### Payment Endpoints

#### POST `/order/create`
Create payment order.

#### POST `/order/verify`
Verify payment.

### Review Endpoints

#### POST `/review/create`
Create a course review.

#### GET `/review/course/:courseId`
Get all reviews of a course.

### Coupon Endpoints

#### POST `/coupon/create`
Create a coupon (Admin only).

#### GET `/coupon/validate/:code`
Validate a coupon code.

#### GET `/coupon/all`
Get all coupons (Admin only).

### Notification Endpoints

#### GET `/notification`
Get user notifications.

#### PUT `/notification/:notificationId/read`
Mark notification as read.

#### PUT `/notification/read-all`
Mark all notifications as read.

#### DELETE `/notification/:notificationId`
Delete a notification.

#### DELETE `/notification/all`
Delete all notifications.

### Admin Endpoints

#### GET `/admin/stats`
Get admin dashboard statistics.

#### GET `/admin/users`
Get all users.

#### PUT `/admin/user/:userId/ban`
Ban/unban a user.

#### GET `/admin/courses`
Get all courses (including unpublished).

---

## 🗄 Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String,
  photoUrl: String,
  bio: String,
  phone: String,
  dateOfBirth: Date,
  gender: String (male, female, other),
  role: String (student, educator, admin),
  isBanned: Boolean,
  isVerified: Boolean,
  resetOtp: String,
  otpExpires: Date,
  isOtpVerifed: Boolean,
  enrolledCourses: [ObjectId],
  totalEarnings: Number,
  lastLogin: Date,
  currentSessionId: String,
  sessionDevice: String,
  sessionExpiresAt: Date,
  timestamps: true
}
```

### Course Model
```javascript
{
  title: String,
  subTitle: String,
  description: String,
  category: String,
  level: String (beginner, intermediate, advanced),
  price: Number,
  thumbnail: String,
  validity: {
    value: Number,
    unit: String (day, month, year)
  },
  modules: [ObjectId],
  creator: ObjectId,
  isPublished: Boolean,
  reviews: [ObjectId],
  timestamps: true
}
```

### Module Model
```javascript
{
  course: ObjectId,
  title: String,
  description: String,
  order: Number,
  timestamps: true
}
```

### Lecture Model
```javascript
{
  module: ObjectId,
  title: String,
  description: String,
  videoUrl: String,
  duration: Number,
  order: Number,
  quiz: [{
    question: String,
    options: [String],
    correctAnswer: Number
  }],
  resources: [{
    filename: String,
    url: String,
    mimeType: String
  }],
  timestamps: true
}
```

### Enrollment Model
```javascript
{
  user: ObjectId,
  course: ObjectId,
  enrolledAt: Date,
  expiresAt: Date,
  progress: Number,
  completed: Boolean,
  timestamps: true
}
```

### Lecture Progress Model
```javascript
{
  user: ObjectId,
  lecture: ObjectId,
  course: ObjectId,
  watchedDuration: Number,
  completed: Boolean,
  quizCompleted: Boolean,
  lastWatchedAt: Date,
  timestamps: true
}
```

### Notification Model
```javascript
{
  recipient: ObjectId,
  recipientRole: String,
  sender: ObjectId,
  title: String,
  message: String,
  type: String,
  category: String,
  actionUrl: String,
  resourceType: String,
  resourceId: ObjectId,
  metadata: Object,
  priority: String (low, medium, high),
  channels: {
    inApp: Boolean,
    email: Boolean,
    push: Boolean,
    sms: Boolean
  },
  isRead: Boolean,
  readAt: Date,
  expiresAt: Date,
  timestamps: true
}
```

### Review Model
```javascript
{
  user: ObjectId,
  course: ObjectId,
  rating: Number,
  comment: String,
  timestamps: true
}
```

### Coupon Model
```javascript
{
  code: String (unique),
  discountType: String (percentage, fixed),
  discountValue: Number,
  maxUses: Number,
  usedCount: Number,
  expiresAt: Date,
  isActive: Boolean,
  applicableCourses: [ObjectId],
  timestamps: true
}
```

### Certificate Model
```javascript
{
  user: ObjectId,
  course: ObjectId,
  certificateId: String (unique),
  issuedAt: Date,
  certificateUrl: String,
  timestamps: true
}
```

---

## 🔒 Authentication & Authorization

### Authentication Flow

1. **Registration**: User signs up with email and password
2. **OTP Verification**: OTP sent to email for verification
3. **Login**: User logs in with credentials
4. **Token Generation**: JWT token generated and stored in HTTP-only cookie
5. **Session Management**: Single device login enforced with session tracking

### Authentication Middleware (`isAuth`)

The `isAuth` middleware:
- Extracts JWT token from cookie or Authorization header
- Verifies token validity
- Checks if user is banned
- Validates session expiration
- Attaches user object to request

### Role-Based Authorization (`isRole`)

The `isRole` middleware:
- Checks if authenticated user has required role
- Supports multiple roles
- Returns 403 if access is denied

### Usage Example

```javascript
import isAuth from "../middleware/isAuth.js";
import isRole from "../middleware/isRole.js";

// Only authenticated users
router.get("/profile", isAuth, getProfile);

// Only educators
router.post("/create-course", isAuth, isRole("educator"), createCourse);

// Multiple roles
router.get("/admin-data", isAuth, isRole("admin", "educator"), getAdminData);
```

---

## 🔌 Socket.IO Integration

### Socket Configuration

Socket.IO is initialized in `index.js` and configured in `sockets/index.js`.

### Socket Events

#### Client Events
- `join:user` - User joins their personal room
- `disconnect` - User disconnects

#### Server Events
- `new-notification` - New notification sent to user
- `unread-count` - Updated unread count sent to user

### Socket Service Functions

#### `initializeSocket(io)`
Initialize Socket.IO instance.

#### `emitNotification(userId, notification)`
Emit notification to specific user room.

#### `emitUnreadCount(userId, count)`
Emit unread count to specific user room.

### Usage Example

```javascript
import { emitNotification } from "../service/socketNotificationService.js";

// Emit notification to user
emitNotification(userId, notificationData);
```

---

## 🔔 Notification System

### Notification Types

The system supports various notification types:
- `enrollment` - Course enrollment
- `course_published` - Course published
- `lecture_completed` - Lecture completed
- `quiz_completed` - Quiz completed
- `certificate_issued` - Certificate issued
- `comment_reply` - Comment reply received
- `payment_success` - Payment successful
- `payment_failed` - Payment failed
- `system` - System notifications

### Notification Channels

- **In-App**: Real-time via Socket.IO
- **Email**: Via Nodemailer
- **Push**: Via push notification service
- **SMS**: Via SMS service (configurable)

### Notification Service Functions

#### `createNotification(options)`
Create a single notification.

#### `createBulkNotifications(notifications)`
Create multiple notifications at once.

#### `getUserNotifications({ userId, page, limit })`
Get paginated user notifications.

#### `getUnreadCount(userId)`
Get count of unread notifications.

#### `markNotificationRead(notificationId)`
Mark a specific notification as read.

#### `markAllNotificationsRead(userId)`
Mark all user notifications as read.

#### `deleteNotification(notificationId)`
Delete a specific notification.

#### `deleteAllNotifications(userId)`
Delete all user notifications.

#### `deleteOldNotifications()`
Delete notifications older than 15 days (auto-cleanup).

### Usage Example

```javascript
import { createNotification } from "../service/notificationService.js";

await createNotification({
  recipient: userId,
  recipientRole: "student",
  title: "Course Enrolled!",
  message: "You have successfully enrolled in the course.",
  type: "enrollment",
  category: "course",
  actionUrl: `/course/${courseId}`,
  resourceType: "Course",
  resourceId: courseId,
  priority: "high",
  channels: {
    inApp: true,
    email: true,
    push: false,
    sms: false
  }
});
```

---

## 📤 File Upload & Cloudinary

### Multer Configuration

File uploads are handled by Multer middleware configured in `middleware/multer.js`.

### Supported File Types

- **Images**: JPG, JPEG, PNG, GIF, WEBP
- **Videos**: MP4, MOV, AVI
- **Documents**: PDF, DOC, DOCX
- **Resources**: Various file types for lecture resources

### Cloudinary Integration

- Images and videos are uploaded to Cloudinary
- Cloudinary provides CDN delivery
- Automatic optimization and transformation
- Secure upload with API signature

### Upload Endpoints

#### Course Thumbnail
```javascript
POST /course/editcourse/:courseId
Content-Type: multipart/form-data
Body: thumbnail (file)
```

#### Lecture Video
```javascript
POST /course/editlecture/:lectureId
Content-Type: multipart/form-data
Body: videoUrl (file)
```

#### Lecture Resources
```javascript
POST /course/upload-resource/:lectureId
Content-Type: multipart/form-data
Body: files (array, max 20 files)
```

---

## 💳 Payment Integration

### Razorpay Integration

The backend uses Razorpay for payment processing.

### Payment Flow

1. **Order Creation**: Create order with Razorpay
2. **Payment Initiation**: Frontend initiates payment
3. **Payment Verification**: Verify payment signature on backend
4. **Enrollment**: Enroll user after successful payment
5. **Notification**: Send payment success notification

### Payment Endpoints

#### Create Order
```javascript
POST /order/create
Body: {
  courseId: "course_id",
  amount: 99900  // Amount in paise
}
```

#### Verify Payment
```javascript
POST /order/verify
Body: {
  razorpay_order_id: "order_id",
  razorpay_payment_id: "payment_id",
  razorpay_signature: "signature"
}
```

### Coupon Support

- Apply coupon codes during payment
- Percentage and fixed amount discounts
- Usage limits and expiration
- Course-specific coupons

---

## 📜 Certificate Generation

### Certificate System

Certificates are generated using PDFKit upon course completion.

### Certificate Features

- Unique certificate ID
- User and course information
- Issue date
- Professional design
- PDF download

### Certificate Endpoints

#### Generate Certificate
```javascript
POST /course/certificate/generate/:courseId
```

#### Get Certificate
```javascript
GET /course/certificate/:courseId
```

#### Download Certificate
```javascript
GET /course/certificate/download/:courseId
```

### Certificate Requirements

- Course must be completed (100% progress)
- All lectures must be marked as completed
- All quizzes must be completed
- User must be enrolled in the course

---

## 🎥 Video Processing

### HLS Streaming

Video lectures are converted to HLS format for adaptive streaming.

### Video Processing Tools

- **ffmpeg-static**: Static FFmpeg binaries
- **fluent-ffmpeg**: Node.js wrapper for FFmpeg
- **hls.js**: HLS playback in browser

### Video Processing Flow

1. Upload video file
2. Convert to HLS format
3. Generate segments and playlist
4. Upload to Cloudinary
5. Stream via HLS

### Utility Functions

#### `convertToHLS(videoPath, outputPath)`
Convert video to HLS format.

---

## 🏃 Running the Server

### Development Mode

```bash
npm run dev
```

This starts the server with Nodemon for auto-restart on file changes.

### Production Mode

```bash
node index.js
```

### Server Health Check

```bash
GET http://localhost:5000/
```

Returns: "Hello from Server"

---

## 📜 Scripts

### Available Scripts

```json
{
  "dev": "nodemon index.js"
}
```

### Utility Scripts

- **checkCourses.js**: Check course data integrity
- **migrateProgress.js**: Migrate progress data
- **createAdmin.js**: Create admin user (in config/)

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Style

- Use ES6+ syntax
- Follow existing code structure
- Add comments for complex logic
- Use meaningful variable names

### Commit Messages

- Use clear, descriptive commit messages
- Follow conventional commit format
- Reference related issues

---

## 📝 License

ISC License

---

## 👥 Authors

- SkillBridge Team

---

## 🙏 Acknowledgments

- Express.js team
- MongoDB
- Socket.IO
- Razorpay
- Cloudinary
- All open-source contributors

---

## 📞 Support

For support and queries, please contact the development team.

---

## 🔄 Version History

### Version 1.0.0
- Initial release
- Core LMS features
- Authentication and authorization
- Course management
- Enrollment system
- Payment integration
- Notification system
- Certificate generation

---

**Note:** This backend is designed to work with a frontend application. Ensure proper CORS configuration and environment setup for seamless integration.
