const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const channelPartnerRetailerSchema = new mongoose.Schema(
  {
    channelPartnerEmail: {
      type: String,
      required: true,
      index: true,
    },

    retailerEmail: {
      type: String,
      required: true,
      index: true,
    },

    retailerName: String,
    mobileNumber: String,
    altMobileNumber: String,
    shopName: String,
    city: String,
    state: String,
    country: String,
    isActive: {
      type: Boolean,
      default: true,
    },

    addedBy: {
      type: String,
    },
  },
  { timestamps: true }
);

// 🔥 Prevent duplicate retailer for same CP
channelPartnerRetailerSchema.index({ channelPartnerEmail: 1, retailerEmail: 1 }, { unique: true });

// plugins
channelPartnerRetailerSchema.plugin(toJSON);
channelPartnerRetailerSchema.plugin(paginate);

const ChannelPartnerCustomer = mongoose.model('ChannelPartnerCustomer', channelPartnerRetailerSchema);

module.exports = ChannelPartnerCustomer;
