const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');

const userSchema = mongoose.Schema(
  {
    userCategory: {
      type: String,
      default: 'orderwise',
      enum: ['setwise', 'orderwise'],
    },

    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
    },

    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],

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

    // 🔥 UPDATED ROLE ENUM
    role: {
      type: String,
      enum: [
        'superadmin',
        'manufacture',
        'wholesaler',
        'retailer',
        'channelPartner',
        'shopKeeper',
        'masteradmin',
        'sales',

        // ✅ Staff Roles
        'rawMaterialManager',
        'finishedGoodsManager',
        'productManager',
        'orderManager',
      ],
      default: 'retailer',
    },

    // ✅ NEW (Optional - Email Based)
    createdBy: {
      type: String, // manufacturer email
      trim: true,
      index: true,
    },

    code: {
      type: String,
    },

    contryCode: {
      type: String,
    },

    mobileNumber: {
      type: String,
      required: true,
      unique: true,
      validate(value) {
        if (!/^[0-9]{10}$/.test(value)) {
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

    referralCode: {
      type: String,
    },
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubscriptionPlan',
    },

    subscriptionStatus: {
      type: String,
      enum: ['active', 'expired', 'cancelled'],
      default: 'expired',
    },

    subscriptionStartDate: Date,

    subscriptionExpiryDate: Date,

    lastPaymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },
  },
  {
    timestamps: true,
  }
);

// plugins
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

// check email taken
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

// password match
userSchema.methods.isPasswordMatch = async function (password) {
  return bcrypt.compare(password, this.password);
};

// hash password
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

// index
userSchema.index({ refByEmail: 1 });

userSchema.index({
  subscriptionStatus: 1,
  subscriptionExpiryDate: 1,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
