const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');

const manufactureSchema = mongoose.Schema(
  {
    leagalStatusOfFirm: {
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
      unique: true,
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
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    GSTIN: {
      type: String,
    },
    pan: {
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
      }
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

/**
 * @typedef ManufactureUser
 */
const Manufacture = mongoose.model('Manufacture', manufactureSchema);

module.exports = Manufacture;
