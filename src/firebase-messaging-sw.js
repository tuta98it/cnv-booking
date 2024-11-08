importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "AIzaSyDDgwJ4FeJ1wW8kzBDGub4J76ZNLBuT_mc",
  authDomain: "vhl-notification.firebaseapp.com",
  projectId: "vhl-notification",
  storageBucket: "vhl-notification.firebasestorage.app",
  messagingSenderId: "664705952523",
  appId: "1:664705952523:web:bb53e1806608ac7799500e",
  measurementId: "G-7WF2VJ24RK"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload);

  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
