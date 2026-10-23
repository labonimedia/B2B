const cron = require('node-cron');
const logger = require('../config/logger');

const {
  expireSubscriptions,
} = require('../services/type2.services/helper/subscription.expiry.helper');

/**
 * Start Subscription Expiry Job
 */
const startSubscriptionExpiryJob = () => {
//   /*
//   |--------------------------------------------------------------------------
//   | Every Minute
//   |--------------------------------------------------------------------------
//   |
//   | Testing:
//   | * * * * *
//   |
//   | Production Recommended:
//   | */5 * * * *
//   |
//   //*/

  cron.schedule('* * * * *', async () => {
    try {
      const result = await expireSubscriptions();

      if (result.modifiedCount > 0) {
        logger.info(
          `Subscription Expiry Job: ${result.modifiedCount} subscription(s) expired`
        );
      }
    } catch (error) {
      logger.error(
        `Subscription Expiry Job Failed: ${error.message}`
      );
    }
  });

  logger.info('Subscription Expiry Job started');
};

module.exports = {
  startSubscriptionExpiryJob,
};