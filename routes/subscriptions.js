const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const { createCustomerUser, updateCustomerUser } = require('../controllers');
const User = require('../models/User');
const Subscription = require('../models/Subscription');

require('dotenv').config();

const router = Router();

const validationMiddleware = [check('email', 'Invalid email').isEmail()];

router.get('/', async (req, res) => {
  res.json({ message: 'Hi!' });
});

router.post('/save', async (req, res) => {
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
    const user = await User.findOne({ clickId });
    if (user) {
      console.log('Subscription for delete', user.subscription);
      await Subscription.findByIdAndDelete(user.subscription);
      user.subscription = newSubscription._id;
      await user.save();
      await updateCustomerUser(clickId, { is_subscribed_on_push: true });
      console.log('Updated user', user);

      return res.status(201).json(user);
    }
    const newUser = new User({ clickId, subscription: newSubscription._id });
    await newUser.save();
    await createCustomerUser(clickId);

    console.log('New user', newUser);

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
