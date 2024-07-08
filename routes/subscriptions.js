/* eslint-disable no-underscore-dangle */
const { Router } = require('express');
const webpush = require('web-push');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const Casino = require('../models/Casino');
require('dotenv').config();

const router = Router();

const validationMiddleware = [check('email', 'Invalid email').isEmail()];

const vapidKeys = {
  publicKey: process.env.FCM_VAPID_PUBLIC_KEY,
  privateKey: process.env.FCM_VAPID_PRIVATE_KEY,
};

webpush.setVapidDetails(
  'https://mayan.bet/',
  vapidKeys.publicKey,
  vapidKeys.privateKey,
);

const sendNotification = (subscription, dataToSend = '') => {
  webpush.sendNotification(subscription, dataToSend);
};

let subscriptionDB = null;

router.get('/', async (req, res) => {
  res.json({ message: 'Hi!' });
});

router.get('/send-notification', (req, res) => {
  const subscription = subscriptionDB; //get subscription from your database here.
  const message = 'Hello World';
  // const message = JSON.stringify({ title: 'title', body: 'body' });
  sendNotification(subscription, message);
  res.json({ message: 'message sent' });
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

    const subscription = req.body;
    console.log(subscription);
    subscriptionDB = subscription;

    // await saveToDatabase(subscription);
    res.json({ message: 'success' });

    // res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error, message: 'Something went wrong' });
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
