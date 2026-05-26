import Enrollment from "../models/enrollmentModel.js";
import User from "../models/userModel.js";

export const isCourseActive = async (
  userId,
  courseId
) => {

  // find enrollment
  const enrollment = await Enrollment.findOne({
    user: userId,
    course: courseId,
  });

  // no enrollment
  if (!enrollment) {
    return false;
  }

  // already expired
  if (enrollment.status === "expired") {

    await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          enrolledCourses: courseId,
        },
      }
    );

    return false;
  }

  // check current time
  const now = new Date();

  // course expired
  if (now > enrollment.endDate) {

    // update enrollment status
    enrollment.status = "expired";

    await enrollment.save();

    // remove from user enrolled courses
    await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          enrolledCourses: courseId,
        },
      }
    );

    return false;
  }

  // active course
  return true;
};