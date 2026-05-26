import Lecture from "../models/lectureModel.js";

export const addComment = async (req, res) => {
  try {
    console.log("=== ADD COMMENT API CALLED ===");
    const { lectureId } = req.params;
    const { message } = req.body;
    const userId = req.userId;
    console.log("Lecture ID:", lectureId);
    console.log("User ID:", userId);
    console.log("Message:", message);

    if (!message) {
      console.log("Message is required");
      return res.status(400).json({ message: "Message is required" });
    }

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) return res.status(404).json({ message: "Lecture not found" });

    lecture.comments.push({ user: userId, message });
    await lecture.save();

    // Naya comment populate karke return karo
    await lecture.populate("comments.user", "name photoUrl");
    const newComment = lecture.comments[lecture.comments.length - 1];
    console.log("Comment added successfully:", newComment._id);

    return res.status(201).json({ success: true, comment: newComment });
  } catch (error) {
    console.log("Error in addComment:", error);
    return res.status(500).json({ message: error.message });
  }
};


export const removeComment = async (req, res) => {
  try {
    console.log("=== DELETE COMMENT API CALLED ===");
    const { lectureId, commentId } = req.params;
    const userId = req.userId;
    console.log("Lecture ID:", lectureId);
    console.log("Comment ID:", commentId);
    console.log("User ID from req.userId:", userId);
    console.log("User ID type:", typeof userId);

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) return res.status(404).json({ message: "Lecture not found" });

    const comment = lecture.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    console.log("Comment found:", comment);
    console.log("Comment user ID:", comment.user);
    console.log("Comment user ID type:", typeof comment.user);
    console.log("Comment user.toString():", comment.user.toString());

    // Sirf apna comment delete kar sakta hai
    if (comment.user.toString() !== userId.toString()) {
      console.log("AUTHORIZATION FAILED: User IDs don't match");
      console.log("comment.user.toString():", comment.user.toString());
      console.log("userId.toString():", userId.toString());
      return res.status(403).json({ message: "Not authorized" });
    }

    console.log("Authorization successful, deleting comment...");
    comment.deleteOne();
    await lecture.save();

    console.log("Comment deleted successfully");
    return res.status(200).json({ success: true, message: "Comment deleted" });
  } catch (error) {
    console.log("Error in removeComment:", error);
    return res.status(500).json({ message: error.message });
  }
};


export const getLectureComments = async (req, res) => {
  try {
    console.log("=== GET LECTURE COMMENTS API CALLED ===");
    const { lectureId } = req.params;
    console.log("Lecture ID:", lectureId);

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

    console.log("Comments fetched:", sorted.length);
    return res.status(200).json({ success: true, comments: sorted });
  } catch (error) {
    console.log("Error in getLectureComments:", error);
    return res.status(500).json({ message: error.message });
  }
};


