
// Import Course model
import Course from "../model/courseModel.js"

// Create Course
export const crateCourse = async (req, res) =>{
    try{
        const {title, category} = req.body

        // Validation
        if(!title || !category ){
            return res.status(400).json({message:"Title and Category are required"})
        }

        // Create Course
        const course = await Course.create({
            title,
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
        const courses = await Course.find({isPublished:true})
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
        const courses = await Course.find({creator:userId})
        if(!courses){
            return res.status(400).json({message:"Courses is not found"})
        }
        return res.status(200).json(courses)

    } catch (error) {
        return res.status(500).json({message:`Failed to fetch courses ${error}`})
    }
}

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
        const update
    } catch (error) {
        
    }
}