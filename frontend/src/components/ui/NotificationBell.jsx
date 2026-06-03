import React, { useState } from "react";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSocket } from "../../context/SocketContext";
import axios from "axios";
import { serverUrl } from "../../App";
import { useNavigate } from "react-router-dom";

const NotificationBell = () => {
  const { unreadCount, latestNotification, setLatestNotification } = useSocket();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/notification?limit=5`, {
        withCredentials: true,
      });
      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const handleBellClick = async () => {
    if (!isOpen) {
      await fetchNotifications();
    }
    setIsOpen(!isOpen);
  };

  const handleNotificationClick = async (notification) => {
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
    setIsOpen(false);
    setLatestNotification(null);
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await axios.patch(
        `${serverUrl}/api/notification/${notificationId}/read`,
        {},
        { withCredentials: true }
      );
      await fetchNotifications();
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await axios.patch(
        `${serverUrl}/api/notification/read-all`,
        {},
        { withCredentials: true }
      );
      await fetchNotifications();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={handleBellClick}
        className="relative w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 flex items-center justify-center transition-all duration-300"
      >
        <Bell size={21} className="text-gray-700 dark:text-gray-300" />

        {/* Unread Count Badge */}
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 text-white text-xs font-bold flex items-center justify-center shadow-lg"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.div>
        )}
      </motion.button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-[60px] w-[380px] max-w-[calc(100vw-32px)] bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-2xl rounded-3xl border border-gray-200 dark:border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden z-50"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
                <h3 className="font-bold text-gray-900 dark:text-white">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-sm text-violet-600 hover:text-violet-700 font-medium"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              {/* Notifications List */}
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      No notifications yet
                    </p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification._id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-4 border-b border-gray-100 dark:border-white/5 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-all ${
                        !notification.isRead ? "bg-violet-50/50 dark:bg-violet-500/5" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Notification Icon based on type */}
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                          {notification.type === "enrollment" && (
                            <span className="text-white text-lg">📚</span>
                          )}
                          {notification.type === "course" && (
                            <span className="text-white text-lg">🎯</span>
                          )}
                          {notification.type === "certificate" && (
                            <span className="text-white text-lg">🏆</span>
                          )}
                          {notification.type === "system" && (
                            <span className="text-white text-lg">⚙️</span>
                          )}
                          {!notification.type && (
                            <span className="text-white text-lg">🔔</span>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                            {notification.title}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 text-xs mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>

                        {/* Unread indicator */}
                        {!notification.isRead && (
                          <div className="w-2 h-2 rounded-full bg-violet-500 flex-shrink-0 mt-2" />
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-3 border-t border-gray-200 dark:border-white/10">
                  <button
                    onClick={() => {
                      navigate("/student/notifications");
                      setIsOpen(false);
                    }}
                    className="w-full py-2 text-center text-sm text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 font-medium transition-colors"
                  >
                    View all notifications
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
