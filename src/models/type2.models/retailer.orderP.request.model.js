const mongoose = require('mongoose');
const { paginate, toJSON } = require('../plugins');

const RetailerPartialRequestSchema = mongoose.Schema(
  {
    deliveryChallanId: {
      type: String,
    },
    poNumber: {
      type: Number,
      required: true,
    },
    retailerEmail: {
      type: String,
      required: true,
    },
    wholesalerEmail: {
      type: String,
      required: true,
    },
    requestType: {
      type: String,
      enum: ['partial_delivery', 'checked', 'cancel'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'checked'],
      default: 'pending',
    },
    requestedItems: [
      {
        statusSingle: {
          type: String,
          enum: ['pending', 'approved', 'rejected'],
          default: 'pending',
        },
        designNumber: String,
        colour: String,
        colourName: String,
        size: String,
        orderedQuantity: Number,
        availableQuantity: Number,
      },
    ],
    contativeDate: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);

// Add plugins for JSON conversion & pagination
RetailerPartialRequestSchema.plugin(toJSON);
RetailerPartialRequestSchema.plugin(paginate);

const RetailerPartialReq = mongoose.model('RetailerPartialReq', RetailerPartialRequestSchema);

module.exports = RetailerPartialReq;
