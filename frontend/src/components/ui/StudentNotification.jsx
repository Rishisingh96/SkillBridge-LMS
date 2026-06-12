import React, { useState, useEffect } from 'react';
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_SERVER_URL;
import { useNavigate } from 'react-router-dom';
import { Bell, Trash2, Check, Clock } from 'lucide-react';

const StudentNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/notification?limit=100`, {
        withCredentials: true,
      });
      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleNotificationClick = (notification) => {
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await axios.patch(
        `${BASE_URL}/api/notification/${notificationId}/read`,
        {},
        { withCredentials: true }
      );
      await fetchNotifications();
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await axios.delete(
        `${BASE_URL}/api/notification/${notificationId}`,
        { withCredentials: true }
      );
      await fetchNotifications();
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await axios.patch(
        `${BASE_URL}/api/notification/read-all`,
        {},
        { withCredentials: true }
      );
      await fetchNotifications();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'enrollment':
        return '📚';
      case 'course':
        return '🎯';
      case 'certificate':
        return '🏆';
      case 'lecture':
        return '📹';
      case 'quiz':
        return '❓';
      case 'assignment':
        return '📝';
      case 'system':
        return '⚙️';
      default:
        return '🔔';
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
                <Bell className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Notifications
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {notifications.length} notifications
                </p>
              </div>
            </div>
            {notifications.some(n => !n.isRead) && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Check size={16} />
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-12 text-center">
            <Bell size={64} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No notifications yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              You'll see notifications from admin and educators here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 cursor-pointer hover:shadow-md transition-all ${
                  !notification.isRead ? 'border-l-4 border-violet-500' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center flex-shrink-0 text-2xl">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className={`font-semibold text-gray-900 dark:text-white ${!notification.isRead ? 'text-lg' : 'text-base'}`}>
                          {notification.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-500">
                          <Clock size={12} />
                          {formatTimeAgo(notification.createdAt)}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!notification.isRead && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(notification._id);
                            }}
                            className="p-2 hover:bg-violet-100 dark:hover:bg-violet-900/30 rounded-lg transition-colors"
                            title="Mark as read"
                          >
                            <Check size={16} className="text-violet-600 dark:text-violet-400" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(notification._id);
                          }}
                          className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentNotification;
