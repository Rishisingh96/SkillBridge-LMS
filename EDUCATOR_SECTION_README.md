# SkillBridge LMS - Educator/Creator Section Documentation

## Table of Contents
- [Overview](#overview)
- [Educator Pages](#educator-pages)
- [Educator Components](#educator-components)
- [Redux State Management](#redux-state-management)
- [Course Creation Workflow](#course-creation-workflow)
- [Module & Lecture Management](#module--lecture-management)
- [Content Upload System](#content-upload-system)
- [Coupon Management](#coupon-management)
- [Analytics & Reporting](#analytics--reporting)
- [Best Practices](#best-practices)

---

## Overview

The Educator/Creator section of SkillBridge LMS provides a comprehensive platform for course creators to design, manage, and monetize their courses. Built with React, Redux, and modern UI libraries, it offers an intuitive interface for creating professional learning experiences.

### Key Features
- **Course Creation**: Create and publish professional courses with ease
- **Module Management**: Organize course content into structured modules
- **Lecture Management**: Add video lectures with resources and quizzes
- **Coupon System**: Create and manage discount coupons for promotions
- **Analytics Dashboard**: Track enrollment, revenue, and student progress
- **Content Upload**: Upload videos, resources, and quiz materials
- **Course Publishing**: Control course visibility and publication status

---

## Educator Pages

### 1. Dashboard (`pages/educator/Dashboard.jsx`)

**Purpose**: Main educator dashboard providing an overview of course performance, revenue, and student engagement.

**Key Features**:
- **Profile Card**: Educator profile with total earnings display
- **Stats Cards**: Key metrics including total courses, students, earnings, progress, downloads, and recent enrollments
- **Graph Section**: Visual representation of enrollment by course
- **Course Performance Table**: Detailed performance metrics for each course
- **Recent Enrollments**: List of recent student enrollments
- **Top Performing Course**: Highlight of the best-performing course

**Technical Implementation**:
```jsx
// Redux integration for dashboard stats
// useEffect for data fetching on mount
// Component composition with dashboard components
// Responsive layout with grid system
```

**Key Functions**:

**Fetch Dashboard Data**:
```javascript
useEffect(() => {
  dispatch(fetchCreatorCourses());
  dispatch(fetchDashboardStats());
}, [dispatch]);
```

**Stats Display**:
```javascript
const totalCourses = stats.totalCourses;
const totalStudents = stats.totalStudents;
const totalEarning = stats.totalEarnings;
const averageProgress = stats.averageProgress;
const recentEnrollments = stats.recentEnrollments;
const totalDownloads = stats.totalDownloads;
const enrollmentByCourse = stats.enrollmentByCourse;
```

**User Flow**:
1. Educator navigates to dashboard
2. Dashboard stats fetched from API
3. Key metrics displayed in cards
4. Graph shows enrollment trends
5. Course performance table shows detailed analytics
6. Recent enrollments and top course highlighted

---

### 2. Create Course (`pages/educator/CreateCourse.jsx`)

**Purpose**: Course creation form allowing educators to create new courses with basic information.

**Key Features**:
- **Course Title**: Input for course name
- **Category Selection**: Dropdown with predefined categories (Web Development, Mobile Development, Data Science, etc.)
- **Course Description**: Textarea for course overview
- **Two-Column Layout**: Professional split-screen design
- **Mobile Responsive**: Optimized for all devices
- **Loading States**: Button loading during course creation
- **Navigation**: Back button to return to previous page

**Technical Implementation**:
```jsx
// Redux action for course creation
// Form state management with useState
// Category dropdown with multiple options
// Responsive design with Tailwind CSS
// Dark mode support
```

**Key Functions**:

**Handle Create Course**:
```javascript
const handleCreateCourse = () => {
  dispatch(createCourse({ title, category, description }, navigate));
};
```

**Category Options**:
```javascript
const categories = [
  "web-development",
  "mobile-development",
  "data-science",
  "machine-learning",
  "ui-ux-design",
  "digital-marketing",
  "ai-ml",
  "ethical-hacking",
  "business",
  "other"
];
```

**User Flow**:
1. Educator clicks "Create Course" from dashboard or courses page
2. Fills in course title, category, and description
3. Clicks "Create Course" button
4. Course created via Redux action
5. Redirected to edit course page to add details
6. Can then add modules and lectures

---

### 3. Courses (`pages/educator/Courses.jsx`)

**Purpose**: List view of all courses created by the educator with quick access to edit functionality.

**Key Features**:
- **Course Table**: Desktop table view with course details
- **Mobile Cards**: Responsive card layout for mobile devices
- **Course Information**: Thumbnail, title, price, and status
- **Publication Status**: Visual indicator (Published/Draft)
- **Quick Edit**: Direct access to edit course page
- **Empty State**: Friendly message when no courses exist
- **Create Button**: Quick access to create new course

**Technical Implementation**:
```jsx
// Redux integration for creator courses
// Responsive design (table for desktop, cards for mobile)
// useEffect for data fetching
// Status badge with conditional styling
```

**Key Functions**:

**Fetch Creator Courses**:
```javascript
useEffect(() => {
  dispatch(fetchCreatorCourses());
}, [dispatch]);
```

**Status Badge**:
```javascript
<span className={`text-sm px-4 py-1.5 rounded-full font-medium ${
  course.isPublished 
    ? 'bg-green-100 text-green-700' 
    : 'bg-pink-100 text-pink-700'
}`}>
  {course.isPublished ? 'Published' : 'Draft'}
</span>
```

**User Flow**:
1. Educator navigates to courses page
2. All created courses displayed
3. Views course status (Published/Draft)
4. Clicks "Edit" button on desired course
5. Redirected to edit course page

---

### 4. Edit Course (`pages/educator/EditCourse.jsx`)

**Purpose**: Comprehensive course editing interface for updating course details, pricing, and publication status.

**Key Features**:
- **Course Details**: Title, subtitle, description
- **Category & Level**: Dropdown selections for categorization
- **Pricing**: Price input with currency symbol
- **Validity**: Course validity period (value and unit)
- **Thumbnail Upload**: Image upload with preview
- **Publish Control**: Toggle to publish/unpublish course
- **Course Removal**: Option to delete course entirely
- **Module Navigation**: Quick access to module management
- **Auto-convert Validity**: Smart conversion (12+ months to years)

**Technical Implementation**:
```jsx
// Axios for API calls
// FormData for file upload
// useRef for file input
// useEffect for course data fetching
// Validity auto-conversion logic
```

**Key Functions**:

**Fetch Course by ID**:
```javascript
const getCourseById = async () => {
  try {
    setLoading(true);
    const result = await axios.get(
      `${serverUrl}/api/course/getcourse/${courseId}`,
      { withCredentials: true }
    );
    
    const course = result.data.course || result.data;
    setTitle(course.title || "");
    setSubTitle(course.subTitle || "");
    setDescription(course.description || "");
    setCategory(course.category || "");
    setLevel(course.level || "");
    setPrice(course.price || "");
    setIsPublished(course.isPublished || false);
    setValidityValue(course.validity?.value || 6);
    setValidityUnit(course.validity?.unit || "month");
    
    if (course.thumbnail) {
      setThumbnail(course.thumbnail);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to fetch course details");
  } finally {
    setLoading(false);
  }
};
```

**Auto-convert Validity**:
```javascript
const getFormattedValidity = () => {
  let value = Number(validityValue);
  let unit = validityUnit;
  
  // 12+ months => convert to years
  if (unit === "month" && value >= 12) {
    value = value / 12;
    if (Number.isInteger(value)) {
      unit = "year";
    } else {
      value = validityValue;
    }
  }
  
  return { value, unit };
};
```

**Update Course**:
```javascript
const handleUpdateCourse = async (e) => {
  e.preventDefault();
  
  try {
    setLoading(true);
    const formData = new FormData();
    
    formData.append("title", title);
    formData.append("subTitle", subTitle);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("level", level);
    formData.append("price", price);
    
    const formattedValidity = getFormattedValidity();
    formData.append("validity.value", formattedValidity.value);
    formData.append("validity.unit", formattedValidity.unit);
    formData.append("isPublished", isPublished);
    
    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    }
    
    const result = await axios.put(
      `${serverUrl}/api/course/editcourse/${courseId}`,
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      }
    );
    
    toast.success("Course updated successfully");
    navigate("/educator/courses");
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to update course");
  } finally {
    setLoading(false);
  }
};
```

**Remove Course**:
```javascript
const handleRemoveCourse = async () => {
  setLoading1(true);
  try {
    const result = await axios.delete(
      serverUrl + `/api/course/remove/${courseId}`,
      { withCredentials: true }
    );
    toast.success("Course Removed");
    navigate("/courses");
  } catch (error) {
    toast.error(error.response.data.message);
  } finally {
    setLoading1(false);
  }
};
```

**User Flow**:
1. Educator clicks "Edit" on course from courses page
2. Course details fetched and pre-filled
3. Updates course information as needed
4. Uploads new thumbnail (optional)
5. Toggles publish status
6. Clicks "Save Changes"
7. Course updated successfully
8. Can navigate to module page to add content

---

### 5. Module (`pages/educator/Module.jsx`)

**Purpose**: Module management interface for creating, editing, and organizing course modules.

**Key Features**:
- **Module Creation**: Create new modules with title and description
- **Module Editing**: Update existing module details
- **Module Deletion**: Remove modules with confirmation
- **Module List**: Visual list of all modules with action buttons
- **Empty State**: Friendly message when no modules exist
- **Loading States**: Loading indicators during operations
- **Navigation**: Back button and module navigation

**Technical Implementation**:
```jsx
// Redux slice for module management
// useState for form and UI state
// useEffect for data fetching
// Toast notifications for feedback
```

**Key Functions**:

**Fetch Modules**:
```javascript
useEffect(() => {
  dispatch(fetchModules(courseId));
}, [dispatch, courseId]);
```

**Create Module**:
```javascript
const handleCreateModule = async (e) => {
  e.preventDefault();
  
  if (!title.trim()) {
    return toast.error("Module title is required");
  }
  
  try {
    await dispatch(
      createModule({
        courseId,
        moduleData: { title, description },
      })
    ).unwrap();
    
    toast.success("Module created successfully");
    setTitle("");
    setDescription("");
    setShowCreateForm(false);
  } catch (error) {
    toast.error(error || "Failed to create module");
  }
};
```

**Update Module**:
```javascript
const handleUpdateModule = async (e) => {
  e.preventDefault();
  
  if (!title.trim()) {
    return toast.error("Module title is required");
  }
  
  try {
    await dispatch(
      updateModule({
        moduleId: editingModule._id,
        moduleData: { title, description },
      })
    ).unwrap();
    
    toast.success("Module updated successfully");
    setTitle("");
    setDescription("");
    setEditingModule(null);
    setShowCreateForm(false);
  } catch (error) {
    toast.error(error || "Failed to update module");
  }
};
```

**Delete Module**:
```javascript
const handleDeleteModule = async (moduleId) => {
  try {
    await dispatch(deleteModule(moduleId)).unwrap();
    toast.success("Module deleted successfully");
  } catch (error) {
    toast.error(error);
  }
};
```

**Open Module**:
```javascript
const handleOpenModule = (moduleId) => {
  navigate(`/educator/create-lecture/${courseId}/${moduleId}`);
};
```

**User Flow**:
1. Educator navigates to module page from edit course
2. Views existing modules
3. Clicks "Add Module" to create new module
4. Fills in module title and description
5. Clicks "Create Module"
6. Module created and displayed in list
7. Clicks "Open" to add lectures to module
8. Can edit or delete existing modules

---

### 6. Create Lecture (`pages/educator/CreateLecture.jsx`)

**Purpose**: Lecture creation interface for adding new lectures to modules.

**Key Features**:
- **Lecture Creation**: Create lectures with title
- **Lecture List**: Visual list of all lectures in module
- **Video Indicator**: Shows if video is uploaded
- **Preview Badge**: Indicates free preview lectures
- **Empty State**: Friendly message when no lectures exist
- **Statistics**: Total lecture count display
- **Loading States**: Loading indicators during operations

**Technical Implementation**:
```jsx
// Redux slice for lecture management
// useState for form state
// useEffect for data fetching
// Confirmation dialog for deletion
```

**Key Functions**:

**Fetch Lectures**:
```javascript
useEffect(() => {
  dispatch(fetchLectures(moduleId));
}, [dispatch, moduleId]);
```

**Create Lecture**:
```javascript
const handleCreateLecture = async (e) => {
  e.preventDefault();
  
  if (!lectureTitle.trim()) {
    return toast.error("Lecture title is required");
  }
  
  try {
    await dispatch(
      createLecture({
        moduleId,
        lectureData: { lectureTitle },
      })
    ).unwrap();
    
    toast.success("Lecture created successfully");
    setLectureTitle("");
    setShowCreateForm(false);
  } catch (error) {
    toast.error(error || "Failed to create lecture");
  }
};
```

**Delete Lecture**:
```javascript
const handleDeleteLecture = async (lectureId) => {
  if (!window.confirm("Are you sure you want to delete this lecture?")) {
    return;
  }
  
  try {
    await dispatch(deleteLecture(lectureId)).unwrap();
    toast.success("Lecture deleted successfully");
  } catch (error) {
    toast.error(error || "Failed to delete lecture");
  }
};
```

**Edit Lecture**:
```javascript
const handleEditLecture = (lectureId) => {
  navigate(`/educator/editlecture/${courseId}/${moduleId}/${lectureId}`);
};
```

**User Flow**:
1. Educator opens module from module page
2. Views existing lectures
3. Clicks "Add Lecture" to create new lecture
4. Fills in lecture title
5. Clicks "Create Lecture"
6. Lecture created and displayed in list
7. Clicks "Edit" to add video, resources, and quiz
8. Can delete existing lectures

---

### 7. Edit Lecture (`pages/educator/EditLecture.jsx`)

**Purpose**: Comprehensive lecture editing interface for uploading videos, adding resources, and creating quizzes.

**Key Features**:
- **Lecture Title**: Edit lecture title
- **Video Upload**: Upload lecture video with progress indicator
- **Video Preview**: View existing video before replacement
- **Free Preview Toggle**: Mark lecture as free preview
- **Resources Upload**: Upload PDFs, code files, and other materials
- **Quiz Upload**: Create MCQ quiz questions
- **Upload Progress**: Real-time progress bar for uploads
- **Remove Lecture**: Delete lecture with confirmation

**Technical Implementation**:
```jsx
// Redux for lecture state
// Axios for API calls
// FormData for file uploads
// Progress tracking for uploads
// Child components for resources and quizzes
```

**Key Functions**:

**Sync State with Selected Lecture**:
```javascript
useEffect(() => {
  if (selectedLecture) {
    setLectureTitle(selectedLecture.lectureTitle || "");
    setIsPreviewFree(selectedLecture.isPreviewFree || false);
    setExistingVideo(selectedLecture.video?.fileUrl || "");
    setResources(selectedLecture.resources || []);
    setQuizData(selectedLecture.quizQuestions || []);
  }
}, [selectedLecture]);
```

**Handle Video Change**:
```javascript
const handleVideoChange = (e) => {
  const file = e.target.files[0];
  
  if (!file) return;
  
  // 500MB Limit
  if (file.size > 500 * 1024 * 1024) {
    toast.error("Video size should be less than 500MB");
    return;
  }
  
  setVideoUrl(file);
};
```

**Update Lecture**:
```javascript
const handleUpdateLecture = async () => {
  if (!lectureTitle.trim()) {
    return toast.error("Lecture title is required");
  }
  
  try {
    setLoading(true);
    const formData = new FormData();
    
    formData.append("lectureTitle", lectureTitle);
    formData.append("isPreviewFree", isPreviewFree);
    
    if (videoUrl) {
      formData.append("videoUrl", videoUrl);
    }
    
    const result = await axios.post(
      `${serverUrl}/api/course/editlecture/${lectureId}`,
      formData,
      {
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percent);
        },
      }
    );
    
    const updatedLectures = lectureData.map((lecture) =>
      lecture._id === lectureId ? result.data : lecture
    );
    
    dispatch(setLectureData(updatedLectures));
    toast.success("Lecture Updated Successfully");
    navigate(`/educator/create-lecture/${courseId}/${moduleId}`);
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message || "Something went wrong");
    setLoading(false);
  }
};
```

**Remove Lecture**:
```javascript
const handleRemoveLecture = async () => {
  try {
    setLoading1(true);
    await axios.delete(
      `${serverUrl}/api/course/removelecture/${lectureId}`,
      { withCredentials: true }
    );
    
    const filteredLectures = lectureData.filter(
      (lecture) => lecture._id !== lectureId
    );
    
    dispatch(setLectureData(filteredLectures));
    toast.success("Lecture Removed Successfully");
    navigate(`/educator/create-lecture/${courseId}/${moduleId}`);
    setLoading1(false);
  } catch (error) {
    toast.error(error?.response?.data?.message || "Something went wrong");
    setLoading1(false);
  }
};
```

**User Flow**:
1. Educator clicks "Edit" on lecture from lecture list
2. Lecture details pre-filled
3. Updates lecture title
4. Uploads video file (optional)
5. Toggles free preview (optional)
6. Uploads resources via ResourcesUpload component
7. Adds quiz questions via QuizUpload component
8. Clicks "Update Lecture"
9. Progress bar shows upload progress
10. Lecture updated successfully
11. Redirected back to lecture list

---

### 8. Resources Upload (`pages/educator/ResourcesUpload.jsx`)

**Purpose**: Resource upload component for adding PDFs, code files, and other materials to lectures.

**Key Features**:
- **Multi-file Upload**: Upload multiple files at once
- **File Type Support**: PDFs, images, ZIP files, source code
- **Upload Progress**: Real-time progress indicator
- **Resource List**: View all uploaded resources
- **View Resource**: Open resources in new tab
- **Remove Resource**: Delete individual resources
- **File Size Display**: Show file size in MB

**Technical Implementation**:
```jsx
// Axios for API calls
// FormData for file uploads
// Progress tracking
// Resource state management
```

**Key Functions**:

**Handle File Change**:
```javascript
const handleFileChange = (e) => {
  const selectedFiles = Array.from(e.target.files);
  setFiles(selectedFiles);
};
```

**Upload Resources**:
```javascript
const handleUploadResources = async () => {
  if (files.length === 0) {
    return toast.error("Please select files");
  }
  
  try {
    setLoading(true);
    const formData = new FormData();
    
    files.forEach((file) => {
      formData.append("files", file);
    });
    
    const result = await axios.post(
      `${serverUrl}/api/course/upload-resource/${lectureId}`,
      formData,
      {
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percent);
        },
      }
    );
    
    setResources(result.data.resources);
    toast.success("Resources Uploaded Successfully");
    setFiles([]);
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message || "Upload failed");
    setLoading(false);
  }
};
```

**Remove Resource**:
```javascript
const handleRemoveResource = async (resourceId) => {
  try {
    const result = await axios.delete(
      `${serverUrl}/api/course/removeresource/${lectureId}/${resourceId}`,
      { withCredentials: true }
    );
    
    setResources(result.data.resources);
    toast.success("Resources Remove Successfully");
  } catch (error) {
    toast.error(error?.response?.data?.message || "Failed to remove resource");
  }
};
```

**View Resource**:
```javascript
const handleViewResource = async (resourceId) => {
  try {
    const result = await axios.get(
      `${serverUrl}/api/course/download-resource/${lectureId}/${resourceId}`,
      { withCredentials: true }
    );
    
    window.open(result.data.fileUrl, "_blank");
  } catch (error) {
    toast.error(error?.response?.data?.message || "Failed to open resource");
  }
};
```

**User Flow**:
1. Educator navigates to edit lecture
2. Scrolls to Resources Upload section
3. Selects one or more files
4. Clicks "Upload Resources"
5. Progress bar shows upload progress
6. Resources uploaded and displayed in list
7. Can view or remove individual resources

---

### 9. Quiz Upload (`pages/educator/QuizUpload.jsx`)

**Purpose**: Quiz creation component for adding MCQ questions to lectures.

**Key Features**:
- **Question Input**: Text input for quiz question
- **Options Input**: Four option inputs for MCQ
- **Correct Answer Selection**: Dropdown to select correct answer
- **Quiz List**: View all added quiz questions
- **Remove Quiz**: Delete individual quiz questions
- **Correct Answer Highlight**: Visual indication of correct answer
- **Validation**: Form validation before submission

**Technical Implementation**:
```jsx
// Axios for API calls
// State management for quiz data
// Form validation
// Dynamic options array
```

**Key Functions**:

**Handle Option Change**:
```javascript
const handleOptionChange = (index, value) => {
  const updatedOptions = [...options];
  updatedOptions[index] = value;
  setOptions(updatedOptions);
};
```

**Add Quiz**:
```javascript
const handleAddQuiz = async () => {
  if (!question || options.some((option) => !option) || !correctAnswer) {
    return toast.error("Please fill all fields");
  }
  
  try {
    setLoading(true);
    const result = await axios.post(
      `${serverUrl}/api/course/add-quiz/${lectureId}`,
      { question, options, correctAnswer },
      { withCredentials: true }
    );
    
    setQuizData(result.data.quizQuestions);
    toast.success("Quiz Added Successfully");
    
    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer("");
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message || "Quiz upload failed");
    setLoading(false);
  }
};
```

**Remove Quiz**:
```javascript
const handleRemoveQuiz = async (quizId) => {
  try {
    const response = await axios.delete(
      `${serverUrl}/api/course/remove-quiz/${lectureId}/${quizId}`,
      { withCredentials: true }
    );
    
    setQuizData(response.data.quizQuestions);
    toast.success("Quiz Removed Successfully");
  } catch (error) {
    toast.error(error?.response?.data?.message || "Failed to remove quiz");
  }
};
```

**User Flow**:
1. Educator navigates to edit lecture
2. Scrolls to Quiz Upload section
3. Enters quiz question
4. Fills in four options
5. Selects correct answer from dropdown
6. Clicks "Add Quiz Question"
7. Quiz added and displayed in list
8. Can add multiple questions
9. Can remove individual questions

---

### 10. Coupons (`pages/educator/Coupons.jsx`)

**Purpose**: Coupon management interface for creating, editing, and managing discount coupons.

**Key Features**:
- **Coupon Creation**: Create new discount coupons
- **Coupon Editing**: Update existing coupon details
- **Coupon Deletion**: Remove coupons with confirmation
- **Status Toggle**: Enable/disable coupons
- **Discount Types**: Percentage or fixed amount discounts
- **Usage Limits**: Set maximum usage per coupon
- **Expiry Date**: Set coupon validity period
- **Course Targeting**: Apply to all courses or specific courses
- **Usage Tracking**: View coupon usage statistics

**Technical Implementation**:
```jsx
// Axios for API calls
// State management for coupons and form
// Modal for create/edit operations
// Redux for course data
```

**Key Functions**:

**Fetch Coupons**:
```javascript
const fetchCoupons = async () => {
  try {
    const { data } = await axios.get(`${serverUrl}/api/coupon/my-coupons`, {
      withCredentials: true
    });
    if (data.success) {
      setCoupons(data.coupons);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to fetch coupons");
  } finally {
    setLoading(false);
  }
};
```

**Create Coupon**:
```javascript
const handleCreate = async (e) => {
  e.preventDefault();
  try {
    const { data } = await axios.post(`${serverUrl}/api/coupon/create`, formData, {
      withCredentials: true
    });
    if (data.success) {
      toast.success("Coupon created successfully");
      setShowCreateModal(false);
      resetForm();
      fetchCoupons();
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to create coupon");
  }
};
```

**Update Coupon**:
```javascript
const handleUpdate = async (e) => {
  e.preventDefault();
  try {
    const { data } = await axios.put(
      `${serverUrl}/api/coupon/update/${selectedCoupon._id}`,
      formData,
      { withCredentials: true }
    );
    if (data.success) {
      toast.success("Coupon updated successfully");
      setShowEditModal(false);
      resetForm();
      fetchCoupons();
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to update coupon");
  }
};
```

**Delete Coupon**:
```javascript
const handleDelete = async (couponId) => {
  if (!window.confirm("Are you sure you want to delete this coupon?")) return;
  
  try {
    const { data } = await axios.delete(`${serverUrl}/api/coupon/delete/${couponId}`, {
      withCredentials: true
    });
    if (data.success) {
      toast.success("Coupon deleted successfully");
      fetchCoupons();
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to delete coupon");
  }
};
```

**Toggle Status**:
```javascript
const handleToggleStatus = async (couponId) => {
  try {
    const { data } = await axios.patch(`${serverUrl}/api/coupon/toggle/${couponId}`, {}, {
      withCredentials: true
    });
    if (data.success) {
      toast.success(data.message);
      fetchCoupons();
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to toggle status");
  }
};
```

**User Flow**:
1. Educator navigates to coupons page
2. Views all existing coupons
3. Clicks "Create Coupon" to add new coupon
4. Fills in coupon details (code, discount, expiry, etc.)
5. Selects discount type (percentage/fixed)
6. Sets usage limit and expiry date
7. Chooses course targeting (all/specific)
8. Clicks "Create Coupon"
9. Coupon created and displayed in list
10. Can edit, delete, or toggle status of existing coupons

---

## Educator Components

### 1. Educator Layout (`components/educator/EducatorLayout.jsx`)

**Purpose**: Layout wrapper for educator pages providing consistent structure and navigation.

**Key Features**:
- **Sidebar Navigation**: Persistent sidebar with educator menu
- **Header**: Top header with user info and actions
- **Content Area**: Main content area for page content
- **Responsive Design**: Mobile-friendly layout
- **Theme Support**: Dark/light mode integration

---

### 2. Educator Sidebar (`components/educator/EducatorSidebar.jsx`)

**Purpose**: Sidebar navigation component for educator dashboard and related pages.

**Key Features**:
- **Dashboard Link**: Quick access to educator dashboard
- **Courses Link**: Navigate to courses management
- **Coupons Link**: Navigate to coupon management
- **Profile Link**: Access educator profile
- **Active State**: Visual indication of current page
- **Collapsible**: Can be collapsed on mobile

---

## Redux State Management

### Course Slice (`redux/slices/courseSlice.js`)

**Purpose**: Manages course-related state for educators including creator courses and course data.

**State Structure**:
```javascript
{
  courseData: array,        // All published courses
  creatorCourseData: array, // Courses created by educator
  selectedCourse: object,   // Currently selected course
  loading: boolean,         // Loading state
  error: string            // Error message
}
```

**Key Actions**:
- `fetchCreatorCourses`: Fetch courses created by educator
- `setCourseData`: Set course data
- `setSelectedCourse`: Set currently selected course

---

### Module Slice (`redux/slices/moduleSlice.js`)

**Purpose**: Manages module state for course content organization.

**State Structure**:
```javascript
{
  moduleData: array,   // Course modules
  loading: boolean,    // Loading state
  error: string       // Error message
}
```

**Key Actions**:
- `fetchModules`: Fetch modules for a course
- `createModule`: Create new module
- `updateModule`: Update existing module
- `deleteModule`: Delete module
- `clearError`: Clear error state

---

### Lecture Slice (`redux/slices/lectureSlice.js`)

**Purpose**: Manages lecture state for module content.

**State Structure**:
```javascript
{
  lectureData: array,   // Lectures in a module
  loading: boolean,    // Loading state
  error: string       // Error message
}
```

**Key Actions**:
- `fetchLectures`: Fetch lectures for a module
- `createLecture`: Create new lecture
- `deleteLecture`: Delete lecture
- `setLectureData`: Set lecture data

---

### Dashboard Slice (`redux/slices/dashboardSlice.js`)

**Purpose**: Manages dashboard statistics and analytics data.

**State Structure**:
```javascript
{
  stats: {
    totalCourses: number,
    totalStudents: number,
    totalEarnings: number,
    averageProgress: number,
    recentEnrollments: array,
    totalDownloads: number,
    enrollmentByCourse: array
  },
  loading: boolean,
  error: string
}
```

**Key Actions**:
- `fetchDashboardStats`: Fetch dashboard statistics

---

### Coupon Slice (`redux/slices/couponSlice.js`)

**Purpose**: Manages coupon state for discount management.

**State Structure**:
```javascript
{
  myCoupons: array,   // Coupons created by educator
  loading: boolean,   // Loading state
  error: string      // Error message
}
```

**Key Actions**:
- `setMyCoupons`: Set educator's coupons

---

## Course Creation Workflow

### Step-by-Step Process

1. **Create Course**
   - Navigate to "Create Course" page
   - Fill in course title, category, and description
   - Submit form to create course
   - Redirected to edit course page

2. **Edit Course Details**
   - Update course title, subtitle, description
   - Select category and level
   - Set price and validity period
   - Upload course thumbnail
   - Toggle publish status

3. **Create Modules**
   - Navigate to module page
   - Click "Add Module"
   - Enter module title and description
   - Create module
   - Repeat for additional modules

4. **Create Lectures**
   - Open module to view lectures
   - Click "Add Lecture"
   - Enter lecture title
   - Create lecture
   - Repeat for additional lectures

5. **Edit Lectures**
   - Click "Edit" on lecture
   - Upload video file (max 500MB)
   - Toggle free preview option
   - Upload resources (PDFs, code files)
   - Add quiz questions
   - Update lecture

6. **Publish Course**
   - Return to edit course page
   - Toggle "Publish Course" button
   - Course becomes visible to students
   - Students can enroll and access content

---

## Module & Lecture Management

### Module Organization

Modules serve as containers for organizing course content into logical sections. Each module can contain multiple lectures.

**Module Structure**:
```javascript
{
  _id: string,
  title: string,
  description: string,
  lectures: array [
    {
      _id: string,
      lectureTitle: string,
      video: {
        fileUrl: string
      },
      isPreviewFree: boolean,
      resources: array,
      quizQuestions: array
    }
  ]
}
```

**Best Practices**:
- Create modules based on topics or learning objectives
- Use descriptive module titles
- Add brief module descriptions
- Organize lectures in logical order
- Mark key lectures as free previews

---

### Lecture Management

Lectures are the primary content units within modules. Each lecture can include video, resources, and quizzes.

**Lecture Features**:
- **Video Upload**: Upload lecture videos (max 500MB)
- **Free Preview**: Mark lectures as free for non-enrolled students
- **Resources**: Attach PDFs, code files, and other materials
- **Quizzes**: Add MCQ questions for assessment

**Video Requirements**:
- Maximum file size: 500MB
- Supported formats: MP4, WebM, etc.
- Auto-play disabled for security
- Download protection enabled

---

## Content Upload System

### Video Upload

**Process**:
1. Select video file from device
2. File size validation (max 500MB)
3. Upload with progress tracking
4. Video stored on server
5. URL returned and stored in lecture

**Technical Details**:
```javascript
const handleVideoChange = (e) => {
  const file = e.target.files[0];
  
  if (!file) return;
  
  if (file.size > 500 * 1024 * 1024) {
    toast.error("Video size should be less than 500MB");
    return;
  }
  
  setVideoUrl(file);
};
```

**Progress Tracking**:
```javascript
onUploadProgress: (progressEvent) => {
  const percent = Math.round(
    (progressEvent.loaded * 100) / progressEvent.total
  );
  setProgress(percent);
}
```

---

### Resource Upload

**Supported File Types**:
- PDF documents
- Images (PNG, JPG, etc.)
- ZIP archives
- Source code files
- Text documents

**Process**:
1. Select one or multiple files
2. Upload with progress tracking
3. Files stored on server
4. URLs returned and stored in lecture
5. Resources displayed in list
6. Can view or remove individual resources

---

### Quiz Upload

**Quiz Structure**:
```javascript
{
  _id: string,
  question: string,
  options: array [string, string, string, string],
  correctAnswer: string
}
```

**Process**:
1. Enter quiz question
2. Fill in four options
3. Select correct answer
4. Submit quiz
5. Quiz stored in lecture
6. Can add multiple questions
7. Can remove individual questions

---

## Coupon Management

### Coupon Types

**Percentage Discount**:
- Discount value as percentage
- Maximum discount cap (optional)
- Example: 20% off, max ₹500

**Fixed Amount Discount**:
- Fixed discount amount
- No maximum cap needed
- Example: ₹200 off

---

### Coupon Configuration

**Required Fields**:
- Coupon Code (unique identifier)
- Discount Type (percentage/fixed)
- Discount Value
- Expiry Date
- Usage Limit

**Optional Fields**:
- Maximum Discount (for percentage type)
- Minimum Purchase
- Applicable Courses (all or specific)

---

### Coupon Targeting

**All Courses**:
- Coupon applies to all educator's courses
- Simple configuration
- Broad promotion

**Specific Courses**:
- Coupon applies to selected courses only
- Checkbox selection for courses
- Targeted promotion

---

## Analytics & Reporting

### Dashboard Metrics

**Total Courses**: Number of published courses
**Total Students**: Total enrolled students across all courses
**Total Earnings**: Revenue from course sales
**Average Progress**: Average student completion rate
**Recent Enrollments**: Number of recent enrollments
**Total Downloads**: Total resource downloads
**Enrollment by Course**: Breakdown by individual course

---

### Course Performance

**Metrics Tracked**:
- Enrollment count per course
- Revenue per course
- Student progress per course
- Completion rates
- Engagement metrics

---

### Recent Enrollments

**Information Displayed**:
- Student name
- Course enrolled in
- Enrollment date
- Payment amount

---

## Best Practices

### Course Creation

1. **Planning**: Plan course structure before creation
2. **Modules**: Organize content into logical modules
3. **Lectures**: Keep lectures focused and concise
4. **Resources**: Provide supplementary materials
5. **Quizzes**: Add assessments for knowledge checks
6. **Previews**: Mark key lectures as free previews
7. **Pricing**: Set competitive pricing based on content value

### Content Quality

1. **Video Quality**: Ensure high-quality video production
2. **Audio Quality**: Clear audio with minimal background noise
3. **Resources**: Provide valuable supplementary materials
4. **Quizzes**: Create relevant and challenging quiz questions
5. **Descriptions**: Write clear and informative descriptions

### Coupon Strategy

1. **Launch Offers**: Create coupons for course launches
2. **Seasonal Sales**: Offer discounts during holidays
3. **Bundle Deals**: Create coupons for course bundles
4. **Limited Time**: Set expiry dates for urgency
5. **Usage Limits**: Control coupon availability

### Analytics Review

1. **Regular Monitoring**: Check dashboard analytics regularly
2. **Performance Tracking**: Monitor course performance
3. **Student Feedback**: Review student progress and engagement
4. **Revenue Analysis**: Track earnings and optimize pricing
5. **Content Updates**: Update content based on performance data

---

## Troubleshooting

### Common Issues

**Issue**: Course not publishing
- **Solution**: Check all required fields are filled, verify thumbnail is uploaded, check publish toggle

**Issue**: Video upload failing
- **Solution**: Check file size (max 500MB), verify file format, check internet connection

**Issue**: Module not creating
- **Solution**: Ensure module title is filled, check for special characters, verify API connection

**Issue**: Resources not uploading
- **Solution**: Check file size, verify file type, check server storage limits

**Issue**: Coupon not applying
- **Solution**: Verify coupon code is correct, check expiry date, ensure course is in applicable list

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
- **FormData**: File uploads
- **Progress Tracking**: Upload progress monitoring

---

## Future Enhancements

### Planned Features

- **Bulk Upload**: Upload multiple videos at once
- **Video Editor**: Built-in video editing tools
- **Interactive Quizzes**: More quiz question types
- **Live Sessions**: Add live streaming capability
- **Certificates**: Generate completion certificates
- **Analytics Export**: Export analytics data
- **Course Templates**: Pre-built course templates
- **Collaboration**: Multiple educators per course
- **Version Control**: Track course content changes
- **AI Assistant**: AI-powered content suggestions

### Performance Improvements

- **Video Compression**: Automatic video compression
- **CDN Integration**: Faster content delivery
- **Lazy Loading**: Optimize content loading
- **Caching**: Implement caching strategies

### UX Enhancements

- **Drag & Drop**: Drag and drop for file uploads
- **Rich Text Editor**: Enhanced description editing
- **Preview Mode**: Preview course before publishing
- **Course Duplication**: Clone existing courses
- **Bulk Actions**: Perform actions on multiple items

---

## Support

For issues, questions, or contributions, please contact the development team or refer to the project repository.

---

**Last Updated**: May 2026
**Version**: 1.0.0
