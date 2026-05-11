import express from "express"
import { googleAuth, login, logOut, resetPassword, sendOtp, signUP, varifyOTP } from "../controller/authController.js"

const authRouter = express.Router()

authRouter.post("/signup", signUP)
authRouter.post("/login", login)
authRouter.get("/logout", logOut)
authRouter.post("/sendotp",sendOtp)
authRouter.post("/verifyotp",varifyOTP)
authRouter.post("/resetpassword",resetPassword)
authRouter.post("/googleauth",googleAuth)


export default authRouter;