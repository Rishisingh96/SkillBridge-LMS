import express from "express"
import { createReview, getReviews } from "../controller/reviewController.js"
import isAuth from "../middleware/isAuth.js"

const reviewRoter = express.Router()

reviewRoter.post("/createreview", isAuth, createReview)
reviewRoter.get("/getreview", getReviews)

export default reviewRoter