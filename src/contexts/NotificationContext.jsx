import { createContext, useState, useEffect } from "react";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Sample notifications for testing
  useEffect(() => {
    const sampleNotifications = [
      {
        id: 1,
        message: "Welcome to HealthTrack! Start by logging your first meal.",
        timestamp: new Date(),
        read: false,
      },
      {
        id: 2,
        message: "Remember to track your water intake today.",
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        read: false,
      },
      {
        id: 3,
        message: "Complete your profile to get personalized recommendations.",
        timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
        read: false,
      },
    ];

    // Only set sample notifications if there aren't any
    if (notifications.length === 0) {
      setNotifications(sampleNotifications);
    }
  }, []);

  useEffect(() => {
    // Calculate unread count
    const count = notifications.filter(
      (notification) => !notification.read
    ).length;
    setUnreadCount(count);
  }, [notifications]);

  const addNotification = (notification) => {
    setNotifications((prev) => [
      {
        id: Date.now(),
        timestamp: new Date(),
        read: false,
        ...notification,
      },
      ...prev,
    ]);
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
