import { useState } from 'react';
import { useLocalStorage } from 'react-use';

export interface Notification {
  id: string;
  category: 'match' | 'payment' | 'delivery' | 'system';
  message: string;
  timestamp: string;
  read: boolean;
}

export function useNotifications() {
  const [notifications, setNotifications] = useLocalStorage<Notification[]>('notifications', []);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      (prev || []).map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => (prev || []).map((n) => ({ ...n, read: true })));
  };

  return {
    notifications: notifications || [],
    markAsRead,
    markAllAsRead,
  };
}
