
// Import Course model
import Course from "../model/courseModel.js"
import User from "../model/userModel.js"
import uploadOnCloudinary from "../config/cloudinary.js"

// Create Course
export const createCourse = async (req, res) =>{
    try{
        const {title, category, description} = req.body

        // Validation
        if(!title || !category ){
            return res.status(400).json({message:"Title and Category are required"})
        }

        // Create Course
        const course = await Course.create({
            title,
            category,
            description,
            creator: req.userId   
        })
        res.status(201).json({message:"Course created successfully", course})
    } catch(error){
        console.log("Create Course Error :", error)
        res.status(500).json({message:"Failed to create course"})
    }
}

// Get Publiced course
export const getPublishedCourses = async (req, res) =>{
    try {
        const courses = await Course.find({isPublished:true}).populate("lectures").populate("creator");
        if(!courses){ 
            return res.status(404).json({message:"No published courses found"})
        }
        return res.status(200).json(courses)
    } catch (error) {
        return res.status(500).json({message:`Failed to fetch courses ${error}`})
        
    }
}


// Get Courses by Creator
export const getCreatorCourses = async (req, res) =>{
    try {
        
        const userId = req.userId
        
        const courses = await Course.find({})
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
export const editCourse = async (req, res) =>{
    try {
        const {courseId} = req.params
        const {title, subTitle, description, category, level, isPublished, price} = req.body
        let thumbnail

        if(req.file){
            thumbnail = await uploadOnCloudinary(req.file.path)
        }
        let course = await Course.findById(courseId)

        if(!course) {
            return res.status(400).json({message:"Course is not found"})
        }
        const updateDate =  {
            title,
            subTitle,
            description,
            category,
            level,
            isPublished,
            price,
            thumbnail
        }

        course = await Course.findByIdAndUpdate(courseId, updateDate, {new:true})

        return res.status(200).json({message:"Course updated successfully", course})
    } catch (error) {
        return res.status(500).json({message:`failed to generate course ${error}`})  
    }
}


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

