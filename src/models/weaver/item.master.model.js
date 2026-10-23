const mongoose = require('mongoose');

const { paginate, toJSON } = require('../plugins');

const masterSchema = mongoose.Schema(
  {
    // ==========================================
    // ITEM & TAXATION DETAILS
    // ==========================================

    itemCode: {
      type: String,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    shortName: {
      type: String,
      trim: true,
    },

    hsnCode: {
      type: String,
      trim: true,
    },

    hsnCode2: {
      type: String,
      trim: true,
    },

    gstCalculation: {
      type: String,
      trim: true,
    },

    sgstPercentage: {
      type: Number,
      default: 0,
    },

    cgstPercentage: {
      type: Number,
      default: 0,
    },

    igstPercentage: {
      type: Number,
      default: 0,
    },

    cessPercentage: {
      type: Number,
      default: 0,
    },

    unitOfMeasure: {
      type: String,
      trim: true,
    },

    printUom: {
      type: String,
      trim: true,
    },

    hsnGstr1Uqc: {
      type: String,
      trim: true,
    },

    hsnGstr1Description: {
      type: String,
      trim: true,
    },

    isServiceJob: {
      type: Boolean,
      default: false,
    },

    // ==========================================
    // GROUP DETAILS
    // ==========================================

    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WeaverItemGroupMaster',
      index: true,
    },

    groupName: {
      type: String,
      trim: true,
    },

    subGroupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WeaverItemSubGroupMaster',
      index: true,
    },

    subGroupName: {
      type: String,
      trim: true,
    },

    itemTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WeaverItemTypeMaster',
      index: true,
    },

    itemTypeName: {
      type: String,
      trim: true,
    },

    itemStockTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WeaverItemStockTypeMaster',
      index: true,
    },

    itemStockTypeName: {
      type: String,
      trim: true,
    },

    // ==========================================
    // OTHER DETAILS
    // ==========================================

    denierCut: {
      type: Number,
      default: 0,
    },

    ratePerMtr: {
      type: Number,
      default: 0,
    },

    avgPerMtr: {
      type: Number,
      default: 0,
    },

    itemWeight: {
      type: Number,
      default: 0,
    },

    ratePerPick: {
      type: Number,
      default: 0,
    },

    avgPerPick: {
      type: Number,
      default: 0,
    },

    purchaseRate: {
      type: Number,
      default: 0,
    },

    salesRate: {
      type: Number,
      default: 0,
    },

    costingRate: {
      type: Number,
      default: 0,
    },

    openingStockNos: {
      type: Number,
      default: 0,
    },

    openingQuantity: {
      type: Number,
      default: 0,
    },

    openingAmount: {
      type: Number,
      default: 0,
    },

    knittingMeters: {
      type: Number,
      default: 0,
    },

    recipeConsumption: {
      type: String,
      trim: true,
    },

    cataloguePhoto: {
      type: String,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    addRate: {
      type: Boolean,
      default: false,
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

// Same item code should not repeat
// for the same Weaver.
masterSchema.index(
  {
    weaverId: 1,
    itemCode: 1,
  },
  {
    unique: true,
    sparse: true,
  }
);

// Same item name should not repeat
// for the same Weaver.
masterSchema.index(
  {
    weaverId: 1,
    name: 1,
  },
  {
    unique: true,
  }
);

// Weaver-wise item listing
masterSchema.index({
  weaverId: 1,
  isActive: 1,
});

// Group-wise items
masterSchema.index({
  weaverId: 1,
  groupId: 1,
});

// Sub-group-wise items
masterSchema.index({
  weaverId: 1,
  subGroupId: 1,
});

// Item type-wise items
masterSchema.index({
  weaverId: 1,
  itemTypeId: 1,
});

// Stock type-wise items
masterSchema.index({
  weaverId: 1,
  itemStockTypeId: 1,
});

masterSchema.plugin(toJSON);
masterSchema.plugin(paginate);

const WeaverItemMaster = mongoose.model('WeaverItemMaster', masterSchema);

module.exports = WeaverItemMaster;
