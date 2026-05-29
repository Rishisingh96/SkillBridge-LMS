import React, { useEffect, useMemo, useState } from "react";
import {
  FaHeart,
  FaReply,
  FaTrash,
  FaPaperPlane,
  FaThumbtack,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

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

const Comment = ({ lectureId }) => {
  const dispatch = useDispatch();

  const { comments, loading } = useSelector(
    (state) => state.comment
  );

  const { userData } = useSelector((state) => state.user);

  const [message, setMessage] = useState("");
  const [replyMessage, setReplyMessage] =
    useState("");

  const [replyBox, setReplyBox] = useState(null);

  const [showReplies, setShowReplies] =
    useState({});

  const [showAllComments, setShowAllComments] =
    useState(false);

  // ==================================================
  // FETCH COMMENTS
  // ==================================================

  useEffect(() => {
    if (lectureId) {
      dispatch(fetchLectureComments(lectureId));
    }
  }, [lectureId, dispatch]);

  // ==================================================
  // SHOW ONLY 1 COMMENT
  // ==================================================

  const visibleComments = useMemo(() => {
    return showAllComments
      ? comments
      : comments?.slice(0, 1);
  }, [comments, showAllComments]);

  // ==================================================
  // ADD COMMENT
  // ==================================================

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

  // ==================================================
  // ADD REPLY
  // ==================================================

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

  // ==================================================
  // LIKE CHECK
  // ==================================================

  const isLiked = (likes) => {
    if (!likes || !userData?._id) return false;

    return likes.includes(userData._id);
  };

  return (
    <div className="w-full rounded-3xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 overflow-hidden">

      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div className="p-5 border-b border-zinc-200 dark:border-white/10 flex items-center justify-between">

        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Discussion
          </h2>

          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Ask questions & interact with students
          </p>
        </div>

        <div className="px-3 py-2 rounded-xl bg-zinc-100 dark:bg-white/5 text-sm text-zinc-600 dark:text-zinc-300">
          {comments?.length || 0} Comments
        </div>

      </div>

      {/* ================================================== */}
      {/* ADD COMMENT */}
      {/* ================================================== */}

      <div className="p-5 border-b border-zinc-200 dark:border-white/10">

        <div className="flex gap-3">

          <img
            src={
              userData?.photoUrl ||
              "/default-avatar.png"
            }
            alt=""
            className="w-11 h-11 rounded-xl object-cover"
          />

          <div className="flex-1">

            <textarea
              rows={3}
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              placeholder="Write a comment..."
              className="
                w-full
                rounded-2xl
                border
                border-zinc-200
                dark:border-white/10
                bg-zinc-50
                dark:bg-zinc-950
                p-4
                text-zinc-800
                dark:text-white
                placeholder:text-zinc-400
                outline-none
                resize-none
                focus:border-violet-500
              "
            />

            <div className="flex justify-end mt-4">

              <button
                onClick={handleAddComment}
                className="
                  px-5 py-3 rounded-xl
                  bg-violet-600 hover:bg-violet-500
                  text-white font-medium
                  flex items-center gap-2
                  transition-all
                "
              >
                <FaPaperPlane />

                Comment
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* ================================================== */}
      {/* COMMENTS */}
      {/* ================================================== */}

      <div className="p-5 space-y-5">

        {loading ? (

          <div className="flex justify-center py-10">
            <ClipLoader size={30} color="#7c3aed" />
          </div>

        ) : visibleComments?.length > 0 ? (

          <>
            {visibleComments.map((comment) => (

              <motion.div
                key={comment._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`
                  rounded-2xl border p-4
                  ${
                    comment.isPinned
                      ? "border-yellow-500/30 bg-yellow-500/5"
                      : "border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950"
                  }
                `}
              >

                {/* TOP */}

                <div className="flex justify-between gap-4">

                  <div className="flex gap-3 flex-1">

                    <img
                      src={
                        comment?.user?.photoUrl ||
                        "/default-avatar.png"
                      }
                      alt=""
                      className="w-12 h-12 rounded-xl object-cover"
                    />

                    <div className="flex-1">

                      {/* USER */}

                      <div className="flex items-center gap-2 flex-wrap">

                        <h3 className="font-semibold text-zinc-900 dark:text-white">
                          {comment?.user?.name}
                        </h3>

                        {comment?.user?.role ===
                          "educator" && (
                          <span className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs">
                            Educator
                          </span>
                        )}

                        {comment.isPinned && (
                          <span className="px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-xs flex items-center gap-1">
                            <FaThumbtack />
                            Pinned
                          </span>
                        )}

                      </div>

                      {/* MESSAGE */}

                      <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                        {comment?.message}
                      </p>

                      {/* ACTIONS */}

                      <div className="flex items-center gap-5 mt-4">

                        {/* LIKE */}

                        <button
                          onClick={() =>
                            dispatch(
                              toggleCommentLike({
                                lectureId,
                                commentId:
                                  comment._id,
                                userId:
                                  userData?._id,
                              })
                            )
                          }
                          className={`
                            flex items-center gap-2 text-sm transition-all
                            ${
                              isLiked(comment?.likes)
                                ? "text-red-500"
                                : "text-zinc-500 hover:text-red-500"
                            }
                          `}
                        >
                          <FaHeart
                            className={
                              isLiked(comment?.likes)
                                ? "fill-current"
                                : ""
                            }
                          />

                          {comment?.likes?.length || 0}
                        </button>

                        {/* REPLY */}

                        <button
                          onClick={() =>
                            setReplyBox(
                              replyBox ===
                                comment._id
                                ? null
                                : comment._id
                            )
                          }
                          className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all"
                        >
                          <FaReply />
                          Reply
                        </button>

                        {/* TOGGLE REPLIES */}

                        {comment?.replies?.length >
                          0 && (
                          <button
                            onClick={() =>
                              setShowReplies(
                                (prev) => ({
                                  ...prev,
                                  [comment._id]:
                                    !prev[
                                      comment._id
                                    ],
                                })
                              )
                            }
                            className="flex items-center gap-2 text-sm text-violet-500"
                          >
                            {showReplies[
                              comment._id
                            ] ? (
                              <>
                                <FaChevronUp />
                                Hide Replies
                              </>
                            ) : (
                              <>
                                <FaChevronDown />
                                View Replies (
                                {
                                  comment.replies
                                    .length
                                }
                                )
                              </>
                            )}
                          </button>
                        )}

                      </div>

                    </div>

                  </div>

                  {/* RIGHT ACTIONS */}

                  <div className="flex gap-2">

                    {userData?.role ===
                      "educator" && (
                      <button
                        onClick={() =>
                          dispatch(
                            togglePinComment({
                              lectureId,
                              commentId:
                                comment._id,
                            })
                          )
                        }
                        className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center text-zinc-500 hover:text-yellow-500"
                      >
                        <FaThumbtack />
                      </button>
                    )}

                    {userData?._id ===
                      comment?.user?._id && (
                      <button
                        onClick={() =>
                          dispatch(
                            deleteComment({
                              lectureId,
                              commentId:
                                comment._id,
                            })
                          )
                        }
                        className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500"
                      >
                        <FaTrash />
                      </button>
                    )}

                  </div>

                </div>

                {/* ================================================== */}
                {/* REPLY BOX */}
                {/* ================================================== */}

                <AnimatePresence>

                  {replyBox === comment._id && (

                    <motion.div
                      initial={{
                        opacity: 0,
                        height: 0,
                      }}
                      animate={{
                        opacity: 1,
                        height: "auto",
                      }}
                      exit={{
                        opacity: 0,
                        height: 0,
                      }}
                      className="overflow-hidden"
                    >

                      <div className="mt-5 ml-0 md:ml-16">

                        <textarea
                          rows={2}
                          value={replyMessage}
                          onChange={(e) =>
                            setReplyMessage(
                              e.target.value
                            )
                          }
                          placeholder="Write a reply..."
                          className="
                            w-full
                            rounded-2xl
                            border
                            border-zinc-200
                            dark:border-white/10
                            bg-white
                            dark:bg-zinc-900
                            p-4
                            text-zinc-800
                            dark:text-white
                            outline-none
                          "
                        />

                        <div className="flex gap-3 mt-4">

                          <button
                            onClick={() =>
                              handleReply(
                                comment._id
                              )
                            }
                            className="px-5 py-2 rounded-xl bg-violet-600 text-white"
                          >
                            Reply
                          </button>

                          <button
                            onClick={() => {
                              setReplyBox(
                                null
                              );
                              setReplyMessage(
                                ""
                              );
                            }}
                            className="px-5 py-2 rounded-xl bg-zinc-200 dark:bg-white/10 text-zinc-700 dark:text-zinc-300"
                          >
                            Cancel
                          </button>

                        </div>

                      </div>

                    </motion.div>
                  )}

                </AnimatePresence>

                {/* ================================================== */}
                {/* REPLIES */}
                {/* ================================================== */}

                <AnimatePresence>

                  {showReplies[comment._id] && (

                    <motion.div
                      initial={{
                        opacity: 0,
                        height: 0,
                      }}
                      animate={{
                        opacity: 1,
                        height: "auto",
                      }}
                      exit={{
                        opacity: 0,
                        height: 0,
                      }}
                      className="overflow-hidden"
                    >

                      <div className="mt-5 ml-0 md:ml-16 space-y-3">

                        {comment.replies.map(
                          (reply) => (

                            <div
                              key={reply._id}
                              className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 p-4"
                            >

                              <div className="flex justify-between gap-4">

                                <div className="flex gap-3 flex-1">

                                  <img
                                    src={
                                      reply?.user
                                        ?.photoUrl ||
                                      "/default-avatar.png"
                                    }
                                    alt=""
                                    className="w-10 h-10 rounded-xl object-cover"
                                  />

                                  <div className="flex-1">

                                    <h4 className="font-medium text-sm text-zinc-900 dark:text-white">
                                      {
                                        reply?.user
                                          ?.name
                                      }
                                    </h4>

                                    <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-2 leading-6">
                                      {
                                        reply?.message
                                      }
                                    </p>

                                  </div>

                                </div>

                                {userData?._id ===
                                  reply?.user
                                    ?._id && (
                                  <button
                                    onClick={() =>
                                      dispatch(
                                        deleteReply(
                                          {
                                            lectureId,
                                            commentId:
                                              comment._id,
                                            replyId:
                                              reply._id,
                                          }
                                        )
                                      )
                                    }
                                    className="text-red-500"
                                  >
                                    <FaTrash />
                                  </button>
                                )}

                              </div>

                            </div>
                          )
                        )}

                      </div>

                    </motion.div>
                  )}

                </AnimatePresence>

              </motion.div>
            ))}

            {/* ================================================== */}
            {/* VIEW MORE COMMENTS */}
            {/* ================================================== */}

            {comments?.length > 1 && (

              <div className="flex justify-center">

                <button
                  onClick={() =>
                    setShowAllComments(
                      !showAllComments
                    )
                  }
                  className="px-5 py-3 rounded-xl bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 flex items-center gap-2"
                >
                  {showAllComments ? (
                    <>
                      <FaChevronUp />
                      Show Less
                    </>
                  ) : (
                    <>
                      <FaChevronDown />
                      View All (
                      {comments.length})
                    </>
                  )}
                </button>

              </div>
            )}

          </>
        ) : (

          <div className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950 p-10 text-center">

            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">
              No Comments Yet
            </h3>

            <p className="text-zinc-500 dark:text-zinc-400 mt-3">
              Be the first student to start the discussion.
            </p>

          </div>
        )}

      </div>

    </div>
  );
};

export default Comment;