const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');

const manufactureSchema = mongoose.Schema(
  {
    logo: {
      type: String,
    },
    file: {
      type: String,
    },
    fileName: {
      type: String,
    },
    profileImg: {
      type: String,
    },
    currency: {
      type: String,
    },
    leagalStatusOfFirm: {
      type: String,
    },
    fullName: {
      type: String,
      trim: true,
    },
    companyName: {
      type: String,
    },
    email: {
      type: String,
    },
    address: {
      type: String,
    },
    state: {
      type: String,
    },
    introduction: {
      type: String,
    },
    city: {
      type: String,
    },
    country: {
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
    code: {
      type: String,
    },
    altCode: {
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
    visibilitySettings: {
      logo: { type: Boolean, default: true },
      file: { type: Boolean, default: true },
      fileName: { type: Boolean, default: true },
      profileImg: { type: Boolean, default: true },
      currency: { type: Boolean, default: true },
      leagalStatusOfFirm: { type: Boolean, default: true },
      fullName: { type: Boolean, default: true },
      companyName: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      address: { type: Boolean, default: true },
      state: { type: Boolean, default: true },
      introduction: { type: Boolean, default: true },
      city: { type: Boolean, default: true },
      country: { type: Boolean, default: true },
      pinCode: { type: Boolean, default: true },
      mobNumber: { type: Boolean, default: true },
      mobNumber2: { type: Boolean, default: true },
      email2: { type: Boolean, default: true },
      GSTIN: { type: Boolean, default: true },
      pan: { type: Boolean, default: true },
      code: { type: Boolean, default: true },
      establishDate: { type: Boolean, default: true },
      turnover: { type: Boolean, default: true },
      registerOnFTH: { type: Boolean, default: true },

      brandView: [{
        visibility: { type: Boolean },
        brandName: { type: String },
        brandLogo: { type: String },
      }],

      delingInView: {
        type: Boolean,
        default: true
      },

      // Social Media fields
      'socialMedia.facebook': { type: Boolean, default: true },
      'socialMedia.instagram': { type: Boolean, default: true },
      'socialMedia.linkedIn': { type: Boolean, default: true },
      'socialMedia.webSite': { type: Boolean, default: true },

      // Bank Details fields
      'BankDetails.accountNumber': { type: Boolean, default: true },
      'BankDetails.accountType': { type: Boolean, default: true },
      'BankDetails.bankName': { type: Boolean, default: true },
      'BankDetails.IFSCcode': { type: Boolean, default: true },
      'BankDetails.country': { type: Boolean, default: true },
      'BankDetails.city': { type: Boolean, default: true },
      'BankDetails.branch': { type: Boolean, default: true },

      isActive: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
manufactureSchema.plugin(toJSON);
manufactureSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
manufactureSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
manufactureSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

manufactureSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

// Add the static method to get the visible fields
manufactureSchema.methods.getVisibleProfile = function () {
  const manufacture = this.toObject();
  const visibleProfile = {};
  for (const key in manufacture) {
    if (manufacture.visibilitySettings[key] !== false) {
      visibleProfile[key] = manufacture[key];
    }
  }
  return visibleProfile;
};

/**
 * @typedef ManufactureUser
 */
const Manufacture = mongoose.model('Manufacture', manufactureSchema);

module.exports = Manufacture;
