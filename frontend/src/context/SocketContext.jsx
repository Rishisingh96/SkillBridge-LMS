import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [latestNotification, setLatestNotification] = useState(null);
  
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    // Connect to socket when user is logged in
    if (userData?._id) {
      const socketInstance = io(import.meta.env.VITE_SERVER_URL || "http://localhost:5000", {
        withCredentials: true,
        transports: ["websocket", "polling"],
      });

      socketInstance.on("connect", () => {
        console.log("Socket connected:", socketInstance.id);
        setIsConnected(true);
        
        // Join user's room
        socketInstance.emit("join", userData._id);
      });

      socketInstance.on("disconnect", () => {
        console.log("Socket disconnected");
        setIsConnected(false);
      });

      // Listen for new notifications
      socketInstance.on("new-notification", (notification) => {
        console.log("New notification received:", notification);
        setLatestNotification(notification);
        
        // Show toast notification
        if (Notification.permission === "granted") {
          new Notification(notification.title, {
            body: notification.message,
            icon: "/favicon.svg",
          });
        }
      });

      // Listen for unread count updates
      socketInstance.on("unread-count", (count) => {
        console.log("Unread count updated:", count);
        setUnreadCount(count);
      });

      setSocket(socketInstance);

      // Cleanup on unmount
      return () => {
        socketInstance.disconnect();
        setSocket(null);
        setIsConnected(false);
      };
    }
  }, [userData?._id]);

  const value = {
    socket,
    isConnected,
    unreadCount,
    latestNotification,
    setLatestNotification,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
