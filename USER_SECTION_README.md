# SkillBridge LMS - User Section Documentation

## Table of Contents
- [Overview](#overview)
- [User Pages](#user-pages)
- [User Components](#user-components)
- [Custom Hooks](#custom-hooks)
- [Redux State Management](#redux-state-management)
- [Authentication Flow](#authentication-flow)
- [Course Enrollment Flow](#course-enrollment-flow)
- [Video Learning Experience](#video-learning-experience)
- [Profile Management](#profile-management)
- [Discussion & Community](#discussion--community)
- [Payment Integration](#payment-integration)

---

## Overview

The User section of SkillBridge LMS provides a comprehensive learning platform for students to discover, enroll in, and learn from premium courses. Built with React, Redux, and modern UI libraries, it offers an immersive and intuitive learning experience.

### Key Features
- **Course Discovery**: Browse and search through a wide range of premium courses
- **Secure Enrollment**: Razorpay-powered payment integration with coupon support
- **Interactive Learning**: Video player with resources, quizzes, and discussions
- **Profile Management**: Complete user profile with enrollment tracking
- **Community Engagement**: Discussion forums and comment systems
- **Responsive Design**: Fully responsive across all devices

---

## User Pages

### 1. Home Page (`pages/student/Home.jsx`)

**Purpose**: Landing page that serves as the entry point for users, showcasing the platform's offerings and guiding users to explore courses.

**Key Features**:
- **Hero Section**: Animated hero with video background showcasing the platform's value proposition
- **Navigation**: Integrated navbar with course mega-menu and user profile dropdown
- **Course Discovery**: Quick access to all courses and AI-powered search
- **Social Proof**: Logo carousel showing platform credibility
- **Course Highlights**: Featured courses carousel and card grid
- **Reviews Section**: Student testimonials and ratings
- **About Section**: Platform information and value proposition

**Technical Implementation**:
```jsx
// Uses Framer Motion for smooth animations
// Integrates Videobg component for dynamic background
// Lazy loads course data via Redux
// Responsive layout with mobile-first approach
```

**User Flow**:
1. User lands on homepage
2. Views hero section with call-to-action buttons
3. Explores featured courses
4. Navigates to course details or all courses page

**Dependencies**:
- `Videobg`: Video background component
- `ExploreCourses`: Course discovery section
- `CardPage`: Course card grid
- `ReviewPage`: Reviews and testimonials
- `About`: Platform information

---

### 2. All Courses Page (`pages/student/AllCourses.jsx`)

**Purpose**: Comprehensive course listing page with advanced filtering and search capabilities.

**Key Features**:
- **Advanced Search**: Real-time search by course title
- **Category Filtering**: Multi-select category filters (Web Development, Mobile Development, Machine Learning, etc.)
- **Course Grid**: Responsive grid layout with course cards
- **Loading States**: Skeleton loaders for better UX
- **Empty States**: Friendly message when no courses match filters
- **Course Count**: Real-time count of filtered courses

**Technical Implementation**:
```jsx
// Redux integration for course data
// useMemo for optimized filtering
// Framer Motion for smooth animations
// Responsive sidebar for filters
```

**State Management**:
```javascript
const [category, setCategory] = useState([]); // Selected categories
const [search, setSearch] = useState(""); // Search query
const { courseData, loading } = useSelector((state) => state.course);
```

**Filtering Logic**:
```javascript
const filteredCourses = useMemo(() => {
  let courses = [...(courseData || [])];
  
  if (category.length > 0) {
    courses = courses.filter((item) =>
      category.includes(item.category)
    );
  }
  
  if (search.trim()) {
    courses = courses.filter((course) =>
      course.title.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  return courses;
}, [courseData, category, search]);
```

**User Flow**:
1. User navigates to all courses
2. Applies category filters
3. Uses search to find specific courses
4. Clicks on course card to view details

---

### 3. Course Detail Page (`pages/student/CourseDetail.jsx`)

**Purpose**: Detailed course view providing comprehensive information about a course before enrollment.

**Key Features**:
- **Course Information**: Title, subtitle, description, pricing, and validity
- **Curriculum Preview**: Module and lecture structure with free preview lectures
- **Instructor Profile**: Creator information with photo and bio
- **Reviews & Ratings**: Student reviews with rating system
- **Enrollment Actions**: Enroll button with Razorpay integration
- **Dark Mode**: Toggle between light and dark themes
- **Related Courses**: Other courses by the same instructor

**Technical Implementation**:
```jsx
// Dynamic routing with useParams
// Axios for API calls (modules, enrollment check)
// Razorpay integration for payment
// Redux for state management
// Formatted description parsing for module structure
```

**Key Functions**:

**Fetch Modules**:
```javascript
const fetchModules = async () => {
  try {
    const response = await axios.get(
      `${serverUrl}/api/course/course-modules/${courseId}`,
      { withCredentials: true }
    );
    dispatch(setModuleData(response.data.modules));
  } catch (error) {
    console.log(error);
  }
};
```

**Check Enrollment**:
```javascript
const checkEnrollment = async () => {
  try {
    const response = await axios.get(
      `${serverUrl}/api/course/check-enrollment/${courseId}`,
      { withCredentials: true }
    );
    
    if (response.data.isEnrolled && response.data.isActive) {
      setIsEnrolled(true);
      setEnrollmentData(response.data);
    }
  } catch (error) {
    setIsEnrolled(false);
  }
};
```

**Handle Enrollment**:
```javascript
const handleEnroll = async (courseId) => {
  try {
    const orderData = await axios.post(
      serverUrl + "/api/order/razorpay-order",
      { courseId },
      { withCredentials: true }
    );
    
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderData.data.order.amount,
      currency: "INR",
      name: "LEARN SKILLS",
      description: "COURSE ENROLLMENT",
      order_id: orderData.data.order.id,
      handler: async function (response) {
        const verifyPayment = await axios.post(
          serverUrl + "/api/order/verifypayment",
          { ...response, courseId },
          { withCredentials: true }
        );
        setIsEnrolled(true);
        toast.success(verifyPayment.data.message);
      },
    };
    
    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    toast.error(error.response?.data?.message || "Enrollment failed");
  }
};
```

**Description Formatting**:
```javascript
const formatDescription = (description) => {
  if (!description) return null;
  
  const lines = description.split('\n');
  const moduleRegex = /^(Module\s+\d+[:\s]|Module\s+\d+\.)/i;
  
  const formattedContent = [];
  let currentModule = null;
  let currentContent = [];
  
  lines.forEach((line) => {
    const trimmedLine = line.trim();
    
    if (moduleRegex.test(trimmedLine)) {
      if (currentModule) {
        formattedContent.push({
          type: 'module',
          title: currentModule,
          content: currentContent
        });
      }
      currentModule = trimmedLine;
      currentContent = [];
    } else if (currentModule) {
      if (trimmedLine) {
        currentContent.push(trimmedLine);
      }
    } else {
      if (trimmedLine) {
        formattedContent.push({
          type: 'text',
          content: trimmedLine
        });
      }
    }
  });
  
  return formattedContent;
};
```

**User Flow**:
1. User clicks on course card
2. Views course details, curriculum, and instructor info
3. Watches free preview lectures
4. Reads reviews from other students
5. Clicks "Enroll Now" to purchase course
6. Redirected to video player after successful payment

---

### 4. View Lecture Page (`pages/student/ViewLecture.jsx`)

**Purpose**: Main learning interface where enrolled students watch course lectures and access related materials.

**Key Features**:
- **Video Player**: Secure video player with disabled right-click and keyboard shortcuts
- **Module Navigation**: Accordion-style module list for easy navigation
- **Lecture Selection**: Click to select and play different lectures
- **Instructor Info**: Instructor profile and contact information
- **Course Progress**: Track total lectures and progress
- **Enrollment Verification**: Automatic check for valid enrollment

**Technical Implementation**:
```jsx
// Protected route - requires enrollment
// Auto-selects first lecture on load
// Fetches creator data for instructor info
// Theme-aware design
```

**Key Functions**:

**Fetch Course Data**:
```javascript
const fetchCourseData = () => {
  courseData.map((course) => {
    if (course._id === courseId) {
      dispatch(setSelectedCourse(course));
    }
    return null;
  });
};
```

**Fetch Modules**:
```javascript
const fetchModules = async () => {
  try {
    const response = await axios.get(
      `${serverUrl}/api/course/course-modules/${courseId}`,
      { withCredentials: true }
    );
    dispatch(setModuleData(response.data.modules));
  } catch (error) {
    console.log(error);
  }
};
```

**Check Enrollment**:
```javascript
const checkEnrollment = async () => {
  try {
    const response = await axios.get(
      `${serverUrl}/api/course/check-enrollment/${courseId}`,
      { withCredentials: true }
    );
    
    if (response.data.isEnrolled && response.data.isActive) {
      setIsEnrolled(true);
    } else {
      setIsEnrolled(false);
      toast.error("Please enroll in this course to access lectures");
      navigate(`/course/${courseId}`);
    }
  } catch (error) {
    setIsEnrolled(false);
    toast.error("Please enroll in this course to access lectures");
    navigate(`/course/${courseId}`);
  }
};
```

**Auto-select First Lecture**:
```javascript
useEffect(() => {
  if (moduleData?.length > 0 && !selectedLecture) {
    const firstLecture = moduleData[0]?.lectures?.[0];
    if (firstLecture) {
      setSelectedLecture(firstLecture);
    }
  }
}, [moduleData]);
```

**User Flow**:
1. Enrolled user navigates to view lecture
2. System verifies enrollment status
3. Auto-selects first lecture
4. User watches video and navigates through modules
5. Accesses resources, quizzes, and discussions

---

### 5. My Enrolled Courses Page (`pages/student/MyEnrolledCourses.jsx`)

**Purpose**: Dashboard showing all courses the user has enrolled in with quick access to continue learning.

**Key Features**:
- **Course Grid**: Visual grid of enrolled courses
- **Course Details**: Thumbnail, title, category, level, and lecture count
- **Quick Access**: "Continue Learning" button for each course
- **Empty State**: Friendly message when no courses are enrolled
- **Enrollment Status**: Visual indicator for enrolled courses

**Technical Implementation**:
```jsx
// Redux integration for user data
// Responsive grid layout
// Empty state handling
// Navigation to lecture player
```

**User Flow**:
1. User navigates to "My Courses"
2. Views all enrolled courses in grid
3. Clicks "Continue Learning" on desired course
4. Redirected to lecture player

---

### 6. Profile Page (`pages/student/Profile.jsx`)

**Purpose**: Comprehensive user profile view displaying personal information, enrolled courses, and account details.

**Key Features**:
- **Profile Header**: Cover image with profile picture
- **User Information**: Name, email, phone, gender, date of birth
- **Role Display**: User role (student, educator, admin)
- **Enrolled Courses**: List of enrolled courses with enrollment details
- **Course Stats**: Number of enrolled courses and validity
- **Edit Profile**: Quick access to profile editing
- **Loading States**: Skeleton loaders during data fetch

**Technical Implementation**:
```jsx
// Axios for enrollment data fetch
// InfoCard component for information display
- Role-based content display
// Enrollment status tracking
// Responsive design
```

**Key Functions**:

**Fetch Enrollments**:
```javascript
const fetchEnrollments = async () => {
  if (!userData) return;
  
  setLoadingEnrollments(true);
  try {
    const response = await axios.get(
      `${serverUrl}/api/course/user-enrollments`,
      { withCredentials: true }
    );
    setEnrollments(response.data.enrollments || []);
  } catch (error) {
    console.log(error);
  } finally {
    setLoadingEnrollments(false);
  }
};
```

**InfoCard Component**:
```jsx
const InfoCard = ({ icon, label, value }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-5"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600/20 to-cyan-500/20 flex items-center justify-center">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-400 mb-1">{label}</p>
          <h3 className="text-white font-semibold break-words leading-7">
            {value || "Not Added"}
          </h3>
        </div>
      </div>
    </motion.div>
  );
};
```

**User Flow**:
1. User navigates to profile
2. Views personal information
3. Checks enrolled courses and their validity
4. Clicks "Edit Profile" to update information

---

### 7. Edit Profile Page (`pages/student/EditProfile.jsx`)

**Purpose**: Profile editing interface allowing users to update their personal information and profile picture.

**Key Features**:
- **Profile Picture Upload**: Image upload with preview and size validation (max 5MB)
- **Personal Information**: Name, phone, bio, gender, date of birth
- **Real-time Preview**: Live preview of profile picture
- **Form Validation**: Client-side validation for all fields
- **Loading States**: Button loading state during update
- **Cancel Option**: Cancel changes and return to profile

**Technical Implementation**:
```jsx
// FormData for file upload
// Redux action for profile update
// Image validation and preview
// Form state management
```

**Key Functions**:

**Handle Image Change**:
```javascript
const handleImageChange = (e) => {
  const file = e.target.files[0];
  
  if (!file) return;
  
  if (file.size > 5 * 1024 * 1024) {
    toast.error("Image size must be less than 5MB");
    return;
  }
  
  setPhotoUrl(file);
  
  const reader = new FileReader();
  reader.onloadend = () => {
    setPreviewImage(reader.result);
  };
  reader.readAsDataURL(file);
};
```

**Handle Edit Profile**:
```javascript
const handleEditProfile = async (e) => {
  e.preventDefault();
  
  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("bio", bio);
    formData.append("phone", phone);
    formData.append("gender", gender);
    formData.append("dateOfBirth", dateOfBirth);
    
    if (photoUrl instanceof File) {
      formData.append("photo", photoUrl);
    }
    
    await dispatch(updateProfileData(formData)).unwrap();
    toast.success("Profile updated successfully");
    navigate("/profile");
  } catch (error) {
    toast.error(error || "Failed to update profile");
  }
};
```

**User Flow**:
1. User navigates to edit profile
2. Updates personal information
3. Uploads new profile picture (optional)
4. Clicks "Save Changes"
5. Redirected to profile page with updated information

---

### 8. Checkout Page (`pages/student/CheckoutPage.jsx`)

**Purpose**: Secure checkout interface for course enrollment with payment processing and coupon application.

**Key Features**:
- **Course Information**: Course details, thumbnail, and description
- **User Details Form**: Name, email, and phone number
- **Coupon System**: Apply discount coupons with validation
- **Bill Summary**: Original price, discount, and final amount
- **Razorpay Integration**: Secure payment processing
- **Mobile Optimization**: Fixed bottom bar for mobile users
- **Security Indicators**: Trust badges and secure payment messaging

**Technical Implementation**:
```jsx
// Razorpay SDK integration
// Coupon API integration
// Form validation
// Responsive design
// Real-time price calculation
```

**Key Functions**:

**Apply Coupon**:
```javascript
const applyCoupon = async () => {
  try {
    if (!coupon) {
      return alert("Please enter coupon");
    }
    
    setCouponLoading(true);
    
    const { data } = await axios.post(
      serverUrl + "/api/coupon/apply",
      {
        code: coupon,
        courseId: selectedCourse?._id,
      },
      {
        withCredentials: true,
      }
    );
    
    if (data.success) {
      setDiscount(data.discount);
      setCouponMessage(`Coupon Applied Successfully 🎉`);
    }
  } catch (error) {
    setDiscount(0);
    setCouponMessage(error?.response?.data?.message || "Invalid Coupon ❌");
  } finally {
    setCouponLoading(false);
  }
};
```

**Handle Payment**:
```javascript
const handlePayment = async () => {
  try {
    if (!formData.name || !formData.email || !formData.phone) {
      return alert("Please fill all details");
    }
    
    setLoading(true);
    
    const orderData = await axios.post(
      serverUrl + "/api/order/razorpay-order",
      { 
        courseId: selectedCourse?._id,
        couponCode: coupon,
        discount: discount
      },
      { withCredentials: true }
    );
    
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderData.data.order.amount,
      currency: "INR",
      name: "LEARN SKILLS",
      description: "COURSE ENROLLMENT",
      order_id: orderData.data.order.id,
      
      handler: async function (response) {
        try {
          const verifyPayment = await axios.post(
            serverUrl + "/api/order/verifypayment",
            { ...response, courseId: selectedCourse?._id },
            { withCredentials: true }
          );
          
          toast.success(verifyPayment.data.message);
          navigate(`/viewlecture/${selectedCourse?._id}`);
        } catch (error) {
          toast.error(error.response?.data?.message);
        }
      },
    };
    
    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    toast.error(error.response?.data?.message || "Payment failed");
  } finally {
    setLoading(false);
  }
};
```

**Final Price Calculation**:
```javascript
const finalPrice = useMemo(() => {
  if (!selectedCourse) return 0;
  
  return Math.max(
    selectedCourse.price - discount,
    0
  );
}, [selectedCourse, discount]);
```

**User Flow**:
1. User clicks "Enroll Now" on course detail page
2. Redirected to checkout page
3. Fills in personal details
4. Applies coupon code (optional)
5. Reviews bill summary
6. Clicks "Pay Now" to complete payment
7. Redirected to lecture player after successful payment

---

### 9. Comment Component (`pages/student/Comment.jsx`)

**Purpose**: Discussion and comment system for lectures, enabling student interaction and Q&A.

**Key Features**:
- **Add Comments**: Post comments on lectures
- **Reply System**: Reply to existing comments
- **Like System**: Like/unlike comments and replies
- **Pin Comments**: Educators can pin important comments
- **Delete Comments**: Users can delete their own comments
- **View Replies**: Expand/collapse reply threads
- **Loading States**: Loading indicators during API calls
- **Empty States**: Message when no comments exist

**Technical Implementation**:
```jsx
// Redux for comment state management
// AnimatePresence for smooth animations
// Role-based actions (educator can pin)
// Real-time comment updates
```

**Key Functions**:

**Handle Add Comment**:
```javascript
const handleAddComment = () => {
  if (!message.trim()) return;
  
  dispatch(
    addComment({
      lectureId,
      message,
    })
  );
  
  setMessage("");
};
```

**Handle Reply**:
```javascript
const handleReply = (commentId) => {
  if (!replyMessage.trim()) return;
  
  dispatch(
    addReply({
      lectureId,
      commentId,
      message: replyMessage,
    })
  );
  
  setReplyMessage("");
  setReplyBox(null);
};
```

**Like Check**:
```javascript
const isLiked = (likes) => {
  if (!likes || !userData?._id) return false;
  
  return likes.includes(userData._id);
};
```

**User Flow**:
1. User navigates to lecture player
2. Clicks "Discussions" tab
3. Views existing comments
4. Adds new comment or replies to existing ones
5. Likes helpful comments
6. Educator pins important comments

---

### 10. Search Results Page (`pages/student/SearchResults.jsx`)

**Purpose**: Search results page for displaying courses matching user search queries.

**Status**: Currently a placeholder component, ready for implementation.

**Planned Features**:
- Search query display
- Filtered course results
- Advanced filtering options
- Sort by relevance, price, rating
- Pagination for large result sets

---

## User Components

### 1. Course Card (`components/course/Card.jsx`)

**Purpose**: Reusable course card component for displaying course information in grids and carousels.

**Key Features**:
- **Course Thumbnail**: High-quality course image with hover zoom effect
- **Course Title**: Truncated title with hover color change
- **Category Badge**: Category label with glassmorphism effect
- **Price Display**: Gradient text for pricing
- **Rating System**: Average rating with review count
- **Hover Effects**: Smooth animations and glow effects
- **Play Button**: Decorative play button overlay

**Technical Implementation**:
```jsx
// Framer Motion for animations
// useNavigate for navigation
// Rating calculation logic
// Responsive design
```

**Rating Calculation**:
```javascript
const calculateAvgReview = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;
  
  const total = reviews.reduce(
    (sum, review) => sum + review.rating,
    0
  );
  
  return (total / reviews.length).toFixed(1);
};
```

**Props**:
```javascript
{
  thumbnail: string,    // Course image URL
  title: string,        // Course title
  category: string,     // Course category
  price: number,        // Course price
  id: string,          // Course ID
  reviews: array       // Array of review objects
}
```

---

### 2. Module List (`components/lecture/ModuleList.jsx`)

**Purpose**: Accordion-style module list component for displaying course curriculum and lecture navigation.

**Key Features**:
- **Accordion Structure**: Expandable/collapsible modules
- **Lecture List**: Lectures within each module
- **Active State**: Visual indication of selected lecture
- **Lock System**: Locks non-free lectures in preview mode
- **Lecture Count**: Total lecture count display
- **Smooth Animations**: Framer Motion for expand/collapse
- **Theme Support**: Dark/light mode styling

**Technical Implementation**:
```jsx
// useState for module expansion
// AnimatePresence for smooth transitions
// Theme context integration
// Mode prop (preview/watch)
```

**Props**:
```javascript
{
  moduleData: array,        // Array of module objects
  selectedLecture: object,  // Currently selected lecture
  onSelectLecture: function, // Callback for lecture selection
  mode: string              // 'preview' or 'watch'
}
```

**Lock Logic**:
```javascript
const isLocked =
  mode === "preview" &&
  !lecture.isPreviewFree;
```

---

### 3. Lecture Player (`components/lecture/LecturePlayer.jsx`)

**Purpose**: Main video player component with tabs for resources, quizzes, and discussions.

**Key Features**:
- **Video Player**: HTML5 video player with security measures
- **Security Features**: Disabled right-click, keyboard shortcuts (F12, Ctrl+S, Ctrl+U)
- **Tab System**: About, Resources, Quiz, Discussions tabs
- **Lecture Info**: Title and description display
- **Resource Integration**: Access to lecture resources
- **Quiz Integration**: Quiz component for assessments
- **Discussion Integration**: Comment component for Q&A

**Technical Implementation**:
```jsx
// useRef for video element
// useEffect for video source update
// Security event handlers
// Tab state management
```

**Security Measures**:
```javascript
const handleContextMenu = (e) => {
  e.preventDefault();
};

const handleKeyDown = (e) => {
  // F12
  if (e.keyCode === 123) {
    e.preventDefault();
  }
  
  // CTRL + S
  if (e.ctrlKey && e.key === "s") {
    e.preventDefault();
  }
  
  // CTRL + U
  if (e.ctrlKey && e.key === "u") {
    e.preventDefault();
  }
};
```

**Video Player Configuration**:
```jsx
<video
  ref={videoRef}
  controls
  autoPlay={false}
  controlsList="nodownload noplaybackrate nofullscreen"
  disablePictureInPicture
  onKeyDown={handleKeyDown}
  onContextMenu={handleContextMenu}
/>
```

---

### 4. Navbar (`components/navbar/Navbar.jsx`)

**Purpose**: Main navigation component with course mega-menu, user dropdown, and mobile menu.

**Key Features**:
- **Logo & Branding**: Platform logo with navigation
- **Course Mega-Menu**: Dropdown with course categories and featured courses
- **User Dropdown**: Profile dropdown with user info and actions
- **Mobile Menu**: Responsive hamburger menu for mobile devices
- **Dark Mode Toggle**: Theme switching capability
- **Logout Functionality**: Secure logout with Redux state clearing
- **Navigation Links**: Quick access to profile, courses, and other pages

**Technical Implementation**:
```jsx
// Redux for user state
// useState for dropdown states
// AnimatePresence for smooth animations
// Axios for logout API call
```

**Logout Function**:
```javascript
const handleLogout = async () => {
  try {
    await axios.get(
      serverUrl + "/api/auth/logout",
      {
        withCredentials: true,
      }
    );
    
    localStorage.clear();
    dispatch(setUserData(null));
    toast.success("Logout Successfully");
    navigate("/login");
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      "Logout Failed"
    );
  }
};
```

**Course Mega-Menu**:
- Category filtering
- Course grid display
- Hover-triggered animation
- Responsive design

---

### 5. Lecture Preview (`components/lecture/LecturePreview.jsx`)

**Purpose**: Preview component for displaying lecture information before enrollment.

**Key Features**:
- **Lecture Information**: Title, description, and duration
- **Preview Video**: Video player for free preview lectures
- **Locked State**: Visual indication for locked lectures
- **Enrollment CTA**: Call-to-action for enrollment

---

### 6. Lecture Resources (`components/lecture/LectureResources.jsx`)

**Purpose**: Component for displaying and downloading lecture-related resources.

**Key Features**:
- **Resource List**: PDFs, code files, and other materials
- **Download Links**: Direct download links for resources
- **File Type Indicators**: Visual indicators for file types

---

### 7. Quiz Result (`components/lecture/QuizResult.jsx`)

**Purpose**: Quiz component for lecture assessments and knowledge checks.

**Key Features**:
- **Quiz Display**: Multiple-choice questions
- **Answer Selection**: Interactive answer selection
- **Result Display**: Score and correct answers
- **Retake Option**: Ability to retake quiz

---

## Custom Hooks

### 1. useCurrentUser (`customHooks/useCurrentUser.js`)

**Purpose**: Custom hook for fetching and managing current user data.

**Status**: Currently commented out, ready for implementation when needed.

**Planned Implementation**:
```javascript
const useCurrentUser = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);
  
  return { userData, loading, error };
};
```

---

### 2. usePublishedCourse (`customHooks/usePublishedCourse.js`)

**Purpose**: Custom hook for fetching published courses data.

**Features**:
- Fetches all published courses
- Manages loading and error states
- Caches course data in Redux

---

### 3. useAllReviews (`customHooks/useAllReviews.js`)

**Purpose**: Custom hook for fetching all reviews across the platform.

**Features**:
- Fetches review data
- Manages loading states
- Provides review statistics

---

## Redux State Management

### User Slice (`redux/slices/userSlice.js`)

**Purpose**: Manages user-related state including user data, loading states, and profile updates.

**State Structure**:
```javascript
{
  userData: object,      // Current user data
  loading: boolean,     // Loading state
  error: string         // Error message
}
```

**Key Actions**:
- `setUserData`: Set user data
- `updateProfileData`: Update user profile
- `fetchCurrentUser`: Fetch current user from API

---

### Course Slice (`redux/slices/courseSlice.js`)

**Purpose**: Manages course-related state including course data, selected course, and filtering.

**State Structure**:
```javascript
{
  courseData: array,        // All published courses
  selectedCourse: object,   // Currently selected course
  loading: boolean,         // Loading state
  error: string            // Error message
}
```

**Key Actions**:
- `fetchPublishedCourses`: Fetch all published courses
- `setSelectedCourse`: Set currently selected course
- `setCourseData`: Set course data

---

### Module Slice (`redux/slices/moduleSlice.js`)

**Purpose**: Manages module and lecture data for courses.

**State Structure**:
```javascript
{
  moduleData: array,   // Course modules with lectures
  loading: boolean,    // Loading state
  error: string       // Error message
}
```

**Key Actions**:
- `setModuleData`: Set module data
- `fetchCourseModules`: Fetch modules for a course

---

### Review Slice (`redux/slices/reviewSlice.js`)

**Purpose**: Manages course reviews and ratings.

**State Structure**:
```javascript
{
  reviews: array,      // Course reviews
  loading: boolean,     // Loading state
  error: string       // Error message
}
```

**Key Actions**:
- `fetchReviews`: Fetch reviews for a course
- `addReview`: Add a new review
- `deleteReview`: Delete a review

---

### Comment Slice (`redux/slices/commentSlice.js`)

**Purpose**: Manages lecture comments and discussions.

**State Structure**:
```javascript
{
  comments: array,      // Lecture comments
  loading: boolean,     // Loading state
  error: string       // Error message
}
```

**Key Actions**:
- `fetchLectureComments`: Fetch comments for a lecture
- `addComment`: Add a new comment
- `addReply`: Add a reply to a comment
- `deleteComment`: Delete a comment
- `deleteReply`: Delete a reply
- `toggleCommentLike`: Like/unlike a comment
- `toggleReplyLike`: Like/unlike a reply
- `togglePinComment`: Pin/unpin a comment (educator only)

---

## Authentication Flow

### Login Process

1. User navigates to `/login`
2. Enters email and password
3. Submits form
4. API validates credentials
5. On success:
   - User data stored in Redux
   - JWT token stored in HTTP-only cookie
   - User redirected to home page
6. On failure:
   - Error message displayed
   - User remains on login page

### Logout Process

1. User clicks logout in navbar dropdown
2. `handleLogout` function called
3. API call to `/api/auth/logout`
4. On success:
   - Redux user state cleared
   - Local storage cleared
   - User redirected to login page
5. On failure:
   - Error message displayed

### Protected Routes

Protected routes use the `ProtectedRoute` component to verify authentication:
```jsx
<ProtectedRoute>
  <MyEnrolledCourses />
</ProtectedRoute>
```

If user is not authenticated, they are redirected to login page.

---

## Course Enrollment Flow

### Free Course Enrollment

1. User views course detail page
2. Clicks "Enroll For Free" button
3. `handleFreeEnroll` function called
4. API call to `/api/course/enroll/${courseId}`
5. On success:
   - Enrollment status updated
   - User redirected to lecture player
6. On failure:
   - Error message displayed

### Paid Course Enrollment

1. User views course detail page
2. Clicks "Enroll Now" button
3. Redirected to checkout page
4. Fills in personal details
5. Applies coupon (optional)
6. Clicks "Pay Now"
7. Razorpay order created via API
8. Razorpay payment modal opens
9. User completes payment
10. Payment verified via API
11. On success:
    - Enrollment created
    - User redirected to lecture player
12. On failure:
    - Error message displayed
    - User remains on checkout page

---

## Video Learning Experience

### Lecture Viewing

1. Enrolled user navigates to `/viewlecture/${courseId}`
2. Enrollment verified via API
3. Modules and lectures fetched
4. First lecture auto-selected
5. Video player loads lecture video
6. User can:
   - Watch video with controls
   - Navigate between lectures
   - Access resources
   - Take quizzes
   - Participate in discussions

### Video Security

- Right-click disabled
- Download disabled
- Keyboard shortcuts disabled (F12, Ctrl+S, Ctrl+U)
- Picture-in-picture disabled
- Playback rate control disabled

### Progress Tracking

- Lecture completion tracked
- Module progress calculated
- Overall course progress displayed
- Resume from last viewed lecture

---

## Profile Management

### Profile Viewing

1. User navigates to `/profile`
2. User data fetched from Redux
3. Enrollments fetched from API
4. Profile information displayed
5. Enrolled courses listed with validity

### Profile Editing

1. User clicks "Edit Profile" button
2. Navigated to `/editprofile`
3. Current data pre-filled in form
4. User updates information
5. Uploads new profile picture (optional)
6. Submits form
7. Data sent to API via FormData
8. On success:
   - Redux state updated
   - User redirected to profile
9. On failure:
   - Error message displayed

---

## Discussion & Community

### Comment System

1. User navigates to lecture player
2. Clicks "Discussions" tab
3. Comments fetched from API
4. User can:
   - Add new comment
   - Reply to existing comments
   - Like comments and replies
   - Delete own comments
   - View reply threads

### Educator Features

- Pin important comments
- Reply to student questions
- Moderate discussions

### Comment Actions

- **Add Comment**: Post a new comment on the lecture
- **Reply**: Respond to an existing comment
- **Like**: Show appreciation for helpful comments
- **Delete**: Remove own comments or replies
- **Pin**: Mark important comments (educator only)

---

## Payment Integration

### Razorpay Integration

**Configuration**:
- Razorpay Key ID stored in environment variables
- Order creation via backend API
- Payment verification via backend API

**Payment Flow**:

1. User initiates payment
2. Order created via `/api/order/razorpay-order`
3. Razorpay options configured
4. Razorpay modal opens
5. User completes payment
6. Payment handler called with response
7. Payment verified via `/api/order/verifypayment`
8. Enrollment created on successful verification
9. User redirected to lecture player

**Coupon System**:

1. User enters coupon code
2. Coupon validated via `/api/coupon/apply`
3. If valid:
   - Discount applied
   - Final price updated
4. If invalid:
   - Error message displayed
5. Discount included in order creation

**Security**:
- All payment operations use HTTP-only cookies
- Server-side order creation and verification
- No sensitive data stored on client

---

## Technical Stack

### Frontend Technologies

- **React 18**: UI library
- **Redux Toolkit**: State management
- **React Router**: Navigation
- **Axios**: HTTP client
- **Framer Motion**: Animations
- **Tailwind CSS**: Styling
- **React Icons**: Icon library
- **React Toastify**: Toast notifications
- **React Spinners**: Loading indicators

### Backend Integration

- **REST API**: Backend API endpoints
- **HTTP-only Cookies**: Authentication
- **Razorpay**: Payment processing
- **File Upload**: FormData for profile pictures

### Development Tools

- **Vite**: Build tool
- **ESLint**: Code linting
- **Git**: Version control

---

## Best Practices

### Code Organization

- Component-based architecture
- Separation of concerns (UI, logic, data)
- Reusable components
- Custom hooks for logic reuse

### State Management

- Redux for global state
- Local state for component-specific data
- Optimized with useMemo and useCallback
- Proper state updates via actions

### Performance

- Lazy loading for routes
- Code splitting
- Image optimization
- Debounced search
- Memoized calculations

### Security

- Protected routes
- HTTP-only cookies
- Input validation
- XSS prevention
- CSRF protection

### User Experience

- Loading states for all async operations
- Error handling with user-friendly messages
- Responsive design
- Accessibility considerations
- Smooth animations

---

## Future Enhancements

### Planned Features

- **Search Results Page**: Advanced search with filters
- **Course Progress Tracking**: Detailed progress analytics
- **Certificates**: Course completion certificates
- **Wishlist**: Save courses for later
- **Course Comparison**: Compare multiple courses
- **Offline Access**: Download lectures for offline viewing
- **Notes System**: Take notes while watching lectures
- **Playback Speed**: Adjustable video playback speed
- **Subtitles**: Multi-language subtitle support
- **Recommendations**: AI-powered course recommendations

### Performance Improvements

- Implement virtual scrolling for large lists
- Add service worker for offline support
- Optimize bundle size
- Implement caching strategies

### UX Enhancements

- Onboarding flow for new users
- Interactive course previews
- Gamification elements
- Social sharing features
- Advanced search filters

---

## Troubleshooting

### Common Issues

**Issue**: Course not loading
- **Solution**: Check network connection, verify course ID, check API status

**Issue**: Payment failure
- **Solution**: Verify Razorpay configuration, check payment details, contact support

**Issue**: Video not playing
- **Solution**: Check enrollment status, verify video URL, check browser compatibility

**Issue**: Profile update not saving
- **Solution**: Check file size (max 5MB), verify form data, check API response

**Issue**: Comments not loading
- **Solution**: Check lecture ID, verify API endpoint, check network connection

---

## Support

For issues, questions, or contributions, please contact the development team or refer to the project repository.

---

**Last Updated**: May 2026
**Version**: 1.0.0
