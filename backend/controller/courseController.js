
// Import Course model
import Course from "../model/courseModel.js"
import User from "../model/userModel.js"
import uploadOnCloudinary from "../config/cloudinary.js"

// Create Course
export const createCourse = async (req, res) =>{
    try{
        const {title, category, description, validity} = req.body
        console.log("Request body:", req.body)

        const safeValidity = validity || {
            value:6,
            unit:"month"
        }

        // Validation
        if(!title || !category ){
            return res.status(400).json({message:"Title and Category are required"})
        }

        // Create Course
        const course = await Course.create({
            title,
            category,
            description,
            validity: safeValidity,
            creator: req.userId   
        })
        res.status(201).json({message:"Course created successfully", course})
    } catch(error){
        console.log("Create Course Error :", error)
        res.status(500).json({message:"Failed to create course"})
    }
}

// togglePublishCourse 
export const togglePublishCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // toggle
    course.isPublished = !course.isPublished;

    await course.save();

    return res.status(200).json({
      message: course.isPublished
        ? "Course published successfully"
        : "Course unpublished successfully",
      course,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error: ${error.message}`,
    });
  }
};

// Get Publiced course
// Get Published Courses
export const getPublishedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .populate({
        path: "modules",
        populate: {
          path: "lectures",
          model: "Lecture",
        },
      })
      .populate({
        path: "creator",
        select: "name email photoUrl role",
      })
      .populate({
        path: "reviews",
      });

    if (!courses || courses.length === 0) {
      return res.status(404).json({
        message: "No published courses found",
      });
    }

    return res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });

  } catch (error) {
    return res.status(500).json({
      message: `Failed to fetch courses: ${error.message}`,
    });
  }
};


// Get Courses by Creator
export const getCreatorCourses = async (req, res) =>{
    try {

        const userId = req.userId

        const courses = await Course.find({creator: userId})
        console.log("Found courses:", courses)

        if(!courses){
            return res.status(400).json({message:"Courses are not found"})
        }
        return res.status(200).json(courses)

    } catch (error) {
        console.log("Error in getCreatorCourses:", error)
        return res.status(500).json({message:`Failed to fetch courses ${error}`})
    }
}

//get Creator
export const getCreatorById = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    const { userId } = req.body;

    if (!userId) {
      console.log("No userId provided in request");
      return res.status(400).json({ message: "userId is required" });
    }

    console.log("Searching for user with ID:", userId);
    const user = await User.findById(userId).select("-password");

    console.log("Found user:", user);

    if (!user) {
      console.log("User not found with ID:", userId);
      return res.status(404).json({ message: "user is not found." });
    }

    console.log("Returning user data:", user);
    return res.status(200).json(user);
  } catch (error) {
    console.log("Error in getCreatorById:", error);
    return res.status(500).json({ message: `Failed to Creator   ${error}` });
  }
};


// Get Course Edit
export const editCourse = async (req, res) => {
  try {

    const { courseId } = req.params;

    const {
      title,
      subTitle,
      description,
      category,
      level,
      isPublished,
      price,
    } = req.body;

    // find course
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    // validity object
    const validity = {
      value: req.body["validity[value]"],
      unit: req.body["validity[unit]"],
    };

    // dynamic update object
    const updateData = {};

    if (title) updateData.title = title;

    if (subTitle) updateData.subTitle = subTitle;

    if (description) updateData.description = description;

    if (category) updateData.category = category;

    if (level) updateData.level = level;

    if (price !== undefined) updateData.price = price;

    // validity update
    if (validity.value && validity.unit) {
      updateData.validity = {
        value: Number(validity.value),
        unit: validity.unit,
      };
    }

    // boolean handle
    if (typeof isPublished !== "undefined") {
      updateData.isPublished = isPublished;
    }

    // thumbnail upload
    if (req.file) {

      const thumbnailUrl = await uploadOnCloudinary(
        req.file.path
      );

      updateData.thumbnail = thumbnailUrl.fileUrl;
    }

    // update course
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      updateData,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course: updatedCourse,
    });

  } catch (error) {

    console.log("Edit course error:", error);

    return res.status(500).json({
      success: false,
      message: `Failed to update course: ${error.message}`,
    });
  }
};


// Get Course by Id
export const getCourseById = async (req, res) =>{
    try {
        const {courseId} = req.params
        const course = await Course.findById(courseId).populate("creator")
        if(!course){
            return res.status(400).json({message:"Course is not found"})
        }   
        return res.status(200).json(course)
    } catch (error) {
        return res.status(500).json({message:`failed to fetch course ${error}`})  
    }
}


// Delete Course
export const deleteCourse = async (req, res) =>{
    try {
        const {courseId} = req.params
        let course = await Course.findById(courseId)
        if(!course){
            return res.status(400).json({message:"Course is not found"})
        }
        course = await Course.findByIdAndDelete(courseId)
        return res.status(200).json({message:"Course deleted successfully"})
    } catch (error) {
        return res.status(500).json({message:`failed to delete course ${error}`})  
    }
}


