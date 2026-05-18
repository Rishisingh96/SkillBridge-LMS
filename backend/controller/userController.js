import uploadOnClodinary from "../config/cloudinary.js"
import User from "../model/userModel.js"

export const getCurrentUser = async (req, res) => {
    try{
        //-password likha hi hoga compala
        const user = await User.findById(req.userId).select("-password").populate("enrolledCourses")
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        return res.status(200).json(user)
    }catch(error){
        return res.status(500).json({message:`GetCurrentUser error ${error}`})
    }
}

// Update Profile data me se photo bhi update karna hai to uske liye cloudinary ka use karna hoga
export const updateProfile = async (req, res) =>{
    try {
        console.log("=== PROFILE UPDATE START ===")
        console.log("User ID:", req.userId)
        console.log("Request body:", req.body)
        console.log("Uploaded file:", req.file)
        
        const userId = req.userId
        const {description, name } = req.body

        let photoUrl
        
        if(req.file){
            console.log("Uploading image to cloudinary...")
            photoUrl = await uploadOnClodinary(req.file.path)
            console.log("Cloudinary URL:", photoUrl)
        }
        
        const updateData = {name, description}
        if(photoUrl){
            updateData.photoUrl = photoUrl
        }
        
        console.log("Update data:", updateData)
        
        const user = await User.findByIdAndUpdate(userId, updateData, {new: true})
        console.log("Updated user:", user)

         if(!user){
            console.log("User not found")
            return res.status(404).json({message:"User not found"})
        }
        
        console.log("=== PROFILE UPDATE SUCCESS ===")
        return res.status(200).json({user: user})
    } catch (error) {
        console.log("=== PROFILE UPDATE ERROR ===")
        console.log("Error:", error)
         return res.status(500).json({message:`UpdateProfile error ${error}`})
    }
}