const isCourseActive = async (userId, courseId) => {

  const enrollment = await Enrollment.findOne({
    user: userId,
    course: courseId,
  });

  if (!enrollment) return false;

  if (new Date() > enrollment.endDate) {
    enrollment.status = "expired";
    await enrollment.save();
    return false;
  }

  return true;
};