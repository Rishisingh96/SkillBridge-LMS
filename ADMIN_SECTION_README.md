# SkillBridge LMS - Admin Section Documentation

## Table of Contents
- [Overview](#overview)
- [Admin Pages](#admin-pages)
- [Admin Components](#admin-components)
- [Redux State Management](#redux-state-management)
- [User Management](#user-management)
- [Course Management](#course-management)
- [Coupon Management](#coupon-management)
- [Platform Analytics](#platform-analytics)
- [Security & Permissions](#security--permissions)
- [Best Practices](#best-practices)

---

## Overview

The Admin section of SkillBridge LMS provides a comprehensive administrative dashboard for managing the entire platform. Built with React, Redux, and modern UI libraries, it offers powerful tools for user management, course moderation, coupon oversight, and platform analytics.

### Key Features
- **User Management**: View, ban, unban, and manage user roles
- **Course Management**: Monitor, publish/unpublish, and delete courses
- **Coupon Oversight**: Manage all platform-wide discount coupons
- **Platform Analytics**: Comprehensive statistics and revenue tracking
- **Real-time Monitoring**: Live dashboard with key metrics
- **Role-based Access**: Secure admin-only access to sensitive operations

---

## Admin Pages

### 1. Admin Dashboard (`pages/admin/AdminDashboard.jsx`)

**Purpose**: Main administrative dashboard providing an overview of platform health, user activity, and key metrics.

**Key Features**:
- **Platform Statistics**: Total users, students, courses, and banned users
- **Analytics Chart**: Bar chart visualization of platform data
- **Platform Status**: System overview with published courses, educators, active students, and banned accounts
- **Recent Users**: Table showing latest registered users
- **Loading States**: Loading indicators during data fetch
- **Responsive Design**: Optimized for all screen sizes

**Technical Implementation**:
```jsx
// Redux integration for admin data
// Recharts for data visualization
// useEffect for data fetching on mount
// StatCard component for metrics display
```

**Key Functions**:

**Fetch Dashboard Data**:
```javascript
useEffect(() => {
  dispatch(fetchPlatformStats());
  dispatch(fetchAllUsers());
  dispatch(fetchCourses());
}, [dispatch]);
```

**Recent Users Calculation**:
```javascript
const recentUsers = [...users]
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  .slice(0, 5);
```

**Chart Data Preparation**:
```javascript
const chartData = [
  { name: "Students", value: stats.totalStudents || 0 },
  { name: "Educators", value: stats.totalEducators || 0 },
  { name: "Courses", value: stats.totalCourses || 0 },
  { name: "Banned", value: stats.bannedUsers || 0 },
];
```

**StatCard Component**:
```jsx
const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex items-center justify-between hover:shadow-xl transition-all duration-300">
      <div>
        <h3 className="text-gray-500 text-sm mb-2">{title}</h3>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
      </div>
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${color}`}>
        {icon}
      </div>
    </div>
  );
};
```

**User Flow**:
1. Admin navigates to dashboard
2. Platform statistics fetched from API
3. Key metrics displayed in stat cards
4. Analytics chart shows platform breakdown
5. Platform status panel displays system health
6. Recent users table shows latest registrations

---

### 2. Manage Users (`pages/admin/ManageUsers.jsx`)

**Purpose**: User management interface for viewing, banning, unbanning, deleting users, and changing user roles.

**Key Features**:
- **User Table**: Comprehensive table with all user information
- **Ban/Unban**: Toggle user ban status
- **Delete User**: Permanently remove users from platform
- **Role Change**: Change user role (student/educator/admin)
- **Loading States**: Loading indicators during operations
- **Empty State**: Friendly message when no users exist

**Technical Implementation**:
```jsx
// Redux integration for user management
// UserTable component for display
// Action handlers for user operations
// Confirmation dialogs for destructive actions
```

**Key Functions**:

**Fetch All Users**:
```javascript
useEffect(() => {
  dispatch(fetchAllUsers());
}, [dispatch]);
```

**Action Handlers**:
```javascript
<UserTable
  users={users}
  onBan={(userId) => dispatch(banUser(userId))}
  onUnban={(userId) => dispatch(unbanUser(userId))}
  onDelete={(userId) => dispatch(deleteUser(userId))}
  onRoleChange={(userId, newRole) =>
    dispatch(changeUserRole({ userId, role: newRole }))
  }
/>
```

**User Flow**:
1. Admin navigates to Manage Users
2. All users fetched and displayed in table
3. Admin views user information (name, email, role, status)
4. Admin can ban/unban users
5. Admin can delete users with confirmation
6. Admin can change user roles
7. Changes reflected immediately in table

---

### 3. Manage Courses (`pages/admin/ManageCourses.jsx`)

**Purpose**: Course management interface for monitoring, publishing/unpublishing, and deleting courses.

**Key Features**:
- **Course Search**: Real-time search by course title
- **Course Statistics**: Total courses, published, and unpublished counts
- **Course Table**: Comprehensive table with course details
- **Publish Toggle**: Change course publication status
- **Delete Course**: Remove courses from platform
- **Loading States**: Loading indicators during operations
- **Empty State**: Friendly message when no courses found

**Technical Implementation**:
```jsx
// Redux integration for course management
// useMemo for optimized search filtering
// CourseTable component for display
// Confirmation dialogs for destructive actions
```

**Key Functions**:

**Fetch Courses**:
```javascript
useEffect(() => {
  dispatch(fetchCourses());
}, [dispatch]);
```

**Filter Courses**:
```javascript
const filteredCourses = useMemo(() => {
  return courses.filter((course) =>
    course.title?.toLowerCase().includes(search.toLowerCase())
  );
}, [courses, search]);
```

**Delete Course**:
```javascript
const handleDeleteCourse = (courseId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this course?"
  );
  if (confirmDelete) {
    dispatch(deleteCourse(courseId));
  }
};
```

**Toggle Publish**:
```javascript
const handleTogglePublish = (courseId) => {
  dispatch(toggleCoursePublish(courseId));
};
```

**User Flow**:
1. Admin navigates to Manage Courses
2. All courses fetched and displayed
3. Statistics show total, published, and unpublished counts
4. Admin can search courses by title
5. Admin can toggle course publication status
6. Admin can delete courses with confirmation
7. Changes reflected immediately

---

### 4. Coupons (`pages/admin/Coupons.jsx`)

**Purpose**: Platform-wide coupon management interface for creating, editing, and managing discount coupons across all courses.

**Key Features**:
- **All Coupons View**: View all coupons created by any educator
- **Coupon Creation**: Create new platform-wide coupons
- **Coupon Editing**: Update existing coupon details
- **Coupon Deletion**: Remove coupons with confirmation
- **Status Toggle**: Enable/disable coupons
- **Creator Information**: View which educator created each coupon
- **Usage Tracking**: Monitor coupon usage statistics
- **Course Targeting**: Apply to all courses or specific courses

**Technical Implementation**:
```jsx
// Axios for API calls with Bearer token
// State management for coupons and form
// Modal for create/edit operations
// Course fetching for targeting
```

**Key Functions**:

**Fetch All Coupons**:
```javascript
const fetchCoupons = async () => {
  try {
    const token = localStorage.getItem("token");
    const { data } = await axios.get(`${serverUrl}/api/coupon/all`, {
      headers: { Authorization: `Bearer ${token}` }
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

**Fetch All Courses**:
```javascript
const fetchCourses = async () => {
  try {
    const token = localStorage.getItem("token");
    const { data } = await axios.get(`${serverUrl}/api/course/all-courses`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (data.success) {
      setCourses(data.courses);
    }
  } catch (error) {
    console.error("Failed to fetch courses");
  }
};
```

**Create Coupon**:
```javascript
const handleCreate = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem("token");
    const { data } = await axios.post(`${serverUrl}/api/coupon/create`, formData, {
      headers: { Authorization: `Bearer ${token}` }
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
    const token = localStorage.getItem("token");
    const { data } = await axios.put(
      `${serverUrl}/api/coupon/update/${selectedCoupon._id}`,
      formData,
      { headers: { Authorization: `Bearer ${token}` } }
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
    const token = localStorage.getItem("token");
    const { data } = await axios.delete(`${serverUrl}/api/coupon/delete/${couponId}`, {
      headers: { Authorization: `Bearer ${token}` }
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
    const token = localStorage.getItem("token");
    const { data } = await axios.patch(`${serverUrl}/api/coupon/toggle/${couponId}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
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
1. Admin navigates to Coupons page
2. All platform coupons fetched and displayed
3. Views coupon details including creator information
4. Clicks "Create Coupon" to add new coupon
5. Fills in coupon details
6. Selects applicable courses (optional)
7. Clicks "Create Coupon"
8. Coupon created and displayed in list
9. Can edit, delete, or toggle status of existing coupons

---

### 5. Platform Stats (`pages/admin/PlatformStats.jsx`)

**Purpose**: Comprehensive platform statistics page with detailed analytics, revenue charts, and user information.

**Key Features**:
- **Admin Stats Component**: Detailed platform statistics display
- **Revenue Chart**: Visual representation of platform revenue
- **Extra Info Cards**: Additional metrics cards
- **Recent Users Table**: Latest user registrations
- **System Status**: Platform health indicator
- **Loading States**: Loading indicators during data fetch

**Technical Implementation**:
```jsx
// Redux integration for stats data
// AdminStats component for detailed metrics
// RevenueChart component for visualization
// UserTable component for recent users
```

**Key Functions**:

**Fetch Platform Data**:
```javascript
useEffect(() => {
  dispatch(fetchPlatformStats());
  dispatch(fetchAllUsers());
  dispatch(fetchCourses());
}, [dispatch]);
```

**Recent Users Calculation**:
```javascript
const recentUsers = [...users]
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  .slice(0, 6);
```

**User Flow**:
1. Admin navigates to Platform Stats
2. All platform data fetched from API
3. AdminStats component displays detailed metrics
4. Revenue chart shows platform revenue trends
5. Extra info cards show key statistics
6. Recent users table displays latest registrations
7. System status indicator shows platform health

---

## Admin Components

### 1. Admin Layout (`components/admin/AdminLayout.jsx`)

**Purpose**: Layout wrapper for admin pages providing consistent structure and navigation.

**Key Features**:
- **Sidebar Navigation**: Persistent sidebar with admin menu
- **Header**: Top header with user info and actions
- **Content Area**: Main content area for page content
- **Responsive Design**: Mobile-friendly layout
- **Theme Support**: Dark/light mode integration

---

### 2. Admin Sidebar (`components/admin/AdminSidebar.jsx`)

**Purpose**: Sidebar navigation component for admin dashboard and related pages.

**Key Features**:
- **Dashboard Link**: Quick access to admin dashboard
- **Manage Users Link**: Navigate to user management
- **Manage Courses Link**: Navigate to course management
- **Coupons Link**: Navigate to coupon management
- **Platform Stats Link**: Navigate to platform statistics
- **Active State**: Visual indication of current page
- **Collapsible**: Can be collapsed on mobile

---

### 3. Admin Stats (`components/admin/AdminStats.jsx`)

**Purpose**: Statistics display component showing comprehensive platform metrics.

**Key Features**:
- **Total Users**: Count of all registered users
- **Total Students**: Count of student users
- **Total Educators**: Count of educator users
- **Total Courses**: Count of all courses
- **Published Courses**: Count of published courses
- **Banned Users**: Count of banned users
- **Revenue Display**: Total platform revenue

---

### 4. User Table (`components/admin/UserTable.jsx`)

**Purpose**: Table component for displaying and managing user information.

**Key Features**:
- **User Information**: Name, email, role, status
- **Ban/Unban Action**: Toggle user ban status
- **Delete Action**: Remove user from platform
- **Role Change**: Change user role
- **Action Buttons**: Quick access to user actions
- **Responsive Design**: Mobile-friendly table
- **Hide Actions Option**: Option to hide action buttons

---

### 5. Course Table (`components/admin/CourseTable.jsx`)

**Purpose**: Table component for displaying and managing course information.

**Key Features**:
- **Course Information**: Title, creator, price, status
- **Publish Toggle**: Change course publication status
- **Delete Action**: Remove course from platform
- **Status Badge**: Visual indication of publication status
- **Creator Info**: Display course creator information
- **Responsive Design**: Mobile-friendly table

---

### 6. Revenue Chart (`components/admin/RevenueChart.jsx`)

**Purpose**: Chart component for visualizing platform revenue and growth metrics.

**Key Features**:
- **Revenue Visualization**: Bar or line chart for revenue
- **User Growth**: Track user registration trends
- **Course Performance**: Course enrollment metrics
- **Time Period Selection**: Filter by time period
- **Interactive Tooltips**: Hover for detailed information

---

### 7. Mobile Sidebar (`components/admin/MobileSidebar.jsx`)

**Purpose**: Mobile-friendly sidebar navigation for admin pages.

**Key Features**:
- **Hamburger Menu**: Collapsible sidebar for mobile
- **Navigation Links**: All admin navigation options
- **Active State**: Visual indication of current page
- **Smooth Transitions**: Animated open/close
- **Touch-friendly**: Optimized for mobile interaction

---

### 8. Admin Navbar (`components/admin/AdminNavbar.jsx`)

**Purpose**: Top navigation bar for admin pages.

**Key Features**:
- **Logo**: Platform logo with navigation
- **User Info**: Display admin user information
- **Logout**: Secure logout functionality
- **Theme Toggle**: Dark/light mode switch
- **Mobile Menu**: Hamburger menu for mobile

---

## Redux State Management

### Admin Slice (`redux/slices/adminSlice.js`)

**Purpose**: Manages admin-related state including platform stats, users, and courses.

**State Structure**:
```javascript
{
  stats: {
    totalUsers: number,
    totalStudents: number,
    totalEducators: number,
    totalCourses: number,
    publishedCourses: number,
    bannedUsers: number,
    totalRevenue: number
  },
  users: array,        // All platform users
  courses: array,      // All platform courses
  loading: boolean,     // Loading state
  error: string        // Error message
}
```

**Key Actions**:
- `fetchPlatformStats`: Fetch platform statistics
- `fetchAllUsers`: Fetch all platform users
- `fetchCourses`: Fetch all platform courses
- `banUser`: Ban a user
- `unbanUser`: Unban a user
- `deleteUser`: Delete a user
- `changeUserRole`: Change user role
- `deleteCourse`: Delete a course
- `toggleCoursePublish`: Toggle course publication status

---

## User Management

### User Operations

**View Users**:
- Navigate to Manage Users page
- All users displayed in table
- View user information (name, email, role, status)

**Ban User**:
- Click ban button on user row
- User status changes to "Banned"
- User cannot access platform
- Reversible action

**Unban User**:
- Click unban button on banned user
- User status changes to "Active"
- User can access platform again

**Delete User**:
- Click delete button on user row
- Confirmation dialog appears
- User permanently removed from platform
- All associated data deleted
- Irreversible action

**Change Role**:
- Select new role from dropdown
- Options: student, educator, admin
- User permissions updated immediately
- Role change logged for audit

---

### User Roles

**Student**:
- Can browse and enroll in courses
- Can view enrolled courses
- Can participate in discussions
- Cannot create or manage courses

**Educator**:
- All student permissions
- Can create and manage courses
- Can create modules and lectures
- Can upload content
- Can create coupons for their courses

**Admin**:
- All educator permissions
- Can manage all users
- Can manage all courses
- Can manage all coupons
- Can view platform analytics
- Full platform control

---

## Course Management

### Course Operations

**View Courses**:
- Navigate to Manage Courses page
- All courses displayed in table
- View course information (title, creator, price, status)

**Search Courses**:
- Use search bar to filter courses
- Real-time filtering by title
- Results update instantly

**Publish Course**:
- Click publish toggle on course row
- Course status changes to "Published"
- Course visible to all users
- Can be unpublished anytime

**Unpublish Course**:
- Click publish toggle on published course
- Course status changes to "Draft"
- Course hidden from users
- Can be republished anytime

**Delete Course**:
- Click delete button on course row
- Confirmation dialog appears
- Course permanently removed from platform
- All associated content deleted
- Enrollments cancelled
- Irreversible action

---

### Course Statistics

**Total Courses**: Count of all courses on platform
**Published Courses**: Count of visible courses
**Unpublished Courses**: Count of draft courses
**Course by Category**: Breakdown by category
**Course by Creator**: Courses per educator

---

## Coupon Management

### Coupon Operations

**View All Coupons**:
- Navigate to Coupons page
- All platform coupons displayed
- View coupon details including creator

**Create Coupon**:
- Click "Create Coupon" button
- Fill in coupon details
- Select applicable courses (optional)
- Click "Create Coupon"
- Coupon created and displayed

**Edit Coupon**:
- Click edit button on coupon
- Update coupon details
- Click "Update Coupon"
- Changes saved immediately

**Delete Coupon**:
- Click delete button on coupon
- Confirmation dialog appears
- Coupon permanently removed
- Irreversible action

**Toggle Status**:
- Click toggle button on coupon
- Status changes between Active/Inactive
- Inactive coupons cannot be used

---

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

### Coupon Targeting

**All Courses**:
- Coupon applies to all courses on platform
- Simple configuration
- Broad promotion

**Specific Courses**:
- Coupon applies to selected courses only
- Checkbox selection for courses
- Targeted promotion

---

## Platform Analytics

### Dashboard Metrics

**Total Users**: Number of registered users
**Total Students**: Number of student users
**Total Educators**: Number of educator users
**Total Courses**: Number of courses on platform
**Published Courses**: Number of visible courses
**Banned Users**: Number of banned accounts
**Total Revenue**: Platform revenue from course sales

---

### Platform Status

**Published Courses**: Count of visible courses
**Total Educators**: Count of active educators
**Active Students**: Count of active students
**Banned Accounts**: Count of banned users

---

### Revenue Tracking

**Total Revenue**: Cumulative platform revenue
**Revenue by Course**: Breakdown by individual course
**Revenue by Educator**: Earnings per educator
**Revenue Trends**: Revenue over time

---

### User Analytics

**User Growth**: New user registrations over time
**User Activity**: Active vs inactive users
**User Distribution**: Students vs educators
**User Retention**: User retention rates

---

### Course Analytics

**Course Performance**: Enrollment per course
**Course Completion**: Completion rates
**Course Revenue**: Revenue per course
**Course Popularity**: Most viewed courses

---

## Security & Permissions

### Access Control

**Admin-Only Access**:
- All admin pages protected
- Role-based access control
- Protected routes implementation
- Unauthorized access redirected

**Authentication**:
- HTTP-only cookies for session
- JWT token validation
- Secure API communication
- Token refresh mechanism

---

### Audit Trail

**User Actions**:
- User bans logged
- User deletions logged
- Role changes logged
- Timestamp recorded

**Course Actions**:
- Course publication logged
- Course deletion logged
- Status changes logged
- Timestamp recorded

**Coupon Actions**:
- Coupon creation logged
- Coupon deletion logged
- Status changes logged
- Timestamp recorded

---

### Data Protection

**Sensitive Data**:
- User passwords hashed
- Payment information secure
- Personal data protected
- GDPR compliance

**API Security**:
- CORS configuration
- Rate limiting
- Input validation
- SQL injection prevention

---

## Best Practices

### User Management

1. **Ban Policy**: Ban users only for violations
2. **Role Changes**: Document role change reasons
3. **User Deletion**: Consider data retention policies
4. **Communication**: Notify users of account changes
5. **Review**: Regular review of banned users

### Course Management

1. **Review**: Review courses before publishing
2. **Quality Standards**: Ensure course quality
3. **Content Guidelines**: Enforce content policies
4. **Creator Support**: Support course creators
5. **Moderation**: Regular content moderation

### Coupon Management

1. **Fair Use**: Ensure fair coupon distribution
2. **Expiration**: Set reasonable expiry dates
3. **Usage Limits**: Control coupon availability
4. **Monitoring**: Monitor coupon usage patterns
5. **Fraud Prevention**: Prevent coupon abuse

### Analytics Review

1. **Regular Monitoring**: Check analytics regularly
2. **Trend Analysis**: Identify trends and patterns
3. **Performance Metrics**: Track key performance indicators
4. **Data-Driven Decisions**: Make decisions based on data
5. **Reporting**: Generate regular reports

---

## Troubleshooting

### Common Issues

**Issue**: Users not loading
- **Solution**: Check API connection, verify admin permissions, refresh page

**Issue**: Course publish toggle not working
- **Solution**: Check course data, verify API endpoint, check network connection

**Issue**: Coupon creation failing
- **Solution**: Verify form data, check coupon code uniqueness, check API response

**Issue**: Analytics not updating
- **Solution**: Check data fetch, verify API endpoints, clear browser cache

**Issue**: User ban not applying
- **Solution**: Check user ID, verify API response, check user status in database

---

## Technical Stack

### Frontend Technologies

- **React 18**: UI library
- **Redux Toolkit**: State management
- **React Router**: Navigation
- **Axios**: HTTP client
- **Recharts**: Data visualization
- **Lucide React**: Icon library
- **Tailwind CSS**: Styling
- **React Toastify**: Toast notifications

### Backend Integration

- **REST API**: Backend API endpoints
- **HTTP-only Cookies**: Authentication
- **Bearer Tokens**: API authentication
- **Role-based Access**: Permission system

---

## Future Enhancements

### Planned Features

- **Advanced Analytics**: More detailed analytics and reports
- **Audit Logs**: Comprehensive audit trail
- **Bulk Operations**: Perform actions on multiple items
- **Email Notifications**: Automated email alerts
- **Reports Export**: Export analytics data
- **User Activity Logs**: Detailed user activity tracking
- **Course Review System**: Course review and approval workflow
- **Automated Moderation**: AI-powered content moderation
- **Revenue Payouts**: Automated educator payouts
- **Platform Settings**: Configurable platform settings

### Performance Improvements

- **Data Caching**: Implement caching strategies
- **Lazy Loading**: Optimize data loading
- **Pagination**: Implement pagination for large datasets
- **Real-time Updates**: WebSocket for real-time updates

### UX Enhancements

- **Advanced Filters**: More filtering options
- **Bulk Actions**: Perform actions on multiple items
- **Drag & Drop**: Drag and drop for reordering
- **Keyboard Shortcuts**: Keyboard navigation
- **Dark Mode**: Enhanced dark mode support

---

## Support

For issues, questions, or contributions, please contact the development team or refer to the project repository.

---

**Last Updated**: May 2026
**Version**: 1.0.0
