import { useState, useEffect, useCallback } from 'react';

export type NotificationPermission = 'default' | 'granted' | 'denied';

interface UseNotificationsReturn {
  permission: NotificationPermission;
  isSupported: boolean;
  isRegistered: boolean;
  requestPermission: () => Promise<boolean>;
  scheduleAlarm: (alarmTime: string, userName?: string) => Promise<void>;
  sendTestNotification: () => Promise<void>;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    // Check if notifications are supported
    const supported = 'Notification' in window && 'serviceWorker' in navigator;
    setIsSupported(supported);

    if (supported) {
      setPermission(Notification.permission as NotificationPermission);
      
      // Register service worker
      registerServiceWorker();
    }
  }, []);

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });
      
      setSwRegistration(registration);
      setIsRegistered(true);
      
      // Ensure the service worker is ready
      await navigator.serviceWorker.ready;
      
      console.log('Service Worker registered successfully');
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      setIsRegistered(false);
    }
  };

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      console.warn('Notifications not supported');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result as NotificationPermission);
      return result === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, [isSupported]);

  const scheduleAlarm = useCallback(async (alarmTime: string, userName?: string): Promise<void> => {
    if (!isSupported || !swRegistration) {
      console.warn('Cannot schedule alarm: notifications not supported or SW not registered');
      return;
    }

    if (permission !== 'granted') {
      const granted = await requestPermission();
      if (!granted) {
        console.warn('Notification permission not granted');
        return;
      }
    }

    // Send message to service worker to schedule alarm
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SCHEDULE_ALARM',
        alarmTime,
        userName,
      });
      console.log(`Alarm scheduled for ${alarmTime}`);
    } else {
      // If no controller, wait for it to be ready
      const registration = await navigator.serviceWorker.ready;
      registration.active?.postMessage({
        type: 'SCHEDULE_ALARM',
        alarmTime,
        userName,
      });
      console.log(`Alarm scheduled for ${alarmTime}`);
    }
  }, [isSupported, swRegistration, permission, requestPermission]);

  const sendTestNotification = useCallback(async (): Promise<void> => {
    if (!isSupported) {
      console.warn('Notifications not supported');
      return;
    }

    if (permission !== 'granted') {
      const granted = await requestPermission();
      if (!granted) return;
    }

    // Show a test notification
    if (swRegistration) {
      await swRegistration.showNotification('THE PILLAR - Test', {
        body: 'Notifications are working! Your morning alarm will arrive on time.',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'test-notification',
      } as NotificationOptions);
    } else {
      // Fallback to regular notification
      new Notification('THE PILLAR - Test', {
        body: 'Notifications are working! Your morning alarm will arrive on time.',
        icon: '/favicon.ico',
      });
    }
  }, [isSupported, permission, swRegistration, requestPermission]);

  return {
    permission,
    isSupported,
    isRegistered,
    requestPermission,
    scheduleAlarm,
    sendTestNotification,
  };
};
