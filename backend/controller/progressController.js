import Lecture from "../models/lectureModel.js";
import LectureProgress from "../models/lectureProgressModel.js";
import Module from "../models/moduleModel.js";

// Helper function to merge user progress with lecture data
export const mergeUserProgressWithLectures = async (lectures, userId) => {
  if (!lectures || lectures.length === 0) {
    return lectures;
  }

  if (!userId) {
    // If no userId, return lectures with default false values
    return lectures.map((lecture) => {
      const lectureObj = lecture.toObject ? lecture.toObject() : lecture;
      return {
        ...lectureObj,
        isLectureCompleted: false,
        isQuizCompleted: false,
        currentPosition: 0,
        progressPercent: 0,
        completed: false,
      };
    });
  }

  try {
    const lectureIds = lectures.map((lecture) => lecture._id);

    // Fetch all progress records for this user for these lectures
    const progressRecords = await LectureProgress.find({
      user: userId,
      lecture: { $in: lectureIds },
    });

    // Create a map for quick lookup
    const progressMap = {};
    progressRecords.forEach((progress) => {
      progressMap[progress.lecture.toString()] = {
        isLectureCompleted: progress.isLectureCompleted || false,
        isQuizCompleted: progress.isQuizCompleted || false,
        currentPosition: progress.currentPosition || 0,
        progressPercent: progress.progressPercent || 0,
        completed: progress.completed || false,
      };
    });

    // Merge progress into each lecture
    const mergedLectures = lectures.map((lecture) => {
      const lectureId = lecture._id.toString();
      const progress = progressMap[lectureId] || {
        isLectureCompleted: false,
        isQuizCompleted: false,
        currentPosition: 0,
        progressPercent: 0,
        completed: false,
      };

      // Return lecture object with merged progress
      const lectureObj = lecture.toObject ? lecture.toObject() : lecture;
      return {
        ...lectureObj,
        isLectureCompleted: progress.isLectureCompleted,
        isQuizCompleted: progress.isQuizCompleted,
        currentPosition: progress.currentPosition,
        progressPercent: progress.progressPercent,
        completed: progress.completed,
      };
    });

    return mergedLectures;
  } catch (error) {
    console.error("Error merging lecture progress:", error);
    // Return original lectures if merge fails
    return lectures.map((lecture) => {
      const lectureObj = lecture.toObject ? lecture.toObject() : lecture;
      return {
        ...lectureObj,
        isLectureCompleted: false,
        isQuizCompleted: false,
        currentPosition: 0,
        progressPercent: 0,
        completed: false,
      };
    });
  }
};

// Helper function to merge user progress with modules
export const mergeUserProgressWithModules = async (modules, userId) => {
  if (!modules || modules.length === 0) {
    return modules;
  }

  try {
    // Get all lectures from all modules
    const allLectures = [];
    modules.forEach((module) => {
      if (module.lectures && module.lectures.length > 0) {
        allLectures.push(...module.lectures);
      }
    });

    // If no lectures found, return modules as is but with default completion values
    if (allLectures.length === 0) {
      return modules.map((module) => {
        const moduleObj = module.toObject ? module.toObject() : { ...module };
        moduleObj.lectures = [];
        return moduleObj;
      });
    }

    // Merge progress with lectures
    const mergedLectures = await mergeUserProgressWithLectures(allLectures, userId);

    // Create a map for quick lookup
    const lectureMap = {};
    mergedLectures.forEach((lecture) => {
      if (lecture._id) {
        lectureMap[lecture._id.toString()] = lecture;
      }
    });

    // Merge lectures back into modules
    const mergedModules = modules.map((module) => {
      // Convert to plain object if it's a mongoose document
      const moduleObj = module.toObject ? module.toObject() : { ...module };
      
      if (moduleObj.lectures && moduleObj.lectures.length > 0) {
        moduleObj.lectures = moduleObj.lectures.map((lecture) => {
          const lectureId = lecture._id ? lecture._id.toString() : null;
          const mergedLecture = lectureId ? lectureMap[lectureId] : null;
          
          if (mergedLecture) {
            return mergedLecture;
          }
          
          // If no merged lecture found, add default completion values
          const lectureObj = lecture.toObject ? lecture.toObject() : lecture;
          return {
            ...lectureObj,
            isLectureCompleted: false,
            isQuizCompleted: false,
            currentPosition: 0,
            progressPercent: 0,
            completed: false,
          };
        });
      } else {
        moduleObj.lectures = [];
      }
      return moduleObj;
    });

    return mergedModules;
  } catch (error) {
    console.error("Error merging module progress:", error);
    // Return modules with default values if merge fails
    return modules.map((module) => {
      const moduleObj = module.toObject ? module.toObject() : { ...module };
      if (moduleObj.lectures && moduleObj.lectures.length > 0) {
        moduleObj.lectures = moduleObj.lectures.map((lecture) => {
          const lectureObj = lecture.toObject ? lecture.toObject() : lecture;
          return {
            ...lectureObj,
            isLectureCompleted: false,
            isQuizCompleted: false,
            currentPosition: 0,
            progressPercent: 0,
            completed: false,
          };
        });
      } else {
        moduleObj.lectures = [];
      }
      return moduleObj;
    });
  }
};

