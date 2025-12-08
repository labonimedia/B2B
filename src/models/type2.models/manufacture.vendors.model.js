const mongoose = require('mongoose');
const { paginate, toJSON } = require('../plugins');

const { Schema } = mongoose;

// // Reuse-style embedded Bank Details schema
// const bankDetailsSchema = new Schema({
//   accountHolderName: {
//     type: String,
//     trim: true,
//   },
//   accountNumber: {
//     type: String,
//     trim: true,
//   },
//   accountType: {
//     type: String,
//     trim: true,
//   },
//   bankName: {
//     type: String,
//     trim: true,
//   },
//   branchName: {
//     type: String,
//     trim: true,
//   },
//   ifscCode: {
//     type: String,
//     trim: true,
//   },
//   swiftCode: {
//     type: String,
//     trim: true,
//   },
//   upiId: {
//     type: String,
//     trim: true,
//   },
//   bankAddress: {
//     type: String,
//     trim: true,
//   },
// });

const manufacturerVendorSchema = new Schema(
  {
    manufacturerEmail: {
      type: String,
      required: true,
      trim: true,
    },

    vendorName: {
      type: String,
      required: true,
      trim: true,
    },

    companyName: {
      type: String,
      trim: true,
    },

    contactPersonName: {
      type: String,
      trim: true,
    },

    vendorEmail: {
      type: String,
      required: true,
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

    gstNumber: {
      type: String,
      trim: true,
    },

    panNumber: {
      type: String,
      trim: true,
    },

    address: {
      line1: { type: String, trim: true },
      line2: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true },
      pinCode: { type: String, trim: true },
    },

    materialCategories: [
      {
        type: String,
        trim: true, // e.g. "Fabric", "Buttons", "Zippers", "Packaging"
      },
    ],

    paymentTerms: {
      type: String,
      trim: true, // e.g. "30 days credit", "Advance", etc.
    },

   // bankDetails: bankDetailsSchema,

    notes: {
      type: String,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
     code: {
      type: String,
      trim: true, 
       // unique: true,// e.g. WH001, PUNE_WH, etc.
    },
  },
  {
    timestamps: true,
  }
);

// Unique: one vendorEmail per manufacturer (avoid duplicates)
manufacturerVendorSchema.index(
  { manufacturerEmail: 1, vendorEmail: 1 },
  { unique: true }
);
manufacturerVendorSchema.index({ code: 1 }, { unique: true });

manufacturerVendorSchema.plugin(toJSON);
manufacturerVendorSchema.plugin(paginate);

const ManufacturerVendor = mongoose.model('ManufacturerVendor', manufacturerVendorSchema);

module.exports = ManufacturerVendor;
