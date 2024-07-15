const { Router } = require('express');
const User = require('../models/User');
const { triggerPushMessage, updateCustomerUser } = require('../controllers');

const router = Router();

router.post('/send', async (req, res) => {
  try {
    const { clickIds = [], messageData } = req.body;

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

      return triggerPushMessage(subscription, messageData).catch(
        async error => {
          if (error.statusCode === 404 || error.statusCode === 410) {
            const { body, endpoint } = error;
            console.log({
              body,
              clickId,
              endpoint,
            });
            await subscription.deleteOne();
            user.subscription = null;
            await user.save();
            await updateCustomerUser(clickId, { is_subscribed_on_push: false });
          }
          return error;
        },
      );
    });

    await Promise.all(pushPromises);

    res.json({ message: 'messages sent' });
  } catch (error) {
    res.status(400).json({ error, message: 'Something went wrong' });
  }
});

module.exports = router;
