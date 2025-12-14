/**
 * Service Worker for Push Notifications
 * Desolates Production OS
 */

// Install event
self.addEventListener('install', (event) => {
  console.log('[SW] Service Worker installed')
  self.skipWaiting()
})

// Activate event
self.addEventListener('activate', (event) => {
  console.log('[SW] Service Worker activated')
  event.waitUntil(clients.claim())
})

// Push event - receive push notification
self.addEventListener('push', (event) => {
  console.log('[SW] Push received:', event)
  
  let data = {
    title: 'Desolates',
    body: 'Новое обновление',
    icon: '/favicon.png',
    badge: '/favicon.png',
    url: '/dashboard'
  }
  
  if (event.data) {
    try {
      data = { ...data, ...event.data.json() }
    } catch (e) {
      data.body = event.data.text()
    }
  }
  
  const options = {
    body: data.body,
    icon: data.icon || '/favicon.png',
    badge: data.badge || '/favicon.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/dashboard',
      dateOfArrival: Date.now()
    },
    actions: [
      { action: 'open', title: 'Открыть' },
      { action: 'close', title: 'Закрыть' }
    ],
    tag: data.tag || 'desolates-notification',
    renotify: true
  }
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event)
  
  event.notification.close()
  
  if (event.action === 'close') {
    return
  }
  
  const urlToOpen = event.notification.data?.url || '/dashboard'
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // Check if there's already a window open
        for (const client of windowClients) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.navigate(urlToOpen)
            return client.focus()
          }
        }
        // Open new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen)
        }
      })
  )
})
