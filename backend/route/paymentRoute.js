import express from 'express'
import { RazorPayOrder, VerifyPayment } from '../controller/orderController.js'

const paymentRouter = express.Router()

paymentRouter.post("/razorpay-order", RazorPayOrder)
paymentRouter.post("/verifypayment", VerifyPayment)

export default paymentRouter