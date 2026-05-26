import Lecture from "../models/lectureModel.js";

export const addComment = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const { message } = req.body;
    const userId = req.userId;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) return res.status(404).json({ message: "Lecture not found" });

    lecture.comments.push({ user: userId, message });
    await lecture.save();

    // Naya comment populate karke return karo
    await lecture.populate("comments.user", "name photoUrl");
    const newComment = lecture.comments[lecture.comments.length - 1];

    return res.status(201).json({ success: true, comment: newComment });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const removeComment = async (req, res) => {
  try {
    const { lectureId, commentId } = req.params;
    const userId = req.userId;

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) return res.status(404).json({ message: "Lecture not found" });

    const comment = lecture.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Sirf apna comment delete kar sakta hai
    if (comment.user.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    comment.deleteOne();
    await lecture.save();

    return res.status(200).json({ success: true, message: "Comment deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const getLectureComments = async (req, res) => {
  try {
    const { lectureId } = req.params;

    const lecture = await Lecture.findById(lectureId)
      .populate("comments.user", "name photoUrl role")
      .populate("comments.replies.user", "name photoUrl role")
      .select("comments");

    if (!lecture) return res.status(404).json({ message: "Lecture not found" });

    // Pinned comments upar aayein
    const sorted = [...lecture.comments].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return res.status(200).json({ success: true, comments: sorted });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const addReply = async (req, res) => {
  try {
    const { lectureId, commentId } = req.params;
    const { message } = req.body;
    const userId = req.userId;

    if (!message) return res.status(400).json({ message: "Message is required" });

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) return res.status(404).json({ message: "Lecture not found" });

    const comment = lecture.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    comment.replies.push({ user: userId, message });
    await lecture.save();

    await lecture.populate("comments.replies.user", "name photoUrl");
    const updatedComment = lecture.comments.id(commentId);

    return res.status(201).json({ success: true, comment: updatedComment });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const removeReply = async (req, res) => {
  try {
    const { lectureId, commentId, replyId } = req.params;
    const userId = req.userId;

    const lecture = await Lecture.findById(lectureId);
    const comment = lecture.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const reply = comment.replies.id(replyId);
    if (!reply) return res.status(404).json({ message: "Reply not found" });

    if (reply.user.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    reply.deleteOne();
    await lecture.save();

    return res.status(200).json({ success: true, message: "Reply deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const toggleCommentLike = async (req, res) => {
  try {
    const { lectureId, commentId } = req.params;
    const userId = req.userId;

    const lecture = await Lecture.findById(lectureId);
    const comment = lecture.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const alreadyLiked = comment.likes.includes(userId);

    if (alreadyLiked) {
      // Unlike
      comment.likes.pull(userId);
    } else {
      // Like
      comment.likes.push(userId);
    }

    await lecture.save();

    return res.status(200).json({
      success: true,
      liked: !alreadyLiked,
      likesCount: comment.likes.length,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const toggleReplyLike = async (req, res) => {
  try {
    const { lectureId, commentId, replyId } = req.params;
    const userId = req.userId;

    const lecture = await Lecture.findById(lectureId);
    const comment = lecture.comments.id(commentId);
    const reply = comment.replies.id(replyId);
    if (!reply) return res.status(404).json({ message: "Reply not found" });

    const alreadyLiked = reply.likes.includes(userId);

    alreadyLiked ? reply.likes.pull(userId) : reply.likes.push(userId);

    await lecture.save();

    return res.status(200).json({
      success: true,
      liked: !alreadyLiked,
      likesCount: reply.likes.length,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const togglePinComment = async (req, res) => {
  try {
    const { lectureId, commentId } = req.params;
    const userId = req.userId;

    const lecture = await Lecture.findById(lectureId);
    const comment = lecture.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Pehle sab unpin karo — ek hi pinned comment hoga
    lecture.comments.forEach(c => c.isPinned = false);

    // Toggle
    comment.isPinned = !comment.isPinned;
    await lecture.save();

    return res.status(200).json({
      success: true,
      isPinned: comment.isPinned,
      message: comment.isPinned ? "Comment pinned" : "Comment unpinned",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};