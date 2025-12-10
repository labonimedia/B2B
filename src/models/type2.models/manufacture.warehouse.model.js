
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

const rackSimpleSchema = new Schema(
  {
    rackName: { type: String, trim: true }, // e.g. "A", "B", "C"
    columnsCount: { type: Number, default: 0 }, // number of columns in the rack
    notes: { type: String, trim: true },
    columnNaming: { type: String, trim: true },
  },
  { _id: false }
);

const manufacturerWarehouseSchema = new Schema(
  {
    manufacturerEmail: { type: String, required: true, trim: true },
    warehouseName: { type: String, required: true, trim: true },
    code: { type: String, trim: true, unique: true }, // WH1, WH2...
    contactPersonName: { type: String, trim: true },
    contactNumber: { type: String, trim: true },
    altContactNumber: { type: String, trim: true },
    email: { type: String, trim: true },
    gstNumber: { type: String, trim: true },
    address: addressSchema,
    isPrimary: { type: Boolean, default: false },
    storageCapacity: { type: String, trim: true },
    notes: { type: String, trim: true },

    // SIMPLE racks representation
    racks: {
      type: [rackSimpleSchema],
      default: [],
    },

    // totals for quick read
    totalRacks: { type: Number, default: 0 },
    totalColumns: { type: Number, default: 0 },

    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// uniqueness constraints
manufacturerWarehouseSchema.index({ manufacturerEmail: 1, warehouseName: 1 }, { unique: true });
manufacturerWarehouseSchema.index({ code: 1 }, { unique: true });

manufacturerWarehouseSchema.plugin(toJSON);
manufacturerWarehouseSchema.plugin(paginate);

const ManufacturerWarehouse = mongoose.model('ManufacturerWarehouse', manufacturerWarehouseSchema);

module.exports = ManufacturerWarehouse;
