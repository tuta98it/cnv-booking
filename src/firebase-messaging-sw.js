

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  // Link cần mở được lấy từ dữ liệu đính kèm trong thông báo
  const openUrl = event.notification.data?.link;

  event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
          // Kiểm tra nếu một tab với URL mở đã tồn tại
          // for (let i = 0; i < clientList.length; i++) {
          //     const client = clientList[i];
          //     if (client.url === openUrl && 'focus' in client) {
          //         return client.focus();
          //     }
          // }

          // Nếu không có tab nào mở sẵn, tạo một tab mới
          if (clients.openWindow) {
              return clients.openWindow(openUrl);
          }
      })
  );
});

// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');
firebase.initializeApp({
  apiKey: "AIzaSyDDgwJ4FeJ1wW8kzBDGub4J76ZNLBuT_mc",
  authDomain: "vhl-notification.firebaseapp.com",
  projectId: "vhl-notification",
  storageBucket: "vhl-notification.firebasestorage.app",
  messagingSenderId: "664705952523",
  appId: "1:664705952523:web:bb53e1806608ac7799500e",
  measurementId: "G-7WF2VJ24RK"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );

  // Customize notification here
  const notification = payload.notification;
  const notificationTitle = notification.title ?? '';
  const notificationOptions = {
    body: notification.body ?? '',
    icon: notification.icon ?? '',
    data: payload.data ?? '',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
