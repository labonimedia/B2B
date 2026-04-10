const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');

const channelPartnerSchema = mongoose.Schema(
  {
    // 🔥 Commission Setup (from Manufacturer)
    commissionGiven: [
      {
        commissionGivenBy: {
          type: String, // manufacturer email
        },
        id: {
          type: String,
        },
        category: {
          type: String,
        },
        productCommission: {
          type: String, // % or fixed
        },
        shippingCommission: {
          type: String,
        },
      },
    ],

    // 🔹 Profile (Same as Retailer)
    logo: String,
    file: String,
    fileName: String,
    profileImg: String,

    altCode: String,
    referralCode: {
      type: String,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    companyName: String,

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },

    password: {
      type: String,
      minlength: 8,
      private: true,
    },

    // 🔹 Address Info
    address: String,
    introduction: String,
    country: String,
    state: String,
    city: String,
    pinCode: String,

    mobNumber: String,
    mobNumber2: String,
    email2: String,

    GSTIN: String,
    pan: String,

    establishDate: Date,
    turnover: String,

    registerOnFTH: {
      type: Date,
      default: Date.now,
    },

    userCode: String,
    contryCode: String,

    leagalStatusOfFirm: String,

    // 🔹 Social
    socialMedia: {
      facebook: String,
      instagram: String,
      linkedIn: String,
      webSite: String,
    },

    // 🔹 KYC
    kycVerified: {
      type: Boolean,
      default: false,
    },

    // 🔹 Bank
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

    // 🔥 Manufacturer Linking (VERY IMPORTANT)
    linkedManufacturers: [
      {
        manufacturerEmail: String,
        manufacturerName: String,
        isApproved: {
          type: Boolean,
          default: false,
        },
      },
    ],

    // 🔥 Retailers managed by CP
    retailers: [
      {
        retailerName: String,
        retailerEmail: String,
        mobileNumber: String,
        shopName: String,
        city: String,
        state: String,
      },
    ],

    // 🔥 Earnings Tracking
    totalCommissionEarned: {
      type: Number,
      default: 0,
    },

    pendingCommission: {
      type: Number,
      default: 0,
    },

    // 🔹 Status
    status: {
      type: String,
      enum: ['pending', 'approved', 'blocked'],
      default: 'pending',
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // 🔹 Invitation
    invitedBy: {
      type: String, // manufacturer email
    },

    registrationType: {
      type: String,
      enum: ['self', 'invited'],
      default: 'self',
    },
  },
  {
    timestamps: true,
  }
);

// 🔹 Indexes
channelPartnerSchema.index({ email: 1, isActive: 1, kycVerified: 1 });
channelPartnerSchema.index({ 'linkedManufacturers.manufacturerEmail': 1 });

// 🔹 Plugins
channelPartnerSchema.plugin(toJSON);
channelPartnerSchema.plugin(paginate);

// 🔹 Password Hash
channelPartnerSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

/**
 * @typedef ChannelPartner
 */
const ChannelPartner = mongoose.model('ChannelPartner', channelPartnerSchema);

module.exports = ChannelPartner;
