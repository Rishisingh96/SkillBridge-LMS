import { createNotification } from "../services/notificationService.js";

export const notifyCourseEnrollment = async ({
  studentId,
  courseId,
  courseTitle,
}) => {
  return await createNotification({
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
    return await createNotification({
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
    return await createNotification({
      recipient: educatorId,
      recipientRole: "educator",

      title: "New Student Enrolled",

      message: `${studentName} enrolled in your course.`,

      type: "new_enrollment",

      category: "course",

      actionUrl: `/educator/courses/${courseId}`,
    });
  };