export const addReply = async (req, res) => {
  try {
    console.log("=== ADD REPLY API CALLED ===");
    const { lectureId, commentId } = req.params;
    const { message } = req.body;
    const userId = req.userId;
    console.log("Lecture ID:", lectureId);
    console.log("Comment ID:", commentId);
    console.log("User ID:", userId);
    console.log("Reply message:", message);

    if (!message) return res.status(400).json({ message: "Message is required" });

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) return res.status(404).json({ message: "Lecture not found" });

    const comment = lecture.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    comment.replies.push({ user: userId, message });
    await lecture.save();

    await lecture.populate("comments.replies.user", "name photoUrl");
    const updatedComment = lecture.comments.id(commentId);
    console.log("Reply added successfully");

    return res.status(201).json({ success: true, comment: updatedComment });
  } catch (error) {
    console.log("Error in addReply:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const removeReply = async (req, res) => {
  try {
    console.log("=== DELETE REPLY API CALLED ===");
    const { lectureId, commentId, replyId } = req.params;
    const userId = req.userId;
    console.log("Lecture ID:", lectureId);
    console.log("Comment ID:", commentId);
    console.log("Reply ID:", replyId);
    console.log("User ID:", userId);

    const lecture = await Lecture.findById(lectureId);
    const comment = lecture.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const reply = comment.replies.id(replyId);
    if (!reply) return res.status(404).json({ message: "Reply not found" });

    if (reply.user.toString() !== userId.toString()) {
      console.log("AUTHORIZATION FAILED: User IDs don't match");
      console.log("reply.user.toString():", reply.user.toString());
      console.log("userId.toString():", userId.toString());
      return res.status(403).json({ message: "Not authorized" });
    }

    reply.deleteOne();
    await lecture.save();
    console.log("Reply deleted successfully");

    return res.status(200).json({ success: true, message: "Reply deleted" });
  } catch (error) {
    console.log("Error in removeReply:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const toggleCommentLike = async (req, res) => {
  try {
    console.log("=== TOGGLE COMMENT LIKE API CALLED ===");
    const { lectureId, commentId } = req.params;
    const userId = req.userId;
    console.log("Lecture ID:", lectureId);
    console.log("Comment ID:", commentId);
    console.log("User ID:", userId);

    const lecture = await Lecture.findById(lectureId);
    const comment = lecture.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const alreadyLiked = comment.likes.includes(userId);
    console.log("Already liked:", alreadyLiked);

    if (alreadyLiked) {
      // Unlike
      comment.likes.pull(userId);
      console.log("Comment unliked");
    } else {
      // Like
      comment.likes.push(userId);
      console.log("Comment liked");
    }

    await lecture.save();

    return res.status(200).json({
      success: true,
      liked: !alreadyLiked,
      likesCount: comment.likes.length,
    });
  } catch (error) {
    console.log("Error in toggleCommentLike:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const toggleReplyLike = async (req, res) => {
  try {
    console.log("=== TOGGLE REPLY LIKE API CALLED ===");
    const { lectureId, commentId, replyId } = req.params;
    const userId = req.userId;
    console.log("Lecture ID:", lectureId);
    console.log("Comment ID:", commentId);
    console.log("Reply ID:", replyId);
    console.log("User ID:", userId);

    const lecture = await Lecture.findById(lectureId);
    const comment = lecture.comments.id(commentId);
    const reply = comment.replies.id(replyId);
    if (!reply) return res.status(404).json({ message: "Reply not found" });

    const alreadyLiked = reply.likes.includes(userId);
    console.log("Already liked:", alreadyLiked);

    alreadyLiked ? reply.likes.pull(userId) : reply.likes.push(userId);
    console.log(alreadyLiked ? "Reply unliked" : "Reply liked");

    await lecture.save();

    return res.status(200).json({
      success: true,
      liked: !alreadyLiked,
      likesCount: reply.likes.length,
    });
  } catch (error) {
    console.log("Error in toggleReplyLike:", error);
    return res.status(500).json({ message: error.message });
  }
};


export const togglePinComment = async (req, res) => {
  try {
    console.log("=== TOGGLE PIN COMMENT API CALLED ===");
    const { lectureId, commentId } = req.params;
    const userId = req.userId;
    console.log("Lecture ID:", lectureId);
    console.log("Comment ID:", commentId);
    console.log("User ID:", userId);

    const lecture = await Lecture.findById(lectureId);
    const comment = lecture.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Pehle sab unpin karo — ek hi pinned comment hoga
    lecture.comments.forEach(c => c.isPinned = false);

    // Toggle
    comment.isPinned = !comment.isPinned;
    await lecture.save();
    console.log("Comment pin status toggled:", comment.isPinned);

    return res.status(200).json({
      success: true,
      isPinned: comment.isPinned,
      message: comment.isPinned ? "Comment pinned" : "Comment unpinned",
    });
  } catch (error) {
    console.log("Error in togglePinComment:", error);
    return res.status(500).json({ message: error.message });
  }
};