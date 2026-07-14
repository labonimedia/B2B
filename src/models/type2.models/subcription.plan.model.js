const mongoose = require('mongoose');
const { paginate, toJSON } = require('../plugins');

const subscriptionPlanSchema = new mongoose.Schema(
  {
    planName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    planCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      unique: true,
    },

    description: {
      type: String,
      default: '',
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage',
    },

    discountValue: {
      type: Number,
      default: 0,
      min: 0,
    },

    finalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: 'INR',
    },

    validity: {
      type: Number,
      required: true,
      default: 30,
    },

    // validityType: {
    //   type: String,
    //   enum: ['days', 'months', 'years'],
    //   default: 'days',
    // },
    validityType: {
      type: String,
      enum: ['minutes', 'days', 'months', 'years'],
      default: 'days',
    },
    features: [
      {
        type: String,
        trim: true,
      },
    ],

    maxProducts: {
      type: Number,
      default: 0,
    },

    maxOrders: {
      type: Number,
      default: 0,
    },

    maxUsers: {
      type: Number,
      default: 1,
    },

    isPopular: {
      type: Boolean,
      default: false,
    },

    isRecommended: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },

    createdBy: {
      type: String,
      default: null,
    },

    updatedBy: {
      type: String,
      default: null,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Auto Calculate Final Amount
 */
subscriptionPlanSchema.pre('save', function (next) {
  if (this.discountType === 'percentage') {
    this.finalAmount = this.amount - (this.amount * this.discountValue) / 100;
  } else {
    this.finalAmount = this.amount - this.discountValue;
  }

  if (this.finalAmount < 0) {
    this.finalAmount = 0;
  }

  next();
});

/**
 * Plugins
 */
subscriptionPlanSchema.plugin(toJSON);
subscriptionPlanSchema.plugin(paginate);

/**
 * Static Methods
 */

subscriptionPlanSchema.statics.isPlanNameTaken = async function (planName, excludeId) {
  const plan = await this.findOne({
    planName,
    _id: { $ne: excludeId },
    isDeleted: false,
  });

  return !!plan;
};

subscriptionPlanSchema.statics.isPlanCodeTaken = async function (planCode, excludeId) {
  const plan = await this.findOne({
    planCode,
    _id: { $ne: excludeId },
    isDeleted: false,
  });

  return !!plan;
};

const SubscriptionPlan = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);

module.exports = SubscriptionPlan;
