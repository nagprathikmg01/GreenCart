import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { storage } from '../utils/storage';
import SellerNotificationPopup from '../components/SellerNotificationPopup';

const NotificationContext = createContext();

export function useNotifications() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const [showSellerNotification, setShowSellerNotification] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [processedNotifications, setProcessedNotifications] = useState(new Set());
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      checkForNewSales();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const checkForNewSales = () => {
    if (!currentUser) return;

    const notifications = storage.getSellerNotifications(currentUser.uid);
    const unprocessedNotifications = notifications.filter(
      notification => !processedNotifications.has(notification.id)
    );

    if (unprocessedNotifications.length > 0) {
      // Show the most recent notification
      const latestNotification = unprocessedNotifications[0];
      setCurrentNotification(latestNotification);
      setShowSellerNotification(true);

      // Mark as processed
      setProcessedNotifications(prev => new Set([...prev, latestNotification.id]));
    }
  };

  const closeSellerNotification = () => {
    setShowSellerNotification(false);
    setCurrentNotification(null);
  };

  const value = {
    showSellerNotification,
    currentNotification,
    closeSellerNotification,
    checkForNewSales
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}

      {/* Seller Notification Popup */}
      <SellerNotificationPopup
        isOpen={showSellerNotification}
        onClose={closeSellerNotification}
        notification={currentNotification}
      />
    </NotificationContext.Provider>
  );
}
