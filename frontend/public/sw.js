// Service Worker for Push Notifications
// This file should be placed in the public folder

const CACHE_NAME = 'commitforce-v1';

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
  event.waitUntil(self.clients.claim());
});

// Push notification event
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);

  let notificationData = {
    title: 'CommitForce',
    body: 'You have a new notification',
    icon: '/logo.png',
    badge: '/badge.png',
    data: {},
  };

  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = {
        ...notificationData,
        ...data,
      };
    } catch (e) {
      notificationData.body = event.data.text();
    }
  }

  const options = {
    body: notificationData.body,
    icon: notificationData.icon,
    badge: notificationData.badge,
    vibrate: [100, 50, 100],
    data: notificationData.data,
    actions: getActionsForType(notificationData.data?.type),
    requireInteraction: notificationData.data?.requireInteraction || false,
    tag: notificationData.data?.tag || 'default',
  };

  event.waitUntil(
    self.registration.showNotification(notificationData.title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  event.notification.close();

  const data = event.notification.data || {};
  let url = '/dashboard';

  // Determine URL based on notification type
  switch (data.type) {
    case 'challenge_reminder':
    case 'challenge_complete':
      url = data.challengeId ? `/challenges/${data.challengeId}` : '/challenges';
      break;
    case 'new_message':
      url = '/messages';
      break;
    case 'new_badge':
      url = '/achievements';
      break;
    case 'deposit_confirmed':
    case 'refund_processed':
      url = '/wallet';
      break;
    default:
      url = '/dashboard';
  }

  // Handle action clicks
  if (event.action === 'checkin') {
    url = data.challengeId ? `/challenges/${data.challengeId}` : '/challenges';
  } else if (event.action === 'reply') {
    url = '/messages';
  } else if (event.action === 'view') {
    // Use the default URL
  }

  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientList) => {
      // If there's already a window open, focus it
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      // Otherwise open a new window
      return self.clients.openWindow(url);
    })
  );
});

// Get actions based on notification type
function getActionsForType(type) {
  switch (type) {
    case 'challenge_reminder':
      return [
        { action: 'checkin', title: '📸 Check In Now' },
        { action: 'dismiss', title: 'Dismiss' },
      ];
    case 'new_message':
      return [
        { action: 'reply', title: '💬 Reply' },
        { action: 'dismiss', title: 'Dismiss' },
      ];
    default:
      return [
        { action: 'view', title: 'View' },
        { action: 'dismiss', title: 'Dismiss' },
      ];
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Background sync:', event.tag);

  if (event.tag === 'sync-checkins') {
    event.waitUntil(syncPendingCheckins());
  }
});

async function syncPendingCheckins() {
  // Get pending check-ins from IndexedDB and sync them
  console.log('Syncing pending check-ins...');
}
