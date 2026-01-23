const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');

const { Schema } = mongoose;

const vendorDetailsSchema = new Schema(
  {
    vendorName: String,
    companyName: String,
    contactPersonName: String,
    vendorEmail: String,
    contactNumber: String,
    gstNumber: String,
    panNumber: String,
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      country: String,
      pinCode: String,
    },
  },
  { _id: false }
);

const rackRowMappingSchema = new Schema(
  {
    rackName: { type: String, trim: true },
    rowName: { type: String, trim: true },
  },
  { _id: false }
);

const warehouseDetailsSchema = new Schema(
  {
    warehouseName: String,
    code: String,
    contactPersonName: String,
    contactNumber: String,
    email: String,
    gstNumber: String,
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      country: String,
      pinCode: String,
    },
    isPrimary: Boolean,
    storageCapacity: String,
  },
  { _id: false }
);

const inventoryLogSchema = new Schema(
  {
    previousStock: {
      type: Number,
      required: true,
    },
    updatedStock: {
      type: Number,
      required: true,
    },
    changeType: {
      type: String,
      enum: ['stock_added', 'stock_removed', 'adjustment'],
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    updatedBy: {
      type: String, // user email
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const rawMaterialInventorySchema = new Schema(
  {
    masterItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ManufactureMasterItem',
      required: true,
      unique: true,
    },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'ManufactureCategory' },
    categoryName: { type: String, trim: true },
    categoryCode: { type: String, trim: true },
    subcategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'ManufactureSubcategory' },
    subcategoryCode: { type: String, trim: true },
    subcategoryName: { type: String, trim: true },
    itemName: { type: String, required: true, trim: true },
    code: { type: String, trim: true },
    parameter: { type: String, trim: true },
    stockUnit: { type: String, trim: true },
    vendorDetails: vendorDetailsSchema,
    warehouseDetails: warehouseDetailsSchema,
    photo1: String,
    photo2: String,
    details: String,
    note: String,
    isActive: { type: Boolean, default: true },
    rackRowMappings: [rackRowMappingSchema],
    manufacturerEmail: {
      type: String,
      required: true,
      trim: true,
    },
    currentStock: {
      type: Number,
      default: 0,
    },
    minimumStockLevel: {
      type: Number,
      default: 10,
    },
    inventoryLogs: {
      type: [inventoryLogSchema],
      default: [],
    },
  },
  { timestamps: true }
);

rawMaterialInventorySchema.index({ masterItemId: 1 });
rawMaterialInventorySchema.index({ manufacturerEmail: 1 });
rawMaterialInventorySchema.plugin(toJSON);
rawMaterialInventorySchema.plugin(paginate);

const ManufactureRawMaterialInventory = mongoose.model('ManufactureRawMaterialInventory', rawMaterialInventorySchema);
module.exports = ManufactureRawMaterialInventory;
