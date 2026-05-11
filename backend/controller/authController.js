import User from "../model/userModel.js"
import validator from "validator"
import bcrypt from "bcryptjs"
import genToken from "../config/token.js"
import sendMail from "../config/sendMail.js"


//singup
export const signUP = async (req, res) =>{
    try{
        const {name, email, password, role} = req.body

        //Before find user
        let existUser = await User.findOne({email})
        if(existUser){
            return res.status(400).json({message:"User is already exist"})
        }
        if(!validator.isEmail(email)){
            return res.status(400).json({message:"Enter valid email"})
        }

          // check password
        if(password.length < 8){
            return res.status(400).json({message:"Enter Strong password"})
        }

        // bcrypt passwor 
        let hashPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            name, 
            email, 
            password:hashPassword,
            role
        })
      
        const token = await genToken(user._id)

        res.cookie("token", token, {
            httpOnly:true, 
            secure:false,  // when we deploye than chage true
            sameSite:"Strict",  
            maxAge: 7*24*60*60*1000 // chage in milisecont
        })

        return res.status(201).json(user)


    }catch(error){
        return res.status(500).json({message:`SignUp error ${error}`})

    }
}

///login 
export const login = async (req, res) =>{
    try{
        const {email, password} = req.body
        //find user
        let user = await User.findOne({email})

        // user not found
        if(!user){
            return res.status(404).json({message:"User not found"})
        }

        //compare user same of not use bcrypt
        let isMatch = await bcrypt.compare(password, user.password)
        // check password
        if(!isMatch){
            return res.status(400).json({message:"Incorract password"})
        }
        const token = await genToken(user._id)

        res.cookie("token", token, {
            httpOnly: true, 
            secure:false, 
            sameSite: "Strict", 
            maxAge: 7*24*60*60*1000
        })
        return res.status(200).json(user)
    } catch(error){
        return res.status(500).json({message:`Login error ${error}`})
    }
}

// for logOut
export const logOut = async (req, res) => {
    try { 
        await res.clearCookie("token");
        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        return res.status(500).json({ message: `Logout error: ${error.message}` });
    }
};


// send otp
export const sendOtp = async (req, res) => {
    try {
        const {email} = req.body
        //find user
        let user = await User.findOne({email})
        // user not found
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        // generate otp
        const otp = Math.floor(100000 + Math.random() * 900000).toString()

        user.resetOtp = otp, 
        user.otpExpires = Date.now() + 5*60*1000, 
        user.isOtpVerifed = false
        // save otp
        await user.save()

        // send otp
        await sendMail(email, otp)
        return res.status(200).json({message:"OTP sent successfully"})
    } catch (error) {
        return res.status(500).json({message:`Send OTP error ${error}`})
    }
}

// verify otp
export const varifyOTP = async (req, res)=>{
    try {
        const { email, otp} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        if(user.resetOtp !== otp){
            return res.status(400).json({message:"Invalid OTP"})
        }
        if(user.otpExpires < Date.now()){
            return res.status(400).json({message:"OTP expired"})
        }
        user.isOtpVerifed = true
        user.resetOtp = undefined, 
        user.otpExpires = undefined,
       
        await user.save()
        return res.status(200).json({message:"OTP verified successfully"})
    } catch (error) {
        return res.status(500).json({message:`Verify OTP error ${error}`})
    }
}

// Reset password 
export const resetPassword = async (req, res) =>{
    try {
        const {email, password} = req.body
        const user = await User.findOne({email})
        if(!user || !user.isOtpVerifed){
            return res.status(404).json({message:"OTP verification is required"})
        }
        const hashPassword = await bcrypt.hash(password, 10)
        user.password = hashPassword,
        user.isOtpVerifed = false

        await user.save()
        return res.status(200).json({message:"Password reset successfully"})
    } catch (error) {
        return res.status(500).json({message:`Reset password error ${error}`})
    }
}


//Google Singup 

export const googleAuth = async (req, res) =>{
        try {
            const {name, email, role} = req.body
            
            let user = await User.findOne({email})
            
            if(!user){
                // Create new user with role, default to 'student' if not provided
                user = await User.create({
                    name, 
                    email , 
                    role: role || "student",
                })
            }

            let token = await genToken(user._id)

            res.cookie("token", token, {
                httpOnly:true, 
                secure:false,  // when we deploye than chage true
                sameSite:"Strict",  
                maxAge: 7*24*60*60*1000 // chage in milisecont
            })

            return res.status(201).json(user)
            
        } catch (error) {
            return res.status(500).json({message: `Google auth error: ${error.message}`})
        }
}