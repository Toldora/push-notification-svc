const webpush = require('web-push');

const initWebpush = () => {
  webpush.setGCMAPIKey(process.env.GCM_SENDER_ID);
  webpush.setVapidDetails(
    'https://mayan.bet/',
    process.env.FCM_VAPID_PUBLIC_KEY,
    process.env.FCM_VAPID_PRIVATE_KEY,
  );
};

const triggerPushMessage = (subscription, dataToSend = {}) =>
  webpush.sendNotification(subscription, JSON.stringify(dataToSend), {
    headers: {
      'Content-Type': 'application/json',
    },
  });

module.exports = { initWebpush, triggerPushMessage };
