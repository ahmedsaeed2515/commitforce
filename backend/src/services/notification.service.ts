import Notification from '../models/Notification.model';

export const createNotification = async (userId: string, title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
  return await Notification.create({
    user: userId,
    title,
    message,
    type
  });
};

export const getUserNotifications = async (userId: string) => {
  return await Notification.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(20);
};

export const markAsRead = async (notificationId: string, userId: string) => {
  return await Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { read: true },
    { new: true }
  );
};

export const markAllAsRead = async (userId: string) => {
    return await Notification.updateMany(
        { user: userId, read: false },
        { read: true }
    );
};
