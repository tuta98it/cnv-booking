// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');
firebase.initializeApp({
  FireBase.firebaseConfig


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
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

