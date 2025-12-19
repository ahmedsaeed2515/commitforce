import webpush from 'web-push';
import config from '../config/env';

// Configure web-push with VAPID keys
if (config.VAPID_PUBLIC_KEY && config.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    config.VAPID_SUBJECT || 'mailto:admin@commitforce.com',
    config.VAPID_PUBLIC_KEY,
    config.VAPID_PRIVATE_KEY
  );
}

interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

interface Notification {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: {
    type?: string;
    url?: string;
    challengeId?: string;
    userId?: string;
    [key: string]: any;
  };
  requireInteraction?: boolean;
  tag?: string;
}

// In-memory store for subscriptions (use database in production)
const subscriptions = new Map<string, PushSubscription>();

export const pushNotificationService = {
  /**
   * Store a push subscription
   */
  saveSubscription: (userId: string, subscription: PushSubscription) => {
    subscriptions.set(userId, subscription);
    console.log(`Push subscription saved for user ${userId}`);
    return true;
  },

  /**
   * Remove a push subscription
   */
  removeSubscription: (userId: string) => {
    subscriptions.delete(userId);
    console.log(`Push subscription removed for user ${userId}`);
    return true;
  },

  /**
   * Get a user's subscription
   */
  getSubscription: (userId: string): PushSubscription | undefined => {
    return subscriptions.get(userId);
  },

  /**
   * Send a push notification to a specific user
   */
  sendToUser: async (userId: string, notification: Notification): Promise<boolean> => {
    const subscription = subscriptions.get(userId);
    
    if (!subscription) {
      console.log(`No push subscription found for user ${userId}`);
      return false;
    }

    try {
      const payload = JSON.stringify({
        title: notification.title,
        body: notification.body,
        icon: notification.icon || '/logo.png',
        badge: notification.badge || '/badge.png',
        data: notification.data || {},
        requireInteraction: notification.requireInteraction || false,
        tag: notification.tag || 'default',
      });

      await webpush.sendNotification(subscription, payload);
      console.log(`Push notification sent to user ${userId}`);
      return true;
    } catch (error: any) {
      console.error(`Failed to send push notification to user ${userId}:`, error);
      
      // If subscription is invalid, remove it
      if (error.statusCode === 410 || error.statusCode === 404) {
        subscriptions.delete(userId);
        console.log(`Removed invalid subscription for user ${userId}`);
      }
      
      return false;
    }
  },

  /**
   * Send a push notification to multiple users
   */
  sendToUsers: async (userIds: string[], notification: Notification): Promise<number> => {
    let successCount = 0;

    await Promise.all(
      userIds.map(async (userId) => {
        const success = await pushNotificationService.sendToUser(userId, notification);
        if (success) successCount++;
      })
    );

    return successCount;
  },

  /**
   * Send challenge reminder notification
   */
  sendChallengeReminder: async (userId: string, challengeTitle: string, challengeId: string): Promise<boolean> => {
    return pushNotificationService.sendToUser(userId, {
      title: '⏰ Challenge Reminder',
      body: `Don't forget to check in for "${challengeTitle}"!`,
      icon: '/icons/challenge.png',
      data: {
        type: 'challenge_reminder',
        challengeId,
        url: `/challenges/${challengeId}`,
      },
      requireInteraction: true,
      tag: `challenge-${challengeId}`,
    });
  },

  /**
   * Send new message notification
   */
  sendNewMessage: async (userId: string, senderName: string, preview: string): Promise<boolean> => {
    return pushNotificationService.sendToUser(userId, {
      title: `💬 Message from ${senderName}`,
      body: preview.length > 50 ? preview.substring(0, 47) + '...' : preview,
      icon: '/icons/message.png',
      data: {
        type: 'new_message',
        url: '/messages',
      },
      tag: 'new-message',
    });
  },

  /**
   * Send streak warning notification
   */
  sendStreakWarning: async (userId: string, streakDays: number, challengeId: string): Promise<boolean> => {
    return pushNotificationService.sendToUser(userId, {
      title: `🔥 ${streakDays}-Day Streak at Risk!`,
      body: 'Check in now to keep your streak alive!',
      icon: '/icons/streak.png',
      data: {
        type: 'streak_warning',
        challengeId,
        url: `/challenges/${challengeId}`,
      },
      requireInteraction: true,
      tag: `streak-${challengeId}`,
    });
  },

  /**
   * Send badge earned notification
   */
  sendBadgeEarned: async (userId: string, badgeName: string): Promise<boolean> => {
    return pushNotificationService.sendToUser(userId, {
      title: '🏅 New Badge Earned!',
      body: `You've unlocked the "${badgeName}" badge!`,
      icon: '/icons/badge.png',
      data: {
        type: 'new_badge',
        url: '/achievements',
      },
      tag: 'new-badge',
    });
  },

  /**
   * Send challenge completed notification
   */
  sendChallengeCompleted: async (userId: string, challengeTitle: string, refundAmount?: number): Promise<boolean> => {
    return pushNotificationService.sendToUser(userId, {
      title: '🎉 Challenge Completed!',
      body: refundAmount 
        ? `Congratulations! You completed "${challengeTitle}" and received $${refundAmount} back!`
        : `Congratulations! You completed "${challengeTitle}"!`,
      icon: '/icons/trophy.png',
      data: {
        type: 'challenge_complete',
        url: '/achievements',
      },
      tag: 'challenge-complete',
    });
  },

  /**
   * Check if VAPID is configured
   */
  isConfigured: (): boolean => {
    return !!(config.VAPID_PUBLIC_KEY && config.VAPID_PRIVATE_KEY);
  },

  /**
   * Get VAPID public key for clients
   */
  getPublicKey: (): string | null => {
    return config.VAPID_PUBLIC_KEY || null;
  },
};

export default pushNotificationService;
