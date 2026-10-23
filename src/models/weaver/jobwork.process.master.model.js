const mongoose = require('mongoose');

const { paginate, toJSON } = require('../plugins');

const masterSchema = mongoose.Schema(
  {
    // ==========================================
    // PROCESS DETAILS
    // ==========================================

    processCode: {
      type: Number,
      required: true,
    },

    processName: {
      type: String,
      required: true,
      trim: true,
    },

    orderBy: {
      type: Number,
      default: 0,
    },

    processType: {
      type: String,
      required: true,
      trim: true,
      enum: ['Regular', 'Create Job', 'Complete Job'],
      default: 'Regular',
    },

    remarks: {
      type: String,
      trim: true,
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

// Same process code should not repeat
// for the same Weaver.
masterSchema.index(
  {
    weaverId: 1,
    processCode: 1,
  },
  {
    unique: true,
  }
);

// Same process name should not repeat
// for the same Weaver.
masterSchema.index(
  {
    weaverId: 1,
    processName: 1,
  },
  {
    unique: true,
  }
);

// Weaver-wise listing
masterSchema.index({
  weaverId: 1,
  isActive: 1,
});

// Process search
masterSchema.index({
  weaverId: 1,
  processName: 1,
});

// ==========================================
// PLUGINS
// ==========================================

masterSchema.plugin(toJSON);
masterSchema.plugin(paginate);

// ==========================================
// MODEL
// ==========================================

const WeaverJobworkProcessMaster = mongoose.model('WeaverJobworkProcessMaster', masterSchema);

module.exports = WeaverJobworkProcessMaster;
