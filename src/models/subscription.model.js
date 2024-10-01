const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  productLimit: {
    type: Number, // Number of products allowed
    required: true,
  },
  additionalProductPrice: {
    type: Number, // Price for each additional product
    required: true,
  },
  productsUsed: {
    type: Number,
    default: 0, // Track how many products have been added
  },
  price: {
    type: Number,
    required: true, // Subscription price
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: true, // Subscription expiration date
  },
  status: {
    type: String,
    enum: ['active', 'expired'],
    default: 'active',
  },
});

// add plugin that converts mongoose to json
subscriptionSchema.plugin(toJSON);
subscriptionSchema.plugin(paginate);

const Subscription = mongoose.model('Subscription', subscriptionSchema);
module.exports = Subscription;
