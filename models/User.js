const { Schema, model, ObjectId } = require('mongoose');

const schema = new Schema({
  clickId: {
    type: String,
  },
  subscription: {
    type: ObjectId,
    ref: 'Subscription',
    required: true,
  },
});

module.exports = model('User', schema);
