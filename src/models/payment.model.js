const mongoose = require('mongoose');
const { paginate, toJSON } = require('./plugins');

const paymentSchema = new mongoose.Schema(
  {
    // User Information
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      // required: true,
    },

    userEmail: {
      type: String,
      required: true,
      trim: true,
    },

    // Subscription Information
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubscriptionPlan',
      required: true,
    },

    // Snapshot of purchased plan
    planName: {
      type: String,
      required: true,
    },

    planCode: {
      type: String,
      required: true,
    },

    validity: {
      type: Number,
      required: true,
    },

    validityType: {
      type: String,
      enum: ['days', 'months', 'years'],
      required: true,
    },

    // Amount Details
    amount: {
      type: Number,
      required: true,
    },

    discount: {
      type: Number,
      default: 0,
    },

    payableAmount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: 'INR',
    },

    // Razorpay
    razorpayOrderId: {
      type: String,
      required: true,
      unique: true,
    },

    razorpayPaymentId: {
      type: String,
      default: null,
    },

    razorpaySignature: {
      type: String,
      default: null,
    },

    receipt: {
      type: String,
      required: true,
    },

    // Payment Status
    status: {
      type: String,
      enum: ['created', 'paid', 'failed', 'partially_refunded', 'refunded'],
      default: 'created',
    },

    paymentMethod: {
      type: String,
      default: null,
    },

    paymentGateway: {
      type: String,
      default: 'razorpay',
    },

    gatewayResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    verifiedAt: {
      type: Date,
    },

    // Failure Information
    failureReason: {
      type: String,
      default: null,
    },

    failureCode: {
      type: String,
      default: null,
    },

    retryCount: {
      type: Number,
      default: 0,
    },

    // Refund
    refundId: {
      type: String,
      default: null,
    },

    refundAmount: {
      type: Number,
      default: 0,
    },

    refundStatus: {
      type: String,
      enum: ['not_requested', 'pending', 'processed'],
      default: 'not_requested',
    },

    // Webhook
    webhookVerified: {
      type: Boolean,
      default: false,
    },

    webhookPayload: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    // Subscription Dates
    subscriptionStartDate: {
      type: Date,
    },

    subscriptionExpiryDate: {
      type: Date,
    },

    invoiceNumber: {
      type: String,
      default: null,
    },

    remarks: {
      type: String,
      trim: true,
      default: '',
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
    history: [
      {
        event: String,

        status: String,

        message: String,

        payload: mongoose.Schema.Types.Mixed,

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

/*
|--------------------------------------------------------------------------
| Plugins
|--------------------------------------------------------------------------
*/

paymentSchema.plugin(toJSON);
paymentSchema.plugin(paginate);

/*
|--------------------------------------------------------------------------
| Indexes
|--------------------------------------------------------------------------
*/

paymentSchema.index({
  razorpayOrderId: 1,
});

paymentSchema.index({
  razorpayPaymentId: 1,
});

paymentSchema.index({
  userId: 1,
});

paymentSchema.index({
  subscriptionId: 1,
});

paymentSchema.index({
  status: 1,
});

paymentSchema.index({
  createdAt: -1,
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
