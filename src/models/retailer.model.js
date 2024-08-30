const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const retailerSchema = mongoose.Schema(
  {
    file: {
      type: String,
    },
    fileName: {
      type: String,
    },
    profileImg: {
      type: String,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    companyName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
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
    mobNumber: {
      type: String,
    },
    mobNumber2: {
      type: String,
    },
    email2: {
      type: String,
      // trim: true,
      // lowercase: true,
      // validate(value) {
      //   if (!validator.isEmail(value)) {
      //     throw new Error('Invalid email');
      //   }
      // },
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
    registerOnFTH : {
      type: Date,
    },
    code: {
      type: String,
    },
    leagalStatusOfFirm: {
      type: String,
    },
    socialMedia: {
      facebook: {
        type: String,
      },
      instagram: {
        type: String,
      },
      linkedIn: {
        type: String,
      },
      webSite: {
        type: String,
      },
    },
    BankDetails: {
      accountNumber: {
        type: Number,
      },
      accountType: {
        type: String,
      },
      bankName: {
        type: String,
      },
      IFSCcode: {
        type: String,
      },
      country: {
        type: String,
      },
      city: {
        type: String,
      },
      branch: {
        type: String,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
retailerSchema.plugin(toJSON);
retailerSchema.plugin(paginate);

/**
 * @typedef Retailer
 */
const Retailer = mongoose.model('Retailer', retailerSchema);

module.exports = Retailer;
