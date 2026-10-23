const mongoose = require('mongoose');

const { paginate, toJSON } = require('../plugins');

const masterSchema = mongoose.Schema(
  {
    // ==========================================
    // BOOK & OTHER DETAILS
    // ==========================================

    acType: {
      type: String,
      trim: true,
    },

    bookNo: {
      type: Number,
    },

    bookType: {
      type: String,
      trim: true,
    },

    purchaseAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WeaverAcountMaster',
    },

    purchaseAccountName: {
      type: String,
      trim: true,
    },

    salesAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WeaverAcountMaster',
    },

    salesAccountName: {
      type: String,
      trim: true,
    },

    // ==========================================
    // BOOK SETTINGS
    // ==========================================

    gstCalculate: {
      type: Boolean,
      default: false,
    },

    lrDetail: {
      type: Boolean,
      default: false,
    },

    transportDetail: {
      type: Boolean,
      default: false,
    },

    generalPurchase: {
      type: Boolean,
      default: false,
    },

    knittingMeters: {
      type: Boolean,
      default: false,
    },

    purchaseDirectSales: {
      type: Boolean,
      default: false,
    },

    stockJobIssue: {
      type: Boolean,
      default: false,
    },

    billPayInCash: {
      type: Boolean,
      default: false,
    },

    setInvoiceNoInChallanNo: {
      type: Boolean,
      default: false,
    },

    showRateInChallan: {
      type: Boolean,
      default: false,
    },

    jobItcChallan04: {
      type: Boolean,
      default: false,
    },

    orderType: {
      type: String,
      trim: true,
    },

    deliveryChallanStockOn: {
      type: String,
      trim: true,
    },

    salesPurchaseRateFrom: {
      type: String,
      trim: true,
    },

    discountFrom: {
      type: String,
      trim: true,
    },

    transportVehicleFrom: {
      type: String,
      trim: true,
    },

    formula: {
      type: String,
      trim: true,
    },

    rateRoundOff: {
      type: Number,
      default: 0,
    },

    itemStockType: {
      type: String,
      trim: true,
    },

    bookShowInMill: {
      type: Boolean,
      default: false,
    },

    deliveryChallanTakaEntryOn: {
      type: String,
      trim: true,
    },

    showEInvoice: {
      type: Boolean,
      default: false,
    },

    showEWaybill: {
      type: Boolean,
      default: false,
    },

    calcOnRemarksSum: {
      type: String,
      trim: true,
    },

    copyToNextRow: {
      type: String,
      trim: true,
    },

    columnsCopyToNextRow: {
      type: String,
      trim: true,
    },

    useChallanInInvoiceOn: {
      type: String,
      trim: true,
    },

    useJobChallanInInvoiceOn: {
      type: String,
      trim: true,
    },

    autoSuggestionOn: {
      type: String,
      trim: true,
    },

    showMainGroupsParties: {
      type: String,
      trim: true,
    },

    // ==========================================
    // TDS / TCS DETAILS
    // ==========================================

    taxType: {
      type: String,
      trim: true,
    },

    typeOfGoods: {
      type: String,
      trim: true,
    },

    cutAutoTdsJv: {
      type: Boolean,
      default: false,
    },

    tdsCalculationOn: {
      type: String,
      trim: true,
    },

    tdsAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WeaverAcountMaster',
    },

    tdsAccountName: {
      type: String,
      trim: true,
    },

    addAutoTcsJv: {
      type: Boolean,
      default: false,
    },

    tcsCalculationOn: {
      type: String,
      trim: true,
    },

    tcsAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WeaverAcountMaster',
    },

    tcsAccountName: {
      type: String,
      trim: true,
    },

    // ==========================================
    // PREFIX / POSTFIX
    // ==========================================

    prefixPostfix: {
      salesBill: {
        prefix: {
          type: String,
          trim: true,
        },
        postfix: {
          type: String,
          trim: true,
        },
      },

      deliveryChallan: {
        prefix: {
          type: String,
          trim: true,
        },
        postfix: {
          type: String,
          trim: true,
        },
      },

      salesReturn: {
        prefix: {
          type: String,
          trim: true,
        },
        postfix: {
          type: String,
          trim: true,
        },
      },

      salesReturnCN: {
        prefix: {
          type: String,
          trim: true,
        },
        postfix: {
          type: String,
          trim: true,
        },
      },

      salesReturnDN: {
        prefix: {
          type: String,
          trim: true,
        },
        postfix: {
          type: String,
          trim: true,
        },
      },

      purchaseReturn: {
        prefix: {
          type: String,
          trim: true,
        },
        postfix: {
          type: String,
          trim: true,
        },
      },

      purchaseReturnCN: {
        prefix: {
          type: String,
          trim: true,
        },
        postfix: {
          type: String,
          trim: true,
        },
      },

      purchaseReturnDN: {
        prefix: {
          type: String,
          trim: true,
        },
        postfix: {
          type: String,
          trim: true,
        },
      },

      purchaseOrder: {
        prefix: {
          type: String,
          trim: true,
        },
        postfix: {
          type: String,
          trim: true,
        },
      },

      salesOrder: {
        prefix: {
          type: String,
          trim: true,
        },
        postfix: {
          type: String,
          trim: true,
        },
      },

      order: {
        prefix: {
          type: String,
          trim: true,
        },
        postfix: {
          type: String,
          trim: true,
        },
      },

      millIssue: {
        prefix: {
          type: String,
          trim: true,
        },
        postfix: {
          type: String,
          trim: true,
        },
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

// Same Book No should not repeat for same Weaver
masterSchema.index(
  {
    weaverId: 1,
    bookNo: 1,
  },
  {
    unique: true,
    sparse: true,
  }
);

// Weaver-wise listing
masterSchema.index({
  weaverId: 1,
  isActive: 1,
});

// Search
masterSchema.index({
  weaverId: 1,
  bookType: 1,
});

masterSchema.plugin(toJSON);
masterSchema.plugin(paginate);

const WeaverSalesPurchaseBookMaster = mongoose.model('WeaverSalesPurchaseBookMaster', masterSchema);

module.exports = WeaverSalesPurchaseBookMaster;
