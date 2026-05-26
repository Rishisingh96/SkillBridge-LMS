import express from 'express'
import dotenv from 'dotenv'
import connectDb from './config/connectDB.js'
import cookieParser from 'cookie-parser'
import authRouter from './routes/authRoute.js'
import cors from 'cors'
import userRouter from './routes/userRoute.js'
import courseRoute from './routes/courseRoute.js'
import paymentRouter from './routes/paymentRoute.js'
import reviewRoter from './routes/reviewRoute.js'

// ✅ IMPORTANT MODEL IMPORTS
import "./models/moduleModel.js";
import "./models/lectureModel.js";
import errorHandler from './middleware/errorHandler.js'

dotenv.config()

const port = process.env.PORT 

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(errorHandler);

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/course", courseRoute)
app.use("/api/order",paymentRouter)
app.use("/api/review", reviewRoter)


app.get("/",(req, res)=>{
    res.send("Hello from Server")
})

app.listen(port, ()=>{
    console.log("Server Started")
    connectDb()
})