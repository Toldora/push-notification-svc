const customerController = require('./customer');
const webpushController = require('./webpush');

module.exports = {
  ...customerController,
  ...webpushController,
};
