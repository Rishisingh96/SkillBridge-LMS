export const enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.userId;

    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user || !course) {
      return res.status(404).json({
        message: "User or Course not found",
      });
    }

    // ❌ paid course block
    if (course.price > 0) {
      return res.status(400).json({
        success: false,
        message: "Paid course requires payment",
      });
    }

    const already = await Enrollment.findOne({
      user: userId,
      course: courseId,
    });

    if (already) {
      return res.status(400).json({
        message: "Already enrolled",
      });
    }

    const startDate = new Date();
    const endDate = new Date(startDate);

    const { value = 6, unit = "month" } = course.validity || {};

    if (unit === "day") endDate.setDate(endDate.getDate() + value);
    if (unit === "month") endDate.setMonth(endDate.getMonth() + value);
    if (unit === "year") endDate.setFullYear(endDate.getFullYear() + value);

    const enrollment = await Enrollment.create({
      user: userId,
      course: courseId,
      pricePaid: 0,
      startDate,
      endDate,
    });

    return res.status(201).json({
      success: true,
      message: "Free course enrolled successfully",
      enrollment,
    });

  } catch (error) {
    return res.status(500).json({
      message: `Enroll error ${error.message}`,
    });
  }
};