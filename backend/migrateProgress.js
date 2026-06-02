import mongoose from "mongoose";
import dotenv from "dotenv";
import Lecture from "./models/lectureModel.js";
import LectureProgress from "./models/lectureProgressModel.js";
import Enrollment from "./models/enrollmentModel.js";
import User from "./models/userModel.js";

dotenv.config();

const migrateProgress = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/skillbridge-lms");
    console.log("✅ Connected to MongoDB");

    console.log("\n🔄 Starting progress migration...\n");

    // Step 1: Clear old completion fields from Lecture documents
    console.log("📋 Step 1: Clearing old completion fields from Lecture documents...");
    const lectureUpdateResult = await Lecture.updateMany(
      {},
      {
        $unset: {
          isLectureCompleted: 1,
          isQuizCompleted: 1,
        },
      }
    );
    console.log(`   ✅ Updated ${lectureUpdateResult.modifiedCount} lecture documents\n`);

    // Step 2: Get all enrolled users and their courses
    console.log("📋 Step 2: Fetching enrolled users and their courses...");
    const enrollments = await Enrollment.find({ status: "active" })
      .populate("user")
      .populate("course");
    console.log(`   ✅ Found ${enrollments.length} active enrollments\n`);

    // Step 3: For each enrollment, get all lectures in the course
    console.log("📋 Step 3: Creating LectureProgress records for enrolled users...");
    let progressCreated = 0;
    let progressSkipped = 0;

    for (const enrollment of enrollments) {
      const userId = enrollment.user._id;
      const courseId = enrollment.course._id;

      // Get all modules for this course
      const modules = await mongoose.model("Module").find({ course: courseId });
      
      // Get all lecture IDs from all modules
      const lectureIds = [];
      for (const module of modules) {
        lectureIds.push(...module.lectures);
      }

      // For each lecture, check if progress already exists
      for (const lectureId of lectureIds) {
        const existingProgress = await LectureProgress.findOne({
          user: userId,
          lecture: lectureId,
        });

        if (!existingProgress) {
          // Create new progress record with default false values
          await LectureProgress.create({
            user: userId,
            lecture: lectureId,
            isLectureCompleted: false,
            isQuizCompleted: false,
          });
          progressCreated++;
        } else {
          progressSkipped++;
        }
      }
    }

    console.log(`   ✅ Created ${progressCreated} new progress records`);
    console.log(`   ✅ Skipped ${progressSkipped} existing progress records\n`);

    console.log("✅ Migration completed successfully!\n");
    console.log("📝 Summary:");
    console.log(`   - Cleared completion fields from ${lectureUpdateResult.modifiedCount} lectures`);
    console.log(`   - Created ${progressCreated} new progress records`);
    console.log(`   - ${progressSkipped} progress records already existed`);
    console.log("\n⚠️  Note: Users will need to re-complete lectures/quiz to track their progress.");
    console.log("    Going forward, all progress will be user-specific.\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Migration error:", error);
    process.exit(1);
  }
};

// Run migration
migrateProgress();
