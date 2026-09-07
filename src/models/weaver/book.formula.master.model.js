const mongoose = require('mongoose');

const { paginate, toJSON } = require('../plugins');

const formulaFieldSchema = new mongoose.Schema(
  {
    enabled: {
      type: Boolean,
      default: false,
    },

    value: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    _id: false,
  }
);

const masterSchema = mongoose.Schema(
  {
    // ==========================================
    // BASIC DETAILS
    // ==========================================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================================
    // FORMULA FIELDS
    // ==========================================

    taka: {
      type: formulaFieldSchema,
      default: () => ({}),
    },

    pcs: {
      type: formulaFieldSchema,
      default: () => ({}),
    },

    weight: {
      type: formulaFieldSchema,
      default: () => ({}),
    },

    meters: {
      type: formulaFieldSchema,
      default: () => ({}),
    },

    bundle: {
      type: formulaFieldSchema,
      default: () => ({}),
    },

    carton: {
      type: formulaFieldSchema,
      default: () => ({}),
    },

    cops: {
      type: formulaFieldSchema,
      default: () => ({}),
    },

    con: {
      type: formulaFieldSchema,
      default: () => ({}),
    },

    bag: {
      type: formulaFieldSchema,
      default: () => ({}),
    },

    denier: {
      type: formulaFieldSchema,
      default: () => ({}),
    },

    beam: {
      type: formulaFieldSchema,
      default: () => ({}),
    },

    ends: {
      type: formulaFieldSchema,
      default: () => ({}),
    },

    creel: {
      type: formulaFieldSchema,
      default: () => ({}),
    },

    palate: {
      type: formulaFieldSchema,
      default: () => ({}),
    },

    cut: {
      type: formulaFieldSchema,
      default: () => ({}),
    },

    qnty: {
      type: formulaFieldSchema,
      default: () => ({}),
    },

    pano: {
      type: formulaFieldSchema,
      default: () => ({}),
    },

    box18: {
      type: formulaFieldSchema,
      default: () => ({}),
    },

    box19: {
      type: formulaFieldSchema,
      default: () => ({}),
    },

    box20: {
      type: formulaFieldSchema,
      default: () => ({}),
    },

    // ==========================================
    // FORMULA / REMARKS
    // ==========================================

    formula: {
      type: String,
      trim: true,
    },

    remarks: {
      type: String,
      trim: true,
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

// Same formula name should not repeat
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

// Weaver-wise listing
masterSchema.index({
  weaverId: 1,
  name: 1,
});

// Formula search
masterSchema.index({
  weaverId: 1,
  formula: 1,
});

masterSchema.plugin(toJSON);
masterSchema.plugin(paginate);

const WeaverBookFormulaMaster = mongoose.model('WeaverBookFormulaMaster', masterSchema);

module.exports = WeaverBookFormulaMaster;
