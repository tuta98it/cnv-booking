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
  const notification = otification.notification;
  const notificationTitle = notification.title ?? '';
  const notificationOptions = {
    body: notification.body ?? '',
    icon: notification.icon ?? '',
    data: notification.data ?? '',

  };

  // self.registration.showNotification(notificationTitle, notificationOptions);
});

