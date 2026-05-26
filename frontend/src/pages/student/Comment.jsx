import React, { useEffect, useState } from "react";

import {
  FaHeart,
  FaReply,
  FaTrash,
  FaPaperPlane,
  FaThumbtack,
} from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";

import {
  addComment,
  fetchLectureComments,
  deleteComment,
  addReply,
  toggleCommentLike,
  deleteReply,
  toggleReplyLike,
  togglePinComment,
} from "../../redux/slices/commentSlice";

import { ClipLoader } from "react-spinners";

const Comment = ({ lectureId }) => {
  const dispatch = useDispatch();

  const { comments, loading } = useSelector(
    (state) => state.comment
  );

  const { userData } = useSelector((state) => state.user);

  const [message, setMessage] = useState("");

  const [replyBox, setReplyBox] = useState(null);

  const [replyMessage, setReplyMessage] = useState("");

  // =========================
  // FETCH COMMENTS
  // =========================
  useEffect(() => {
    if (lectureId) {
      dispatch(fetchLectureComments(lectureId));
    }
  }, [lectureId]);

  // =========================
  // ADD COMMENT
  // =========================
  const handleAddComment = () => {
    if (!message.trim()) return;

    dispatch(
      addComment({
        lectureId,
        message,
      })
    );

    setMessage("");
  };

  // =========================
  // ADD REPLY
  // =========================
  const handleReply = (commentId) => {
    if (!replyMessage.trim()) return;

    dispatch(
      addReply({
        lectureId,
        commentId,
        message: replyMessage,
      })
    );

    setReplyMessage("");
    setReplyBox(null);
  };

  // =========================
  // CHECK IF USER LIKED
  // =========================
  const isLiked = (likes) => {
    if (!likes || !userData?._id) return false;
    return likes.includes(userData._id);
  };

  return (
    <div className="bg-white rounded-[22px] shadow-lg border border-gray-200 p-5 mt-8">

      {/* Heading */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-black">
          Discussion
        </h2>

        <span className="text-sm text-gray-500">
          {comments?.length} Comments
        </span>
      </div>

      {/* Add Comment */}
      <div className="mt-6 flex gap-3">

        <img
          src={userData?.photoUrl || "/default-avatar.png"}
          alt=""
          className="w-11 h-11 rounded-full object-cover"
        />

        <div className="flex-1">

          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your thoughts..."
            className="w-full border border-gray-300 rounded-xl p-4 outline-none resize-none focus:border-black"
          />

          <div className="flex justify-end mt-3">

            <button
              onClick={handleAddComment}
              className="bg-black text-white px-5 py-2 rounded-xl flex items-center gap-2 hover:opacity-90"
            >
              <FaPaperPlane />
              Comment
            </button>

          </div>
        </div>
      </div>

      {/* COMMENTS */}
      <div className="mt-8 space-y-6">

        {loading ? (
          <div className="flex justify-center py-10">
            <ClipLoader size={35} />
          </div>
        ) : comments?.length > 0 ? (
          comments.map((comment) => (

            <div
              key={comment._id}
              className={`border rounded-2xl p-4 ${comment.isPinned ? "border-yellow-400 bg-yellow-50" : "border-gray-200"}`}
            >

              {/* USER */}
              <div className="flex items-start justify-between">

                <div className="flex gap-3">

                  <img
                    src={comment?.user?.photoUrl || "/default-avatar.png"}
                    alt=""
                    className="w-12 h-12 rounded-full object-cover"
                  />

                  <div className="flex-1">

                    <div className="flex items-center gap-2">

                      <h3 className="font-semibold text-black">
                        {comment?.user?.name}
                      </h3>

                      {comment?.user?.role === "educator" && (
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                          Educator
                        </span>
                      )}

                      {comment.isPinned && (
                        <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full flex items-center gap-1">
                          <FaThumbtack className="text-xs" />
                          Pinned
                        </span>
                      )}

                    </div>

                    <p className="text-gray-600 mt-1">
                      {comment?.message}
                    </p>

                  </div>
                </div>

                {/* ACTIONS - DELETE & PIN */}
                <div className="flex items-center gap-2">

                  {/* PIN - Only Educator */}
                  {userData?.role === "educator" && (
                    <button
                      onClick={() =>
                        dispatch(
                          togglePinComment({
                            lectureId,
                            commentId: comment._id,
                          })
                        )
                      }
                      className={`p-2 rounded-lg ${comment.isPinned ? "text-yellow-600 bg-yellow-100" : "text-gray-400 hover:text-yellow-600 hover:bg-yellow-50"}`}
                      title={comment.isPinned ? "Unpin comment" : "Pin comment"}
                    >
                      <FaThumbtack />
                    </button>
                  )}

                  {/* DELETE - Only Owner */}
                  {userData?._id === comment?.user?._id && (
                    <button
                      onClick={() =>
                        dispatch(
                          deleteComment({
                            lectureId,
                            commentId: comment._id,
                          })
                        )
                      }
                      className="p-2 rounded-lg text-red-500 hover:bg-red-50"
                      title="Delete comment"
                    >
                      <FaTrash />
                    </button>
                  )}

                </div>
              </div>

              {/* ACTIONS - LIKE & REPLY */}
              <div className="flex items-center gap-5 mt-4 ml-14">

                {/* LIKE */}
                <button
                  onClick={() =>
                    dispatch(
                      toggleCommentLike({
                        lectureId,
                        commentId: comment._id,
                        userId: userData?._id,
                      })
                    )
                  }
                  className={`flex items-center gap-2 text-sm ${isLiked(comment?.likes) ? "text-red-500" : "text-gray-600 hover:text-red-500"}`}
                >
                  <FaHeart className={isLiked(comment?.likes) ? "fill-current" : ""} />

                  {comment?.likes?.length || 0}
                </button>

                {/* REPLY */}
                <button
                  onClick={() =>
                    setReplyBox(
                      replyBox === comment._id
                        ? null
                        : comment._id
                    )
                  }
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-black"
                >
                  <FaReply />
                  Reply
                </button>

              </div>

              {/* REPLY BOX */}
              {replyBox === comment._id && (

                <div className="mt-4 ml-14">

                  <textarea
                    rows={2}
                    value={replyMessage}
                    onChange={(e) =>
                      setReplyMessage(e.target.value)
                    }
                    placeholder="Write a reply..."
                    className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:border-black"
                  />

                  <div className="flex gap-2 mt-2">

                    <button
                      onClick={() =>
                        handleReply(comment._id)
                      }
                      className="bg-black text-white px-4 py-2 rounded-xl hover:opacity-90"
                    >
                      Reply
                    </button>

                    <button
                      onClick={() => {
                        setReplyBox(null);
                        setReplyMessage("");
                      }}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-300"
                    >
                      Cancel
                    </button>

                  </div>

                </div>
              )}

              {/* REPLIES */}
              {comment?.replies?.length > 0 && (

                <div className="mt-5 ml-14 space-y-4">

                  {comment.replies.map((reply) => (

                    <div
                      key={reply._id}
                      className="bg-gray-100 rounded-xl p-3"
                    >

                      <div className="flex items-start justify-between gap-3">

                        <div className="flex gap-3 flex-1">

                          <img
                            src={reply?.user?.photoUrl || "/default-avatar.png"}
                            alt=""
                            className="w-9 h-9 rounded-full object-cover"
                          />

                          <div className="flex-1">

                            <div className="flex items-center gap-2">

                              <h4 className="font-medium text-sm text-black">
                                {reply?.user?.name}
                              </h4>

                              {reply?.user?.role === "educator" && (
                                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                                  Educator
                                </span>
                              )}

                            </div>

                            <p className="text-gray-700 text-sm mt-1">
                              {reply?.message}
                            </p>

                            {/* REPLY ACTIONS */}
                            <div className="flex items-center gap-4 mt-2">

                              {/* LIKE REPLY */}
                              <button
                                onClick={() =>
                                  dispatch(
                                    toggleReplyLike({
                                      lectureId,
                                      commentId: comment._id,
                                      replyId: reply._id,
                                      userId: userData?._id,
                                    })
                                  )
                                }
                                className={`flex items-center gap-1 text-xs ${isLiked(reply?.likes) ? "text-red-500" : "text-gray-500 hover:text-red-500"}`}
                              >
                                <FaHeart className={isLiked(reply?.likes) ? "fill-current" : ""} />
                                {reply?.likes?.length || 0}
                              </button>

                              {/* DELETE REPLY - Only Owner */}
                              {userData?._id === reply?.user?._id && (
                                <button
                                  onClick={() =>
                                    dispatch(
                                      deleteReply({
                                        lectureId,
                                        commentId: comment._id,
                                        replyId: reply._id,
                                      })
                                    )
                                  }
                                  className="text-red-500 hover:text-red-600 text-xs"
                                  title="Delete reply"
                                >
                                  <FaTrash />
                                </button>
                              )}

                            </div>

                          </div>

                        </div>

                      </div>

                    </div>
                  ))}

                </div>
              )}

            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-500">
            No comments yet. Be the first to comment!
          </div>
        )}

      </div>
    </div>
  );
};

export default Comment;