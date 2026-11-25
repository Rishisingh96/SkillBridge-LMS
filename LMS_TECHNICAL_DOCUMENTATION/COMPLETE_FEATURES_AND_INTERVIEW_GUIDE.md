# SkillBridge LMS — Complete Feature Inventory and Interview Guide

This document is based on a source-code audit of the current SkillBridge-LMS working tree. It separates **Implemented**, **Partial**, **Broken**, **Missing**, **Unused/dead**, and **Unverified** behavior so the project can be discussed honestly in interviews.

## Status Legend

- **Implemented** — code path exists and is wired end-to-end, subject to normal runtime verification.
- **Partial** — useful code exists, but the feature is incomplete, insecure, or only works in limited cases.
- **Broken** — code exists but a visible mismatch/import/endpoint issue prevents reliable use.
- **Missing** — required product behavior is not present.
- **Unused/dead** — files or utilities exist but are not routed/imported in the active application.
- **Unverified** — external service or runtime behavior cannot be confirmed from source alone.

## High-Level Architecture

SkillBridge is a MERN-style learning management system:

- **Frontend:** React 18 + Vite SPA, React Router, Redux Toolkit + Redux Persist, Axios, Socket.IO client, Tailwind CSS, Recharts, Framer Motion, Firebase client SDK, HLS.js dependency, React Helmet Async, React Markdown.
- **Backend:** Node.js ESM + Express 5, MongoDB + Mongoose, JWT auth with HTTP-only cookie/Bearer fallback, Razorpay, Cloudinary, Multer, PDFKit, Nodemailer, Socket.IO, Google GenAI.
- **Runtime split:** `backend/index.js` creates the HTTP server, initializes Socket.IO, connects MongoDB, and schedules notification cleanup. `backend/app.js` mounts all REST routers and the centralized error handler.
- **Frontend bootstrap:** `frontend/src/main.jsx` wraps the app in `StrictMode`, `HelmetProvider`, `BrowserRouter`, Redux `Provider`, `ThemeProvider`, `PersistGate`, and Google Analytics. `frontend/src/App.jsx` lazy-loads routes and applies role-based page guards.

---

# Part 1 — Complete Feature Inventory

## 1. Authentication and Session Management

**Status:** Partial — email/password auth works in code, but role selection and Google auth have serious trust issues.

### What it does

Users can sign up, log in, log out, reset password with OTP, and attempt Google sign-in. JWT authentication is enforced by `backend/middleware/isAuth.js`, which accepts either the `token` HTTP-only cookie or an `Authorization: Bearer` token.

### Why it is needed

Authentication protects user profiles, enrollments, progress, payments, comments, notifications, educator/admin actions, and paid content.

### Roles

Student, educator, and admin.

### Frontend files

- `frontend/src/pages/auth/SignUp.jsx`
- `frontend/src/pages/auth/Login.jsx`
- `frontend/src/pages/auth/ForgetPassword.jsx`
- `frontend/src/redux/slices/userSlice.js`
- `frontend/src/utils/firebase.js`
- `frontend/src/App.jsx`

### Backend files

- `backend/routes/authRoute.js`
- `backend/controller/authController.js`
- `backend/middleware/isAuth.js`
- `backend/middleware/isRole.js`
- `backend/models/userModel.js`

### APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/signup` | Create account and return user/JWT cookie |
| POST | `/api/auth/login` | Verify credentials and return user/JWT cookie |
| GET | `/api/auth/logout` | Clear auth cookie |
| POST | `/api/auth/sendotp` | Generate/store password-reset OTP |
| POST | `/api/auth/verifyotp` | Verify OTP |
| POST | `/api/auth/resetpassword` | Reset password after OTP |
| POST | `/api/auth/googleauth` | Create/login Google-style user |
| POST | `/api/auth/clearsession` | Clear stored session fields by email |

### Database models

- `User` (`backend/models/userModel.js`) stores `name`, `email`, hashed `password`, `role`, `photoUrl`, `bio`, `phone`, `gender`, `dateOfBirth`, `enrolledCourses`, `createdCourses`, `isBanned`, `totalEarnings`, OTP fields, and session fields.

### Working flow

1. Signup/login posts credentials to `/api/auth/*`.
2. Backend validates input, hashes or compares password with `bcryptjs`, creates a JWT containing the user ID, sets the `token` cookie, and returns user data.
3. Frontend dispatches `setUserData(user)` into Redux and redirects by `user.role`.
4. Protected API calls send cookies via `withCredentials: true` or Bearer tokens.
5. `isAuth` verifies JWT, loads the user, checks ban/session expiry, and attaches `req.user`/`req.userId`.

### Implementation status and limitations

- **Implemented:** password hashing, JWT cookie/Bearer auth, logout, OTP endpoints, role middleware, ban/session checks.
- **Partial/unsafe:** `signUP` accepts client-provided `role`, so a user can self-register as `admin` or `educator` unless externally constrained. `googleAuth` trusts client-supplied `name`, `email`, `photoUrl`, and `role` without verifying a Google/Firebase ID token. `currentSessionId` is generated but not embedded in the JWT, so single-session invalidation is not truly enforced. `clearSession` is unauthenticated. OTP uses `Math.random()`, is stored in plaintext, and lacks robust rate limiting/attempt limits.
- **Improvements:** allow only `student`/`educator` at signup or require admin approval; verify Firebase/Google ID tokens server-side; put `sessionId` in JWT and compare it to `user.currentSessionId`; hash/expire OTPs and add rate limits; remove sensitive auth logging.

---

## 2. Profile Management

**Status:** Implemented, with upload and deletion caveats.

### What it does

Users can view profile details, edit name/bio/phone/gender/date of birth, upload a profile photo, change password, view enrolled/created courses, and delete their account.

### Roles

All authenticated users.

### Frontend files

- `frontend/src/pages/student/Profile.jsx`
- `frontend/src/pages/student/EditProfile.jsx`
- `frontend/src/redux/slices/userSlice.js`
- `frontend/src/components/navbar/Navbar.jsx`

### Backend files

- `backend/routes/userRoute.js`
- `backend/controller/userController.js`
- `backend/models/userModel.js`
- `backend/config/cloudinary.js`
- `backend/middleware/multer.js`