export const updateLectureProgress = async (req, res) => {
try {
const { lectureId, currentPosition } = req.body;
const userId = req.userId;


const lecture = await Lecture.findById(lectureId);

if (!lecture) {
  return res.status(404).json({
    success: false,
    message: "Lecture not found",
  });
}

let progress = await LectureProgress.findOne({
  user: userId,
  lecture: lectureId,
});

if (!progress) {
  progress = new LectureProgress({
    user: userId,
    lecture: lectureId,
  });
}

// Current position for resume
progress.currentPosition = currentPosition;

// Highest watched position
progress.maxPosition = Math.max(
  progress.maxPosition || 0,
  currentPosition
);

// Total watch time
progress.watchTime = progress.maxPosition;

progress.lastAccessedAt = new Date();

const duration = lecture.video?.duration || 0;

if (duration > 0) {
  progress.progressPercent = Math.min(
    100,
    Math.round(
      (progress.maxPosition / duration) * 100
    )
  );
}

// Auto complete at 95%
if (
  progress.progressPercent >= 95 &&
  !progress.completed
) {
  progress.completed = true;
  progress.completedAt = new Date();
}

await progress.save();

return res.status(200).json({
  success: true,
  progress,
});


} catch (error) {
return res.status(500).json({
success: false,
message: error.message,
});
}
};



export const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.userId;

    // Get course modules
    const modules = await Module.find({
      course: courseId,
    });

    const moduleIds = modules.map(
      (module) => module._id
    );

    // Get all lectures of those modules
    const lectures = await Lecture.find({
      module: {
        $in: moduleIds,
      },
    });

    const lectureIds = lectures.map(
      (lecture) => lecture._id
    );

    const totalLectures =
      lectureIds.length;

    // Completed lectures
    const completedLectures =
      await LectureProgress.countDocuments({
        user: userId,
        lecture: {
          $in: lectureIds,
        },
        completed: true,
      });

    // Total course duration
    const totalCourseDuration =
      lectures.reduce(
        (sum, lecture) =>
          sum +
          (lecture.video?.duration || 0),
        0
      );

    // All progress
    const allProgress =
      await LectureProgress.find({
        user: userId,
        lecture: {
          $in: lectureIds,
        },
      });

    const lectureProgressMap = {};

    allProgress.forEach((item) => {
      lectureProgressMap[
        item.lecture.toString()
      ] = {
        completed:
          item.completed,

        currentPosition:
          item.currentPosition,

        progressPercent:
          item.progressPercent,
      };
    });

    const progressPercent =
      totalLectures > 0
        ? Math.round(
            (completedLectures /
              totalLectures) *
              100
          )
        : 0;

    return res.status(200).json({
      success: true,

      totalLectures,

      completedLectures,

      progressPercent,

      totalCourseDuration,

      lectureProgress:
        lectureProgressMap,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Resume Lecture API
export const resumeLecture = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.userId;

    // Get all modules of course
    const modules = await Module.find({
      course: courseId,
    });

    const moduleIds = modules.map(
      (module) => module._id
    );

    // Get all lectures of those modules
    const lectures = await Lecture.find({
      module: {
        $in: moduleIds,
      },
    });

    const lectureIds = lectures.map(
      (lecture) => lecture._id
    );

    // Find last accessed lecture
    const progress =
      await LectureProgress.findOne({
        user: userId,
        lecture: {
          $in: lectureIds,
        },
      })
        .populate("lecture")
        .sort({
          lastAccessedAt: -1,
        });

    // If no progress, return null
    if (!progress || !progress.lecture) {
      return res.status(200).json({
        success: true,
        lecture: null,
        currentPosition: 0,
      });
    }

    // Get full lecture data with all nested fields
    const fullLecture = await Lecture.findById(progress.lecture._id);

    return res.status(200).json({
      success: true,
      lecture: fullLecture,
      currentPosition: progress.currentPosition || 0,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


