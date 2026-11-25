# FRONTEND AUDIT — SkillBridge LMS

> **Scope:** Complete audit of the React frontend in `frontend/` (Vite + React 18 + Redux Toolkit + MERN stack).
> **Method:** Every file inside `frontend/src/` was inspected. `dist/` was not used. API calls below are taken directly from source code — nothing is invented.
> **Date:** 2026-11-25

---

## 1. Technology Stack & Dependencies

### Build toolchain

| Item | Value |
|---|---|
| Bundler | Vite 8 (`@vitejs/plugin-react` 6) |
| Framework | React 18.3 (`react`, `react-dom`) |
| Language | JSX / ES modules (`"type": "module"`) |
| Styling | Tailwind CSS 3.4 + PostCSS + Autoprefixer |
| Lint | ESLint 10 + `eslint-plugin-react-hooks` + `react-refresh` |

### Runtime dependencies (`frontend/package.json`)

| Package | Version | Used for |
|---|---|---|
| `@reduxjs/toolkit` | ^2.11 | Store, slices, `createAsyncThunk` |
| `react-redux` | ^9.2 | `Provider`, `useSelector`, `useDispatch` |
| `redux-persist` | ^6.0 | Persist whole Redux store to `localStorage` |
| `@tanstack/react-query` | ^5.100 | **Installed but never imported anywhere in `src/`** (dead dependency) |
| `axios` | ^1.16 | All backend HTTP calls |
| `react-router-dom` | ^7.15 | Client-side routing |
| `socket.io-client` | ^4.8 | Real-time notifications |
| `firebase` | ^12.13 | Google sign-in only (`auth`, `GoogleAuthProvider`) |
| `hls.js` | ^1.6 | **Installed; not referenced in `src/` source** (backend converts to HLS but frontend plays direct `fileUrl` MP4) |
| `framer-motion` | ^12.40 | Animations everywhere |
| `gsap` | ^3.15 | Scroll animations (Footer, `useGSAPAnimations`) |
| `recharts` | ^3.8 | Educator/admin charts |
| `react-helmet-async` | ^3.0 | SEO `<head>` management |
| `react-markdown` + `remark-gfm` + `rehype-highlight` | — | AI chatbot markdown rendering |
| `jspdf` + `html2canvas` | — | Client-side certificate PDF |
| `pdfkit` | ^0.18 | **Node library mistakenly listed as a frontend dep** (unused) |
| `react-toastify` | ^11.1 | Toast notifications |
| `react-spinners` | ^0.17 | `ClipLoader` loading states |
| `lucide-react`, `react-icons` | — | Icon sets (two libraries used side by side) |
| `swiper`, `@tsparticles/*`, `tsparticles` | — | Installed; `swiper`/`tsparticles` not imported in `src/` |
| `tailwindcss` | ^3.4 | (also listed under `dependencies`, should be devDep) |

### Environment variables used

```
VITE_SERVER_URL            → backend base URL (used everywhere as BASE_URL)
VITE_RAZORPAY_KEY_ID       → Razorpay checkout key
VITE_GA_MEASUREMENT_ID     → Google Analytics
VITE_FIREBASE_APIKEY       → Firebase web API key
```

`frontend/.env` is **not committed** — values must be supplied locally.

---

## 2. Folder Structure

```
frontend/
├── index.html                  # HTML shell, SEO meta, Razorpay script (defer)
├── vite.config.js              # manualChunks vendor splitting
├── postcss.config.js
├── eslint.config.js
├── public/sw.js                # service worker (cache-first, prod only)
└── src/
    ├── main.jsx                # React root + all global providers
    ├── App.jsx                 # all routes + bootstrap data fetching
    ├── App.css / index.css     # global styles
    ├── assets/                 # images/video (logo, Empty.png, mp4s, etc.)
    ├── components/
    │   ├── admin/              # AdminLayout, AdminNavbar, AdminSidebar, AdminStats,
    │   │                       #   CourseTable, MobileSidebar, RevenueChart, UserTable
    │   ├── blog/               # BlogSidebar, BlogHero, BlogContent, BlogSectionCard, BlogTechCard
    │   ├── dashboard/          # educator dashboard widgets (StatsCards, GraphSection,
    │   │                       #   ProfileCard, DashboardHeader, CoursePerformanceTable,
    │   │                       #   RecentEnrollments, TopPerformingCourse)
    │   ├── educator/           # EducatorLayout, EducatorNavbar, EducatorSidebar
    │   ├── home/
    │   │   ├── component/      # CourseCard, CategoryCard, InstructorCard, LiveClassCard,
    │   │   │                   #   ReviewCard, SuccessStoryCard, TestimonialCard
    │   │   ├── sections/       # 16 landing-page sections (Hero, FAQ, Reviews, ...)
    │   │   └── shared/         # Footer, Loader, ScrollToTop, Videobg
    │   ├── lecture/            # LecturePlayer, ModuleList, QuizResult, LectureResources,
    │   │                       #   AIChatbot, AIChatbot_backup, AskAIPanel
    │   ├── navbar/             # Navbar + mega-menu system (DesktopMenu, MobileMenu,
    │   │                       #   CoursesMegaMenu, CourseSidebar, CourseGrid,
    │   │                       #   ProfileDropdown, categories.js)
    │   ├── progress/           # UNUSED alternative learning UI (VideoPlayer,
    │   │                       #   CourseSidebar, ModuleAccordion, LectureItem,
    │   │                       #   ResumeLearningButton, ProgressBar, ProgressCard)
    │   ├── seo/                # SEO, SchemaData, GoogleAnalytics, OptimizedImage
    │   ├── shared/             # CreateBlogForm, MyBlogsList, FloatingChatWidget
    │   ├── student/            # StudentLayout, InvoiceModal
    │   ├── studentDashboard/   # Sidebar, StatsCards, TopBanner, LearningStreak,
    │   │                       #   Calendar, Leaderboard, ContinueLearning
    │   └── ui/                 # AnimatedBrand, Badge, Button, DarkModeButton, Modal,
    │                           #   NotificationBell, SearchBar, StudentNotification
    ├── context/
    │   ├── SocketContext.jsx   # socket.io provider + useSocket()
    │   └── ThemeContext.jsx    # dark mode + useTheme()
    ├── hooks/
    │   ├── useDebounce.js      # mostly comments only (near-empty)
    │   ├── useGSAPAnimations.js# GSAP/ScrollTrigger helpers
    │   └── useIntersectionObserver.js
    ├── pages/
    │   ├── home/Home.jsx
    │   ├── auth/               # Login, SignUp, ForgetPassword
    │   ├── student/            # StudentDashboard, AllCourses, CourseDetail,
    │   │                       #   ViewLecture, MyEnrolledCourses, CheckoutPage,
    │   │                       #   Certificates, Profile, EditProfile,
    │   │                       #   PurchaseHistory, Comment (page-level component)
    │   ├── educator/           # EducatorDashboard + 17 management pages
    │   ├── admin/              # AdminDashboard, ManageUsers, ManageCourses,
    │   │                       #   PlatformStats, Coupons, CreateBlog, MyBlogs
    │   ├── Blog/               # BlogPanal, SubjectDetail, CategoryBlog, Blog,
    │   │                       #   BlogDetails (EMPTY FILE), blogData.js
    │   └── course-learning/    # CourseLearning.jsx — NOT ROUTED, BROKEN import
    └── redux/
        ├── actions/courseAction.js   # legacy thunk actions
        └── slices/            # store + 13 slices
    └── utils/                  # constants, firebase, currency/date/duration fmt,
                                #   generateCertificatePdf, throttle
```

