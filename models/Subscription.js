const { Schema, model } = require('mongoose');

const schema = new Schema({
  endpoint: {
    type: String,
    required: true,
  },
  expirationTime: {
    type: Date,
  },
  keys: {
    p256dh: {
      type: String,
    },
    auth: {
      type: String,
    },
  },
});

module.exports = model('Subscription', schema);
