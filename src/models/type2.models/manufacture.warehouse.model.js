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
    rackName: { type: String, trim: true },
    columnsCount: { type: Number, default: 0 },
    rowCount: { type: Number, default: 0 },
    rowNames: [{ type: String, trim: true }],
    columnNames: [{ type: String, trim: true }],
    notes: { type: String, trim: true },
  },
  { _id: false }
);

const manufacturerWarehouseSchema = new Schema(
  {
    manufacturerEmail: { type: String, required: true, trim: true },
    warehouseName: { type: String, required: true, trim: true },
    code: { type: String, trim: true, unique: true },
    contactPersonName: { type: String, trim: true },
    contactNumber: { type: String, trim: true },
    altContactNumber: { type: String, trim: true },
    email: { type: String, trim: true },
    gstNumber: { type: String, trim: true },
    address: addressSchema,
    isPrimary: { type: Boolean, default: false },
    storageCapacity: { type: String, trim: true },
    notes: { type: String, trim: true },
    racks: {
      type: [rackSimpleSchema],
      default: [],
    },
    totalRacks: { type: Number, default: 0 },
    totalColumns: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

manufacturerWarehouseSchema.index({ manufacturerEmail: 1, warehouseName: 1 }, { unique: true });
manufacturerWarehouseSchema.index({ code: 1 }, { unique: true });
manufacturerWarehouseSchema.plugin(toJSON);
manufacturerWarehouseSchema.plugin(paginate);

const ManufacturerWarehouse = mongoose.model('ManufacturerWarehouse', manufacturerWarehouseSchema);

module.exports = ManufacturerWarehouse;
