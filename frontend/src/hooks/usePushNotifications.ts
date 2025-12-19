'use client';

import { useEffect, useState, useCallback } from 'react';

interface NotificationPermissionState {
  permission: NotificationPermission;
  supported: boolean;
}

// Check if browser supports notifications
const isNotificationSupported = () => 
  typeof window !== 'undefined' && 
  'Notification' in window && 
  'serviceWorker' in navigator;

export function usePushNotifications() {
  const [permissionState, setPermissionState] = useState<NotificationPermissionState>({
    permission: 'default',
    supported: false,
  });
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (isNotificationSupported()) {
      setPermissionState({
        permission: Notification.permission,
        supported: true,
      });
      
      // Check if already subscribed
      checkSubscription();
    }
  }, []);

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    } catch (error) {
      console.error('Error checking push subscription:', error);
    }
  };

  const requestPermission = useCallback(async () => {
    if (!isNotificationSupported()) {
      console.warn('Push notifications not supported');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermissionState(prev => ({ ...prev, permission }));
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, []);

  const subscribe = useCallback(async () => {
    if (!isNotificationSupported()) return null;

    try {
      // First request permission
      const granted = await requestPermission();
      if (!granted) return null;

      // Register service worker if needed
      const registration = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;

      // Get VAPID public key from environment
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      
      if (!vapidPublicKey) {
        console.warn('VAPID public key not configured');
        return null;
      }

      // Subscribe to push
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      // Send subscription to backend
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription),
      });

      if (response.ok) {
        setIsSubscribed(true);
        return subscription;
      }

      return null;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      return null;
    }
  }, [requestPermission]);

  const unsubscribe = useCallback(async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
        
        // Notify backend
        await fetch('/api/push/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });

        setIsSubscribed(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      return false;
    }
  }, []);

  return {
    ...permissionState,
    isSubscribed,
    requestPermission,
    subscribe,
    unsubscribe,
  };
}

// Show a local notification
export function showNotification(
  title: string, 
  options?: NotificationOptions
): Notification | null {
  if (!isNotificationSupported()) return null;
  
  if (Notification.permission !== 'granted') {
    console.warn('Notification permission not granted');
    return null;
  }

  return new Notification(title, {
    icon: '/logo.png',
    badge: '/badge.png',
    ...options,
  });
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Notification types for the app
export const NotificationTypes = {
  CHALLENGE_REMINDER: 'challenge_reminder',
  CHALLENGE_COMPLETE: 'challenge_complete',
  NEW_MESSAGE: 'new_message',
  NEW_BADGE: 'new_badge',
  STREAK_WARNING: 'streak_warning',
  DEPOSIT_CONFIRMED: 'deposit_confirmed',
  REFUND_PROCESSED: 'refund_processed',
} as const;

export type NotificationType = typeof NotificationTypes[keyof typeof NotificationTypes];
