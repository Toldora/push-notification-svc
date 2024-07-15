const { TrackClient, RegionEU } = require('customerio-node');
require('dotenv').config();

const customerClient = new TrackClient(
  process.env.CUSTOMER_SITE_ID,
  process.env.CUSTOMER_API_KEY,
  {
    region: RegionEU,
  },
);

module.exports = {
  customerClient,
};
