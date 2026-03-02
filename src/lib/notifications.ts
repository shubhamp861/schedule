export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.error('This browser does not support desktop notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const sendNotification = (title: string, options?: NotificationOptions & { onClick?: () => void }) => {
  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      icon: '/favicon.ico', // Fallback icon
      ...options,
    });

    if (options?.onClick) {
      notification.onclick = options.onClick;
    }
  }
};