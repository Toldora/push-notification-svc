const { Schema, model, ObjectId } = require('mongoose');

const schema = new Schema({
  users: [
    {
      type: ObjectId,
      ref: 'User',
    },
  ],
  name: {
    type: String,
    required: true,
  },
});

module.exports = model('Casino', schema);
