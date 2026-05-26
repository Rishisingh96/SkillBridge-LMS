import express from 'express'
import { RazorPayOrder, VerifyPayment } from '../controller/orderController.js'
import isAuth from "../middleware/isAuth.js";

const paymentRouter = express.Router()

paymentRouter.post("/razorpay-order", isAuth, RazorPayOrder)
paymentRouter.post("/verifypayment", isAuth, VerifyPayment)

export default paymentRouter