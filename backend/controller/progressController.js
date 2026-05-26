import LectureProgress from "../models/lectureProgressModel.js";
import Lecture from "../models/lectureModel.js";

export const updateLectureProgress = async (req, res) => {
  try {
    const { userId, lectureId, watched, watchTime, completed } = req.body;

    let progress = await LectureProgress.findOne({
      user: userId,
      lecture: lectureId,
    });

    if (!progress) {
      progress = await LectureProgress.create({
        user: userId,
        lecture: lectureId,
        watched: watched || false,
        watchTime: watchTime || 0,
        completed: completed || false,
        completedAt: completed ? new Date() : null,
      });
    } else {
      progress.watched = watched ?? progress.watched;
      progress.watchTime = (progress.watchTime || 0) + (watchTime || 0);

      if (completed && !progress.completed) {
        progress.completed = true;
        progress.completedAt = new Date();
      }

      await progress.save();
    }

    return res.json({
      success: true,
      message: "Progress updated",
      progress,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getCourseProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    const lectures = await Lecture.find({ course: courseId });

    const lectureIds = lectures.map((lecture) => lecture._id);

    const totalLectures = lectureIds.length;

    const completedLectures = await LectureProgress.countDocuments({
      user: userId,
      lecture: { $in: lectureIds },
      completed: true,
    });

    const progressPercent =
      totalLectures === 0
        ? 0
        : Math.round((completedLectures / totalLectures) * 100);

    return res.json({
      success: true,
      totalLectures,
      completedLectures,
      progressPercent,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const resumeLecture = async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    const lectures = await Lecture.find({ course: courseId });

    const lectureIds = lectures.map((lecture) => lecture._id);

    const lastWatched = await LectureProgress.findOne({
      user: userId,
      lecture: { $in: lectureIds },
    })
      .populate("lecture")
      .sort({ updatedAt: -1 });

    return res.json({
      success: true,
      lecture: lastWatched?.lecture || null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateWatchTime = async (req, res) => {
  try {
    const { userId, lectureId, watchTime } = req.body;

    const progress = await LectureProgress.findOneAndUpdate(
      { user: userId, lecture: lectureId },
      {
        $inc: { watchTime },
        watched: true,
      },
      { new: true, upsert: true },
    );

    return res.json({
      success: true,
      progress,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
