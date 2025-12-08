const mongoose = require('mongoose');
const { paginate, toJSON } = require('../plugins');

const { Schema } = mongoose;

const addressSchema = new Schema({
  line1: { type: String, trim: true },
  line2: { type: String, trim: true },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  country: { type: String, trim: true },
  pinCode: { type: String, trim: true },
});

const manufacturerWarehouseSchema = new Schema(
  {
    manufacturerEmail: {
      type: String,
      required: true,
      trim: true,
    },

    warehouseName: {
      type: String,
      required: true,
      trim: true,
    },

    code: {
      type: String,
      trim: true, // e.g. WH001, PUNE_WH, etc.
    },

    contactPersonName: {
      type: String,
      trim: true,
    },

    contactNumber: {
      type: String,
      trim: true,
    },

    altContactNumber: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
    },

    gstNumber: {
      type: String,
      trim: true,
    },

    address: addressSchema,

    isPrimary: {
      type: Boolean,
      default: false,
    },

    storageCapacity: {
      type: String,
      trim: true, // e.g. "10000 sq ft", "5000 units"
    },

    notes: {
      type: String,
      trim: true,
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

// Avoid duplicate warehouse name per manufacturer
manufacturerWarehouseSchema.index(
  { manufacturerEmail: 1, warehouseName: 1 },
  { unique: true }
);
manufacturerWarehouseSchema.index({ code: 1 }, { unique: true });

manufacturerWarehouseSchema.plugin(toJSON);
manufacturerWarehouseSchema.plugin(paginate);

const ManufacturerWarehouse = mongoose.model('ManufacturerWarehouse', manufacturerWarehouseSchema);

module.exports = ManufacturerWarehouse;
