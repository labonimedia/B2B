const mongoose = require('mongoose');

const { paginate, toJSON } = require('../plugins');

const firmMasterSchema = mongoose.Schema(
  {
    // ==========================================
    // BASIC DETAILS
    // ==========================================

    firmCode: {
      type: String,
      trim: true,
    },

    firmName: {
      type: String,
      required: true,
      trim: true,
    },

    ownerName: {
      type: String,
      trim: true,
    },

    officeAddress: {
      type: String,
      trim: true,
    },

    factoryAddress: {
      type: String,
      trim: true,
    },

    phoneNo: {
      type: String,
      trim: true,
    },

    collectionName: {
      type: String,
      trim: true,
    },

    order: {
      type: String,
      trim: true,
    },

    emailId: {
      type: String,
      trim: true,
      lowercase: true,
    },

    backupEmailId: {
      type: String,
      trim: true,
      lowercase: true,
    },

    contactPerson: {
      type: String,
      trim: true,
    },

    referenceBy: {
      type: String,
      trim: true,
    },

    godNameInBill: {
      type: String,
      trim: true,
    },

    businessDescription: {
      type: String,
      trim: true,
    },

    // ==========================================
    // TAXATION DETAILS
    // ==========================================

    stateName: {
      type: String,
      trim: true,
    },

    city: {
      type: String,
      trim: true,
    },

    pincode: {
      type: String,
      trim: true,
    },

    gstNo: {
      type: String,
      trim: true,
      uppercase: true,
    },

    panNo: {
      type: String,
      trim: true,
      uppercase: true,
    },

    firmType: {
      type: String,
      trim: true,
    },

    udyamMsmeNo: {
      type: String,
      trim: true,
    },

    msmeType: {
      type: String,
      trim: true,
    },

    terms: {
      type: String,
      trim: true,
    },

    lutNo: {
      type: String,
      trim: true,
    },

    lutDate: {
      type: Date,
    },

    reportFormat: {
      type: String,
      trim: true,
    },

    soAdjustIn: {
      type: String,
      trim: true,
    },

    poAdjustIn: {
      type: String,
      trim: true,
    },

    showItemImage: {
      type: Boolean,
      default: false,
    },

    epcgNo: {
      type: String,
      trim: true,
    },

    epcgNoDate: {
      type: Date,
    },

    theme: {
      type: String,
      trim: true,
    },

    challanMultiBook: {
      type: Boolean,
      default: false,
    },

    // ==========================================
    // FINANCIAL YEAR
    // ==========================================

    financialYear: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================================
    // GST ACCOUNT DETAILS
    // ==========================================

    sgstAccount: {
      name: {
        type: String,
        trim: true,
      },

      code: {
        type: String,
        trim: true,
      },
    },

    cgstAccount: {
      name: {
        type: String,
        trim: true,
      },

      code: {
        type: String,
        trim: true,
      },
    },

    igstAccount: {
      name: {
        type: String,
        trim: true,
      },

      code: {
        type: String,
        trim: true,
      },
    },

    cessAccount: {
      name: {
        type: String,
        trim: true,
      },

      code: {
        type: String,
        trim: true,
      },
    },

    otherAccount: {
      name: {
        type: String,
        trim: true,
      },

      code: {
        type: String,
        trim: true,
      },
    },

    // ==========================================
    // E-INVOICE / E-WAY BILL CREDENTIALS
    // ==========================================

    eInvoiceUsernameEnabled: {
      type: Boolean,
      default: false,
    },

    eInvoiceUsername: {
      type: String,
      trim: true,
    },

    eInvoicePassword: {
      type: String,
      trim: true,
    },

    eWayBillUsernameEnabled: {
      type: Boolean,
      default: false,
    },

    eWayBillUsername: {
      type: String,
      trim: true,
    },

    eWayBillPassword: {
      type: String,
      trim: true,
    },

    eInvoiceContactNo: {
      type: String,
      trim: true,
    },

    // ==========================================
    // INSURANCE
    // ==========================================

    insurancePolicyNo: {
      type: String,
      trim: true,
    },

    insuranceExpiryDate: {
      type: Date,
    },

    // ==========================================
    // DEFAULT
    // ==========================================

    isDefault: {
      type: Boolean,
      default: false,
    },

    // ==========================================
    // DOCUMENT / LOGO FILES
    // ==========================================

    firmLogoLeft: {
      type: String,
      trim: true,
    },

    firmLogoRight: {
      type: String,
      trim: true,
    },

    invoiceSign: {
      type: String,
      trim: true,
    },

    challanSign: {
      type: String,
      trim: true,
    },

    envelopLogo: {
      type: String,
      trim: true,
    },

    // ==========================================
    // BANK DETAILS
    // ==========================================

    bankDetails: [
      {
        name: {
          type: String,
          trim: true,
        },

        ifsc: {
          type: String,
          trim: true,
          uppercase: true,
        },

        accountNo: {
          type: String,
          trim: true,
        },

        branch: {
          type: String,
          trim: true,
        },
      },
    ],

    // ==========================================
    // OWNER / USER DETAILS
    // ==========================================

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },

    manufactureEmail: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
    },

    // ==========================================
    // STATUS
    // ==========================================

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// ==========================================
// INDEXES
// ==========================================

firmMasterSchema.index({
  userId: 1,
  firmName: 1,
});

firmMasterSchema.index({
  manufactureEmail: 1,
  firmName: 1,
});

firmMasterSchema.index({
  gstNo: 1,
});

firmMasterSchema.index({
  panNo: 1,
});

firmMasterSchema.index({
  isDefault: 1,
});

// ==========================================
// PLUGINS
// ==========================================

firmMasterSchema.plugin(toJSON);

firmMasterSchema.plugin(paginate);

// ==========================================
// DEFAULT FIRM LOGIC
// ==========================================

firmMasterSchema.pre('save', async function (next) {
  const firm = this;

  if (firm.isDefault) {
    await mongoose.model('FirmMaster').updateMany(
      {
        userId: firm.userId,
        _id: {
          $ne: firm._id,
        },
      },
      {
        $set: {
          isDefault: false,
        },
      }
    );
  }

  next();
});

const FirmMaster = mongoose.model('FirmMaster', firmMasterSchema);

module.exports = FirmMaster;
