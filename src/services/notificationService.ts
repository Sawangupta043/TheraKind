// Notification service for real-time updates
// In a real app, this would integrate with Firebase Cloud Messaging, WebSockets, or similar

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export interface PushNotificationData {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
}

class NotificationService {
  private notifications: NotificationData[] = [];
  private listeners: ((notifications: NotificationData[]) => void)[] = [];

  // Initialize notification service
  async initialize() {
    try {
      // Request notification permission
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        console.log('Notification permission:', permission);
      }

      // Load notifications from localStorage
      this.loadNotifications();
    } catch (error) {
      console.error('Error initializing notification service:', error);
    }
  }

  // Add notification
  addNotification(notification: Omit<NotificationData, 'id' | 'timestamp' | 'read'>) {
    const newNotification: NotificationData = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false
    };

    this.notifications.unshift(newNotification);
    this.saveNotifications();
    this.notifyListeners();

    // Show push notification if permission granted
    this.showPushNotification({
      title: newNotification.title,
      body: newNotification.message
    });

    return newNotification.id;
  }

  // Mark notification as read
  markAsRead(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.saveNotifications();
      this.notifyListeners();
    }
  }

  // Mark all notifications as read
  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.saveNotifications();
    this.notifyListeners();
  }

  // Delete notification
  deleteNotification(notificationId: string) {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.saveNotifications();
    this.notifyListeners();
  }

  // Get all notifications
  getNotifications(): NotificationData[] {
    return this.notifications;
  }

  // Get unread notifications
  getUnreadNotifications(): NotificationData[] {
    return this.notifications.filter(n => !n.read);
  }

  // Get unread count
  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  // Subscribe to notification changes
  subscribe(listener: (notifications: NotificationData[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Show push notification
  private async showPushNotification(data: PushNotificationData) {
    try {
      if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification(data.title, {
          body: data.body,
          icon: data.icon || '/favicon.ico',
          badge: data.badge,
          tag: data.tag,
          data: data.data
        });

        // Auto close after 5 seconds
        setTimeout(() => {
          notification.close();
        }, 5000);

        // Handle click
        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      }
    } catch (error) {
      console.error('Error showing push notification:', error);
    }
  }

  // Save notifications to localStorage
  private saveNotifications() {
    try {
      localStorage.setItem('therasoul_notifications', JSON.stringify(this.notifications));
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  }

  // Load notifications from localStorage
  private loadNotifications() {
    try {
      const saved = localStorage.getItem('therasoul_notifications');
      if (saved) {
        this.notifications = JSON.parse(saved).map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }

  // Notify listeners
  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.notifications));
  }

  // Create specific notification types
  createBookingConfirmation(therapistName: string, date: string, time: string) {
    return this.addNotification({
      title: 'Session Booked Successfully',
      message: `Your session with ${therapistName} on ${date} at ${time} has been confirmed.`,
      type: 'success',
      actionUrl: '/client-dashboard'
    });
  }

  createSessionReminder(therapistName: string, date: string, time: string) {
    return this.addNotification({
      title: 'Session Reminder',
      message: `Your session with ${therapistName} is scheduled for ${date} at ${time}.`,
      type: 'info',
      actionUrl: '/client-dashboard'
    });
  }

  createNewSessionRequest(clientName: string, date: string, time: string) {
    return this.addNotification({
      title: 'New Session Request',
      message: `${clientName} has requested a session on ${date} at ${time}.`,
      type: 'info',
      actionUrl: '/therapist-dashboard'
    });
  }

  createSessionCancelled(therapistName: string, date: string, time: string) {
    return this.addNotification({
      title: 'Session Cancelled',
      message: `Your session with ${therapistName} on ${date} at ${time} has been cancelled.`,
      type: 'warning',
      actionUrl: '/client-dashboard'
    });
  }

  createPaymentFailed(amount: number) {
    return this.addNotification({
      title: 'Payment Failed',
      message: `Payment of ₹${amount} failed. Please try again or contact support.`,
      type: 'error',
      actionUrl: '/client-dashboard'
    });
  }
}

// Export singleton instance
export const notificationService = new NotificationService(); 