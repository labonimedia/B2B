const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const subscriptionPlanSchema = mongoose.Schema(
  {
    planName: {
      type: String,
      required: true,
      enum: ['Standard', 'Premium', 'Enterprise'], // You can add more plans as needed
    },
    productLimit: {
      type: Number,
      required: true,
    },
    subscriptionPrice: {
      type: Number,
      required: true,
    },
    durationInDays: {
      type: Number, // Number of days the subscription lasts
      required: true,
    },
    additionalProductPack: {
      productPackSize: {
        type: Number,
      },
      pricePerPack: {
        type: Number,
      },
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
subscriptionPlanSchema.plugin(toJSON);
subscriptionPlanSchema.plugin(paginate);
/**
 * @typedef SubscriptionPlan
 */
const SubscriptionPlan = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);

module.exports = SubscriptionPlan;
