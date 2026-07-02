const { User } = require('../../../models');

/**
 * Activate User Subscription
 * Used by:
 * 1. verifyPayment()
 * 2. Razorpay Webhook
 */
const activateSubscription = async (payment, startDate, expiryDate) => {
  await User.findByIdAndUpdate(
    payment.userId,
    {
      subscriptionId: payment.subscriptionId,

      subscriptionStatus: 'active',

      subscriptionStartDate: startDate,

      subscriptionExpiryDate: expiryDate,

      lastPaymentId: payment._id,
    },
    {
      new: true,
    }
  );
};

module.exports = {
  activateSubscription,
};
