const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const wholesalerSchema = mongoose.Schema(
  {
    discountGiven: [
      {
        discountGivenBy: {
          type: String,
        },
        category: {
          type: String,
        },
        productDiscount: {
          type: String,
        },
        shippingDiscount: {
          type: String,
        },
      },
    ],
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
      // required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    introduction: {
      type: String,
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
    isVerifyKYC: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
wholesalerSchema.plugin(toJSON);
wholesalerSchema.plugin(paginate);

/**
 * @typedef Wholesaler
 */

const Wholesaler = mongoose.model('Wholesaler', wholesalerSchema);

module.exports = Wholesaler;
