const mongoose = require('mongoose');

const {
  paginate,
  toJSON,
} = require('../plugins');

const masterSchema = mongoose.Schema(
  {
    // ==========================================
    // BASIC ACCOUNT DETAILS
    // ==========================================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    code: {
      type: String,
      trim: true,
    },

    groupName: {
      type: String,
      trim: true,
    },

    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WeaverMainGroupMaster',
    },

    partnerProprietorPercentage: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ==========================================
    // ADDRESS DETAILS
    // ==========================================

    address1: {
      type: String,
      trim: true,
    },

    address2: {
      type: String,
      trim: true,
    },

    deliveryAddress: {
      type: String,
      trim: true,
    },

    state: {
      type: String,
      trim: true,
    },

    stateCode: {
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

    distance: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ==========================================
    // TAX DETAILS
    // ==========================================

    gstNo: {
      type: String,
      trim: true,
      uppercase: true,
    },

    pan: {
      type: String,
      trim: true,
      uppercase: true,
    },

    igstApplicable: {
      type: Boolean,
      default: false,
    },

    creditDays: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ==========================================
    // CREDIT DETAILS
    // ==========================================

    creditDetails: {
      creditLimit: {
        type: Number,
        default: 0,
        min: 0,
      },

      interestRate: {
        type: Number,
        default: 0,
        min: 0,
      },

      discountDepreciation: {
        type: Number,
        default: 0,
        min: 0,
      },

      rateWithGstInPurchase: {
        type: Boolean,
        default: false,
      },
    },

    // ==========================================
    // CONTACT DETAILS
    // ==========================================

    contactDetails: {
      partyGroup: {
        type: String,
        trim: true,
      },

      contactPerson: {
        type: String,
        trim: true,
      },

      email: {
        type: String,
        trim: true,
        lowercase: true,
      },

      contactNo: {
        type: String,
        trim: true,
      },

      ewbContactNo: {
        type: String,
        trim: true,
      },

      whatsappNo: {
        type: String,
        trim: true,
      },

      telegramNo: {
        type: String,
        trim: true,
      },

      area: {
        type: String,
        trim: true,
      },
    },

    // ==========================================
    // BROKER DETAILS
    // ==========================================

    brokerDetails: {
      brokerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WeaverBrokerMaster',
      },

      brokerName: {
        type: String,
        trim: true,
      },

      brokeragePercentage: {
        type: Number,
        default: 0,
        min: 0,
      },
    },

    // ==========================================
    // TAXATION DETAILS
    // ==========================================

    taxationDetails: {
      udyamMsmeNo: {
        type: String,
        trim: true,
      },

      msmeType: {
        type: String,
        trim: true,
      },

      sezExport: {
        type: Boolean,
        default: false,
      },

      showEpcgInInvoicePrint: {
        type: Boolean,
        default: false,
      },

      compositionTaxPerson: {
        type: Boolean,
        default: false,
      },

      tcsPercentage: {
        type: Number,
        default: 0,
        min: 0,
      },

      tcsLimit: {
        type: Number,
        default: 0,
        min: 0,
      },

      reverseChargeParty: {
        type: Boolean,
        default: false,
      },

      tdsPercentage: {
        type: Number,
        default: 0,
        min: 0,
      },

      tdsLimit: {
        type: Number,
        default: 0,
        min: 0,
      },

      freightFrom: {
        type: String,
        trim: true,
      },

      cess: {
        type: Boolean,
        default: false,
      },

      tdsType: {
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

      gstRoundOff: {
        type: Boolean,
        default: false,
      },
    },

    // ==========================================
    // TRANSPORT DETAILS
    // ==========================================

    transportDetails: {
      transportId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WeaverTransporterMaster',
      },

      transportName: {
        type: String,
        trim: true,
      },

      station: {
        type: String,
        trim: true,
      },
    },

    // ==========================================
    // OTHER DETAILS
    // ==========================================

    otherDetails: {
      remarks: {
        type: String,
        trim: true,
      },

      grade: {
        type: String,
        trim: true,
      },

      salesPerson: {
        type: String,
        trim: true,
      },
    },

    // ==========================================
    // STATUS
    // ==========================================

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    // ==========================================
    // WEAVER / TENANT DETAILS
    // ==========================================

    weaverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WeaverManufacture',
      required: true,
      index: true,
    },

    weaverEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

// ==========================================
// INDEXES
// ==========================================

/**
 * Weaver-wise account lookup
 */
masterSchema.index({
  weaverId: 1,
});

/**
 * Weaver-wise active account lookup
 */
masterSchema.index({
  weaverId: 1,
  isActive: 1,
});

/**
 * Weaver-wise account name search/sort
 */
masterSchema.index({
  weaverId: 1,
  name: 1,
});

/**
 * Prevent duplicate account names
 * for the same Weaver.
 *
 * Collation makes the unique check
 * case-insensitive.
 *
 * Example:
 *
 * Cash Account
 * cash account
 * CASH ACCOUNT
 *
 * All are considered the same.
 */
masterSchema.index(
  {
    weaverId: 1,
    name: 1,
  },
  {
    unique: true,
    collation: {
      locale: 'en',
      strength: 2,
    },
  }
);

masterSchema.plugin(toJSON);
masterSchema.plugin(paginate);

const WeaverAcountMaster = mongoose.model(
  'WeaverAcountMaster',
  masterSchema
);

module.exports = WeaverAcountMaster;