### APIs

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/user/getcurrentuser` | Load current user and populate enrolled courses |
| PUT | `/api/user/updateprofile` | Update profile fields and optional photo |
| PUT | `/api/user/changepassword` | Change password after old-password check |
| GET | `/api/user/enrolledcourses` | Get populated enrolled courses |
| DELETE | `/api/user/deleteaccount` | Delete user and clear cookie |
| GET | `/api/user/:userId` | Admin-only user lookup |

### Database models

- `User`

### Working flow

1. `App.jsx`/`userSlice.fetchCurrentUser` calls `/api/user/getcurrentuser`.
2. `Profile.jsx` renders `userData` from Redux.
3. `EditProfile.jsx` builds `FormData`, appends fields and optional `photo`, and dispatches `updateProfileData`.
4. Backend uploads photo to Cloudinary if present, updates allowed fields, returns sanitized user.
5. Password change verifies old password with bcrypt and rejects Google users without passwords.

### Limitations and improvements

- Profile photo upload depends on Multer/Cloudinary and has no obvious avatar-specific size/type policy beyond generic upload filtering.
- `deleteAccount` removes the user but does not cascade enrollments, progress, reviews, comments, notifications, certificates, or created courses.
- Email is not editable; add verified email-change flow.
- Add profile validation for phone/date/gender and stronger file-type checks.

---

## 3. Role-Based Access and Route Guards

**Status:** Partial — frontend role checks exist, backend role middleware exists, but several sensitive routes rely only on role rather than ownership.

### What it does

The app separates student, educator, and admin experiences. `App.jsx` lazy-loads role dashboards and redirects users to role-specific homes. Backend `isRole` protects educator/admin endpoints.

### Frontend files

- `frontend/src/App.jsx`
- `frontend/src/components/navbar/Navbar.jsx`
- `frontend/src/components/admin/AdminSidebar.jsx`
- `frontend/src/components/studentDashboard/Sidebar.jsx`

### Backend files

- `backend/middleware/isAuth.js`
- `backend/middleware/isRole.js`
- `backend/routes/*.js`

### APIs

No dedicated API; enforced across all protected routers.

### Database models

- `User.role`

### Working flow

1. Login/signup returns `role`.
2. Frontend stores user in Redux and routes by role.
3. `App.jsx` checks `userData.role` before rendering `/student`, `/educator`, or `/admin` routes.
4. Backend applies `isAuth` and `isRole("educator"|"admin")` to protected endpoints.

### Limitations and improvements

- Frontend guards are UX only; backend must remain authoritative.
- Several educator endpoints check role but not course ownership, so one educator may modify another educator’s course/module/lecture.
- Blog write routes use `isRole("educator")` but the comment says educator/admin; admin may be excluded depending on `isRole` implementation.
- Add ownership checks (`course.creator === req.userId`) and admin override rules.

---

## 4. Student Dashboard

**Status:** Partial — UI components exist, but several widgets appear static or disconnected from verified backend analytics.

### What it does

Shows welcome banner, stats cards, learning streak, calendar, leaderboard, notifications access, enrolled-course entry points, and a floating contact widget.

### Roles

Student.

### Frontend files

- `frontend/src/pages/student/StudentDashboard.jsx`
- `frontend/src/components/studentDashboard/StatsCards.jsx`
- `frontend/src/components/studentDashboard/LearningStreak.jsx`
- `frontend/src/components/studentDashboard/Calendar.jsx`
- `frontend/src/components/studentDashboard/Leaderboard.jsx`
- `frontend/src/components/studentDashboard/TopBanner.jsx`
- `frontend/src/components/shared/FloatingChatWidget.jsx`

### Backend files

- `backend/controller/progressController.js`
- `backend/controller/enrollMentController.js`
- `backend/controller/notificationController.js`

### APIs

- `GET /api/course/progress/course/:courseId`
- `GET /api/enrollment/user` and `GET /api/course/user-enrollments`
- `GET /api/notification`

### Database models

- `LectureProgress`, `Enrollment`, `Notification`, `Course`, `User`

### Working flow

1. Student dashboard mounts and renders widgets.
2. Some widgets use Redux/local data; others call notification/progress/enrollment APIs.
3. `FloatingChatWidget` is only a call/WhatsApp contact widget, not an AI chat.

### Limitations and improvements

- Streak/calendar/leaderboard should be verified against real persisted data; if they are hard-coded or derived only locally, label them as UI-only.
- Add backend student analytics endpoints for accurate streaks, weekly activity, and leaderboard.

---

## 5. Course Discovery, Listing, and Course Detail

**Status:** Implemented for published course browsing; partial for review/rating aggregation and SEO.

### What it does

Students can browse published courses, filter by category, search by title client-side, open course details, view modules/lectures, submit reviews, enroll, and start learning.

### Roles

Public/student for browsing; student for enrollment/review.

### Frontend files

- `frontend/src/pages/student/AllCourses.jsx`
- `frontend/src/pages/home/Home.jsx`
- `frontend/src/pages/student/CourseDetail.jsx`
- `frontend/src/components/home/component/CourseCard.jsx`
- `frontend/src/components/seo/SEO.jsx`
- `frontend/src/components/seo/SchemaData.jsx`

### Backend files

- `backend/routes/courseRoute.js`
- `backend/controller/courseController.js`
- `backend/models/courseModel.js`
- `backend/models/reviewModel.js`

### APIs

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/course/getpublished` | Published courses with populated modules/creator |
| GET | `/api/course/getcourse/:courseId` | Single course details |
| POST | `/api/course/creator` | Get creator by ID |
| POST | `/api/review/createreview` | Create course review |
| GET | `/api/review/getreview` | Get all reviews |

### Database models

- `Course`, `Review`, `User`, `Module`, `Lecture`

### Working flow

1. `AllCourses.jsx` dispatches `fetchPublishedCourses()`.
2. Course cards link to `/course/:courseId`.
3. `CourseDetail.jsx` fetches course/modules/enrollment status, renders SEO/schema, modules, reviews, and enrollment/payment buttons.
4. Paid courses call Razorpay order/verify endpoints; free courses are intended to call enrollment endpoint.

### Limitations and improvements

- Search/filtering is client-side only on loaded published courses.
- `getPublishedCourses` populates nested modules/lectures publicly, exposing video/resource URLs before enrollment checks.
- Review list endpoint returns all reviews globally; course detail should filter by course.
- Add server-side search, pagination, average rating calculation, and enrollment-aware content serialization.

---

## 6. Course Management

**Status:** Partial — CRUD exists, but ownership checks and cascading deletes are incomplete.

### What it does

Educators can create, edit, publish/unpublish, preview, and delete courses. Admins can list/delete/publish-toggle courses platform-wide.

### Roles

Educator for own courses; admin for platform moderation.

### Frontend files

- `frontend/src/pages/educator/Courses.jsx`
- `frontend/src/pages/educator/CreateCourse.jsx`
- `frontend/src/pages/educator/EditCourse.jsx`
- `frontend/src/pages/educator/ViewCourse.jsx`
- `frontend/src/pages/admin/ManageCourses.jsx`
- `frontend/src/redux/slices/courseSlice.js`
- `frontend/src/redux/actions/courseAction.js`

### Backend files

- `backend/routes/courseRoute.js`
- `backend/controller/courseController.js`
- `backend/routes/adminRoute.js`
- `backend/controller/adminController.js`
- `backend/models/courseModel.js`

### APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/course/create` | Create course |
| GET | `/api/course/getcreator` | Educator’s courses |
| PUT | `/api/course/editcourse/:courseId` | Edit course/thumbnail |
| GET | `/api/course/getcourse/:courseId` | Get course |
| DELETE | `/api/course/remove/:courseId` | Delete course |
| GET | `/api/course/getpublished` | Published courses |
| GET | `/api/course/all-courses` | Admin course list |
| PUT | `/api/course/publish/:courseId` | Toggle publish |
| PUT | `/api/course/unpublish/:courseId` | Toggle publish alias |
| GET | `/api/admin/courses` | Admin course list |
| DELETE | `/api/admin/course/:courseId` | Admin delete |
| PUT | `/api/admin/course/publish/:courseId` | Admin publish toggle |

### Database models

- `Course`, `Module`, `Lecture`, `Enrollment`, `Review`, `User`

### Working flow

1. Educator creates course with thumbnail upload.
2. Course is saved with `creator: req.userId`.
3. Educator adds modules/lectures/resources/quizzes.
4. Educator publishes course.
5. Students see it through `/api/course/getpublished`.

### Limitations and improvements

- `editCourse`, `deleteCourse`, `togglePublishCourse`, module/lecture/resource/quiz endpoints generally check `isRole("educator")` but not ownership.
- `removeCourse`/admin delete does not reliably cascade modules, lectures, enrollments, reviews, progress, comments, or Cloudinary assets.
- Add ownership middleware, transaction/cleanup jobs, and soft-delete/archive option.

---

## 7. Module Management

**Status:** Partial — CRUD exists but ownership checks and hierarchy consistency need work.

### What it does

Educators organize lectures into modules inside a course. Students view modules/lectures through course endpoints.

### Roles

Educator manages; student consumes.

### Frontend files

- `frontend/src/pages/educator/Module.jsx` or module-related educator pages
- `frontend/src/redux/slices/moduleSlice.js`
- `frontend/src/components/lecture/ModuleList.jsx`
- `frontend/src/components/progress/ModuleAccordion.jsx`

### Backend files

- `backend/routes/courseRoute.js`
- `backend/controller/moduleController.js`
- `backend/models/moduleModel.js`
- `backend/models/courseModel.js`
- `backend/models/lectureModel.js`

### APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/course/create-module/:courseId` | Create module |
| GET | `/api/course/course-modules/:courseId` | Get modules with lectures/progress merge |
| PUT | `/api/course/update-module/:moduleId` | Intended update; frontend slice calls this but route is missing |
| DELETE | `/api/course/remove-module/:moduleId` | Delete module |
| DELETE | `/api/course/remove-all-modules/:courseId` | Delete all modules |

### Database models

- `Module`, `Course`, `Lecture`, `LectureProgress`

### Working flow

1. Educator creates module under course.
2. Lectures are attached to module.
3. `getCourseModules` populates lectures and merges user progress when authenticated.
4. Student UI renders modules and selects lectures.

### Limitations and improvements

- `moduleSlice.js` calls `PUT /api/course/update-module/:moduleId`, but `courseRoute.js` does not define that route, so module update is broken unless another path handles it.
- `removeLecture` pulls lecture IDs from `Course.lectures` even though lectures are primarily referenced through `Module`, which can leave dangling module references.
- Add explicit `course` ownership checks and transaction-safe hierarchy updates.

---

## 8. Lecture Management and Resources

**Status:** Partial — lecture CRUD/resource upload exist, but ownership/content protection is weak.

### What it does

Educators create/edit/delete lectures, upload videos, attach downloadable resources, add/remove quiz questions, and mark completion flags. Students consume lectures, resources, quizzes, comments, and AI chat.

### Roles

Educator manages; student consumes.

### Frontend files

- `frontend/src/pages/educator/CreateLecture.jsx`
- `frontend/src/pages/educator/EditLecture.jsx`
- `frontend/src/pages/educator/ResourcesUpload.jsx`
- `frontend/src/pages/educator/QuizUpload.jsx`
- `frontend/src/redux/slices/lectureSlice.js`
- `frontend/src/components/lecture/LectureResources.jsx`
- `frontend/src/components/lecture/LecturePlayer.jsx`

### Backend files

- `backend/routes/courseRoute.js`
- `backend/controller/lectureController.js`
- `backend/controller/uploadLectureResource.js`
- `backend/controller/quizController.js`
- `backend/models/lectureModel.js`

### APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/course/createlecture/:moduleId` | Create lecture |
| GET | `/api/course/courselecture/:moduleId` | Educator lecture list |
| POST | `/api/course/editlecture/:lectureId` | Edit lecture/video |
| DELETE | `/api/course/removelecture/:lectureId` | Delete lecture |
| DELETE | `/api/course/remove-lecture-video/:lectureId` | Remove video |
| PUT | `/api/course/mark-lecture-completed/:lectureId` | Mark lecture complete |
| PUT | `/api/course/mark-quiz-completed/:lectureId` | Mark quiz complete |
| POST | `/api/course/upload-resource/:lectureId` | Upload up to 20 resources |
| DELETE | `/api/course/removeresource/:lectureId/:resourceId` | Remove resource |
| GET | `/api/course/download-resource/:lectureId/:resourceId` | Download resource |
| GET | `/api/course/lecture-resources/:lectureId` | List resources |
| POST | `/api/course/add-quiz/:lectureId` | Add quiz question |
| DELETE | `/api/course/remove-quiz/:lectureId/:quizId` | Remove quiz question |
| GET | `/api/course/get-quiz/:lectureId` | Get quiz questions |

### Database models

- `Lecture`, `Module`, `Course`, `LectureProgress`, `User`

### Working flow

1. Educator creates lecture under module.
2. Video/resource files upload through Multer to local temp then Cloudinary.
3. Lecture stores `video.fileUrl`, `video.publicId`, `resources[]`, `quizQuestions[]`, preview/free flags, duration, and order.
4. Student selects lecture; `LecturePlayer` loads `lecture.video.fileUrl`, tracks position, and calls progress endpoints.

### Limitations and improvements

- Lecture/module endpoints do not reliably verify course ownership or active enrollment before returning content.
- `getLectureQuiz` is authenticated but returns `correctAnswer` to students.
- Resource download is authenticated but may not verify enrollment/ownership.
- Add signed/short-lived video URLs, enrollment checks, and sanitized quiz payloads.

---

## 9. Video Streaming and HLS

**Status:** Partial/unused — direct MP4 Cloudinary playback is implemented; HLS conversion exists but is unused and unverified.

### What it does

Lecture videos are uploaded to Cloudinary and played in a browser `<video>` element. Progress tracking resumes playback and marks completion. HLS dependencies and FFmpeg utilities exist, but no active route uses them.

### Roles

Educator uploads; student watches.

### Frontend files

- `frontend/src/components/lecture/LecturePlayer.jsx`
- `frontend/src/components/progress/VideoPlayer.jsx` — unused/broken alternate player
- `frontend/src/pages/course-learning/CourseLearning.jsx` — unrouted/broken learning page
- `frontend/package.json` — includes `hls.js`

### Backend files

- `backend/config/cloudinary.js`
- `backend/controller/lectureController.js`
- `backend/utils/convertToHLS.js` — unused
- `backend/middleware/multer.js`
- `backend/package.json` — includes FFmpeg dependencies

### APIs

- `POST /api/course/createlecture/:moduleId`
- `POST /api/course/editlecture/:lectureId`
- `GET /api/course/course-modules/:courseId`
- `POST /api/course/progress/update`
- `PUT /api/course/mark-lecture-completed/:lectureId`

### Database models

- `Lecture`, `LectureProgress`, `Module`, `Course`

### Working flow

1. Educator uploads MP4 through lecture create/edit.
2. `uploadOnCloudinary` uploads file and returns `fileUrl`, `publicId`, `resourceType`, and duration.
3. `LecturePlayer` sets `video.src = lecture.video.fileUrl`.
4. Player sends progress updates and marks completion on `ended`.

### Limitations and improvements

- No true adaptive bitrate streaming is active. `hls.js` is installed but not imported; `convertToHLS.js` is not called.
- Public module endpoints can expose direct Cloudinary URLs.
- Frontend attempts basic DRM-like controls (`controlsList`, `disablePictureInPicture`, right-click blocking), but these are not real protection.
- For production, implement HLS/DASH with signed URLs or a protected streaming endpoint, tokenized playback, and server-side progress validation.

---

## 10. Enrollment and Course Validity

**Status:** Partial — backend enrollment model/helpers exist, but frontend free-enrollment path calls the wrong endpoint and paid enrollment trusts client data.

### What it does

Free courses create `Enrollment` records with start/end dates based on course validity. Paid courses create enrollments after Razorpay verification. Expired enrollments are marked expired and removed from user course lists.

### Roles

Student enrolls; educator/admin view stats.

### Frontend files

- `frontend/src/pages/student/CourseDetail.jsx`
- `frontend/src/pages/student/CheckoutPage.jsx` — currently broken due missing `useDispatch` import
- `frontend/src/pages/student/MyEnrolledCourses.jsx`
- `frontend/src/pages/student/ViewLecture.jsx`
- `frontend/src/redux/slices/enrollmentSlice.js`

### Backend files

- `backend/routes/enrollmentRoute.js`
- `backend/controller/enrollMentController.js`
- `backend/helpers/enrollmentHelpers.js`
- `backend/models/enrollmentModel.js`
- `backend/models/courseModel.js`
- `backend/models/userModel.js`

### APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/enrollment/enroll/:courseId` | Enroll in free course |
| GET | `/api/enrollment/user` | User enrollments |
| GET | `/api/enrollment/check/:courseId` | Check active enrollment |
| GET | `/api/course/user-enrollments` | User enrollments with validity |
| POST | `/api/course/enroll/:courseId` | Intended legacy path; not defined in `courseRoute.js` |

### Database models

- `Enrollment`, `Course`, `User`

### Working flow

1. Student opens course detail.
2. Frontend checks `/api/enrollment/check/:courseId`.
3. Free course should call `/api/enrollment/enroll/:courseId`; `CourseDetail.jsx` currently calls `/api/course/enroll/:courseId`, which is not mounted.
4. Backend calculates `startDate`/`endDate`, creates enrollment, updates user enrolled courses, sends notifications.
5. `checkEnrollmentStatus` marks expired enrollments and returns `isEnrolled`, `isActive`, `daysRemaining`.

### Limitations and improvements

- Fix frontend free-enrollment URL or add backend alias.
- `CourseDetail` may attempt free enrollment through a non-existent route.
- Expired enrollment re-enrollment can hit unique-index/upsert edge cases depending on schema.
- Add idempotent enrollment creation and clearer expired-renewal flow.

---

## 11. Payments — Razorpay

**Status:** Partial — Razorpay order creation and HMAC verification exist, but amount/course binding and idempotency are weak.

### What it does

Students purchase paid courses through Razorpay Checkout. Backend creates an order, frontend opens Razorpay, and backend verifies `razorpay_signature` before creating enrollment, updating educator earnings, and applying coupon usage.

### Roles

Student pays; educator receives earnings stats; admin monitors platform.

### Frontend files

- `frontend/src/pages/student/CourseDetail.jsx`
- `frontend/src/pages/student/CheckoutPage.jsx` — broken import
- `frontend/src/pages/educator/ViewCourse.jsx`
- `frontend/src/redux/slices/courseSlice.js`

### Backend files

- `backend/routes/paymentRoute.js`
- `backend/controller/orderController.js`
- `backend/models/enrollmentModel.js`
- `backend/models/courseModel.js`
- `backend/models/couponModel.js`
- `backend/helpers/enrollmentHelpers.js`

### APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/order/razorpay-order` | Create Razorpay order |
| POST | `/api/order/verifypayment` | Verify signature and enroll |

### Database models

- `Enrollment`, `Course`, `User`, `Coupon`

### Working flow

1. Frontend posts `{ courseId, discount }` to `/api/order/razorpay-order`.
2. Backend loads course, computes `finalPrice = max(course.price - discount, 0)`, creates Razorpay order in paise.
3. Frontend opens Razorpay Checkout with order ID/key.
4. Razorpay returns `razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature`.
5. Frontend posts these plus course/customer/coupon fields to `/api/order/verifypayment`.
6. Backend verifies HMAC-SHA256 signature using `RAZORPAY_KEY_SECRET`.
7. Backend upserts enrollment by `{ user, course }`, updates user enrolled courses, increments educator `totalEarnings`, increments coupon `usedCount`, sends notifications.

### Limitations and improvements

- `RazorPayOrder` trusts client-supplied `discount`; it should accept `couponId`/`couponCode` and recompute discount server-side.
- `VerifyPayment` verifies signature but trusts `courseId`, `discountAmount`, `couponId`, `originalPrice`, and customer fields from the request body. It does not fetch the Razorpay order/payment to confirm amount, currency, status, or course binding.
- Duplicate callbacks can repeat educator earnings and coupon increments because enrollment upsert does not make side effects idempotent.
- No payment ledger/refund model exists.
- Add order records, webhook verification, amount/course checks, idempotency keys, and transactional side effects.

---

## 12. Coupons

**Status:** Partial — coupon CRUD/apply logic exists, but payment verification does not revalidate coupon server-side.

### What it does

Admins/educators create percentage/fixed coupons with limits, expiry, min purchase, and course applicability. Students apply coupons during checkout to preview discount.

### Roles

Admin manages all; educator manages own coupons; student applies.

### Frontend files

- `frontend/src/pages/admin/Coupons.jsx`
- `frontend/src/pages/educator/Coupons.jsx` or shared coupon page
- `frontend/src/pages/student/CheckoutPage.jsx`
- `frontend/src/redux/slices/couponSlice.js`

### Backend files

- `backend/routes/coupon.routes.js`
- `backend/controller/couponController.js`
- `backend/models/couponModel.js`

### APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/coupon/create` | Create coupon |
| POST | `/api/coupon/apply` | Validate coupon and return discount |
| GET | `/api/coupon/all` | Admin list |
| GET | `/api/coupon/my-coupons` | Educator list |
| GET | `/api/coupon/:id` | Single coupon |
| PUT | `/api/coupon/update/:id` | Update coupon |
| DELETE | `/api/coupon/delete/:id` | Delete coupon |
| PATCH | `/api/coupon/toggle/:id` | Toggle active |

### Database models

- `Coupon`, `Course`, `User`, `Enrollment`

### Working flow

1. Creator submits coupon form.
2. Backend validates unique code, educator ownership for specific courses, creates coupon.
3. Checkout calls `/api/coupon/apply` with code/course.
4. Backend checks active, expiry, usage limit, course applicability, min purchase, computes discount.
5. Payment verification is supposed to consume coupon usage.

### Limitations and improvements

- `applyCoupon` computes discount but does not reserve usage; multiple users can race.
- `VerifyPayment` trusts `couponId`, `discountAmount`, and `couponCode` without revalidating coupon state.
- Educator coupon ownership is checked at creation for specific courses, but update/delete/toggle may not re-check ownership.
- Add atomic coupon usage reservation, server-side discount recomputation, and per-user usage limits.

---

## 13. Quizzes

**Status:** Partial/broken end-to-end — educator can add questions and student UI can answer, but scoring is client-side and answers leak.

### What it does

Educators attach quiz questions to lectures. Students answer questions in `QuizResult.jsx`, see a client-calculated score, and can call `mark-quiz-completed`.

### Roles

Educator creates/removes; student attempts.

### Frontend files

- `frontend/src/pages/educator/QuizUpload.jsx`
- `frontend/src/components/lecture/QuizResult.jsx`
- `frontend/src/components/lecture/LecturePlayer.jsx`

### Backend files

- `backend/routes/courseRoute.js`
- `backend/controller/quizController.js`
- `backend/models/lectureModel.js`
- `backend/models/lectureProgressModel.js`

### APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/course/add-quiz/:lectureId` | Add quiz question |
| DELETE | `/api/course/remove-quiz/:lectureId/:quizId` | Remove question |
| GET | `/api/course/get-quiz/:lectureId` | Get quiz questions |
| PUT | `/api/course/mark-quiz-completed/:lectureId` | Mark quiz completed |

### Database models

- `Lecture.quizQuestions`, `LectureProgress.isQuizCompleted`

### Working flow

1. Educator posts `{ question, options, correctAnswer }` to `add-quiz`.
2. `getLectureQuiz` returns full question objects including `correctAnswer`.
3. `QuizResult.jsx` renders questions/options, stores selected answers locally, computes score by comparing `selectedAnswers[i] === q.correctAnswer`.
4. Student can call `mark-quiz-completed`, which sets `LectureProgress.isQuizCompleted`.

### Limitations and improvements

- No answer-submission/scoring endpoint exists; score is computed in browser.
- `correctAnswer` is exposed to students, making quizzes trivially gameable.
- `markQuizCompleted` only sets a flag and does not verify attempted score or attempt count.
- `quizAttempts` model appears unused.
- Add server-side quiz attempt model, sanitized question payload, answer submission endpoint, scoring, retake policy, and progress gating.

---

## 14. Learning Progress

**Status:** Implemented after route fix — progress APIs are now authenticated and merge into module payloads; completion logic is basic.

### What it does

Tracks current playback position, max position, watch time, progress percent, lecture/quiz completion, last access time, course-level totals, and resume lecture.

### Roles

Student progress; educator dashboard uses aggregate completion.

### Frontend files

- `frontend/src/components/lecture/LecturePlayer.jsx`
- `frontend/src/components/progress/VideoPlayer.jsx` — unused/broken
- `frontend/src/components/progress/ResumeLearningButton.jsx`
- `frontend/src/components/progress/CourseSidebar.jsx`
- `frontend/src/redux/slices/progressSlice.js`
- `frontend/src/pages/student/ViewLecture.jsx`

### Backend files

- `backend/routes/courseRoute.js`
- `backend/controller/progressController.js`
- `backend/models/lectureProgressModel.js`
- `backend/models/lectureModel.js`
- `backend/models/moduleModel.js`

### APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/course/progress/update` | Update lecture position/progress |
| GET | `/api/course/progress/course/:courseId` | Course progress summary |
| GET | `/api/course/progress/resume/:courseId` | Last accessed lecture/position |
| PUT | `/api/course/mark-lecture-completed/:lectureId` | Mark lecture complete |
| PUT | `/api/course/mark-quiz-completed/:lectureId` | Mark quiz complete |

### Database models

- `LectureProgress`, `Lecture`, `Module`, `Course`, `User`

### Working flow

1. `LecturePlayer` listens to `timeupdate`, `play`, `pause`, and `ended`.
2. It posts `{ lectureId, currentPosition }` to `/api/course/progress/update`.
3. Backend upserts `LectureProgress` by `{ user, lecture }`, updates `currentPosition`, `maxPosition`, `watchTime`, `lastAccessedAt`, `progressPercent`.
4. At `>=95%`, `completed` is set automatically; `ended` also calls `mark-lecture-completed`.
5. `getCourseModules` merges progress fields into lectures for the authenticated user.
6. `getCourseProgress` returns totals and per-lecture progress map.

### Limitations and improvements

- Progress is trusted from client position; a user can call the API with arbitrary `currentPosition`.
- Completion is based on position/duration rather than verified watch time or heartbeats.
- `resumeLecture` returns full lecture data; ensure enrollment check before exposing video URL.
- Add server-side duration validation, minimum watch-time thresholds, heartbeat/session tracking, and enrollment checks.

---

## 15. Certificates

**Status:** Partial — certificate generation/download exists, but eligibility logic has a questionable fallback and PDF is generated on demand.

### What it does

Students can generate a certificate after reaching 70% course progress, view certificate records, and download a PDF generated by PDFKit.

### Roles

Student earns/views/downloads.

### Frontend files

- `frontend/src/pages/student/Certificates.jsx`
- `frontend/src/redux/slices/certificateSlice.js`
- `frontend/src/components/lecture/ModuleList.jsx`

### Backend files

- `backend/routes/courseRoute.js`
- `backend/routes/certificateRoute.js`
- `backend/controller/certificateController.js`
- `backend/models/certificateModel.js`
- `backend/models/lectureProgressModel.js`

### APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/course/certificate/generate/:courseId` | Generate certificate |
| GET | `/api/course/certificate/:courseId` | Get certificate |
| GET | `/api/course/certificate/download/:courseId` | Download PDF |
| POST | `/api/certificate/generate/:courseId` | Duplicate generate route |
| GET | `/api/certificate/:courseId` | Duplicate get route |
| GET | `/api/certificate/download/:courseId` | Duplicate download route |

### Database models

- `Certificate`, `Course`, `Module`, `Lecture`, `LectureProgress`, `User`

### Working flow

1. Student clicks generate in `ModuleList` or certificate page.
2. Backend counts completed lectures from `LectureProgress` and also checks `Lecture.isLectureCompleted`.
3. If progress >=70%, creates/finds `Certificate` with `CERT-` + random hex ID.
4. Download endpoint populates user/course and streams a landscape A4 PDF via PDFKit.

### Limitations and improvements

- `completedFromLectureField` checks `Lecture.isLectureCompleted`, which appears to be a per-lecture global flag rather than per-user progress; using `Math.max` can overstate eligibility.
- `pdfUrl` is not used for delivery; PDF is generated per request.
- No public verification endpoint for certificate IDs.
- Add per-user completion source only, store generated PDF or render template, add verification URL, and prevent expired-enrollment certificates if desired.

---

## 16. Reviews

**Status:** Partial — create/get review endpoints exist, but validation and aggregation are weak.

### What it does

Students can submit a rating/comment for a course. Reviews are stored separately and referenced from `Course.reviews`.

### Roles

Student submits; public can view.

### Frontend files

- `frontend/src/pages/student/CourseDetail.jsx`
- `frontend/src/pages/educator/ViewCourse.jsx`
- `frontend/src/redux/slices/reviewSlice.js`

### Backend files

- `backend/routes/reviewRoute.js`
- `backend/controller/reviewController.js`
- `backend/models/reviewModel.js`
- `backend/models/courseModel.js`

### APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/review/createreview` | Create review |
| GET | `/api/review/getreview` | Get all reviews |

### Database models

- `Review`, `Course`, `User`

### Working flow

1. Student submits `{ rating, comment, courseId }`.
2. Backend checks course exists and user has not already reviewed.
3. Saves `Review`, pushes review ID into `course.reviews`.
4. Frontend displays reviews.

### Limitations and improvements

- No enrollment check before reviewing.
- No rating range validation visible in controller.
- `getReviews` returns all reviews globally rather than by course.
- No update/delete review endpoints.
- Add course-filtered endpoint, enrollment requirement, rating validation, average rating, and review moderation.

---

## 17. Comments and Discussions

**Status:** Partial — lecture comments/replies/likes/pin exist, but ownership/pinning checks and ObjectId comparisons need review.

### What it does

Authenticated users can comment on lectures, reply, like comments/replies, delete own comments/replies, and educators can pin comments.

### Roles

Student comments; educator pins.

### Frontend files

- `frontend/src/pages/student/Comment.jsx`
- `frontend/src/components/lecture/LecturePlayer.jsx`
- `frontend/src/redux/slices/commentSlice.js`

### Backend files

- `backend/routes/courseRoute.js`
- `backend/controller/commentController.js`
- `backend/models/commentModel.js` if present or embedded lecture comments

### APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/course/comment/:lectureId` | Add comment |
| GET | `/api/course/comment/:lectureId` | Get comments |
| DELETE | `/api/course/comment/:lectureId/:commentId` | Delete comment |
| POST | `/api/course/comment/reply/:lectureId/:commentId` | Add reply |
| DELETE | `/api/course/comment/reply/:lectureId/:commentId/:replyId` | Delete reply |
| PUT | `/api/course/comment/like/:lectureId/:commentId` | Toggle comment like |
| PUT | `/api/course/comment/reply/like/:lectureId/:commentId/:replyId` | Toggle reply like |
| PUT | `/api/course/comment/pin/:lectureId/:commentId` | Toggle pin |

### Database models

- Lecture comments/replies/likes/pin fields or comment model

### Working flow

1. Student opens lecture discussion tab.
2. Frontend dispatches comment slice thunks.
3. Backend stores comments under lecture and returns populated user data.
4. Likes/pins toggle arrays/flags.

### Limitations and improvements

- Pin endpoint is authenticated but not clearly role-gated to educator/admin in route.
- Like toggling may compare ObjectId values incorrectly, preventing reliable toggles.
- No clear enrollment check before commenting.
- Add ownership checks, role check for pin, rate limiting, profanity/moderation, and pagination.

---

## 18. Notifications

**Status:** Partial — DB-backed notification CRUD exists and some events create records; realtime emission and email/push are incomplete.

### What it does

Stores notifications for users, supports list/unread count/mark read/delete, cleans old notifications, and emits Socket.IO events when wired.

### Roles

All users receive; admins/educators trigger via system events.

### Frontend files

- `frontend/src/components/ui/NotificationBell.jsx`
- `frontend/src/components/ui/StudentNotification.jsx`
- `frontend/src/context/SocketContext.jsx`

### Backend files

- `backend/routes/notificationRoutes.js`
- `backend/controller/notificationController.js`
- `backend/models/notificationModel.js`
- `backend/service/notificationService.js`
- `backend/service/socketNotificationService.js`
- `backend/service/emailNotificationService.js` — placeholder/logging
- `backend/service/pushNotificationService.js` — placeholder/logging

### APIs

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/notification` | Paginated notifications |
| GET | `/api/notification/unread-count` | Unread count |
| PATCH | `/api/notification/:notificationId/read` | Mark read |
| PATCH | `/api/notification/read-all` | Mark all read |
| DELETE | `/api/notification/:notificationId` | Delete one |
| DELETE | `/api/notification/` | Delete all |

### Database models

- `Notification`

### Working flow

1. Backend services create notification records for events like enrollment/course publish.
2. `socketNotificationService.emitNotification` emits `new-notification` to `user:<id>` room.
3. Frontend `SocketContext` listens and updates badge/latest notification.
4. NotificationBell/StudentNotification fetch REST notifications and mark/delete.

### Limitations and improvements

- Bulk notifications do not consistently emit socket events.
- Email/push services are placeholders.
- Notification cleanup removes records older than 15 days.
- Add event-driven emission for all notification types, preferences, retry queues, and real email/push providers.

---

## 19. Socket.IO Realtime

**Status:** Partial — Socket.IO server/client exist, but room joining is unauthenticated and event coverage is limited.

### What it does

Maintains persistent connections for realtime notifications. Backend creates Socket.IO server in `index.js`; frontend connects when `userData._id` exists and joins `user:<id>` room.

### Roles

All authenticated users.

### Frontend files

- `frontend/src/context/SocketContext.jsx`
- `frontend/src/components/ui/NotificationBell.jsx`
- `frontend/src/App.jsx`

### Backend files

- `backend/index.js`
- `backend/sockets/index.js`
- `backend/service/socketNotificationService.js`
- `backend/service/notificationService.js`

### APIs/events

- Socket event `join` with user ID
- Server emits `new-notification`
- Server emits `unread-count`

### Database models

- `Notification`

### Working flow

1. `SocketProvider` creates `io(VITE_SERVER_URL)` when user ID exists.
2. On `connect`, frontend emits `join` with `userData._id`.
3. Backend joins socket to `user:<id>`.
4. Services emit notification events to that room.

### Limitations and improvements

- `join` accepts arbitrary user ID without verifying socket auth token, allowing room spoofing.
- No handshake authentication middleware.
- Reconnect/unread count sync is minimal.
- Add Socket.IO auth middleware using JWT cookie/token, validate room membership server-side, and emit unread counts after DB changes.

---

## 20. AI Chatbot

**Status:** Partial/unverified — backend routes/controller/model and frontend chatbot UI exist, but Gemini integration and persistence need verification.

### What it does

Students can ask lecture-related questions in an AI chatbot tab. Backend builds a lecture-specific prompt, calls Google GenAI interactions API, supports `previous_interaction_id`, and can save/load/delete/favorite chats.

### Roles

Student uses inside lecture player.

### Frontend files

- `frontend/src/components/lecture/AIChatbot.jsx`
- `frontend/src/components/lecture/AIChatbot_backup.jsx` — backup copy
- `frontend/src/components/lecture/AskAIPanel.jsx` — unused/broken alternate panel
- `frontend/src/components/lecture/LecturePlayer.jsx`

### Backend files

- `backend/routes/chatbotRoute.js`
- `backend/controller/chatbotController.js`
- `backend/models/chatboatModel.js` — note filename typo

### APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/chatbot/chat` | Send message to AI |
| POST | `/api/chatbot/save` | Save chat |
| GET | `/api/chatbot/history/:lectureId` | Chat history |
| GET | `/api/chatbot/chat/:chatId` | Load chat |
| DELETE | `/api/chatbot/chat/:chatId` | Delete chat |
| GET | `/api/chatbot/all-chats` | All user chats |
| PUT | `/api/chatbot/favorite/:chatId` | Toggle chat favorite |
| PUT | `/api/chatbot/favorite/:chatId/:messageIndex` | Toggle message favorite |
| GET | `/api/chatbot/favorites` | Favorite chats |

### Database models

- `Chat`/`Chatboat` model, `User`, `Lecture`

### Working flow

1. Student opens AI Chatbot tab in `LecturePlayer`.
2. `AIChatbot.jsx` posts `{ message, lectureId, lectureTitle, chatHistory, previousInteractionId }`.
3. Backend creates system prompt from lecture title, calls `ai.interactions.create` with configured model.
4. Frontend stores interaction ID for stateful follow-up and displays response.
5. User can save chat; backend persists messages.

### Limitations and improvements

- Model name/config (`gemini-3.6-flash` or similar) is unverified and may not exist.
- `AskAIPanel.jsx` imports nonexistent `../../utils/axiosInstance` and `/api/ai-chat` endpoints; it is unused/broken.
- Chat persistence appears manual via save endpoint rather than automatic per message.
- Add rate limits, token/cost controls, prompt-injection safeguards, lecture content grounding, and verified model config.

---

## 21. Blogs

**Status:** Partial — hierarchical blog CRUD/publication exists, but ownership/publish filtering needs hardening.

### What it does

Educators/admins create blog categories, courses/subjects, models/sections, and topics/content. Public users browse published blog content, like topics, comment, and reply.

### Roles

Educator/admin author; public/student consumes.

### Frontend files

- `frontend/src/pages/Blog/Blog.jsx`
- `frontend/src/pages/Blog/BlogDetails.jsx`
- `frontend/src/pages/Blog/BlogPanal.jsx`
- `frontend/src/pages/Blog/CategoryBlog.jsx`
- `frontend/src/pages/Blog/SubjectDetail.jsx`
- `frontend/src/pages/educator/CreateBlog.jsx`
- `frontend/src/pages/educator/MyBlogs.jsx`
- `frontend/src/pages/educator/BlogSubjects.jsx`
- `frontend/src/pages/educator/BlogTopics.jsx`
- `frontend/src/pages/educator/EditBlogCategory.jsx`
- `frontend/src/pages/admin/CreateBlog.jsx`
- `frontend/src/pages/admin/MyBlogs.jsx`
- `frontend/src/redux/slices/blogSlice.js`
- `frontend/src/components/blog/*`
- `frontend/src/components/shared/CreateBlogForm.jsx`
- `frontend/src/components/shared/MyBlogsList.jsx`

### Backend files

- `backend/routes/blogRoute.js`
- `backend/controller/blogController.js`
- `backend/models/blogCategoryModel.js`
- `backend/models/blogCourseModel.js`
- `backend/models/blogModelModel.js`
- `backend/models/blogTopicModel.js`

### APIs

Representative endpoints:

- `POST /api/blog/category/create`
- `GET /api/blog/categories`
- `GET /api/blog/categories/creator`
- `GET /api/blog/category/:categoryId`
- `PUT /api/blog/category/:categoryId`
- `PUT /api/blog/category/publish/:categoryId`
- `DELETE /api/blog/category/:categoryId`
- `POST /api/blog/course/create/:blogCategoryId`
- `GET /api/blog/courses/:blogCategoryId`
- `GET /api/blog/course/:blogCourseId`
- `PUT /api/blog/course/publish/:blogCourseId`
- `DELETE /api/blog/course/:blogCourseId`
- `POST /api/blog/model/create/:blogCourseId`
- `GET /api/blog/models/:blogCourseId`
- `GET /api/blog/model/:blogModelId`
- `PUT /api/blog/model/publish/:blogModelId`
- `DELETE /api/blog/model/:blogModelId`
- `POST /api/blog/topic/create/:blogModelId`
- `GET /api/blog/topics/:blogModelId`
- `GET /api/blog/topic/:blogTopicId`
- `PUT /api/blog/topic/edit/:blogTopicId`
- `PUT /api/blog/topic/publish/:blogTopicId`
- `DELETE /api/blog/topic/:blogTopicId`
- `PUT /api/blog/topic/like/:blogTopicId`
- `POST /api/blog/topic/comment/:blogTopicId`
- `POST /api/blog/topic/comment/reply/:blogTopicId/:commentId`
- `PUT /api/blog/topic/comment/like/:blogTopicId/:commentId`
- `PUT /api/blog/topic/comment/reply/like/:blogTopicId/:commentId/:replyId`
- `DELETE /api/blog/topic/comment/:blogTopicId/:commentId`
- `DELETE /api/blog/topic/comment/reply/:blogTopicId/:commentId/:replyId`

### Database models

- `BlogCategory`, `BlogCourse`, `BlogModel`, `BlogTopic`, embedded comments/likes

### Working flow

1. Educator creates category → course/subject → model/section → topic/content.
2. Each level can be published/unpublished.
3. Public blog pages fetch categories/courses/models/topics.
4. Users like/comment/reply on topics.

### Limitations and improvements

- Public GET endpoints may expose unpublished content if publish filters are inconsistent.
- Ownership checks for update/delete/publish are not clearly enforced per creator.
- Blog comment deletion may allow insufficiently protected deletes.
- Add `isPublished` filters at every public level, ownership middleware, admin override, and cascading deletes.

---

## 22. Search and Filtering

**Status:** Partial — client-side course search/filter exists; backend search controller is empty and no real search API is mounted.

### What it does

`AllCourses.jsx` filters loaded published courses by selected categories and title substring. Admin course/user tables have local search inputs. A `searchController.js` exists but is empty.

### Roles

Public/student/admin.

### Frontend files

- `frontend/src/pages/student/AllCourses.jsx`
- `frontend/src/pages/admin/ManageCourses.jsx`
- `frontend/src/components/ui/SearchBar.jsx`
- `frontend/src/components/dashboard/CoursePerformanceTable.jsx`
- `frontend/src/components/dashboard/RecentEnrollments.jsx`

### Backend files

- `backend/controller/searchController.js` — empty/unused
- `backend/models/courseModel.js`
- `backend/models/userModel.js`

### APIs

- No functional `/api/search` endpoint found.

### Database models

- `Course`, `User`, `BlogTopic`, `Lecture`

### Working flow

1. Frontend loads all published courses.
2. User types search or selects categories.
3. `useMemo` filters `courseData` locally by `title` and `category`.

### Limitations and improvements

- Search only covers fields already loaded and only title/category.
- No backend full-text/search endpoint, pagination, or indexing strategy.
- Add MongoDB text indexes or Elasticsearch/Meilisearch, server-side filters, and blog/course/user search scopes.

---

## 23. SEO

**Status:** Partial — frontend Helmet/schema/GA and backend sitemap/robots exist; sitemap URL config may be wrong and SSR is absent.

### What it does

Adds meta tags, canonical URLs, Open Graph/Twitter tags, JSON-LD schema, Google Analytics, and backend `sitemap.xml`/`robots.txt`.

### Roles

Public marketing/blog/course pages.

### Frontend files

- `frontend/src/components/seo/SEO.jsx`
- `frontend/src/components/seo/SchemaData.jsx`
- `frontend/src/components/seo/GoogleAnalytics.jsx`
- `frontend/src/components/seo/OptimizedImage.jsx`
- `frontend/src/pages/home/Home.jsx`
- `frontend/src/pages/student/CourseDetail.jsx`
- `frontend/src/pages/Blog/Blog.jsx`
- `frontend/src/App.jsx`
- `frontend/src/main.jsx`

### Backend files

- `backend/routes/seoRoute.js`
- `backend/controller/seoController.js`

### APIs

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/sitemap.xml` | XML sitemap |
| GET | `/robots.txt` | Robots rules |

### Database models

- `Course`, blog models for sitemap content if implemented

### Working flow

1. `SEO` component uses `react-helmet-async` to set title/description/OG/Twitter/canonical/robots.
2. `SchemaData` emits website/course/blog JSON-LD.
3. `GoogleAnalytics` injects GA script when measurement ID exists.
4. Backend serves sitemap/robots.

### Limitations and improvements

- SPA SEO is limited because content is client-rendered; crawlers may not see dynamic course/blog content without prerendering/SSR.
- `seoController` may use wrong env var (`CLIENT_URL` vs `FRONTEND_URL`), producing incorrect sitemap URLs.
- Add prerendering/SSR or static generation for public pages, correct env naming, and dynamic sitemap entries.

---

## 24. Dashboard Analytics

**Status:** Partial — educator/admin dashboard APIs/UI exist; student dashboard analytics are less verified.

### What it does

Educator dashboard shows total courses, students, earnings, average progress, recent enrollments, downloads, enrollment-by-course charts, course performance, and top courses. Admin dashboard shows platform users/courses/stats and management tables.

### Roles

Educator and admin.

### Frontend files

- `frontend/src/pages/educator/EducatorDashboard.jsx`
- `frontend/src/pages/educator/Stats.jsx`
- `frontend/src/pages/educator/Graph.jsx` or graph-related pages
- `frontend/src/pages/educator/RecentEnrollments.jsx`
- `frontend/src/pages/admin/AdminDashboard.jsx`
- `frontend/src/pages/admin/PlatformStats.jsx`
- `frontend/src/pages/admin/ManageUsers.jsx`
- `frontend/src/pages/admin/ManageCourses.jsx`
- `frontend/src/redux/slices/dashboardSlice.js`
- `frontend/src/redux/slices/adminSlice.js`
- `frontend/src/components/dashboard/*`
- `frontend/src/components/admin/*`

### Backend files

- `backend/routes/courseRoute.js`
- `backend/controller/dashboardController.js`
- `backend/routes/adminRoute.js`
- `backend/controller/adminController.js`

### APIs

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/course/dashboard-stats` | Educator stats |
| GET | `/api/course/recent-enrollments` | Educator recent enrollments |
| GET | `/api/admin/stats` | Platform stats |
| GET | `/api/admin/users` | All users |
| GET | `/api/admin/students` | Students |
| GET | `/api/admin/educators` | Educators |
| GET | `/api/admin/courses` | Courses |

### Database models

- `Course`, `Enrollment`, `Lecture`, `LectureProgress`, `Module`, `User`

### Working flow

1. Educator dashboard dispatches `fetchCreatorCourses` and `fetchDashboardStats`.
2. Backend aggregates creator courses, active enrollments, unique students, earnings, lecture progress, downloads, and recent enrollments.
3. Admin dashboard dispatches platform stats/users/courses.
4. UI renders cards/charts/tables.

### Limitations and improvements

- `getDashboardStats` performs multiple queries and in-memory aggregation; okay for small data but needs indexes/pipelines at scale.
- `totalEarnings` sums `pricePaid` from active enrollments; verify expired enrollments should or should not count.
- Admin stats are counts only; revenue analytics are not implemented.
- Add MongoDB aggregation pipelines, date-range filters, indexes, and cached analytics.

---

## 25. File Uploads and Cloudinary

**Status:** Partial — Multer + Cloudinary uploads work for course thumbnails, profile photos, lecture videos, resources, and blog thumbnails, but validation/cleanup are incomplete.

### What it does

Uploads files to local temp via Multer, then Cloudinary, storing URLs/public IDs/resource types/duration in MongoDB.

### Roles

Educator/admin upload course content; user uploads avatar.

### Frontend files

- `frontend/src/pages/educator/CreateCourse.jsx`
- `frontend/src/pages/educator/EditCourse.jsx`
- `frontend/src/pages/educator/CreateLecture.jsx`
- `frontend/src/pages/educator/EditLecture.jsx`
- `frontend/src/pages/educator/ResourcesUpload.jsx`
- `frontend/src/pages/student/EditProfile.jsx`
- `frontend/src/pages/educator/BlogContent.jsx` or blog editors

### Backend files

- `backend/middleware/multer.js`
- `backend/config/cloudinary.js`
- `backend/controller/courseController.js`
- `backend/controller/lectureController.js`
- `backend/controller/uploadLectureResource.js`
- `backend/controller/userController.js`
- `backend/controller/blogController.js`

### APIs

- `POST /api/course/create`
- `PUT /api/course/editcourse/:courseId`
- `POST /api/course/createlecture/:moduleId`
- `POST /api/course/editlecture/:lectureId`
- `POST /api/course/upload-resource/:lectureId`
- `PUT /api/user/updateprofile`
- `PUT /api/blog/topic/edit/:blogTopicId`

### Database models

- `Course.thumbnail`, `Lecture.video`, `Lecture.resources`, `User.photoUrl`, blog topic thumbnails

### Working flow

1. Frontend sends `multipart/form-data`.
2. Multer stores temp file and applies filters.
3. Controller calls `uploadOnCloudinary`.
4. Cloudinary returns secure URL/public ID/resource type/duration.
5. Metadata is saved to MongoDB.

### Limitations and improvements

- Upload filtering appears to accept MIME or extension independently and may allow unsafe combinations.
- No consistent file size/type policy per resource type.
- Deleting DB records may not delete Cloudinary assets, causing orphaned files.
- Add strict allowlists, virus scanning, size limits, upload quotas, and cleanup jobs.

---

## 26. Password Reset, OTP, and Email

**Status:** Partial — OTP flow exists, but OTP security and email delivery are weak/unverified.

### What it does

Users request OTP by email, verify it, and reset password. Nodemailer is installed; notification email/push services are placeholders.

### Roles

Unauthenticated user recovering account.

### Frontend files

- `frontend/src/pages/auth/ForgetPassword.jsx`

### Backend files

- `backend/routes/authRoute.js`
- `backend/controller/authController.js`
- `backend/models/userModel.js`
- `backend/service/emailNotificationService.js` — placeholder

### APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/sendotp` | Send OTP |
| POST | `/api/auth/verifyotp` | Verify OTP |
| POST | `/api/auth/resetpassword` | Reset password |

### Database models

- `User.resetOtp`, `otpExpires`, `isOtpVerifed`

### Working flow

1. User enters email.
2. Backend generates OTP, stores fields on user, sends email.
3. User submits OTP.
4. Backend verifies and allows password reset.

### Limitations and improvements

- OTP uses `Math.random()` instead of cryptographically secure random.
- OTP stored plaintext; no attempt limit/rate limit observed.
- Email delivery may be placeholder/unverified.
- Add `crypto.randomInt`, hashed OTP, expiry, attempt counter, resend cooldown, and real SMTP provider.

---

## 27. Additional Discovered Features

### Theme and UI personalization

- **Status:** Implemented.
- `frontend/src/context/ThemeContext.jsx`, `DarkModeButton`, Tailwind dark classes.

### Redux persistence

- **Status:** Implemented.
- `frontend/src/redux/slices/store.js` persists root state to localStorage through custom async storage; serializable checks disabled.

### Service worker / PWA

- **Status:** Partial/unverified.
- `frontend/src/main.jsx` registers `/sw.js` only in production; verify `public/sw.js` exists and caching strategy is safe for authenticated API calls.

### Google Analytics

- **Status:** Implemented if `VITE_GA_MEASUREMENT_ID` is set.
- `frontend/src/components/seo/GoogleAnalytics.jsx`.

### Floating contact widget

- **Status:** Implemented UI only.
- `frontend/src/components/shared/FloatingChatWidget.jsx` links to phone/WhatsApp; it is not AI chat.

### Course categories/navigation

- **Status:** Implemented UI filtering.
- `frontend/src/components/navbar/categories.js`, `AllCourses.jsx` category state.

### Dead/unused/broken frontend files

- `frontend/src/pages/course-learning/CourseLearning.jsx` — not routed; imports missing `CertificateCard`.
- `frontend/src/components/progress/VideoPlayer.jsx` — missing `useState` import; only used by unrouted `CourseLearning`.
- `frontend/src/components/lecture/AskAIPanel.jsx` — imports missing axios instance and wrong `/api/ai-chat` endpoints; unused.
- `frontend/src/components/lecture/AIChatbot_backup.jsx` — backup duplicate.
- `backend/controller/searchController.js` — empty.
- `backend/utils/convertToHLS.js`, `backend/utils/calculateProgress.js`, `backend/utils/isCourseActive.js`, `backend/utils/notificationTemplates.js` — present but not consistently used.

---

# Part 2 — Project Interview Preparation

## 1. Two-Minute Project Introduction

SkillBridge is a full-stack MERN learning management system where educators publish structured courses and students purchase or freely enroll in them, watch lectures, track progress, earn certificates, discuss content, and interact with an AI assistant.

On the frontend, I built a React + Vite SPA with React Router for role-based navigation, Redux Toolkit + Redux Persist for global state, Axios for authenticated API calls, Socket.IO for realtime notifications, Tailwind CSS for UI, and Recharts/Framer Motion for dashboards and interactions. The app supports student, educator, and admin dashboards, course discovery, checkout, lecture playback, quizzes, comments, blogs, profiles, notifications, and SEO metadata.

On the backend, I used Node.js + Express with MongoDB/Mongoose. Authentication uses JWT stored in an HTTP-only cookie with Bearer fallback. Courses are organized as Course → Module → Lecture, with Cloudinary handling thumbnails, videos, and downloadable resources. Payments use Razorpay order creation and HMAC signature verification. Progress is stored per user per lecture in `LectureProgress`, certificates are generated after progress thresholds, notifications are persisted and emitted through Socket.IO rooms, and an AI chatbot integrates Google GenAI for lecture-specific Q&A.

The main technical challenges were securing paid content, making payment verification idempotent, handling course/module/lecture hierarchy, tracking resume positions, and keeping educator/admin permissions consistent. In the current codebase, the core flows exist, but several hardening tasks remain: server-side payment amount validation, quiz answer protection, enrollment checks before exposing lecture content, ownership checks for educator resources, real HLS streaming, and safer Google auth.

## 2. Five-Minute Detailed Project Explanation

SkillBridge is designed as a marketplace-style LMS. A user signs up as student, educator, or admin. Students browse published courses, open a course detail page, apply coupons, pay through Razorpay or enroll free, then enter a learning view with modules, lectures, resources, quizzes, comments, and AI chat. Educators create courses, upload thumbnails, organize modules and lectures, attach resources and quiz questions, publish content, manage coupons/blogs, and view earnings/student analytics. Admins moderate users and courses, toggle publishing, manage coupons/blogs, and view platform stats.

Architecturally, the frontend is a single-page React app. `main.jsx` initializes Helmet, router, Redux store with persistence, theme, analytics, and service worker registration. `App.jsx` lazy-loads pages and protects routes by role. Redux slices manage user, course, module, lecture, enrollment, progress, review, comment, coupon, certificate, blog, dashboard, and admin state. Axios calls use `VITE_SERVER_URL` and `withCredentials` so the JWT cookie is sent cross-origin.

The backend is an Express app mounted under `/api`. `app.js` wires routers for auth, user, course, payment, review, admin, coupon, enrollment, notification, certificate, blog, SEO, and chatbot. `index.js` creates the HTTP server, initializes Socket.IO, connects MongoDB, and schedules notification cleanup. Mongoose models define the domain: `User`, `Course`, `Module`, `Lecture`, `Enrollment`, `LectureProgress`, `Certificate`, `Review`, `Coupon`, `Notification`, blog hierarchy models, and chat model.

Authentication is JWT-based. Login/signup hash passwords with bcrypt, sign a JWT containing user ID, and set an HTTP-only cookie. `isAuth` verifies the cookie or Bearer token, loads the user, checks banned/session status, and attaches `req.userId`. `isRole` restricts educator/admin endpoints. Password reset uses OTP endpoints; Google auth exists but currently trusts client identity fields rather than verifying a Google token.

Course content is hierarchical. A `Course` has modules; each `Module` has lectures; each `Lecture` stores video metadata, resources, quiz questions, preview flags, and duration. Public endpoints return published courses/modules, while progress endpoints merge per-user `LectureProgress` records into lecture payloads. `LecturePlayer` plays the Cloudinary MP4 URL directly, sends position updates every few seconds, resumes from `currentPosition`, and marks completion on ended or around 95% progress.

Enrollment supports validity periods. `Enrollment` stores user, course, status, start/end dates, price paid, payment IDs, coupon data, and payment details. Free enrollment is intended for `price <= 0`; paid enrollment happens after Razorpay verification. Expired enrollments are marked expired and removed from user course lists.

Payments use Razorpay. The frontend requests `/api/order/razorpay-order`, receives an order ID, opens Razorpay Checkout, then posts payment IDs/signature to `/api/order/verifypayment`. The backend verifies HMAC-SHA256 signature and creates/updates enrollment, user enrolled courses, educator earnings, coupon usage, and notifications. The current implementation needs stronger server-side validation because it trusts client-supplied discount/course/coupon fields and does not fully idempotently handle duplicate callbacks.

Progress is stored in `LectureProgress` keyed by user and lecture. Fields include `currentPosition`, `maxPosition`, `watchTime`, `progressPercent`, `completed`, `isLectureCompleted`, `isQuizCompleted`, and timestamps. Course progress endpoints aggregate completed lectures and return per-lecture maps for the UI.

Certificates require roughly 70% progress. The backend counts completed lectures, creates a `Certificate` record with a generated ID, and streams a PDFKit-generated landscape certificate. The UI lists certificates and opens download URLs.

Engagement features include reviews, lecture comments/replies/likes/pinning, blog categories/courses/models/topics with likes/comments, notifications, and AI chat. Notifications are stored in MongoDB and optionally emitted through Socket.IO rooms. The AI chatbot calls Google GenAI with a lecture-specific prompt and can persist chats.

SEO is handled through React Helmet meta tags, JSON-LD schema, Google Analytics, and backend sitemap/robots routes. Admin analytics use MongoDB counts and aggregation-like controller logic; educator analytics aggregate enrollments, earnings, progress, downloads, and recent students.

## 3. Architecture Explanation

### Frontend architecture

- **Routing:** `React Router` with lazy-loaded pages in `App.jsx`.
- **State:** Redux Toolkit slices + Redux Persist for cross-session user/course/UI state.
- **API layer:** Axios with `withCredentials: true`; no centralized axios interceptor instance is consistently used.
- **Realtime:** Socket.IO client inside `SocketProvider`.
- **UI:** Tailwind CSS, Framer Motion, Recharts, React Icons, Toastify.
- **SEO:** `react-helmet-async` + schema components.

### Backend architecture

- **API layer:** Express routers under `/api/*`.
- **Auth layer:** `isAuth` JWT middleware + `isRole` role middleware.
- **Data layer:** Mongoose models and controllers.
- **External services:** Razorpay, Cloudinary, Google GenAI, Nodemailer, Socket.IO.
- **Files:** Multer temp uploads → Cloudinary.
- **Errors:** centralized `errorHandler` middleware.

### Data flow example — student buys course

1. `CourseDetail.jsx`/`CheckoutPage.jsx` calls `/api/order/razorpay-order`.
2. Backend creates Razorpay order.
3. Razorpay Checkout returns payment response to frontend.
4. Frontend posts signature to `/api/order/verifypayment`.
5. Backend verifies signature, upserts `Enrollment`, updates `User.enrolledCourses`, increments educator earnings/coupon usage, sends notifications.
6. Student accesses `/viewlecture/:courseId`; frontend checks `/api/enrollment/check/:courseId`.

## 4. Technology Selection and Justification

- **React + Vite:** component-driven UI, fast dev/build, large ecosystem.
- **Redux Toolkit:** predictable global state for auth, courses, progress, dashboards across many pages.
- **Redux Persist:** keeps user/session data across refreshes; should be used carefully for sensitive tokens.
- **Express:** lightweight REST API layer for MERN backend.
- **MongoDB/Mongoose:** flexible schema for nested course hierarchy and progress records.
- **JWT + HTTP-only cookie:** stateless auth with browser-friendly cookie transport; Bearer fallback supports non-browser clients.
- **Razorpay:** India-friendly payment gateway with order/checkout/signature flow.
- **Cloudinary:** managed media storage/CDN for images/videos/resources.
- **Socket.IO:** realtime notifications over WebSocket with fallback polling.
- **Google GenAI:** lecture-specific chatbot generation.
- **PDFKit:** server-side certificate PDF generation.
- **Tailwind CSS:** rapid consistent styling and dark mode.
- **Recharts/Framer Motion:** dashboard charts and polished interactions.

## 5. Important Technical Decisions

- Chose cookie-based JWT for browser auth while retaining Bearer fallback.
- Stored progress per user per lecture instead of embedding progress on lectures, allowing per-user resume/completion.
- Used Cloudinary public URLs for media rather than proxying all video bytes.
- Used Razorpay signature verification rather than trusting client payment success.
- Used role-based route guards on frontend and `isRole` middleware on backend.
- Used Socket.IO rooms keyed by `user:<id>` for targeted notifications.
- Used PDFKit on-demand instead of storing generated PDFs.

## 6. Real Challenges Found in the Code and Solutions

- **Paid content exposure:** `course-modules` is public and populates lecture video URLs. Solution: return sanitized module structure publicly; provide enrolled-only lecture payload endpoint or signed URLs.
- **Payment trust issues:** `VerifyPayment` trusts client amount/coupon/course fields. Solution: store order metadata server-side, fetch Razorpay order/payment, recompute coupon/amount, use idempotency keys.
- **Duplicate payment callbacks:** side effects can repeat. Solution: unique payment/order ID constraint, idempotent enrollment upsert, transaction/outbox pattern for earnings/coupon updates.
- **Quiz answer leakage:** `getLectureQuiz` returns `correctAnswer`. Solution: strip answers for students; add `/submit-quiz` endpoint.
- **Broken frontend paths:** `CheckoutPage.jsx` uses `useDispatch` without importing it; `CourseDetail.jsx` calls non-existent `/api/course/enroll/:courseId`; `moduleSlice` calls missing `/api/course/update-module/:moduleId`; `CourseLearning`/`VideoPlayer`/`AskAIPanel` are dead/broken. Solution: fix imports/routes or remove dead code.
- **HLS unused:** FFmpeg/convert utility exists but is not wired. Solution: either implement HLS pipeline or remove misleading dependencies and document MP4-only playback.
- **Socket room spoofing:** client emits arbitrary user ID. Solution: authenticate socket handshake and derive room from JWT.
- **Google auth trust:** backend trusts client fields. Solution: verify Firebase/Google ID token server-side.
- **Ownership gaps:** educator endpoints check role but not course ownership. Solution: add `requireCourseOwner` middleware.
- **Progress cheating:** client sends arbitrary positions. Solution: validate against duration, require watch heartbeats, and compute server-side.

## 7. Existing Limitations and Future Improvements

- Add server-side search with indexes/full-text engine.
- Implement real HLS/DASH adaptive streaming with signed URLs.
- Add payment order records, webhooks, refunds, and reconciliation.
- Add quiz attempt model and server-side scoring.
- Add ownership/authorization middleware across educator resources.
- Add comprehensive file validation, malware scanning, and Cloudinary cleanup.
- Add email provider, push notifications, and notification preferences.
- Add SSR/prerendering for SEO.
- Add rate limiting, Helmet, input sanitization, centralized logging, and audit trails.
- Add tests for payment idempotency, enrollment expiry, progress, certificates, and authorization.

---

# Part 3 — 100+ Technical Interview Questions and Answers

## A. Project Architecture

**1. What is SkillBridge LMS?**
SkillBridge is a MERN learning management system where educators publish courses and students enroll, pay, watch lectures, track progress, earn certificates, discuss content, and use an AI assistant. It has student, educator, and admin roles.

**2. How is the project structured?**
The repo has `frontend/` and `backend/`. Backend uses `app.js` for Express middleware/routes and `index.js` for HTTP server, Socket.IO, MongoDB connection, and cleanup jobs. Frontend uses `main.jsx`, `App.jsx`, Redux slices, pages by role, and reusable components.

**3. Why did you choose MongoDB?**
The course hierarchy and progress data are nested and evolving: Course → Module → Lecture, with per-user progress and flexible metadata. MongoDB/Mongoose fits this document model and allows fast iteration.

**4. Why Redux Toolkit instead of only React state?**
Many pages share auth, courses, modules, progress, notifications, and dashboard data. Redux provides a predictable global store; slices keep async thunks and state organized.

**5. How does the frontend communicate with the backend?**
React components and Redux thunks call REST endpoints using Axios with `VITE_SERVER_URL` as base URL and `withCredentials: true` for cookies. Socket.IO handles realtime notifications separately.

**6. What is the role of `backend/app.js` vs `backend/index.js`?**
`app.js` configures Express middleware and mounts routers. `index.js` creates the HTTP server, initializes Socket.IO, connects MongoDB, and starts the app.

**7. How are routes protected?**
Backend uses `isAuth` to verify JWT and attach `req.userId`, and `isRole` for educator/admin endpoints. Frontend uses `userData.role` checks in `App.jsx` for UX routing.

**8. What would you improve architecturally?**
Add a service layer for payments/enrollment, authorization middleware for ownership, background jobs for cleanup/media processing, API versioning, request validation schemas, centralized logging, and tests.

## B. React.js

**9. How do you lazy-load pages?**
`App.jsx` uses `React.lazy` and `Suspense` for role-specific and public pages to reduce initial bundle size.

**10. How does `ViewLecture.jsx` select lectures?**
It stores `selectedLecture` in local state, auto-selects the first lecture or first free preview lecture from `moduleData`, and updates when the user clicks a lecture in `ModuleList`.

**11. How does `LecturePlayer.jsx` track playback?**
It uses a `videoRef`, sets `video.src` from `lecture.video.fileUrl`, resumes `currentTime`, listens to `timeupdate`, `play`, `pause`, and `ended`, and posts progress updates.

**12. Why use `useCallback` in data fetching?**
Functions like `fetchModules` and `checkEnrollment` are memoized to keep stable references for `useEffect` dependencies and avoid unnecessary reruns.

**13. How do you handle loading/empty states?**
Pages use local loading flags, skeletons, empty-state components, and toast notifications. Example: `MyEnrolledCourses.jsx` shows spinner, empty state, or enrollment cards.

**14. What is wrong with `CheckoutPage.jsx`?**
It calls `useDispatch()` but only imports `useSelector` from `react-redux`, so the component will throw a `ReferenceError` when rendered. It needs `useDispatch` imported or the dispatch logic moved into a thunk/component that already imports it.

**15. How does the app support dark mode?**
`ThemeContext` provides `isDark`/`toggleTheme`; Tailwind dark classes and `DarkModeButton` update UI across pages.

**16. What are controlled inputs?**
Inputs like email/password in `Login.jsx` use React state (`useState`) and `value`/`onChange`, making React the source of truth.

**17. How would you improve video player performance?**
Memoize lecture objects, avoid re-creating intervals, throttle progress updates, use `useRef` for video element, and consider HLS for adaptive streaming.

**18. What is the purpose of `SocketProvider`?**
It creates a single Socket.IO connection when a user is logged in, stores socket state in context, listens for notifications, and exposes `socket`, `isConnected`, `unreadCount`, and `latestNotification`.

## C. JavaScript

**19. What are closures and where are they useful here?**
Closures let inner functions access outer variables. In `LecturePlayer`, event handlers close over `videoRef`, `lecture`, `user`, and progress functions.

**20. Explain `async/await` in API calls.**
Controllers and thunks use `async/await` to handle promises from Mongoose/Axios, with `try/catch` for errors.

**23. What is the difference between `let`, `const`, and `var`?**
`const` for immutable bindings, `let` for mutable block-scoped variables, `var` is function-scoped and mostly avoided in modern code.

**24. How does `Array.prototype.reduce` help in dashboard stats?**
`getDashboardStats` uses `reduce` to sum earnings and `Set` to count unique students.

**25. What is optional chaining?**
Syntax like `userData?.role` safely accesses nested properties without throwing if intermediate values are null/undefined.

**26. How do you debounce/throttle progress updates?**
`progress/VideoPlayer.jsx` imports a `throttle` utility to limit update frequency; `LecturePlayer` also uses time-based checks.

**27. What is `FormData` used for?**
Profile/course/lecture forms append text fields and files to `FormData` for `multipart/form-data` uploads.

**28. How do Promises handle Razorpay checkout?**
Frontend creates order via Axios, opens Razorpay Checkout, then resolves payment handler response and posts verification data.

## D. Redux Toolkit

**29. How is the Redux store configured?**
`store.js` combines slices for user, course, lecture, module, review, dashboard, comment, admin, coupon, progress, enrollment, certificate, and blog; it persists root state and disables serializable checks.

**30. What is a slice?**
A slice groups reducers, actions, and state for a feature, e.g., `userSlice` manages `userData`, loading, and error.

**31. What is `createAsyncThunk` used for?**
Thunks like `fetchCurrentUser`, `fetchPublishedCourses`, `fetchDashboardStats`, and `updateProfileData` encapsulate async API calls and dispatch pending/fulfilled/rejected states.

**32. How do components read state?**
`useSelector((state) => state.user.userData)` or similar selects feature state.

**33. How do components update state?**
`useDispatch()` dispatches slice actions or thunks, e.g., `dispatch(setUserData(user))` after login.

**34. Why persist Redux state?**
To keep user/course/dashboard data across refreshes without refetching everything. Sensitive data should be minimized because it is stored in localStorage.

**35. What are the risks of disabling serializable checks?**
Non-serializable values like functions, class instances, or Dates may enter state and cause subtle bugs; here it is likely disabled for convenience.

**36. How would you reset state on logout?**
Dispatch a logout/reset action for user and sensitive slices, clear persisted storage if needed, disconnect socket, and redirect to login.

## E. Node.js

**37. Why use Node.js for this backend?**
Node.js is well-suited for I/O-heavy REST APIs, works naturally with Express/MongoDB, and shares JavaScript with the frontend.

**38. What is the event loop?**
Node.js handles asynchronous I/O through an event loop, allowing many concurrent API requests without one thread per request.

**39. How does `index.js` start the server?**
It imports `app`, creates an HTTP server, initializes Socket.IO, connects MongoDB, registers cleanup jobs, and listens on the configured port.

**40. What are environment variables used for?**
`JWT_SECRET`, `FRONTEND_URL`, Razorpay keys, Cloudinary credentials, Google GenAI key, email config, and client URL are loaded via `dotenv`.

**41. How do you handle uncaught errors?**
Controllers use try/catch and return JSON errors; `app.js` registers centralized `errorHandler` middleware.

**42. What is ESM in this backend?**
Backend files use `import/export` syntax, enabled by Node ESM (`"type": "module"` or `.js` ESM config).

## F. Express.js

**43. What middleware does `app.js` use?**
`express.json()`, `cookieParser()`, `cors` with credentials, route routers, and `errorHandler`.

**44. What does `isAuth` do?**
It reads token from cookie or Authorization header, verifies JWT, loads user, checks ban/session expiry, and sets `req.user`/`req.userId`.

**45. What does `isRole` do?**
It checks `req.user.role` against allowed roles and returns 403 if unauthorized.

**46. How are route parameters used?**
Endpoints like `/course-modules/:courseId`, `/enroll/:courseId`, and `/download-resource/:lectureId/:resourceId` extract IDs via `req.params`.

**47. How are multipart uploads handled?**
Multer middleware parses `multipart/form-data`, stores temp files, and controllers upload them to Cloudinary.

**48. What is wrong with CORS config?**
CORS allows specific origins with credentials, which is good, but must match deployed frontend URL; credentials cannot be used with wildcard origin.

**49. How would you add rate limiting?**
Use `express-rate-limit` on auth/payment endpoints, OTP endpoints, and expensive AI endpoints.

## G. MongoDB and Mongoose

**50. What are the main collections/models?**
`User`, `Course`, `Module`, `Lecture`, `Enrollment`, `LectureProgress`, `Certificate`, `Review`, `Coupon`, `Notification`, blog models, and chat model.

**51. How is course hierarchy modeled?**
`Course` references modules; `Module` references lectures; `Lecture` stores video/resources/quiz. Some legacy `Course.lectures` references may also exist, causing consistency concerns.

**52. How is progress stored?**
`LectureProgress` has `user`, `lecture`, `currentPosition`, `maxPosition`, `watchTime`, `progressPercent`, `completed`, `isLectureCompleted`, `isQuizCompleted`, and timestamps.

**53. How do you merge progress into lectures?**
`mergeUserProgressWithLectures` batch-fetches `LectureProgress` for lecture IDs and maps progress fields onto lecture objects.

**54. What indexes would you add?**
Unique `{ user, course }` for enrollment where appropriate, `{ user, lecture }` for progress, `{ course, isPublished }`, `{ creator }`, `{ code }` for coupons, `{ recipient, isRead }` for notifications, and text indexes for search.

**55. How does population work?**
`.populate("creator", "name email photoUrl")` replaces ObjectId references with selected user fields in query results.

**56. What is the issue with `Math.max` in certificate progress?**
It takes the higher of `LectureProgress.completed` count and `Lecture.isLectureCompleted` count. Since `Lecture.isLectureCompleted` is not per-user, it can overstate a student’s progress.

**57. How would you optimize dashboard stats?**
Use aggregation pipelines, project only needed fields, add indexes, and cache expensive stats instead of repeated multi-query in-memory aggregation.

**58. What is a Mongoose virtual or middleware example here?**
If used, virtuals could compute average rating or full name; middleware could hash passwords before save, though current code hashes explicitly in controller.

## H. Authentication and JWT

**59. How are passwords stored?**
Signup/login use `bcryptjs` to hash/compare passwords. Google users may have no password.

**60. What is in the JWT?**
The JWT payload contains the user ID. `currentSessionId` is generated on user but not embedded in JWT, limiting session invalidation.

**61. Why HTTP-only cookie?**
It reduces XSS token theft compared to storing JWT in localStorage, but requires CSRF protection for state-changing requests.

**62. How does logout work?**
`/api/auth/logout` clears the `token` cookie; frontend also resets Redux user state.

**63. What is wrong with signup role selection?**
`signUP` accepts `role` from request body, allowing self-registration as admin/educator. It should restrict public signup roles or require approval.

**64. How should Google auth be secured?**
Frontend should send Firebase/Google ID token; backend verifies it with Google/Firebase Admin SDK and derives email/name/photo server-side.

**65. What is the OTP flow?**
`sendotp` stores OTP fields on user, `verifyotp` checks them, `resetpassword` updates hashed password.

**66. What are OTP security improvements?**
Use crypto-random OTP, hash it, set short expiry, limit attempts, resend cooldown, rate limit by IP/email, and avoid logging OTPs.

**67. How do you prevent banned users from accessing APIs?**
`isAuth` loads user and checks `isBanned`/session expiry before attaching `req.userId`.

**68. What is Bearer fallback for?**
Allows non-browser clients or mobile apps to send `Authorization: Bearer <token>` when cookies are unavailable.

## I. REST APIs

**69. What are the main API groups?**
Auth, user, course/content, enrollment, payment, review, admin, coupon, notification, certificate, blog, SEO, chatbot.

**70. How do you design a course modules endpoint?**
`GET /api/course/course-modules/:courseId` returns modules with populated lectures and merged user progress when authenticated.

**71. What HTTP methods are used?**
POST for create/actions, GET for reads, PUT/PATCH for updates, DELETE for removal.

**72. How do you return consistent errors?**
Controllers return JSON `{ success, message }`; centralized `errorHandler` catches unhandled errors.

**73. What is wrong with `GET /api/review/getreview`?**
It returns all reviews globally instead of filtering by course, and is public.

**74. How would you version APIs?**
Mount routers under `/api/v1/...` and keep backward-compatible changes.

**75. How do you handle pagination?**
Notification endpoints accept `page`/`limit`; other list endpoints often return full arrays and need pagination.

## J. Payment Integration

**76. How does a student purchase a course?**
Frontend calls `/api/order/razorpay-order` with `courseId` and optional discount, receives Razorpay order, opens Checkout, then posts payment IDs/signature to `/api/order/verifypayment`.

**77. How is payment verified?**
Backend computes HMAC-SHA256 of `razorpay_order_id + "|" + razorpay_payment_id` using `RAZORPAY_KEY_SECRET` and compares it to `razorpay_signature`.

**78. What should be added to verification?**
Fetch Razorpay order/payment by ID, verify amount/currency/status, bind order to course/user server-side, recompute coupon discount, and use idempotency.

**79. How do you handle duplicate payment callbacks?**
Store `razorpay_payment_id`/`razorpay_order_id` uniquely, return existing enrollment if already processed, and make earnings/coupon updates conditional/idempotent.

**80. Where is the discount calculated?**
`/api/coupon/apply` calculates discount for preview; `RazorPayOrder` subtracts client-supplied `discount`; `VerifyPayment` trusts `discountAmount`. This needs server-side recomputation.

**81. What is `pricePaid` in enrollment?**
It stores final paid amount after discount. Current code computes `course.price - discountAmount` from request data, which is unsafe.

**82. How are educator earnings tracked?**
`VerifyPayment` increments `User.totalEarnings` for `course.creator`; dashboard sums active enrollment `pricePaid`.

**83. What happens if payment succeeds but enrollment fails?**
Current code has no payment ledger/webhook reconciliation; money could be captured without enrollment. Add order records and webhook/refund handling.

**84. Why use Razorpay signature instead of trusting frontend success?**
Signature proves payment response authenticity; frontend success alone can be spoofed.

## K. Video Streaming and HLS

**85. How does video playback work now?**
`LecturePlayer` sets `<video src={lecture.video.fileUrl}>` and uses browser-native MP4 playback from Cloudinary.

**86. Is HLS implemented?**
No. `hls.js` is a dependency and `convertToHLS.js` exists, but no active route/component uses them.

**87. What would HLS add?**
Adaptive bitrate streaming, better seeking/buffering, segmented delivery, and potentially signed segment access.

**88. How is resume position stored?**
`LectureProgress.currentPosition` is updated by `/api/course/progress/update`; `LecturePlayer` resumes `video.currentTime` from merged lecture progress.

**89. How is lecture completion detected?**
Progress auto-completes at >=95% position; `ended` event calls `mark-lecture-completed`.

**90. How would you protect videos better?**
Use signed Cloudinary URLs or a protected streaming endpoint, short-lived tokens, server-side enrollment checks, and avoid exposing raw MP4 URLs publicly.

**91. What are limitations of `controlsList`/right-click blocking?**
They are UX deterrents only; anyone can access the URL/network tab or download the file.

**92. How would you implement HLS?**
Transcode uploads to HLS with FFmpeg, store `.m3u8`/segments on Cloudinary or CDN, detect `.m3u8` in player and use `hls.js`, and protect with signed URLs.

## L. Socket.IO and Notifications

**93. Why use Socket.IO?**
For realtime notification delivery without polling, using rooms per user.

**94. How does the client connect?**
`SocketProvider` calls `io(VITE_SERVER_URL)` when `userData._id` exists and emits `join` with user ID.

**95. How does the server emit notifications?**
`socketNotificationService.emitNotification(userId, notification)` emits `new-notification` to `user:<id>`.

**96. What is wrong with room joining?**
The `join` handler accepts any user ID without verifying the socket belongs to that user, allowing notification spoofing.

**97. How should socket auth work?**
Authenticate during handshake using JWT cookie/token, derive user ID server-side, and join only that user’s room.

**98. What notification APIs exist?**
List, unread count, mark read, mark all read, delete one/all under `/api/notification`.

**99. Are email/push notifications implemented?**
Services exist but are placeholders/logging; real delivery is unverified/missing.

**100. How would you sync unread count?**
Emit `unread-count` after create/read/delete operations and fetch initial count via `/api/notification/unread-count`.

## M. Cloudinary and File Uploads

**101. How are uploads handled?**
Multer writes temp files; controllers call `uploadOnCloudinary`; metadata stores `fileUrl`, `publicId`, `resourceType`, and duration.

**102. What files can be uploaded?**
Course thumbnails, profile photos, lecture videos, lecture resources, blog thumbnails depending on route.

**103. What is `resource_type` used for?**
Cloudinary requires correct resource type (`image`, `video`, `raw`) for upload/delete; code stores it from upload result.

**104. How are resources downloaded?**
`downloadResource` builds a Cloudinary URL and may append `fl_attachment` to force download.

**105. What upload validation exists?**
Multer filters exist but appear permissive; frontend checks some image size. Server should enforce strict MIME/extension/size allowlists.

**106. What happens to Cloudinary assets on delete?**
Controllers sometimes delete Cloudinary assets by `publicId`, but cascading cleanup is incomplete for course/module/lecture deletion.

## N. AI Chatbot

**107. How does the AI chatbot work?**
Frontend sends message/lectureId/title/history to `/api/chatbot/chat`; backend builds lecture-specific prompt and calls Google GenAI interactions API.

**108. How is conversation state maintained?**
Frontend stores `interactionId` from response and sends it as `previousInteractionId` for follow-ups.

**109. Can chats be saved?**
Yes, `/api/chatbot/save` persists messages; history/load/delete/favorite endpoints exist.

**110. What is unverified?**
The configured Google GenAI model name and API behavior need runtime verification; `AskAIPanel` is unused/broken.

**111. How would you secure the chatbot?**
Rate limit per user, cap message length/history, validate lecture enrollment, add prompt-injection protections, monitor cost, and avoid exposing system prompts.

**112. How would you ground answers in lecture content?**
Retrieve lecture transcript/description/resources and include them in the prompt or RAG pipeline.

## O. Security

**113. What are the biggest security issues?**
Client-provided signup role, unverified Google auth, public lecture/video URLs, quiz answer leakage, payment trust, socket room spoofing, missing ownership checks, OTP weaknesses, and unsafe file upload filters.

**114. How do you prevent unauthorized course access?**
Currently frontend checks `/api/enrollment/check/:courseId`, but backend module endpoints are public. Proper fix: require auth + active enrollment for lecture/video/resource endpoints and return signed URLs.

**115. How do you protect admin routes?**
`isAuth` + `isRole("admin")` on admin routers; frontend admin pages are role-gated.

**116. What is CSRF risk with cookies?**
Cookie auth is vulnerable to CSRF for state-changing requests unless SameSite/CSRF tokens/origin checks are enforced.

**117. Why is localStorage persistence risky?**
Persisted Redux state may include user data/tokens; sensitive tokens should not be persisted client-side.

**118. How do you sanitize user input?**
Use schema validation (Zod/Joi), sanitize HTML/markdown, parameterize queries via Mongoose, and avoid returning raw `err.message`.

**119. What security headers are missing?**
Helmet/rate limiting/general sanitization were not found; add Helmet, CSP, rate limits, and secure cookie flags.

**120. How do you handle sensitive logging?**
`isAuth`, auth controller, and payment controller log tokens/headers/payment details; remove or redact these in production.

## P. Debugging and Real-World Scenarios

**121. How would you debug a broken API?**
Check route mounting, middleware order, request payload, auth cookie/header, backend logs, controller errors, MongoDB query, and frontend Axios error response.

**122. A student paid but cannot access lectures. What do you check?**
Verify `/api/order/verifypayment` succeeded, `Enrollment` exists and is active, `/api/enrollment/check/:courseId` returns `isActive`, and `course-modules` returns modules. Then check frontend navigation and enrollment state.

**123. A user reports progress not saving. What do you check?**
Confirm `isAuth` populated `req.userId`, `LectureProgress` upsert ran, `lecture.video.duration` exists, frontend sends correct `lectureId/currentPosition`, and course/modules endpoints merge progress.

**124. Razorpay signature fails. Why?**
Wrong key secret, modified payload, incorrect order/payment IDs, or signature generated over wrong string. Verify HMAC input `order_id|payment_id`.

**125. Duplicate enrollment error appears. Why?**
Unique index on `{ user, course }` or expired active enrollment conflict. Check enrollment status/endDate and use upsert/idempotent renewal logic.

**126. Quiz score is wrong. Why?**
Score is computed client-side by comparing answers to leaked `correctAnswer`; there is no server submission endpoint. Implement server-side attempts.

**127. Video does not resume. Why?**
Check `LectureProgress.currentPosition`, merged lecture payload, `video.currentTime` assignment timing, and whether `video.duration` was stored by Cloudinary.

**128. Notifications do not arrive in realtime. Why?**
Check socket connection, `join` event, room name mismatch (`user:<id>`), whether service emitted event, and whether user was authenticated.

**129. Admin cannot see users. What do you check?**
Verify `/api/admin/users` route, `isRole("admin")`, Redux `adminSlice`, `userData.role`, and backend user query.

**130. How would you test payment idempotency?**
Call `/api/order/verifypayment` twice with same signature/payment IDs and assert only one enrollment/earnings/coupon increment occurs.

**131. How would you test unauthorized lecture access?**
Call `/api/course/course-modules/:courseId` and lecture/resource endpoints without enrollment; expected fixed behavior is sanitized content or 403.

**132. How would you debug CORS errors?**
Check `FRONTEND_URL`, allowed origins, `credentials: true`, preflight OPTIONS, cookie `sameSite`/`secure`, and deployed vs localhost URLs.

**133. How would you improve checkout reliability?**
Store pending order server-side, verify payment via webhook + signature, handle duplicate callbacks, show clear failure states, and reconcile payments.

**134. How would you handle expired enrollments?**
`updateExpiredEnrollments` marks status expired; `checkEnrollmentStatus` removes course from user list. Add renewal flow and preserve progress optionally.

**135. What logs should exist for payments?**
Order creation, verification attempt, signature result, enrollment ID, payment ID, amount, coupon used, and errors — with secrets redacted.

**136. How would you implement certificate verification?**
Add public `/api/certificate/verify/:certificateId` returning minimal certificate/course/user data and QR code.

**137. What is the quickest production fix for quiz cheating?**
Remove `correctAnswer` from student payload and add `/api/course/submit-quiz/:lectureId` that scores server-side.

**138. How would you handle large course lists?**
Add pagination, indexes, server-side filtering, and aggregation instead of loading all courses/modules client-side.

**139. What would you monitor in production?**
API error rates, payment failures, enrollment conversion, video playback errors, socket connections, AI token usage/cost, DB query latency, and file upload failures.

**140. How would you explain a bug fix in an interview?**
State symptom, reproduction steps, root cause, code path, fix, and verification test. Example: CheckoutPage `useDispatch` missing import → ReferenceError → import hook → retest checkout render.

---

## Quick Reference — Critical Files

- Backend entry: `backend/index.js`, `backend/app.js`
- Auth: `backend/controller/authController.js`, `backend/middleware/isAuth.js`, `backend/middleware/isRole.js`
- Course/content: `backend/routes/courseRoute.js`, `backend/controller/courseController.js`, `moduleController.js`, `lectureController.js`
- Enrollment/progress: `backend/controller/enrollMentController.js`, `progressController.js`, `backend/models/enrollmentModel.js`, `lectureProgressModel.js`
- Payments/coupons: `backend/controller/orderController.js`, `couponController.js`, `backend/routes/paymentRoute.js`, `coupon.routes.js`
- Media: `backend/config/cloudinary.js`, `backend/middleware/multer.js`, `backend/controller/uploadLectureResource.js`, `frontend/src/components/lecture/LecturePlayer.jsx`
- Realtime/notifications: `backend/sockets/index.js`, `backend/service/socketNotificationService.js`, `backend/controller/notificationController.js`, `frontend/src/context/SocketContext.jsx`
- AI/blogs/SEO: `backend/controller/chatbotController.js`, `blogController.js`, `seoController.js`, `frontend/src/components/lecture/AIChatbot.jsx`, `frontend/src/components/seo/*`
- Frontend state/routes: `frontend/src/redux/slices/store.js`, `frontend/src/App.jsx`, `frontend/src/main.jsx`

## Final Interview Recommendation

Describe SkillBridge as a working full-stack LMS with real payment, media, progress, certificate, notification, blog, and AI features, but be explicit that several production-hardening items remain. The strongest interview answers come from knowing exact file paths, endpoints, models, and the current defects — especially payment idempotency, enrollment-gated content, quiz answer leakage, and unused HLS/search paths.
