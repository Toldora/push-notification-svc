const { Schema, model, ObjectId } = require('mongoose');

const schema = new Schema({
  clickId: {
    type: String,
    unique: true,
  },
  subscription: {
    type: ObjectId,
    ref: 'Subscription',
    required() {
      return this.subscription !== null;
    },
  },
});

module.exports = model('User', schema);
