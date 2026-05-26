import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { fetchRecentEnrollments } from "../../redux/slices/dashboardSlice";
import { MdClose, MdEmail, MdPhone, MdPerson } from "react-icons/md";

const RecentEnrollments = () => {
  const dispatch = useDispatch();
  const { recentEnrollments } = useSelector((state) => state.dashboard);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    dispatch(fetchRecentEnrollments());
  }, [dispatch]);

  const list = recentEnrollments || [];
  const displayed = showAll ? list : list.slice(0, 5);

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <>
      <div className="bg-white rounded-[28px] shadow-lg border border-gray-200 overflow-hidden">

        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Recent Enrollments</h2>
            <p className="text-sm text-gray-500 mt-1">Latest students joined</p>
          </div>
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm font-semibold text-black hover:underline"
          >
            {showAll ? "Show Less" : "View All"}
          </button>
        </div>

        {/* List */}
        <div className="divide-y divide-gray-50">
          {displayed.length === 0 ? (
            <p className="text-center py-10 text-gray-400 text-sm">
              No enrollments yet
            </p>
          ) : (
            displayed.map((enrollment, index) => (
              <motion.div
                key={enrollment._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 flex items-center gap-4 hover:bg-gray-50 transition cursor-pointer"
                onClick={() => setSelectedUser(enrollment)}
              >
                {/* Avatar */}
                {enrollment.user?.photoUrl ? (
                  <img
                    src={enrollment.user.photoUrl}
                    className="w-11 h-11 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg">
                    {enrollment.user?.name?.slice(0, 1).toUpperCase()}
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">
                    {enrollment.user?.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {enrollment.course?.title}
                  </p>
                </div>

                {/* Time */}
                <div className="text-right">
                  <p className="text-xs text-gray-400">
                    {timeAgo(enrollment.createdAt)}
                  </p>
                  <p className="text-xs font-semibold text-green-600 mt-1">
                    ₹{enrollment.pricePaid || "Free"}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* ── User Detail Modal ─────────────────── */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4"
            onClick={() => setSelectedUser(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[28px] shadow-2xl w-full max-w-md overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-black p-6 relative">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition"
                >
                  <MdClose className="text-white text-lg" />
                </button>

                {/* Avatar */}
                <div className="flex flex-col items-center">
                  {selectedUser.user?.photoUrl ? (
                    <img
                      src={selectedUser.user.photoUrl}
                      className="w-20 h-20 rounded-full object-cover border-4 border-white"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center text-3xl font-bold">
                      {selectedUser.user?.name?.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <h2 className="text-white text-xl font-bold mt-3">
                    {selectedUser.user?.name}
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">
                    {selectedUser.user?.role || "Student"}
                  </p>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">

                {/* Email */}
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl">
                  <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                    <MdEmail className="text-white text-lg" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {selectedUser.user?.email || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl">
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                    <MdPhone className="text-white text-lg" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {selectedUser.user?.phone || "Not provided"}
                    </p>
                  </div>
                </div>

                {/* Age */}
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl">
                  <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
                    <MdPerson className="text-white text-lg" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Age</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {selectedUser.user?.age || "Not provided"}
                    </p>
                  </div>
                </div>

                {/* Enrolled Course */}
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <p className="text-xs text-gray-500 mb-2">Enrolled Course</p>
                  <div className="flex items-center gap-3">
                    {selectedUser.course?.thumbnail ? (
                      <img
                        src={selectedUser.course.thumbnail}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center text-white text-xs font-bold">
                        {selectedUser.course?.title?.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        {selectedUser.course?.title}
                      </p>
                      <p className="text-xs text-green-600 font-semibold">
                        ₹{selectedUser.pricePaid || "Free"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Enrolled Date */}
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl">
                  <p className="text-sm text-gray-600">Enrolled On</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {new Date(selectedUser.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default RecentEnrollments;