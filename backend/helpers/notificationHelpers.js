import User from "../models/userModel.js";
import { createBulkNotifications } from "../service/notificationService.js";
// import { createNotification } from "../services/notificationService.js";

export const notifyNewUserRegistration = async ({
  userName,
  userPhone,
  userEmail,
  userRole,
}) => {
  const notifications = [];
  
  // Get all educators
  const educators = await User.find({ role: "educator" }).select("_id");
  
  // Get all admins
  const admins = await User.find({ role: "admin" }).select("_id");
  
  const now = new Date();
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString();
  
  // Create notifications for educators
  for (const educator of educators) {
    notifications.push({
      recipient: educator._id,
      recipientRole: "educator",
      title: "👤 New User Registered",
      message: `${userName} (${userRole}) joined the platform. Phone: ${userPhone || 'Not provided'}`,
      type: "new_user_registered",
      category: "user",
      priority: "medium",
      metadata: {
        userName,
        userPhone,
        userEmail,
        userRole,
        date,
        time
      }
    });
  }
  
  // Create notifications for admins
  for (const admin of admins) {
    notifications.push({
      recipient: admin._id,
      recipientRole: "admin",
      title: "👤 New User Registered",
      message: `${userName} (${userRole}) joined the platform. Phone: ${userPhone || 'Not provided'}`,
      type: "new_user_registered",
      category: "user",
      priority: "high",
      metadata: {
        userName,
        userPhone,
        userEmail,
        userRole,
        date,
        time
      }
    });
  }
  
  // Send bulk notifications
  await createBulkNotifications(notifications);
};


export const notifyCourseEnrollmentToCreatorAndAdmin = async ({
  studentName,
  studentPhone,
  courseId,
  courseTitle,
  educatorId,
}) => {
  const notifications = [];
  
  const now = new Date();
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString();
  
  // Notification for course creator (educator)
  notifications.push({
    recipient: educatorId,
    recipientRole: "educator",
    title: "🎓 New Student Enrolled",
    message: `${studentName} enrolled in your course: ${courseTitle}`,
    type: "new_enrollment",
    category: "course",
    actionUrl: `/educator/courses/${courseId}`,
    priority: "high",
    metadata: {
      studentName,
      studentPhone,
      courseTitle,
      date,
      time
    }
  });
  
  // Get all admins
  const admins = await User.find({ role: "admin" }).select("_id");
  
  // Notification for admins
  for (const admin of admins) {
    notifications.push({
      recipient: admin._id,
      recipientRole: "admin",
      title: "🎓 New Course Enrollment",
      message: `${studentName} enrolled in ${courseTitle} by educator`,
      type: "new_enrollment",
      category: "course",
      actionUrl: `/admin/courses/${courseId}`,
      priority: "medium",
      metadata: {
        studentName,
        studentPhone,
        courseTitle,
        educatorId,
        date,
        time
      }
    });
  }
  
  // Send bulk notifications
  await createBulkNotifications(notifications);
};

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

export const notifyLectureAdded =
  async ({
    studentId,
    courseId,
    lectureId,
    lectureTitle,
  }) => {
    return await createBulkNotifications({
      recipient: studentId,
      recipientRole: "student",

      title: "New Lecture Added",

      message: `${lectureTitle} is now available.`,

      type: "lecture_added",

      category: "lecture",

      actionUrl: `/course/${courseId}/lecture/${lectureId}`,

      resourceType: "lecture",
      resourceId: lectureId,
    });
  };


  export const notifyEducatorEnrollment =
  async ({
    educatorId,
    studentName,
    courseId,
  }) => {
    return await createBulkNotifications({
      recipient: educatorId,
      recipientRole: "educator",

      title: "New Student Enrolled",

      message: `${studentName} enrolled in your course.`,

      type: "new_enrollment",

      category: "course",

      actionUrl: `/educator/courses/${courseId}`,
    });
  };