---

## 3. Application Bootstrap & Lifecycle

### `src/main.jsx`

- Wraps the app in (outer → inner): `StrictMode` → `HelmetProvider` → `BrowserRouter` → Redux `Provider` → `ThemeProvider` → `PersistGate` → `GoogleAnalytics` → `App`.
- Registers `/sw.js` service worker **only in production** (`import.meta.env.PROD`).
- `PersistGate loading={null}` renders nothing until redux-persist rehydrates.

### `src/App.jsx`

- Imports **all pages lazily** via `React.lazy` + one global `<Suspense>` (full-screen "Loading..." fallback).
- On mount dispatches:
  - `fetchCurrentUser()` — session restore via cookie (`withCredentials: true`).
  - `clearAllProgress()` + `clearModuleData()` — prevents progress leakage between users.
  - `fetchAllReviews()` — deferred via `requestIdleCallback` (fallback `setTimeout` 100 ms).
- When `userData` changes:
  - always → `fetchPublishedCourses()` (idle-deferred);
  - `role === "educator"` → `fetchCreatorCourses()`;
  - `role === "admin"` → `fetchAllUsers()` + `fetchCourses()` + `fetchPlatformStats()`.
- Global chrome: `<SEO>` with `websiteSchema`, `<ToastContainer>`, `<ScrollToTop>`, `<SocketProvider>`.

### Routing model (React Router v7)

| Route | Guard | Page |
|---|---|---|
| `/` | public | `Home` |
| `/signup`, `/login` | redirect to role dashboard if logged in | `SignUp`, `Login` |
| `/forget-password` | public | `ForgetPassword` |
| `/profile`, `/editprofile`, `/allcourses`, `/course/:courseId`, `/viewlecture/:courseId`, `/mycourses`, `/checkout/:courseId`, `/student/notifications` | `userData ? page : <Navigate to="/login">` | student pages |
| `/student/*` | `StudentLayout` (any logged-in user — **no role check**) | dashboard, my-courses, certificates, purchase-history, profile |
| `/blogs`, `/blogs/subject/:courseId`, `/blogs/:category`, `/blogs/:category/:slug` | any logged-in user | blog reader pages |
| `/edu-dashboard` | educator → redirect | legacy redirect |
| `/educator/*` | `role === "educator"` else `/` | `EducatorLayout` + 19 nested routes |
| `/admin/*` | `role === "admin"` else `/` | `AdminLayout` + 8 nested routes |

**Notable routing facts**

- `pages/course-learning/CourseLearning.jsx` exists but has **no route** — dead code (also imports a non-existent `components/progress/certificate/CertificateCard`).
- `/student/*` routes accept **any** authenticated role (student/educator/admin).
- Educator layout exposes `coupons` and `blogs` pages — educators manage coupons/blogs.
- `BlogDetails.jsx` is a **0-byte empty file**.
- `components/lecture/AIChatbot_backup.jsx` and `components/lecture/AskAIPanel.jsx` are **not imported** anywhere — dead code. `AskAIPanel` also imports a non-existent `../../utils/axiosInstance`.
- `components/progress/*` (VideoPlayer, CourseSidebar, ModuleAccordion, LectureItem, ResumeLearningButton, ProgressBar, ProgressCard) is an **older/alternative learning UI used only by the unrouted `CourseLearning` page** — effectively dead code in production.

---

## 4. Redux Toolkit Store & Persist

### `src/redux/slices/store.js`

- `combineReducers` merges **13 slices**: `user, course, lecture, module, review, dashboard, comment, admin, coupon, progress, enrollment, certificate, blog`.
- Custom `storage` object wraps `localStorage` in `Promise.resolve` (redux-persist expects async storage).
- `persistConfig = { key: "root", storage }` — **entire store persisted**, no `whitelist`/`blacklist`. This means course lists, comments, progress maps etc. are all written to `localStorage` on every change (performance + stale-data risk; `App.jsx` manually clears progress/module data on boot to compensate).
- `serializableCheck: false` — required because redux-persist stores non-serializable internals.
- Exports `store` and `persistor`.

### Slices — actions, reducers, async operations

#### `userSlice.js`
- State: `{ userData, loading, error, fetched, initialLoading }`.
- Thunks: `fetchCurrentUser` → `GET /api/user/getcurrentuser`; `updateProfileData` → `PUT /api/user/updateprofile` (multipart/form-data).
- Actions: `clearUserData`, `setUserData` (used by Login/SignUp/Navbar logout).
- **Auth model:** cookie-based (`withCredentials: true`); no tokens in Redux. `setUserData` is dispatched directly after login/signup and on logout `setUserData(null)`.

#### `courseSlice.js`
- State: `{ creatorCourseData, courseData, selectedCourse, loading, error }`.
- Thunks: `fetchCreatorCourses` → `GET /api/course/getcreator`; `fetchPublishedCourses` → `GET /api/course/getpublished`; `fetchCourseById` → `GET /api/course/getcourse/:id`.
- Actions: `setSelectedCourse`, `clearCourseError`.

#### `lectureSlice.js`
- State: `{ lectureData, loading, error }`.
- Thunks: `fetchLectures(moduleId)` → `GET /api/course/courselecture/:moduleId`; `createLecture` → `POST /api/course/createlecture/:moduleId`; `updateLecture` → `POST /api/course/editlecture/:lectureId`; `deleteLecture` → `DELETE /api/course/removelecture/:lectureId`.
- Reducers update `lectureData` array optimistically (push / findIndex replace / filter).
- Actions: `setLectureData`, `clearError`.

#### `moduleSlice.js`
- State: `{ moduleData, totalCourseLectures, totalCourseDuration, loading, error }`.
- Thunks: `fetchModules(courseId)` → `GET /api/course/course-modules/:courseId` (stores `modules`, `totalCourseLectures`, `totalCourseDuration`); `createModule` → `POST /api/course/create-module/:courseId`; `updateModule` → `PUT /api/course/update-module/:moduleId`; `deleteModule` → `DELETE /api/course/remove-module/:moduleId`.
- Actions: `setModuleData`, `clearError`, `clearModuleData`.

