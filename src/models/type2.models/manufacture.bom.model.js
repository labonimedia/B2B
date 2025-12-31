const mongoose = require('mongoose');
const { paginate, toJSON } = require('../plugins');

const { Schema } = mongoose;

/* ---------- Material Line Item Schema ---------- */
const materialSchema = new Schema(
  {
    materialCode: { type: String, trim: true },
    categoryName: { type: String, trim: true },
    categoryCode: { type: String, trim: true },
    subcategoryCode: { type: String, trim: true },
    subcategoryName: { type: String, trim: true },
    note: { type: String, trim: true },
    details: { type: String, trim: true },
    quantityParameter: { type: String, trim: true },
    materialName: { type: String, required: true, trim: true },
    materialType: { type: String, trim: true }, // Fabric, Button, etc.
    uom: { type: String, required: true }, // Unit of Measurement
    qtyPerPiece: { type: Number, required: true },
    wastagePercent: { type: Number, default: 0 },
    colorDependent: { type: Boolean, default: false },
  },
  { _id: false }
);

/* ---------- Size-level BOM Schema ---------- */
const sizeSchema = new Schema(
  {
    designNumber: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      required: true,
      trim: true,
    },
    size: { type: String, required: true, trim: true }, // XS, S, M, L, XL
    notes: { type: String, trim: true },
    materials: [materialSchema], // Material list per size
  },
  { _id: false }
);

/* ---------- Main BOM Schema ---------- */
const bomSchema = new Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductType2',
      required: true,
    },

    manufacturerEmail: {
      type: String,
      required: true,
      trim: true,
    },

    designNumber: {
      type: String,
      required: true,
      trim: true,
    },

    sizes: [sizeSchema], // BOM per size
  },
  { timestamps: true }
);

/* --- UNIQUE BOM RULE ---
   Single BOM for:
   Product + Manufacturer + Design + Color
*/
bomSchema.index({ productId: 1, manufacturerEmail: 1, designNumber: 1 }, { unique: true });

bomSchema.plugin(toJSON);
bomSchema.plugin(paginate);

const ManufactureBOM = mongoose.model('ManufactureBOM', bomSchema);
module.exports = ManufactureBOM;
