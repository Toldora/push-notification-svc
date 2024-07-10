/* eslint-disable no-underscore-dangle */
const { Router } = require('express');
const webpush = require('web-push');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
require('dotenv').config();

const router = Router();

const validationMiddleware = [check('email', 'Invalid email').isEmail()];

const vapidKeys = {
  publicKey: process.env.FCM_VAPID_PUBLIC_KEY,
  privateKey: process.env.FCM_VAPID_PRIVATE_KEY,
};

// webpush.setGCMAPIKey(process.env.GCM_SENDER_ID);
webpush.setVapidDetails(
  'https://mayan.bet/',
  vapidKeys.publicKey,
  vapidKeys.privateKey,
);

const sendNotification = async (subscription, dataToSend = '') => {
  await webpush.sendNotification(subscription, dataToSend);
  return `${dataToSend} SENT`;
};

router.get('/', async (req, res) => {
  res.json({ message: 'Hi!' });
});

router.post('/send-notification', async (req, res) => {
  try {
    const { clickIds = [], message } = req.body;

    if (!clickIds?.length) {
      return res.status(400).json({ message: 'clickIds array is empty' });
    }

    const pushPromises = clickIds.map(async clickId => {
      const user = await User.findOne({ clickId })?.populate('subscription');

      if (!user) {
        return res
          .status(400)
          .json({ message: `User with clickId=${clickId} not found` });
      }

      const { subscription } = user;
      console.log(subscription);

      return sendNotification(subscription, message);
    });

    const results = await Promise.all(pushPromises);
    console.log(results);

    res.json({ message: 'messages sent' });
  } catch (error) {
    res.status(400).json({ error, message: 'Something went wrong' });
  }
});

router.post('/save-subscription', async (req, res) => {
  try {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({
    //     errors: errors.array(),
    //     message: 'Validation error',
    //   });
    // }

    const { subscription, clickId } = req.body;

    const newSubscription = new Subscription(subscription);
    await newSubscription.save();
    const newUser = new User({ clickId, subscription: newSubscription._id });
    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error, message: 'Something went wrong' });
  }
});

router.get('/statistics', async (req, res) => {
  try {
    const casinos = await Casino.find();
    const users = await User.find();
    const result = users.reduce((acc, user) => {
      const casino = casinos.find(
        casino => casino._id.toJSON() === user.registeredOn.toJSON(),
      );
      if (acc[casino.name]) {
        acc[casino.name] = acc[casino.name] + 1;
      } else {
        acc[casino.name] = 1;
      }
      return acc;
    }, {});
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error, message: 'Something went wrong' });
  }
});

router.get('/:name', async (req, res) => {
  try {
    const { name } = req.params;

    const casino = await Casino.findOne({ name });
    const users = await User.find({ registeredOn: casino._id });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error, message: 'Something went wrong' });
  }
});

module.exports = router;
