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

    const totalLectures = await Lecture.countDocuments({ course: courseId });

    const completedLectures = await LectureProgress.countDocuments({
      user: userId,
      completed: true,
    });

    const progressPercent =
      totalLectures === 0
        ? 0
        : (completedLectures / totalLectures) * 100;

    return res.json({
      success: true,
      totalLectures,
      completedLectures,
      progressPercent: Math.round(progressPercent),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const resumeLecture = async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    const lastWatched = await LectureProgress.findOne({
      user: userId,
    })
      .populate({
        path: "lecture",
        match: { course: courseId },
      })
      .sort({ updatedAt: -1 });

    return res.json({
      success: true,
      lecture: lastWatched?.lecture || null,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
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
      { new: true, upsert: true }
    );

    return res.json({
      success: true,
      progress,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
