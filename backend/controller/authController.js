import User from "../models/userModel.js"
import validator from "validator"
import bcrypt from "bcryptjs"
import genToken from "../config/token.js"
import sendMail, { sendWelcomeEmail } from "../config/sendMail.js"
import crypto from "crypto"
import { notifyNewUserRegistration } from "../helpers/notificationHelpers.js";


//Signup
export const signUP = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Enter valid email" });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    // OTP generate karo
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // ✅ User banao but isVerified false rakho
    const user = await User.create({
      name,
      email,
      password: hashPassword,
      role: role || "student",
      // role: "student",
      isVerified: false,        // ✅
      resetOtp: otp,            // ✅ OTP save karo
      otpExpires: Date.now() + 5 * 60 * 1000, // ✅ 5 min
    });

    // ✅ OTP email pe bhejo
    await sendMail(email, otp);

    // ✅ Token mat do abhi — pehle verify kare
    return res.status(201).json({
      success: true,
      message: "OTP sent to your email. Please verify to continue.",
      email, // frontend ko email chahiye verify ke liye
    });

  } catch (error) {
    return res.status(500).json({ message: `SignUp error: ${error.message}` });
  }
};

//login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Verified check
    if (!user.isVerified) {
      // OTP dobara bhejo
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      user.resetOtp = otp;
      user.otpExpires = Date.now() + 5 * 60 * 1000;
      await user.save();
      await sendMail(email, otp);

      return res.status(403).json({
        message: "Email not verified. New OTP sent to your email.",
        email,
        isVerified: false,
      });
    }

    // ✅ Banned check
    if (user.isBanned) {
      return res.status(403).json({ message: "Your account has been banned" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Generate new session
    const token = await genToken(user._id);
    const userAgent = req.headers['user-agent'] || 'Unknown Device';
    const currentSessionId = crypto.randomBytes(32).toString('hex');
    const sessionExpiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

    // Update user session info
    user.currentSessionId = currentSessionId;
    user.sessionDevice = userAgent.substring(0, 100); // Limit device string length
    user.sessionExpiresAt = sessionExpiresAt;
    user.lastLogin = Date.now();
    await user.save();

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const safeUser = await User.findById(user._id)
.select("-password");

return res.status(200).json({
  success: true,
  user: safeUser,
  token,
  sessionId: currentSessionId,
});

  } catch (error) {
    return res.status(500).json({ message: `Login error: ${error.message}` });
  }
};


// for logOut
export const logOut = async (req, res) => {
    try {
        // Clear session data from user
        if (req.user) {
            await User.findByIdAndUpdate(req.user._id, {
                currentSessionId: null,
                sessionDevice: null,
                sessionExpiresAt: null
            });
        }
        
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

//verigyOTP
export const varifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.resetOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // ✅ Verify karo
    user.isVerified = true;
    user.isOtpVerifed = true;
    user.resetOtp = undefined;
    user.otpExpires = undefined;
    
    // Update session info
    const userAgent = req.headers['user-agent'] || 'Unknown Device';
    const currentSessionId = crypto.randomBytes(32).toString('hex');
    const sessionExpiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
    user.currentSessionId = currentSessionId;
    user.sessionDevice = userAgent.substring(0, 100);
    user.sessionExpiresAt = sessionExpiresAt;
    user.lastLogin = Date.now();
    await user.save();

    // Add this after user.save() in varifyOTP
    await notifyNewUserRegistration({
      userName: user.name,
      userPhone: user.phone,
      userEmail: user.email,
      userRole: user.role,
    });

    // ✅ Send welcome email after successful verification
    await sendWelcomeEmail(user.email, user.name);

    // ✅ Ab token do — account verified ho gaya
    const token = await genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user,
      token,
      sessionId: currentSessionId,
    });

  } catch (error) {
    return res.status(500).json({ message: `Verify OTP error: ${error.message}` });
  }
};

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
            const {name, email, photoUrl, role} = req.body
            
            let user = await User.findOne({email})
            
            if(!user){
                // Create new user with role, default to 'student' if not provided
                user = await User.create({
                    name, 
                    email , 
                    photoUrl,
                    role: role || "student",
                    isVerified: true, // Google users are auto-verified
                })
                
                // ✅ Send welcome email for Google signup
                await sendWelcomeEmail(user.email, user.name);

                // After line 276 (after sendWelcomeEmail for new users)
if (!user.isVerified) { // Only for new users
  await notifyNewUserRegistration({
    userName: user.name,
    userPhone: user.phone,
    userEmail: user.email,
    userRole: user.role,
  });
}
            } else {
                // Update existing user with Google photo if not present
                if(!user.photoUrl && photoUrl){
                    user.photoUrl = photoUrl
                    await user.save()
                }
            }

            // Update session info
            const userAgent = req.headers['user-agent'] || 'Unknown Device';
            const currentSessionId = crypto.randomBytes(32).toString('hex');
            const sessionExpiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
            user.currentSessionId = currentSessionId;
            user.sessionDevice = userAgent.substring(0, 100);
            user.sessionExpiresAt = sessionExpiresAt;
            user.lastLogin = Date.now();
            await user.save();

            let token = await genToken(user._id)

            res.cookie("token", token, {
                httpOnly:true, 
                secure: process.env.NODE_ENV === "production",  // when we deploye than chage true
                sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
                maxAge: 7*24*60*60*1000 // chage in milisecont
            })

            return res.status(201).json({
                user: user,
                token: token,
                sessionId: currentSessionId,
            })
            
        } catch (error) {
            return res.status(500).json({message: `Google auth error: ${error.message}`})
        }
}

// Clear Session (for users stuck with stale sessions)
export const clearSession = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Clear session data
        user.currentSessionId = null;
        user.sessionDevice = null;
        user.sessionExpiresAt = null;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Session cleared successfully. You can now login again."
        });
    } catch (error) {
        return res.status(500).json({ message: `Clear session error: ${error.message}` });
    }
};


