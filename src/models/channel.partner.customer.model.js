const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const channelPartnerCustomerSchema = new mongoose.Schema(
  {
    // 🔥 Link with Channel Partner
    channelPartnerEmail: {
      type: String,
      required: true,
      index: true,
    },

    // 🔥 Login Email (User model reference)
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },

    // 🔹 Basic Profile
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    shopName: {
      type: String,
    },

    companyName: {
      type: String,
    },

    profileImg: {
      type: String,
    },

    logo: {
      type: String,
    },

    file: {
      type: String,
    },

    fileName: {
      type: String,
    },

    altCode: {
      type: String,
    },

    // 🔹 Contact
    mobileNumber: {
      type: String,
    },

    altMobileNumber: {
      type: String,
    },

    email2: {
      type: String,
      trim: true,
      lowercase: true,
    },

    // 🔹 Address
    address: {
      type: String,
    },

    country: {
      type: String,
    },

    state: {
      type: String,
    },

    city: {
      type: String,
    },

    pinCode: {
      type: String,
    },

    // 🔹 Business Info
    introduction: {
      type: String,
    },

    GSTIN: {
      type: String,
    },

    pan: {
      type: String,
    },

    establishDate: {
      type: Date,
    },

    turnover: {
      type: String,
    },

    registerOnFTH: {
      type: Date,
      default: Date.now,
    },

    userCode: {
      type: String,
    },

    contryCode: {
      type: String,
    },

    leagalStatusOfFirm: {
      type: String,
    },

    // 🔹 Social Media
    socialMedia: {
      facebook: String,
      instagram: String,
      linkedIn: String,
      webSite: String,
    },

    // 🔹 Bank Details
    BankDetails: {
      accountNumber: Number,
      accountType: String,
      bankName: String,
      IFSCcode: String,
      country: String,
      city: String,
      branch: String,
      swiftCode: String,
    },

    // 🔹 KYC
    kycVerified: {
      type: Boolean,
      default: false,
    },

    // 🔹 Status
    isActive: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: ['active', 'blocked'],
      default: 'active',
    },

    // 🔹 Referral
    referralCode: {
      type: String,
    },

    addedBy: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// 🔥 Prevent duplicate shopkeeper under same CP
channelPartnerCustomerSchema.index({ channelPartnerEmail: 1, email: 1 }, { unique: true });

// 🔥 Useful indexes
channelPartnerCustomerSchema.index({ email: 1, isActive: 1 });
channelPartnerCustomerSchema.index({ city: 1, state: 1 });

// 🔹 Plugins
channelPartnerCustomerSchema.plugin(toJSON);
channelPartnerCustomerSchema.plugin(paginate);

const ChannelPartnerCustomer = mongoose.model('ChannelPartnerCustomer', channelPartnerCustomerSchema);

module.exports = ChannelPartnerCustomer;
