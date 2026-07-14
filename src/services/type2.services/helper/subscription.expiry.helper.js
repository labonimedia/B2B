const { User } = require('../../../models');

/**
 * Expire Active Subscriptions
 *
 * Finds active subscriptions where expiry date has passed
 *
 * @returns {Promise<Object>}
 */
const expireSubscriptions = async () => {
  const currentDate = new Date();

  const result = await User.updateMany(
    {
      subscriptionStatus: 'active',
      subscriptionExpiryDate: {
        $ne: null,
        $lte: currentDate,
      },
    },
    {
      $set: {
        subscriptionStatus: 'expired',
      },
    }
  );

  return {
    matchedCount: result.matchedCount || 0,
    modifiedCount: result.modifiedCount || 0,
  };
};

module.exports = {
  expireSubscriptions,
};