const { customerClient } = require('../api');

const createCustomerUser = async clickId => {
  await customerClient.identify(clickId, {
    click_id: clickId,
    created_at: Math.round(+Date.now() / 1000),
    from_pwa: true,
    is_subscribed_on_push: true,
  });
};

const updateCustomerUser = async (clickId, data = {}) => {
  await customerClient.identify(clickId, {
    ...data,
    updated_at: Math.round(+Date.now() / 1000),
  });
};

module.exports = { createCustomerUser, updateCustomerUser };
