self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'RoutineSync Reminder';
  const options = {
    body: data.body || 'It is time for your scheduled task!',
    icon: 'https://picsum.photos/seed/appicon/192/192',
    badge: 'https://picsum.photos/seed/appicon/192/192',
    data: data.url || '/'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data)
  );
});

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});
