// Service Worker for Push Notifications
const CACHE_NAME = 'the-pillar-v1';

// Install event
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Push notification received
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  
  const options = {
    body: data.body || 'Time for your morning devotion!',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [200, 100, 200],
    tag: 'morning-alarm',
    renotify: true,
    requireInteraction: true,
    data: {
      url: data.url || '/',
    },
    actions: [
      { action: 'open', title: 'Open App' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'THE PILLAR', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If app is already open, focus it
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data?.url || '/');
      }
    })
  );
});

// Scheduled alarm check (runs when service worker wakes up)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SCHEDULE_ALARM') {
    const { alarmTime, userName } = event.data;
    scheduleAlarm(alarmTime, userName);
  }
});

// Store alarm data
let scheduledAlarm = null;

function scheduleAlarm(alarmTime, userName) {
  // Clear any existing alarm
  if (scheduledAlarm) {
    clearTimeout(scheduledAlarm);
  }

  const now = new Date();
  const [hours, minutes] = alarmTime.split(':').map(Number);
  
  let alarmDate = new Date();
  alarmDate.setHours(hours, minutes, 0, 0);
  
  // If the time has passed today, schedule for tomorrow
  if (alarmDate <= now) {
    alarmDate.setDate(alarmDate.getDate() + 1);
  }
  
  const timeUntilAlarm = alarmDate.getTime() - now.getTime();
  
  // Schedule the alarm (max timeout is ~24.8 days, so we're safe for daily alarms)
  scheduledAlarm = setTimeout(() => {
    self.registration.showNotification('THE PILLAR - Morning Devotion', {
      body: `Good morning${userName ? `, ${userName}` : ''}! Time for your morning devotion and today's verse.`,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      vibrate: [200, 100, 200, 100, 200],
      tag: 'morning-alarm',
      renotify: true,
      requireInteraction: true,
      data: { url: '/' },
      actions: [
        { action: 'open', title: 'Start Devotion' },
        { action: 'dismiss', title: 'Dismiss' },
      ],
    });
    
    // Reschedule for tomorrow
    scheduleAlarm(alarmTime, userName);
  }, timeUntilAlarm);
}
