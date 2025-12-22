const mongoose = require("mongoose");
const { toJSON, paginate } = require("../plugins");

const { Schema } = mongoose;

const vendorDetailsSchema = new Schema({
//   vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "ManufacturerVendor" },

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
}, { _id: false });

const warehouseDetailsSchema = new Schema({
 // warehouseId: { type: mongoose.Schema.Types.ObjectId, ref: "ManufacturerWarehouse" },

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
}, { _id: false });

const itemSchema = new Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ManufactureCategory",
     // required: true,
    },

    categoryName: {
      type: String,
    //  required: true,
      trim: true,
    },
        categoryCode: {
      type: String,
    //  required: true,
      trim: true,
    },

    subcategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ManufactureSubcategory",
    //  required: true,
    },

  subcategoryCode: {
        type: String,
    //  required: true,
      trim: true,
    //  required: true,
    },
    
    subcategoryName: {
      type: String,
      //required: true,
      trim: true,
    },

    itemName: {
      type: String,
      required: true,
      trim: true,
    },

    code: {
      type: String,
      trim: true,
    //  unique: true, // ITEM001, ITEM002...
    },

    // Vendor full details
    vendorDetails: vendorDetailsSchema,

    // Warehouse full details
    warehouseDetails: warehouseDetailsSchema,

    // // Optional reference IDs (for backend operations)
    // vendorId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "ManufacturerVendor",
    // },

    // warehouseId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "ManufacturerWarehouse",
    // },

    stockInHand: {
      type: Number,
      default: 0,
    },

    photo1: String,
    photo2: String,

    details: String,
    note: String,

    isActive: { type: Boolean, default: true },
  },

  { timestamps: true }
);

// Unique item name per subcategory
itemSchema.index({ subcategoryId: 1, itemName: 1 }, { unique: true });

itemSchema.plugin(toJSON);
itemSchema.plugin(paginate);

const ManufactureMasterItem = mongoose.model(
  "ManufactureMasterItem",
  itemSchema
);

module.exports = ManufactureMasterItem;
