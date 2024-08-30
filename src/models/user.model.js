const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const Counter = require('./counter.model');

const userSchema = mongoose.Schema(
  {
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
    password: {
      type: String,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true,
    },
    role: {
      type: String,
      enum: ['superadmin', 'manufacture', 'wholesaler', 'distributer', 'retailer'],
      default: 'user',
    },
    code: {
      type: String,
    },
    userId: {
      type: String,
      unique: true, // Ensure that codes are unique
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isMobilePhone(value, ['en-IN'])) {
          throw new Error('Invalid mobile number');
        }
      },
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    refByEmail: [
      {
        type: String,
      },
    ],
    blackListed: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});
userSchema.pre('save', async function (next) {
  const user = this;
  
  if (user.isNew) {
    let prefix;
    if (user.role === 'manufacturer') {
      prefix = 'MAN';
    } else if (user.role === 'wholesaler') {
      prefix = 'WHO';
    } else if (user.role === 'retailer') {
      prefix = 'RET';
    } else {
      next(new Error('Invalid role for generating ID'));
      return;
    }

    const counter = await Counter.findOneAndUpdate(
      { role: user.role },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    user.userId = `${prefix}${String(counter.seq).padStart(4, '0')}`;
  }

  next();
});
/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
