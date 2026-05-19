import Course from "../model/courseModel.js"
import Review from "../model/reviewSchema.js"

export const createReview = async (req, res) => {
    try {

        const { rating, comment, courseId } = req.body
        const userId = req.userId

        const course = await Course.findById(courseId)

        if (!course) {
            return res.status(400).json({
                message: "Course not found"
            })
        }

        const alreadyReviewed = await Review.findOne({
            course: courseId,
            user: userId
        })

        if (alreadyReviewed) {
            return res.status(400).json({
                message: "You already reviewed this course"
            })
        }

        const review = new Review({
            course: courseId,
            user: userId,
            rating,
            comment
        })

        await review.save()

        course.reviews.push(review._id)

        await course.save()

        return res.status(201).json(review)

    } catch (error) {

        return res.status(500).json({
            message: `Failed to create review ${error}`
        })

    }
}


// Get Reviews
export const getReviews = async (req, res) => {

    try {

        const review = await Review.find({})
            .populate("user", "name photoUrl description")
            .populate("course", "title")
            .sort({ reviewedAt: -1 })

        return res.status(200).json({
            success: true,
            review
        })

    } catch (error) {

        console.log("GET REVIEW ERROR:", error)

        return res.status(500).json({
            success: false,
            message: error.message
        })

    }

}