#### `reviewSlice.js`
- State: `{ reviewData, loading, error }`.
- Thunk: `fetchAllReviews` → `GET /api/review/getreview` (all reviews for homepage).
- Action: `setReviewData`.

#### `dashboardSlice.js` (educator dashboard)
- State: `{ stats { totalCourses, totalStudents, totalEarnings, averageProgress, recentEnrollments, totalDownloads, enrollmentByCourse[] }, recentEnrollments, loading, error }`.
- Thunks: `fetchDashboardStats` → `GET /api/course/dashboard-stats`; `fetchRecentEnrollments` → `GET /api/course/recent-enrollments`.
- No local reducers.

#### `commentSlice.js` (lecture discussions)
- State: `{ comments, loading, error }`.
- Thunks: `fetchLectureComments(lectureId)` → `GET /api/course/comment/:lectureId`; `addComment` → `POST /api/course/comment/:lectureId`; `deleteComment` → `DELETE /api/course/comment/:lectureId/:commentId`; `addReply` → `POST /api/course/comment/reply/:lectureId/:commentId`; `toggleCommentLike` → `PUT /api/course/comment/like/:lectureId/:commentId`; `deleteReply` → `DELETE /api/course/comment/reply/:lectureId/:commentId/:replyId`; `toggleReplyLike` → `PUT /api/course/comment/reply/like/:lectureId/:commentId/:replyId`; `togglePinComment` → `PUT /api/course/comment/pin/:lectureId/:commentId`.
- ⚠️ `toggleCommentLike`/`toggleReplyLike` read `action.meta.arg.userId`, but the thunk args are `{ lectureId, commentId }` — **`userId` is never passed**, so likes are optimistically updated with `undefined`. Likely bug.

#### `adminSlice.js`
- Dedicated `axios.create({ baseURL: VITE_SERVER_URL + "/api/admin", withCredentials: true })`.
- Thunks: `fetchAllUsers` → `GET /users`; `banUser`/`unbanUser` → `PUT /ban/:id`, `/unban/:id`; `deleteUser` → `DELETE /user/:id`; `changeUserRole` → `PUT /role/:id`; `fetchCourses` → `GET /courses`; `deleteCourse` → `DELETE /course/:id`; `toggleCoursePublish` → `PUT /course/publish/:id`; `fetchPlatformStats` → `GET /stats`.
- Ban/unban/delete/role thunks **self-dispatch `fetchAllUsers()`/`fetchCourses()`** after success.
- State: `{ users, courses, stats, loading, error }`.

#### `couponSlice.js`
- State: `{ couponData, myCoupons, selectedCoupon, appliedCoupon, originalPrice, discount, finalPrice, loading, error }`.
- Thunks: `fetchAllCoupons` → `GET /api/coupon/all`; `fetchMyCoupons` → `GET /api/coupon/my-coupons`; `createCoupon` → `POST /api/coupon/create`; `updateCoupon` → `PUT /api/coupon/update/:id`; `deleteCoupon` → `DELETE /api/coupon/delete/:id`; `toggleCouponStatus` → `PATCH /api/coupon/toggle/:id`.
- Actions: `setCouponData`, `setMyCoupons`, `setSelectedCoupon`, `setAppliedCoupon`, `setCouponPricing`, `clearAppliedCoupon`, `setCouponLoading`, `setCouponError`, `resetCouponState`.
- **Note:** `CheckoutPage.jsx` does NOT use this slice — it manages coupon state locally and calls `POST /api/coupon/apply` directly.

#### `progressSlice.js`
- State: `{ loading, error, courseProgress{[courseId]: data}, resumeLecture, certificateGenerated{[courseId]: bool} }`.
- Thunks: `fetchCourseProgress(courseId)` → `GET /api/course/progress/course/:courseId`; `updateProgress({lectureId,currentPosition})` → `POST /api/course/progress/update`; `fetchResumeLecture(courseId)` → `GET /api/course/progress/resume/:courseId`.
- Actions: `clearProgressError`, `setCertificateGenerated`, `clearAllProgress`.
- ⚠️ `updateProgress.fulfilled` is a no-op — position is tracked server-side; local progress comes from refetches.

#### `enrollmentSlice.js`
- State: `{ enrollments, activeEnrollments, expiredEnrollments, selectedEnrollment, enrollmentStatus, loading, error }`.
- Thunks: `fetchUserEnrollments` → `GET /api/enrollment/user`; `checkEnrollmentStatus(courseId)` → `GET /api/enrollment/check/:courseId`; `enrollFreeCourse(courseId)` → `POST /api/enrollment/enroll/:courseId`.
- Fulfilled handlers split `enrollments` into `activeEnrollments`/`expiredEnrollments` by `status`.
- Actions: `setSelectedEnrollment`, `clearEnrollments`.
- ⚠️ **Largely bypassed**: `CourseDetail.jsx`/`ViewLecture.jsx`/`MyEnrolledCourses.jsx` call enrollment endpoints directly with axios instead of these thunks. Only `PurchaseHistory` and parts of checkout-adjacent code use the slice.

#### `certificateSlice.js`
- State: `{ certificate, loading, success, error }`.
- Thunks: `generateCertificate(courseId)` → `POST /api/course/certificate/generate/:courseId`; `getCertificate(courseId)` → `GET /api/course/certificate/:courseId`.
- Actions: `clearCertificateState`, `clearCertificate`.
- ⚠️ Certificate download is done via direct axios blob fetch in `ModuleList`/`Certificates` page, not via this slice.

#### `blogSlice.js` (largest slice, ~900 lines)
- Hierarchy: **Category → Course(subject) → Model → Topic(article)**.
- State: `{ categories, creatorCategories, selectedCategory, courses, selectedCourse, models, selectedModel, topics, selectedTopic, loading, error }`.
- ~24 thunks covering CRUD + publish-toggle for each of the 4 levels, plus `likeBlogTopic` (`PUT /api/blog/topic/like/:id`), `addBlogComment` (`POST /api/blog/topic/comment/:id`), `addBlogReply` (`POST /api/blog/topic/comment/reply/:topicId/:commentId`), `editBlogTopic` (multipart FormData with thumbnail).
- Reducers maintain arrays with push/findIndex-replace/filter patterns; like/comment handlers mutate `selectedTopic`.
- Actions: `setSelectedCategory/Course/Model/Topic`, `clearBlogError`.

### `redux/actions/courseAction.js` (legacy thunk file)

Plain (non-slice) thunks with side-effects: `createCourse` → `POST /api/course/create` then `navigate("/educator/courses")` + `fetchCreatorCourses()`; `deleteCourse` → `DELETE /api/course/remove/:id`; `togglePublish` → `PUT /api/course/publish/:id`. Only `CreateCourse.jsx` uses `createCourse`; delete/publish are duplicated inside `adminSlice`/`courseSlice` flows.

