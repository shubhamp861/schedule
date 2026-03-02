
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

export const sendNotification = (title: string, options?: NotificationOptions & { onClick?: () => void }) => {
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    const notification = new Notification(title, {
      ...options,
      badge: '/favicon.ico', // Optional
      silent: false,
    });

    if (options?.onClick) {
      notification.onclick = (event) => {
        event.preventDefault();
        options.onClick?.();
        notification.close();
      };
    }
  }
};
