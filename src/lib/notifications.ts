
export const requestNotificationPermission = async () => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    console.error('This browser does not support desktop notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  return false;
};

export const sendNotification = async (title: string, options?: NotificationOptions & { onClick?: string }) => {
  if (typeof window === 'undefined') return;

  if (Notification.permission === 'granted') {
    // For PWAs and Android, we MUST use the Service Worker registration to show notifications
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, {
        icon: 'https://picsum.photos/seed/appicon/192/192',
        badge: 'https://picsum.photos/seed/appicon/192/192',
        vibrate: [200, 100, 200],
        ...options,
        data: {
          url: options?.onClick || '/',
        },
      });
    } else {
      // Fallback for environments without service workers
      new Notification(title, options);
    }
  }
};