---

## 5. Context API & Custom Hooks

### `context/ThemeContext.jsx`
- `isDark` state initialized from `localStorage.theme` (default light).
- `useEffect` toggles `dark` class on `<html>` and persists choice.
- Exposes `{ isDark, toggleTheme }` via `useTheme()`. Used by ~40 components for Tailwind `dark:` styling.

### `context/SocketContext.jsx`
- `SocketProvider` reads `userData._id` from Redux; when present, opens `io(VITE_SERVER_URL, { withCredentials: true, transports: ["websocket","polling"] })`.
- On `connect` emits `join` with user id (server-side room).
- Listens: `new-notification` (stores `latestNotification`, fires browser `Notification` if permission granted), `unread-count` (updates badge count).
- Exposes `{ socket, isConnected, unreadCount, latestNotification, setLatestNotification }` via `useSocket()`.
- ⚠️ `Notification.permission` is never requested anywhere — browser notifications will never actually show.

### Custom hooks

| Hook | File | Status |
|---|---|---|
| `useDebounce` | `hooks/useDebounce.js` | **Effectively empty** — file contains only a comment; no implementation exported. |
| `useIntersectionObserver` | `hooks/useIntersectionObserver.js` | Working implementation (threshold/rootMargin/triggerOnce), returns `{ ref, entry, isIntersecting }`. |
| `useGSAPAnimations` | `hooks/useGSAPAnimations.js` | GSAP helpers (`fadeSlideUp` etc.); used by some home sections. |

---

## 6. API Integration & Backend Communication

- **HTTP client:** raw `axios` everywhere; `withCredentials: true` on every authenticated call (cookie session). Only `adminSlice` uses an `axios.create` instance.
- **Base URL:** `import.meta.env.VITE_SERVER_URL` duplicated as `BASE_URL`/`API_URL` in ~30 files.
- **Backend surface used by frontend:**
  - `/api/auth` — login, signup, googleauth, logout, sendotp, verifyotp, resetpassword, getcurrentuser is under `/api/user`
  - `/api/user` — getcurrentuser, updateprofile
  - `/api/course` — create/getcreator/getpublished/getcourse, course-modules, create-module/update-module/remove-module, createlecture/editlecture/removelecture/courselecture, enroll, user-enrollments, publish, remove, editcourse, add-quiz/remove-quiz, upload-resource/removeresource/download-resource, progress (course/update/resume), mark-lecture-completed, mark-quiz-completed, certificate generate/get/download, dashboard-stats, recent-enrollments, comment CRUD/like/pin/reply
  - `/api/enrollment` — user, check/:courseId, enroll/:courseId
  - `/api/order` — razorpay-order, verifypayment
  - `/api/coupon` — all, my-coupons, create, update, delete, toggle, apply
  - `/api/review` — getreview, createreview
  - `/api/certificate` — list, download/:courseId
  - `/api/notification` — list, :id/read, read-all, :id (DELETE)
  - `/api/chatbot` — chat, history/:lectureId, save, chat/:chatId, favorite/:chatId, favorite/:chatId/:messageIndex
  - `/api/blog` — categories, category CRUD/publish, courses, course CRUD/publish, models, model CRUD/publish, topics, topic CRUD/publish/like/comment/reply, model/:id
  - `/api/admin` — users CRUD/ban/unban/role, courses, course publish/delete, stats
- **Realtime:** Socket.IO for notifications only.
- **File upload:** `FormData` + `multipart/form-data` for profile photo, blog topic thumbnails, lecture video/resources (XHR `onUploadProgress` in `EditLecture`/`ResourcesUpload`).

---

## 7. Authentication & Role-Based Access

