const mongoose = require('mongoose');
const { paginate, toJSON } = require('../plugins');

const salesRegistrationSchema = new mongoose.Schema(
  {
    // Salesman details
    salesmanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    salesmanEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    // Customer details
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    companyName: {
      type: String,
      default: '',
    },

    customerEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    customerMobile: {
      type: String,
      required: true,
    },

    customerRole: {
      type: String,
      enum: ['manufacture', 'wholesaler', 'retailer', 'channelPartner'],
      required: true,
    },

    // Subscription details
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubscriptionPlan',
      required: true,
    },

    planName: {
      type: String,
      required: true,
    },

    planCode: {
      type: String,
      required: true,
    },

    originalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Discount details
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true,
    },

    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },

    discountAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    discountedAmount: {
      type: Number,
      required: true,
      min: 1,
    },

    // Number of successful payments eligible for discount
    discountMaxUses: {
      type: Number,
      required: true,
      min: 1,
    },

    discountUsedCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    discountStartDate: {
      type: Date,
      default: Date.now,
    },

    discountEndDate: {
      type: Date,
      default: null,
    },

    // Registration/payment summary
    totalPaid: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ['active', 'completed', 'expired', 'cancelled'],
      default: 'active',
      index: true,
    },

    remarks: {
      type: String,
      default: '',
      trim: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
    discountReservedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Salesman-wise records
salesRegistrationSchema.index({
  salesmanId: 1,
  createdAt: -1,
});

// Customer-wise records
salesRegistrationSchema.index({
  customerId: 1,
  createdAt: -1,
});

// Plan-wise records
salesRegistrationSchema.index({
  subscriptionId: 1,
});

// Search support
salesRegistrationSchema.index({
  customerName: 'text',
  customerEmail: 'text',
  companyName: 'text',
});

salesRegistrationSchema.plugin(toJSON);
salesRegistrationSchema.plugin(paginate);

const SalesRegistration = mongoose.model('SalesRegistration', salesRegistrationSchema);

module.exports = SalesRegistration;
