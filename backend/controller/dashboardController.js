import Course from "../models/courseModel.js";
import Enrollment from "../models/enrollmentModel.js";
import Lecture from "../models/lectureModel.js";
import LectureProgress from "../models/lectureProgressModel.js";
import Module from "../models/moduleModel.js";


// ======================================
// GET DASHBOARD STATS
// ======================================

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.userId;

    // Get all courses by this creator
    const courses = await Course.find({ creator: userId });

    // Total Courses
    const totalCourses = courses.length;

    // Get all enrollments for creator's courses
    const courseIds = courses.map(c => c._id);
    const enrollments = await Enrollment.find({
      course: { $in: courseIds },
      status: "active"
    });

    // Total Students (unique users)
    const uniqueStudents = new Set(enrollments.map(e => e.user.toString()));
    const totalStudents = uniqueStudents.size;

    // Total Earnings
    const totalEarnings = enrollments.reduce((sum, enrollment) => {
      return sum + (enrollment.pricePaid || 0);
    }, 0);

    // Course Progress (average completion rate)
    let totalLectures = 0;
    let totalCompletedLectures = 0;
    let totalDownloads = 0;

    for (const course of courses) {
      // Get all modules for this course
      const modules = await Module.find({ course: course._id });
      const moduleIds = modules.map(m => m._id);

      // Get all lectures for this course
      const lectures = await Lecture.find({ module: { $in: moduleIds } });
      const lectureIds = lectures.map(l => l._id);

      totalLectures += lectureIds.length;

      // Get completed lectures for this course
      const completedCount = await LectureProgress.countDocuments({
        lecture: { $in: lectureIds },
        completed: true
      });

      totalCompletedLectures += completedCount;

      // Calculate total downloads for this course
      for (const lecture of lectures) {
        for (const resource of lecture.resources) {
          totalDownloads += resource.downloads || 0;
        }
      }
    }

    const averageProgress = totalLectures > 0 
      ? Math.round((totalCompletedLectures / totalLectures) * 100) 
      : 0;

    // Recent Enrollments (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentEnrollments = await Enrollment.find({
      course: { $in: courseIds },
      createdAt: { $gte: thirtyDaysAgo }
    }).populate("user", "name email").sort({ createdAt: -1 }).limit(10);

    // Enrollment count by course
    const enrollmentByCourse = await Promise.all(
      courses.map(async (course) => {
        const count = await Enrollment.countDocuments({
          course: course._id,
          status: "active"
        });
        return {
          courseId: course._id,
          courseTitle: course.title,
          enrollmentCount: count,
          isPublished: course.isPublished,
          thumbnail: course.thumbnail,
          price: course.price,
          reviewCount: course.reviews ? course.reviews.length : 0
        };
      })
    );

    return res.status(200).json({
      success: true,
      stats: {
        totalCourses,
        totalStudents,
        totalEarnings,
        averageProgress,
        recentEnrollments: recentEnrollments.length,
        totalDownloads,
        enrollmentByCourse
      },
      recentEnrollments
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Error fetching dashboard stats: ${error.message}`
    });
  }
};


// ── Recent Enrollments with User Details ──
export const getRecentEnrollments = async (req, res) => {
  try {
    const userId = req.userId;

    // Creator ke courses
    const courses = await Course.find({ creator: userId });
    const courseIds = courses.map(c => c._id);

    const enrollments = await Enrollment.find({
      course: { $in: courseIds },
    })
      .populate("user", "name email photoUrl phone age createdAt")
      .populate("course", "title thumbnail price")
      .sort({ createdAt: -1 })
      .limit(10);

    return res.status(200).json({ success: true, enrollments });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};