- **Login** (`pages/auth/Login.jsx`): email/password → `POST /api/auth/login` → `dispatch(setUserData(user))` → role redirect (`admin`→`/admin/dashboard`, `educator`→`/educator/dashboard`, else `/student/dashboard`). Google button → `signInWithPopup(auth, provider)` → `POST /api/auth/googleauth` with `{name,email,photoUrl,role:"student"}` → same dispatch/redirect.
- **SignUp** (`pages/auth/SignUp.jsx`): name/email/password/confirmPassword + role picker (student/educator/**admin** — ⚠️ any visitor can self-register as admin; backend presumably rejects, but frontend offers it). Posts to `/api/auth/signup`, then identical Google flow.
- **ForgetPassword** (`pages/auth/ForgetPassword.jsx`): 3-step wizard — `POST /api/auth/sendotp` → `POST /api/auth/verifyotp` → `POST /api/auth/resetpassword`. ⚠️ Bug: `toString.error("Password is not matched")` should be `toast.error` — password-mismatch check silently does nothing (typo on `toString`).
- **Session:** cookie (`withCredentials`); `App.jsx` calls `fetchCurrentUser` on boot; persisted Redux rehydrates `userData` instantly while the fetch confirms.
- **Logout:** `GET /api/auth/logout` → `localStorage.clear()` → `setUserData(null)` + `clearAllProgress()` + `clearModuleData()` → `/login`. Implemented in `Navbar.jsx` and `studentDashboard/Sidebar.jsx` (and `AdminSidebar` via `clearUserData`).
- **Route guards:** inline ternaries in `App.jsx` (no dedicated `<ProtectedRoute>` component). Admin/educator areas check `userData.role`; student area checks only `userData`.
- **Firebase** (`utils/firebase.js`): project `skillbridge-87e1f`, only `auth` + `GoogleAuthProvider` initialized and exported. Used solely for Google sign-in popup.

---

## 8. Dashboards

### Student dashboard — `pages/student/StudentDashboard.jsx`
Composition only: `Nav` + `TopBanner` + `StatsCards` + commented-out `ContinueLearning` + `LearningStreak` + `Calendar` + `Leaderboard` + `FloatingChatWidget`.

| Component | Path | Notes |
|---|---|---|
| `TopBanner` | `components/studentDashboard/TopBanner.jsx` | Static welcome banner (Sparkles icon). |
| `StatsCards` | `components/studentDashboard/StatsCards.jsx` | Fetches enrollments via axios (`/api/course/user-enrollments`-style GET with credentials) and shows Books/Award/Clock/TrendingUp stats. |
| `LearningStreak`, `Calendar`, `Leaderboard`, `ContinueLearning` | `components/studentDashboard/*.jsx` | Presentational widgets; `ContinueLearning` is imported nowhere (commented out in page). |
| `Sidebar` | `components/studentDashboard/Sidebar.jsx` | NavLink menu + logout (same axios logout flow). |

### Educator dashboard — `pages/educator/EducatorDashboard.jsx`
- Dispatches `fetchCreatorCourses()` + `fetchDashboardStats()` when `userData` exists.
- Reads `stats` from `state.dashboard`; renders `DashboardHeader`, `ProfileCard`, `StatsCards`, `GraphSection`, `CoursePerformanceTable`, `RecentEnrollments`, `TopPerformingCourse`.
- Sub-pages are thin wrappers: `Graph.jsx`, `Stats.jsx`, `CoursePerformance.jsx`, `RecentEnrollment.jsx` re-render the same dashboard components; `Profile.jsx` renders `ProfileCard`.

### Admin dashboard — `pages/admin/AdminDashboard.jsx`
- Dispatches `fetchPlatformStats`, `fetchAllUsers`, `fetchCourses` on mount; renders stat cards + charts + recent activity (uses `state.admin`).

---

## 9. Courses, Modules, Lectures & Learning UI

### Student course discovery

- **`pages/student/AllCourses.jsx`** — category sidebar (9 hardcoded categories matching `utils/constants.js`), live title search, filters `state.course.courseData` via `useMemo`; accepts `location.state.selectedCategory` from mega-menu. Renders `CourseCard` grid + skeleton loaders + empty state.
- **`components/home/component/CourseCard.jsx`** — memoized card (thumbnail, title, category, price, rating stars, reviews count); navigates to `/course/:id`.
- **`pages/student/CourseDetail.jsx`** (`/course/:courseId`) — the main sales page:
  - Finds course in `courseData` → `setSelectedCourse`; fetches modules via direct axios `GET /api/course/course-modules/:id` → `setModuleData`; checks enrollment via `GET /api/enrollment/check/:id` (stores `enrollmentData` incl. expired status).
  - Auto-selects first `isPreviewFree` lecture; renders `ModuleList` (preview mode) + `LecturePlayer`.
  - Enroll: free (`price === 0`) → `POST /api/course/enroll/:id`; paid → navigate `/checkout/:id`. `_handleEnroll` contains a **second, unused Razorpay flow** (dead code path).
  - Review form (rating stars + textarea) → `POST /api/review/createreview` — only when enrolled.
  - SEO: `<SEO>` + `courseSchema`.
  - ⚠️ Imports `CheckoutPage` at top (unused import) and hardcodes "12+ Hours", "₹599", "Hindi", "New Course".
- **`pages/student/ViewLecture.jsx`** (`/viewlecture/:courseId`) — the classroom:
  - Verifies active enrollment else toast + redirect to `/course/:id`.
  - Layout: `LecturePlayer` (left) + `ModuleList` (right, watch mode) + instructor card.
  - `courseProgress` fetched via `GET /api/course/progress/course/:id` and **polled every 30 s**.
  - `handleLectureComplete`/`handleQuizComplete`: refetch modules+progress, then auto-advance to next lecture only when both `isLectureCompleted` and `isQuizCompleted` (or no quiz) are true.
  - ⚠️ Heavy `console.log` debug statements left in production; duplicate auto-select effects.
- **`components/lecture/LecturePlayer.jsx`** — `<video controls>` with `controlsList="nodownload noplaybackrate nofullscreen"`, `disablePictureInPicture`, right-click disabled, F12/Ctrl+S/Ctrl+U blocked.
  - Sets `video.src = lecture.video.fileUrl` (direct MP4 — **no HLS despite `hls.js` dependency and backend `convertToHLS.js`**).
  - Resumes from `lecture.currentPosition`; posts progress `POST /api/course/progress/update` every ~5 s while playing, every 10 s interval, on pause, and at 90 % watched.
  - `ended` → `PUT /api/course/mark-lecture-completed/:lectureId` → `onLectureComplete()`.
  - Tabs: About / Resources (`LectureResources`) / Quiz (`QuizResult`) / Discussions (`Comment` page component) / AI Chatbot (`AIChatbot`).
- **`components/lecture/ModuleList.jsx`** — accordion of modules; per-lecture lock logic: locked if (not enrolled AND not `isPreviewFree`) OR (enrolled AND previous lecture not fully completed). Badges: Locked / Watch / Video Done / Done. Computes progress % locally from `lectureProgress` + `isLectureCompleted`. Includes **certificate download**: `POST /api/course/certificate/generate/:courseId` then `GET /api/course/certificate/download/:courseId` (blob → anchor download).
- **`components/lecture/QuizResult.jsx`** — collapsible quiz: reads `lecture.quizQuestions` (passed whole lecture object as `lectureId` prop — misnamed). Local `selectedAnswers` map; score computed client-side vs `correctAnswer`; result screen with per-question review, Retry, and "Unlock Next Video" → `PUT /api/course/mark-quiz-completed/:lectureId` → `onQuizComplete()`.
- **`components/lecture/LectureResources.jsx`** — lists `lecture.resources`; download flow: `GET /api/course/download-resource/:lectureId/:resourceId` returns `{fileUrl}` → `fetch` → blob → anchor download.
- **`pages/student/Comment.jsx`** — full discussion thread UI bound to `commentSlice` (fetch/add/delete comments, replies, likes, pin). Rendered inside `LecturePlayer` tab (file lives under `pages/student` but acts as a component).

### Educator course management

- **`pages/educator/Courses.jsx`** — table + mobile cards of `creatorCourseData`; edit → `/educator/edit-course/:id`. (Delete/publish actions exist in slices but are not surfaced on this page.)
- **`pages/educator/CreateCourse.jsx`** — title/category/description form → `dispatch(createCourse(...))` (legacy thunk) → POST `/api/course/create`.
- **`pages/educator/EditCourse.jsx`** — full edit form (title, subTitle, description, category, level, price, thumbnail upload preview, validity value+unit, publish toggle). Fetches course via axios, submits multipart to `/api/course/editcourse/:id`.
- **`pages/educator/Module.jsx`** (`/educator/create-module/:courseId`) — module CRUD via `moduleSlice` thunks; "Open" navigates to `/educator/create-lecture/:courseId/:moduleId`.
- **`pages/educator/CreateLecture.jsx`** — lecture list + create/delete via `lectureSlice`; edit → `/educator/editlecture/:courseId/:moduleId/:lectureId`.
- **`pages/educator/EditLecture.jsx`** — lecture editor: title, description, video file upload (XHR progress bar → `/api/course/createlecture`-style upload endpoint), `isPreviewFree` checkbox, embeds `ResourcesUpload` + `QuizUpload`.
- **`pages/educator/QuizUpload.jsx`** — question + 4 options + correct answer → `POST /api/course/add-quiz/:lectureId`; maintains `quizData` locally.
- **`pages/educator/ResourcesUpload.jsx`** — multi-file upload with progress → `POST /api/course/upload-resource/:lectureId` (FormData), delete → `DELETE /api/course/removeresource/:lectureId/:resourceId`, download → `GET /api/course/download-resource/...`.
- **`pages/educator/ViewCourse.jsx`** — educator preview of a course reusing `ModuleList`/`LecturePlayer` + related-course cards.

### Dead/alternate learning UI

`pages/course-learning/CourseLearning.jsx` + `components/progress/*` form a complete second implementation (VideoPlayer with throttled `updateProgress`, CourseSidebar/ModuleAccordion/LectureItem, ResumeLearningButton via `fetchResumeLecture`, ProgressCard via `fetchCourseProgress`) — **unrouted and broken** (missing `components/progress/certificate/CertificateCard` import).

---

## 10. Payments — Razorpay & Coupons

### `pages/student/CheckoutPage.jsx` (`/checkout/:courseId`)
- Reads `selectedCourse` from `state.course` (must be set by `CourseDetail` first — ⚠️ **direct visit to `/checkout/:id` shows "Loading..." forever** because nothing fetches the course by id here; also `useDispatch` is used but **never imported** → runtime ReferenceError if any dispatch path executes).
- Local state: `formData{name,email,phone}` auto-filled from `userData`; coupon `code`, `discount`, `appliedCouponId`, `couponMessage`, `loading`, `couponLoading`.
- `formatDescription()` parses "Module X:" headings out of the course description into structured JSX.
- `applyCoupon()` → `POST /api/coupon/apply {code, courseId}` → sets `discount`/`appliedCouponId`.
- `handlePayment()` → `POST /api/order/razorpay-order {courseId, couponCode, discount}` → opens `window.Razorpay` (key from `VITE_RAZORPAY_KEY_ID`, hardcoded name "LEARN SKILLS") → handler `POST /api/order/verifypayment` with payment response + user details + coupon info → toast + `navigate(/viewlecture/:id)`.
- Handles 401 by redirecting to login.
- Layout: course summary (left) + sticky checkout card (right) with details form, coupon box, bill summary, pay button, security note.

### Coupons management

- `pages/admin/Coupons.jsx` and `pages/educator/coupons` route share the same component — full CRUD via `couponSlice` (create/update/delete/toggle), course picker populated from `fetchPublishedCourses`/`fetchCreatorCourses`.

---

## 11. Certificates

- `pages/student/Certificates.jsx` (`/student/certificates`) — `GET /api/certificate` list; card per certificate (course title, `certificateId`, issue date); download opens `GET /api/certificate/download/:courseId` in new tab.
- `components/lecture/ModuleList.jsx` — generate+download flow (see §9).
- `utils/generateCertificatePdf.js` — **client-side PDF generator** using `html2canvas` + `jsPDF` landscape A4; exported but **not imported anywhere** (dead code — real downloads come from backend PDF).
- `components/student/InvoiceModal.jsx` — jsPDF/html2canvas invoice modal used by `PurchaseHistory.jsx`.

---

## 12. Notifications & Socket.IO

- `SocketContext` (see §5) — connect on login, `join` room, `new-notification`, `unread-count`.
- `components/ui/NotificationBell.jsx` — bell icon with unread badge (from socket `unreadCount`); dropdown fetches `GET /api/notification?limit=5`; click → `actionUrl` navigation; "View all" → `/student/notifications`; mark-all-read → `PATCH /api/notification/read-all`.
- `components/ui/StudentNotification.jsx` — full notifications page (`/student/notifications`): list, mark-read (`PATCH /api/notification/:id/read`), delete (`DELETE /api/notification/:id`), mark-all, type→emoji map, relative timestamps.
- Backend emits via `backend/service/socketNotificationService.js` + `sockets/notificationSocket.js`.

---

## 13. AI Chatbot

- `components/lecture/AIChatbot.jsx` (647 lines, used in `LecturePlayer` "AI Chatbot" tab):
  - Props: `lectureId`, `lectureTitle`.
  - State: `messages`, `inputMessage`, `isLoading`, `isFullScreen`, `showHistory`, `chatHistory`, `selectedChatId`, `interactionId`.
  - API: `GET /api/chatbot/history/:lectureId` (chat list), `POST /api/chatbot/chat` (send), `POST /api/chatbot/save`, `GET/PUT /api/chatbot/chat/:chatId`, `PUT /api/chatbot/favorite/:chatId` and `/favorite/:chatId/:messageIndex` (seen in grep).
  - Renders assistant output through `ReactMarkdown` + `remark-gfm` with a custom ChatGPT-style component map (headings, code blocks, tables, blockquotes).
  - Features: fullscreen toggle, chat history sidebar, favorites (star), copy, clear.
- `components/lecture/AskAIPanel.jsx` — **dead code**; older "Ask AI" panel calling `/api/ai-chat/:lectureId`; imports non-existent `utils/axiosInstance` → would crash if mounted.
- `components/lecture/AIChatbot_backup.jsx` — 612-line backup copy, unimported.
- `components/shared/FloatingChatWidget.jsx` — **not an AI chatbot**: floating button expanding to `tel:` call + WhatsApp (`wa.me/7800017055`) links; mounted on Home + StudentDashboard.

---

## 14. Blog System

Two parallel structures:

### Public reader (`pages/Blog/`)
- `BlogPanal.jsx` (`/blogs`) — category browser: fetches `fetchAllBlogCategories`, nested selection category→course→model→topic via `fetchBlogTopicById`; renders `BlogSidebar` + `BlogHero`.
- `SubjectDetail.jsx` (`/blogs/subject/:courseId`) — same pattern scoped to a subject.
- `CategoryBlog.jsx` (`/blogs/:category`) — 45-line category listing.
- `Blog.jsx` (`/blogs/:category/:slug`) — article view with `<SEO>` + `blogPostSchema`.
- `BlogDetails.jsx` — **empty file**.
- `blogData.js` — static fallback `blogCategories` object.
- `components/blog/*` — `BlogSidebar` (tree nav), `BlogHero`, `BlogContent` (markdown article), `BlogSectionCard`, `BlogTechCard`.

### Creator/admin (`pages/educator/*Blog*`, `pages/admin/*Blog*`)
- `educator/CreateBlog.jsx` & `admin/CreateBlog.jsx` → shared `components/shared/CreateBlogForm.jsx` (name/slug/description/icon → `createBlogCategory`).
- `educator/MyBlogs.jsx` & `admin/MyBlogs.jsx` → shared `components/shared/MyBlogsList.jsx` (`fetchCreatorBlogCategories`, publish toggle, delete → navigate to edit).
- `educator/EditBlogCategory.jsx` — edit category via `PUT /api/blog/category/:id`.
- `educator/BlogSubjects.jsx` (`blog-subjects/:categoryId`) — subject CRUD (`fetchBlogCoursesByCategory`, `createBlogCourse`, `togglePublishBlogCourse`, `deleteBlogCourse`).
- `educator/BlogTopics.jsx` (`blog-topics/:courseId`) — model CRUD (`fetchBlogModelsByCourse`, `createBlogModel`, ...).
- `educator/BlogContent.jsx` (`blog-content/:modelId`) — topic CRUD + edit (thumbnail upload via `editBlogTopic` FormData).

Naming is confusing ("course"=subject, "model"=chapter, "topic"=article) but consistent with backend models.

---

## 15. Firebase Integration

- `utils/firebase.js` — config hardcodes `authDomain/projectId/storageBucket/messagingSenderId/appId` for project `skillbridge-87e1f`; only `apiKey` comes from env.
- Usage: **Google sign-in popup only** (`Login.jsx`, `SignUp.jsx`). No Firestore/Storage/Messaging usage. No Firebase Admin/backend token verification visible on frontend.

---

## 16. SEO Implementation

- `components/seo/SEO.jsx` — `react-helmet-async` wrapper: title, description, keywords, canonical (`baseUrl + pathname`), robots `noindex`, OG/Twitter tags, JSON-LD script.
- `components/seo/SchemaData.jsx` — builders: `organizationSchema`, `websiteSchema(url)` (with SearchAction), `courseSchema(course)` (⚠️ hardcodes `priceCurrency: 'USD'` while app is INR), `blogPostSchema`.
- `components/seo/GoogleAnalytics.jsx` — injects gtag.js when `VITE_GA_MEASUREMENT_ID` set; cleanup removes scripts.
- `components/seo/OptimizedImage.jsx` — IntersectionObserver lazy image w/ blur placeholder + error fallback (defined; usage limited).
- `index.html` — static meta/OG/Twitter tags, preconnect fonts, dns-prefetch Razorpay, deferred `checkout.razorpay.com` script.
- `public/sw.js` — cache-first service worker (v1), registered only in prod.
- Per-page SEO: `App.jsx` (website schema), `Home.jsx`, `CourseDetail.jsx` (course schema), `Blog.jsx` (blog schema).

---

## 17. Responsive Design & Accessibility

- **Responsive:** Tailwind breakpoints throughout (`sm/md/lg/xl/2xl`); `AllCourses` has dedicated mobile card layout; `MobileMenu.jsx` (668 lines) full mobile nav; sidebars collapse via `sidebarOpen` state in all three layouts; tables have mobile card fallbacks (`Courses.jsx`).
- **Accessibility gaps:** icon-only buttons mostly lack `aria-label`; password visibility toggles are clickable icons without `aria-pressed`; quiz options are buttons (OK) but star rating uses click-only `FaStar` (no keyboard/radio semantics); `Form` inputs rely on placeholders+labels inconsistently; no focus-trap in modals (`Modal.jsx` uses framer-motion only); color contrast of `text-gray-400` on light bg is borderline.
- **Dark mode:** `dark:` variants across ~all components driven by `ThemeContext` + `localStorage`.

---

## 18. Loading, Error & Empty States

- Global: `Suspense` fallback (full-screen "Loading...") for all lazy routes; `PersistGate loading={null}`.
- Per-page: `ClipLoader` spinners (auth, lectures, admin), skeleton grids (`AllCourses`), animated pulse placeholders (`CourseLearning`), empty-state cards with CTA (`MyEnrolledCourses`, `Certificates`, `AllCourses` "No Courses Found", quiz "No Quiz Available", notifications empty state).
- Errors: mostly `toast.error(error.response?.data?.message || fallback)`; Redux `error` fields exist but several pages ignore them; `console.log(error)` is pervasive (incl. `ViewLecture` fetch debug logs and `Login` response logging — **sensitive data in console**).

---

## 19. Bugs, Dead Code & Incomplete Integrations

| # | Issue | Location |
|---|---|---|
| 1 | `useDispatch` used but never imported → ReferenceError risk | `pages/student/CheckoutPage.jsx:24` |
| 2 | `toString.error(...)` typo — password mismatch never reported | `pages/auth/ForgetPassword.jsx:57` |
| 3 | Sign-up lets anyone pick `admin` role | `pages/auth/SignUp.jsx:321-331` |
| 4 | `/checkout/:courseId` renders "Loading..." forever on direct visit (course never fetched by id) | `CheckoutPage.jsx` |
| 5 | `CourseLearning.jsx` unrouted + imports missing `components/progress/certificate/CertificateCard` | `pages/course-learning/` |
| 6 | `AskAIPanel.jsx` imports non-existent `utils/axiosInstance`; unimported | `components/lecture/` |
| 7 | `AIChatbot_backup.jsx`, `BlogDetails.jsx` (empty), `useDebounce.js` (empty), `generateCertificatePdf.js`, `InvoiceModal`-adjacent utils unused | various |
| 8 | `components/progress/*` subtree dead in production | `components/progress/` |
| 9 | `commentSlice` like/reply-like reducers read `action.meta.arg.userId` which thunks never receive | `redux/slices/commentSlice.js:236,269` |
| 10 | `hls.js`, `@tanstack/react-query`, `swiper`, `tsparticles`, `pdfkit`, `rehype-highlight` installed but unused in src | `package.json` |
| 11 | Redux-persist persists **entire** store (no whitelist) → localStorage bloat + stale data; mitigated only by manual clears | `redux/slices/store.js` |
| 12 | Enrollment thunks (`enrollmentSlice`) largely bypassed — pages call axios directly | `CourseDetail`, `ViewLecture`, `MyEnrolledCourses` |
| 13 | Video plays direct `fileUrl` MP4; backend HLS conversion unused on frontend | `LecturePlayer.jsx` vs `backend/utils/convertToHLS.js` |
| 14 | `SocketContext` never requests `Notification.permission` → desktop notifications dead | `context/SocketContext.jsx` |
| 15 | `courseSchema` hardcodes USD; app prices are INR (₹) | `components/seo/SchemaData.jsx` |
| 16 | `Navbar.jsx` logs `result.data` (user object) to console; `ViewLecture` has debug logs | Login/Navbar/ViewLecture |
| 17 | `CheckoutPage`/`CourseDetail` hardcode marketing strings ("Hindi", "New Course", "₹599", "12+ Hours", "LEARN SKILLS") | checkout/course detail |
| 18 | `Certificates` download URL opened via `window.open` without auth header — works only if cookie sent (same-origin ok) but no error handling | `pages/student/Certificates.jsx:153` |
| 19 | `DarkModeButton.jsx` manages its own `isDark` state instead of `useTheme()` → can desync from `ThemeContext` | `components/ui/DarkModeButton.jsx` |
| 20 | Duplicate/unused imports: `CheckoutPage` imported in `CourseDetail`; `_handleEnroll` dead Razorpay path; `store` imported in `EditBlogCategory` | various |
| 21 | `AdminCoupons`/`AdminCreateBlog`/`AdminMyBlogs` reused inside educator routes — intentional but blurs role boundaries | `App.jsx` |
| 22 | `MobileSidebar.jsx` (admin) vs `MobileMenu.jsx` (navbar) — overlapping mobile nav implementations | `components/admin`, `components/navbar` |

---

## 20. Frontend Interview Questions (with answers grounded in this code)

**Q1. How does the app restore a logged-in user on refresh?**
`main.jsx` wraps the tree in Redux `PersistGate`; `App.jsx` mounts → `dispatch(fetchCurrentUser())` → `GET /api/user/getcurrentuser` with `withCredentials: true` (httpOnly cookie session). `userSlice` stores `userData`; route guards in `App.jsx` read `state.user.userData` to decide `<Navigate to="/login">` vs render. Persisted Redux gives instant UI while the fetch revalidates.

**Q2. Explain the Redux data flow for creating a course.**
`CreateCourse.jsx` → `dispatch(createCourse({title,category,description}, navigate))` (thunk in `redux/actions/courseAction.js`) → `axios.post /api/course/create` → toast + `navigate('/educator/courses')` + `dispatch(fetchCreatorCourses())` → `courseSlice` fulfilled case writes `creatorCourseData` → `Courses.jsx` re-renders via `useSelector(state => state.course)`.

**Q3. How is video progress tracked?**
`LecturePlayer` attaches `timeupdate/play/pause/ended` listeners on the `<video>` ref; every ~5 s of playback it POSTs `{lectureId, currentPosition}` to `/api/course/progress/update`; at ≥90 % watched and on pause/ended it posts again; `ended` also PUTs `/api/course/mark-lecture-completed/:id`. Position resumes from `lecture.currentPosition` on load. `ViewLecture` polls `GET /api/course/progress/course/:id` every 30 s for the sidebar progress %.

**Q4. How are lectures locked/unlocked?**
`ModuleList` computes per-lecture `isLocked`: not enrolled → only `isPreviewFree` lectures open; enrolled → a lecture unlocks only when the previous lecture (same module, or last lecture of previous module) has `isLectureCompleted === true` AND (`quizQuestions` empty OR `isQuizCompleted === true`). `QuizResult` "Unlock Next Video" calls `PUT /api/course/mark-quiz-completed/:id` which flips `isQuizCompleted` server-side; `ViewLecture` refetches modules to re-evaluate locks.

**Q5. Describe the payment flow.**
`CourseDetail` → `/checkout/:courseId` → `CheckoutPage` collects name/email/phone, applies coupon via `POST /api/coupon/apply`, then `handlePayment` POSTs `/api/order/razorpay-order` → opens `window.Razorpay` checkout (key id from env) → on success handler POSTs `/api/order/verifypayment` with Razorpay response + order details → backend verifies signature & creates enrollment → navigate to `/viewlecture/:id`.

**Q6. How does real-time notification work?**
`SocketProvider` (mounted once in `App.jsx`) creates `io(VITE_SERVER_URL, {withCredentials:true})` when `userData._id` exists, emits `join` with the user id, listens for `new-notification` (updates `latestNotification`, fires `new Notification()` if permission granted) and `unread-count` (badge). `NotificationBell` consumes `useSocket().unreadCount` and lazy-fetches `GET /api/notification?limit=5` when opened.

**Q7. What does redux-persist store and what are the risks here?**
`persistConfig {key:"root", storage:localStorage-wrapper}` wraps the **combined root reducer** — every slice persists. Risk: localStorage quota, stale course/comment data across sessions; the app mitigates only partially by dispatching `clearAllProgress()`/`clearModuleData()` on boot and `localStorage.clear()` on logout. Best practice would be a `whitelist: ["user"]`.

**Q8. Compare the two video-progress implementations.**
Production path: `LecturePlayer` (direct axios calls, no Redux). Dead path: `components/progress/VideoPlayer.jsx` dispatches `updateProgress` thunk from `progressSlice` with a `throttle` util — cleaner Redux-wise but the page using it (`CourseLearning`) is unrouted and broken. Lesson: duplicated implementations drift; one should be deleted.

**Q9. How does role-based navigation work?**
Three layouts: `StudentLayout`, `EducatorLayout`, `AdminLayout`, each guarded in `App.jsx` by `userData.role`. Educator/admin sidebars render role-specific links; login/signup redirect by role. Weakness: guards are inline ternaries duplicated per route, `/student/*` doesn't check `role === "student"`, and signup exposes an admin option.

**Q10. How is SEO handled?**
`react-helmet-async` `SEO` component injects title/meta/canonical/OG/Twitter + JSON-LD per page; `SchemaData.jsx` builds Organization/WebSite(with SearchAction)/Course/BlogPosting schemas; static tags live in `index.html`; GA via `GoogleAnalytics` component gated on env var; sitemap presumably backend (`/api/seo` routes exist server-side). Weakness: `courseSchema` emits USD while pricing is INR.

**Q11. How does the AI chatbot persist conversations?**
`AIChatbot` keeps `chatHistory`/`selectedChatId`/`interactionId` in local state; history loaded via `GET /api/chatbot/history/:lectureId`; messages sent to `POST /api/chatbot/chat`; save/favorite endpoints exist (`/api/chatbot/save`, `/favorite/:chatId`, `/favorite/:chatId/:messageIndex`). Responses render through `ReactMarkdown`+`remark-gfm` with custom components for code/tables.

**Q12. Identify technical debt a reviewer should flag.**
(see §19) Missing `useDispatch` import, `toString.error` typo, dead routes/components (`CourseLearning`, `AskAIPanel`, `AIChatbot_backup`, `BlogDetails`, `useDebounce`, `generateCertificatePdf`, `components/progress/*`), unused deps (`hls.js`, `react-query`, `swiper`, `tsparticles`, `pdfkit`), unwhitelisted persist, console logging of user data, hardcoded prices/currency strings, no HLS playback despite backend conversion, comment-like reducer bug, admin role self-selection.

---

## 21. Summary Scorecard

| Area | Status |
|---|---|
| Routing & guards | Works; role gaps on `/student/*`, dead routes exist |
| Redux architecture | Functional; oversized persist, slice bypasses, one reducer bug |
| Auth (email + Google) | Working; admin self-signup risk, OTP typo bug |
| Course/module/lecture CRUD (educator) | Working via slices + direct axios mix |
| Learning experience (player, quiz, comments, resources, progress) | Working; duplicated dead implementation; no HLS |
| Payments (Razorpay + coupons) | Working flow; fragile course handoff via Redux `selectedCourse` |
| Certificates | Backend-generated PDF download + unused client-side generator |
| Notifications/Socket.IO | Working; browser Notification permission never requested |
| AI chatbot | Working with markdown rendering; backup/dead variants exist |
| Blog system | Full 4-level CRUD + public reader; confusing naming, one empty file |
| SEO | Solid Helmet/schema/GA setup; USD/INR schema mismatch |
| Responsive/a11y | Good responsive coverage; weak ARIA semantics |
| Code health | ~20 documented issues; significant dead code & unused deps |
