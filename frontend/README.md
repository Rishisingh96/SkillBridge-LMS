# SkillBridge LMS - Frontend

A comprehensive Learning Management System (LMS) frontend built with React, Vite, and modern web technologies. This application provides a complete platform for students, educators, and administrators to manage courses, track progress, and facilitate learning.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Key Features](#key-features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Architecture](#architecture)
- [State Management](#state-management)
- [Routing](#routing)
- [Components](#components)
- [Pages](#pages)
- [API Integration](#api-integration)
- [Styling](#styling)
- [Performance Optimization](#performance-optimization)
- [Authentication](#authentication)
- [Role-Based Access Control](#role-based-access-control)
- [Real-Time Features](#real-time-features)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## 🎯 Project Overview

SkillBridge LMS is a full-featured learning management system that supports three main user roles:

- **Students**: Browse courses, enroll, track progress, view lectures, earn certificates
- **Educators**: Create courses, manage modules, upload lectures, track student performance
- **Administrators**: Manage users, courses, platform statistics, and coupons

The frontend is built as a Single Page Application (SPA) with lazy loading for optimal performance.

## 🛠 Tech Stack

### Core Framework
- **React 19.2.5** - UI library
- **Vite 8.0.10** - Build tool and dev server
- **React Router DOM 7.15.0** - Client-side routing

### State Management
- **Redux Toolkit 2.11.2** - State management
- **Redux Persist 6.0.0** - State persistence
- **React Redux 9.2.0** - React bindings

### UI & Styling
- **TailwindCSS 3.4.1** - Utility-first CSS framework
- **Framer Motion 12.40.0** - Animation library
- **GSAP 3.15.0** - Advanced animations
- **Lucide React 1.16.0** - Icon library
- **React Icons 5.6.0** - Additional icons
- **Swiper 12.1.4** - Carousel/slider component
- **TSParticles 3.9.1** - Particle effects

### Data Fetching & API
- **Axios 1.16.0** - HTTP client
- **@tanstack/react-query 5.100.10** - Data fetching and caching

### Real-Time Communication
- **Socket.io Client 4.8.3** - WebSocket client for real-time updates

### PDF & Document Generation
- **jsPDF 4.2.1** - PDF generation
- **html2canvas 1.4.1** - HTML to canvas conversion
- **PDFKit 0.18.0** - PDF document generation

### Video Streaming
- **HLS.js 1.6.16** - HTTP Live Streaming for video playback

### Notifications
- **React Toastify 11.1.0** - Toast notifications
- **React Spinners 0.17.0** - Loading spinners

### Firebase Integration
- **Firebase 12.13.0** - Backend services (authentication, storage, etc.)

### Charts & Visualization
- **Recharts 3.8.1** - Chart library for analytics

### Development Tools
- **ESLint 10.2.1** - Code linting
- **PostCSS 8.4.35** - CSS processing
- **Autoprefixer 10.4.17** - CSS vendor prefixing

## ✨ Key Features

### Student Features
- Course browsing and discovery
- Course enrollment and checkout
- Lecture viewing with HLS video streaming
- Progress tracking per module and lecture
- Certificate generation upon course completion
- Purchase history
- Profile management
- Blog reading and engagement
- Real-time notifications

### Educator Features
- Course creation and management
- Module organization
- Lecture creation with video upload
- Student enrollment tracking
- Performance analytics and graphs
- Revenue statistics
- Course performance metrics
- Coupon management
- Profile customization

### Admin Features
- User management (view, edit, delete)
- Course management and moderation
- Platform-wide statistics
- Coupon creation and management
- Dashboard with key metrics

### Technical Features
- Lazy loading for all routes
- Code splitting for optimal bundle size
- Dark mode support
- Responsive design
- Real-time socket connections
- Persistent authentication
- Optimistic UI updates
- Debounced search and inputs
- GSAP animations
- Particle effects on home page

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
│   ├── favicon.svg
│   ├── icons.svg
│   └── lms_bg.mp4
├── src/
│   ├── assets/           # Additional assets
│   ├── components/       # Reusable components
│   │   ├── admin/       # Admin-specific components
│   │   ├── blog/        # Blog-related components
│   │   ├── dashboard/   # Dashboard components
│   │   ├── educator/    # Educator-specific components
│   │   ├── home/        # Home page components
│   │   ├── lecture/     # Lecture viewing components
│   │   ├── navbar/      # Navigation components
│   │   ├── progress/    # Progress tracking components
│   │   ├── student/     # Student-specific components
│   │   ├── studentDashboard/  # Student dashboard components
│   │   └── ui/          # Generic UI components
│   ├── context/         # React Context providers
│   │   ├── SocketContext.jsx    # Socket.io provider
│   │   └── ThemeContext.jsx     # Theme provider
│   ├── customHooks/     # Custom React hooks
│   │   ├── useAllReviews.js
│   │   ├── useCreatorCourse.js
│   │   ├── useCurrentUser.js
│   │   └── usePublishedCourse.js
│   ├── hooks/           # Additional hooks
│   │   ├── useDebounce.js
│   │   ├── useGSAPAnimations.js
│   │   └── useIntersectionObserver.js
│   ├── pages/           # Page components
│   │   ├── Blog/        # Blog pages
│   │   ├── admin/       # Admin pages
│   │   ├── auth/        # Authentication pages
│   │   ├── course-learning/  # Course learning pages
│   │   ├── educator/    # Educator pages
│   │   ├── home/        # Home page
│   │   └── student/     # Student pages
│   ├── redux/           # Redux store and slices
│   │   ├── actions/     # Redux actions
│   │   └── slices/      # Redux slices
│   ├── utils/           # Utility functions
│   │   ├── constants.js
│   │   ├── firebase.js
│   │   ├── formatCurrency.js
│   │   ├── formatDate.js
│   │   ├── formateDuration.js
│   │   ├── generateCertificatePdf.js
│   │   └── throttle.js
│   ├── App.css
│   ├── App.jsx          # Main app component with routing
│   ├── index.css        # Global styles
│   └── main.jsx         # Application entry point
├── .env                 # Environment variables
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js       # Vite configuration
```

## 🚀 Installation
### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Steps
1. **Clone the repository**
```bash
git clone <repository-url>
cd SkillBridge-LMS/frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```env
VITE_SERVER_URL=http://localhost:5000
```

4. **Start the development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🔐 Environment Variables

Create a `.env` file in the frontend root directory:

```env
VITE_SERVER_URL=http://localhost:5000
```

**Note**: The backend server URL should point to your backend API endpoint.

## 📜 Available Scripts

### `npm run dev`
Starts the development server with hot module replacement (HMR).

### `npm run build`
Creates an optimized production build in the `dist` directory.

### `npm run preview`
Previews the production build locally.

### `npm run lint`
Runs ESLint to check for code quality issues.

## 🏗 Architecture

### Component Architecture
The application follows a component-based architecture with:
- **Layout Components**: Wrappers for different user roles (AdminLayout, EducatorLayout, StudentLayout)
- **Page Components**: Route-level components loaded lazily
- **UI Components**: Reusable, presentational components
- **Feature Components**: Domain-specific components

### Data Flow
1. **User Action** → Component dispatches Redux action
2. **Redux Action** → API call via Axios
3. **API Response** → Redux state updated
4. **State Change** → Components re-render with new data
5. **Real-time Updates** → Socket.io pushes updates to components

### Lazy Loading
All page components are lazy-loaded using React's `lazy()` and `Suspense` for optimal initial load time.

## 📊 State Management

### Redux Slices

The application uses Redux Toolkit with the following slices:

- **userSlice**: User authentication and profile data
- **courseSlice**: Course data, creator courses, published courses
- **adminSlice**: Admin-specific data (users, courses, stats)
- **progressSlice**: Course and lecture progress tracking
- **moduleSlice**: Module data management
- **lectureSlice**: Lecture data and management
- **reviewSlice**: Course reviews and ratings
- **enrollmentSlice**: Enrollment data and history
- **certificateSlice**: Certificate data
- **couponSlice**: Coupon management
- **commentSlice**: Comments on lectures/courses
- **dashboardSlice**: Dashboard analytics data

### State Persistence
Redux Persist is configured to persist user authentication state across browser sessions.

### Custom Hooks
- `useCurrentUser`: Fetches and manages current user data
- `useCreatorCourse`: Fetches educator's created courses
- `usePublishedCourse`: Fetches published courses
- `useAllReviews`: Fetches all course reviews

## 🧭 Routing

### Route Structure

The application uses React Router with nested routes for different user roles:

#### Public Routes
- `/` - Home page
- `/signup` - Sign up
- `/login` - Login
- `/forget-password` - Password recovery
- `/verify-email` - Email verification

#### Student Routes
- `/student` - Student dashboard layout
  - `/student/dashboard` - Dashboard
  - `/student/my-courses` - Enrolled courses
  - `/student/certificates` - Certificates
  - `/student/purchase-history` - Purchase history
  - `/student/profile` - Profile

#### Educator Routes
- `/educator` - Educator dashboard layout
  - `/educator/profile` - Profile
  - `/educator/dashboard` - Dashboard
  - `/educator/courses` - Course management
  - `/educator/create-course` - Create new course
  - `/educator/edit-course/:courseId` - Edit course
  - `/educator/create-module/:courseId` - Create module
  - `/educator/create-lecture/:courseId/:moduleId` - Create lecture
  - `/educator/editlecture/:courseId/:moduleId/:lectureId` - Edit lecture
  - `/educator/viewcourse/:courseId` - View course
  - `/educator/graph` - Analytics graphs
  - `/educator/recent-enrollment` - Recent enrollments
  - `/educator/stats` - Statistics
  - `/educator/course-performance` - Course performance
  - `/educator/coupons` - Coupon management

#### Admin Routes
- `/admin` - Admin dashboard layout
  - `/admin/dashboard` - Dashboard
  - `/admin/users` - User management
  - `/admin/courses` - Course management
  - `/admin/coupons` - Coupon management
  - `/admin/stats` - Platform statistics

#### Blog Routes
- `/blogs` - Blog panel
- `/blogs/:category` - Category blogs
- `/blogs/:category/:slug` - Individual blog post

#### Other Routes
- `/course/:courseId` - Course detail
- `/viewlecture/:courseId` - View lecture
- `/checkout/:courseId` - Checkout page

### Route Protection
Routes are protected based on user authentication and role. Unauthenticated users are redirected to login, and users without appropriate roles are redirected to their respective dashboards.

## 🧩 Components

### Layout Components
- **AdminLayout**: Admin dashboard with sidebar navigation
- **EducatorLayout**: Educator dashboard with sidebar navigation
- **StudentLayout**: Student dashboard with sidebar navigation

### UI Components
Located in `src/components/ui/`:
- Buttons, cards, modals, forms, loaders, etc.

### Feature Components
- **Home Components**: Hero section, course cards, testimonials, etc.
- **Navbar Components**: Navigation bar with role-specific menus
- **Lecture Components**: Video player, lecture list, progress indicators
- **Progress Components**: Progress bars, completion tracking
- **Dashboard Components**: Analytics cards, charts, tables

## 📄 Pages

### Authentication Pages
- **Login**: User login with email/password
- **SignUp**: User registration
- **ForgetPassword**: Password recovery
- **VerifyEmail**: Email verification

### Student Pages
- **StudentDashboard**: Overview of enrolled courses and progress
- **AllCourses**: Browse all available courses
- **CourseDetail**: Detailed course information
- **ViewLecture**: Watch course lectures
- **MyEnrolledCourses**: List of enrolled courses
- **Certificates**: View earned certificates
- **PurchaseHistory**: View purchase history
- **Profile**: User profile management
- **EditProfile**: Edit user profile
- **CheckoutPage**: Course checkout

### Educator Pages
- **EducatorDashboard**: Educator overview and stats
- **Courses**: Manage created courses
- **CreateCourse**: Create new course
- **EditCourse**: Edit existing course
- **CreateLecture**: Add lecture to module
- **EditLecture**: Edit lecture content
- **ViewCourse**: Preview course
- **Module**: Manage course modules
- **EducatorProfile**: Educator profile
- **Graph**: View analytics graphs
- **RecentEnrollment**: Recent student enrollments
- **Stats**: Detailed statistics
- **CoursePerformance**: Course performance metrics

### Admin Pages
- **AdminDashboard**: Platform overview
- **ManageUsers**: User management
- **ManageCourses**: Course moderation
- **PlatformStats**: Platform statistics
- **Coupons**: Coupon management

### Blog Pages
- **BlogPanel**: Blog listing
- **CategoryBlog**: Blogs by category
- **Blog**: Individual blog post

## 🔌 API Integration

### Axios Configuration
API calls are made using Axios with the base URL from environment variables.

### API Endpoints
The frontend communicates with the backend REST API for:
- Authentication (login, signup, password reset)
- User management
- Course CRUD operations
- Enrollment and payment
- Progress tracking
- Reviews and comments
- Certificate generation
- Blog content
- Notifications

### Error Handling
Global error handling is implemented via Axios interceptors and Redux error states.

## 🎨 Styling

### TailwindCSS
The application uses TailwindCSS for utility-first styling with:
- Dark mode support via `darkMode: 'class'`
- Custom theme extensions
- Responsive design utilities

### Custom CSS
Additional custom styles are in:
- `index.css` - Global styles
- `App.css` - App-specific styles

### Animation Libraries
- **Framer Motion**: Component animations
- **GSAP**: Complex animations and timelines
- **TSParticles**: Particle effects on home page

## ⚡ Performance Optimization

### Code Splitting
Vite configuration includes manual chunk splitting for:
- React vendor chunks
- Redux vendor chunks
- UI vendor chunks
- Animation vendor chunks
- Other vendor dependencies

### Lazy Loading
All page components are lazy-loaded to reduce initial bundle size.

### Optimized Data Fetching
- Deferred non-critical data fetching using `requestIdleCallback`
- Debounced search and input handling
- React Query for efficient data caching and synchronization

### Build Optimization
- Source maps disabled in production
- Chunk size warning limit set to 1000 KB
- Dependency pre-bundling for faster dev server startup

## 🔒 Authentication

### Authentication Flow
1. User logs in via `/login`
2. Credentials sent to backend
3. Backend returns JWT token
4. Token stored in Redux state (persisted)
5. Protected routes check for authentication
6. Socket connection established with token

### Protected Routes
Routes are protected using Redux state. Unauthenticated users are redirected to login.

### Role-Based Access
Different user roles (student, educator, admin) have access to different routes and features.

## 👥 Role-Based Access Control

### Student
- View and enroll in courses
- Watch lectures and track progress
- Earn certificates
- View purchase history
- Read blogs

### Educator
- Create and manage courses
- Upload lectures
- View student enrollments
- Access analytics and performance data
- Manage coupons

### Admin
- Manage all users
- Moderate all courses
- View platform statistics
- Create and manage coupons
- Access admin dashboard

## 🔔 Real-Time Features

### Socket.io Integration
Real-time features powered by Socket.io:
- Live notifications
- Enrollment updates
- Progress updates
- Comment notifications

### Socket Context
`SocketContext.jsx` provides socket connection to all child components.

## 📦 Deployment

### Build for Production
```bash
npm run build
```

The optimized build will be in the `dist/` directory.

### Deployment Options
- **Vercel**: Deploy the `dist/` folder
- **Netlify**: Deploy the `dist/` folder
- **AWS S3 + CloudFront**: Static hosting
- **Docker**: Containerize the application

### Environment Variables in Production
Set `VITE_SERVER_URL` to your production backend URL.

## 🐛 Troubleshooting

### Common Issues

**Issue: CORS errors**
- Solution: Ensure backend allows CORS from frontend domain

**Issue: Socket connection fails**
- Solution: Check backend socket server is running and accessible

**Issue: State not persisting**
- Solution: Check Redux Persist configuration and browser storage

**Issue: Build fails**
- Solution: Check Node.js version and clear node_modules

**Issue: Video not playing**
- Solution: Ensure HLS.js is properly configured and video format is supported

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is part of SkillBridge LMS. See the main repository for license information.

## 📞 Support

For issues and questions, please contact the development team or create an issue in the repository.
