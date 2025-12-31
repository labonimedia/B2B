const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');

const { Schema } = mongoose;

/* -------------------- Vendor Details Schema -------------------- */
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

/* -------------------- Warehouse Row Mapping -------------------- */
const rackRowMappingSchema = new Schema(
  {
    rackName: { type: String, trim: true },
    rowName: { type: String, trim: true },
  },
  { _id: false }
);

/* -------------------- Warehouse Details Schema -------------------- */
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
    // NEW FIELD (VALID ARRAY)
    //rackRowMappings: parsedRackRowMappings,
    isPrimary: Boolean,
    storageCapacity: String,
  },
  { _id: false }
);

/* ------------------------------ Item Schema ------------------------------ */
const itemSchema = new Schema(
  {
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'ManufactureCategory' },
    categoryName: { type: String, trim: true },
    categoryCode: { type: String, trim: true },

    subcategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'ManufactureSubcategory' },
    subcategoryCode: { type: String, trim: true },
    subcategoryName: { type: String, trim: true },
    itemName: { type: String, required: true, trim: true },
    code: { type: String, trim: true },
    parameter: { type: String, trim: true },
    vendorDetails: vendorDetailsSchema,
    warehouseDetails: warehouseDetailsSchema,
    stockInHand: { type: Number, default: 0 },
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
  },
  { timestamps: true }
);

// Unique item name per subcategory
itemSchema.index({ subcategoryId: 1, itemName: 1 }, { unique: true });

itemSchema.plugin(toJSON);
itemSchema.plugin(paginate);

const ManufactureMasterItem = mongoose.model('ManufactureMasterItem', itemSchema);

module.exports = ManufactureMasterItem;
