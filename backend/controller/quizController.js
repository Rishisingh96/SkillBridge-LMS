// Import Models
import Course from "../model/courseModel.js";
import Lecture from "../model/lectureModel.js";
import User from "../model/userModel.js";

// Cloudinary
import uploadOnCloudinary from "../config/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";

// Add Quiz Question
export const addQuizQuestion = async (req, res) => {

  try {

    const { lectureId } = req.params;

    const {

      question,

      options,

      correctAnswer,

    } = req.body;

    // Validate
    if (
      !question ||
      !options ||
      !correctAnswer
    ) {

      return res.status(400).json({

        message:
          "Question, options and correctAnswer are required",

      });

    }

    // Minimum 2 Options
    if (options.length < 2) {

      return res.status(400).json({

        message:
          "Minimum 2 options are required",

      });

    }

    // Find Lecture
    const lecture = await Lecture.findById(
      lectureId
    );

    if (!lecture) {

      return res.status(404).json({

        message: "Lecture not found",

      });

    }

    // Add Quiz
    lecture.quizQuestions.push({

      question,

      options,

      correctAnswer,

    });

    // Save
    await lecture.save();

    // Response
    return res.status(200).json({

      message:
        "Quiz added successfully",

      quizQuestions:
        lecture.quizQuestions,

    });

  } catch (error) {

    console.log(
      "Quiz Error:",
      error
    );

    return res.status(500).json({

      message:
        `Quiz error ${error.message}`,

    });

  }
};


// remove Quiz
export const removeQuizQuestion = async (
  req,
  res
) => {

  try {

    const {
      lectureId,
      quizId,
    } = req.params;

    // Find Lecture
    const lecture =
      await Lecture.findById(
        lectureId
      );

    if (!lecture) {

      return res.status(404).json({

        message:
          "Lecture not found",

      });

    }

    // Find Quiz Question
    const quiz =
      lecture.quizQuestions.id(
        quizId
      );

    if (!quiz) {

      return res.status(404).json({

        message:
          "Quiz question not found",

      });

    }

    // Remove Quiz
    lecture.quizQuestions.pull(
      quizId
    );

    // Save Lecture
    await lecture.save();

    return res.status(200).json({

      message:
        "Quiz removed successfully",

      quizQuestions:
        lecture.quizQuestions,

    });

  } catch (error) {

    console.log(
      "Remove Quiz Error:",
      error
    );

    return res.status(500).json({

      message:
        `Remove quiz error ${error.message}`,

    });

  }

};

// Get Quiz
export const getLectureQuiz = async (
  req,
  res
) => {

  try {

    const { lectureId } =
      req.params;

    const lecture =
      await Lecture.findById(
        lectureId
      ).select("quizQuestions");

    if (!lecture) {

      return res.status(404).json({

        message:
          "Lecture not found",

      });

    }

    return res.status(200).json({

      quizQuestions:
        lecture.quizQuestions,

    });

  } catch (error) {

    return res.status(500).json({

      message:
        `Get quiz error ${error.message}`,

    });

  }

};



