const mongoose = require('mongoose');
const { paginate, toJSON } = require('../plugins');

const { Schema } = mongoose;

/* ---------------- MATERIAL SCHEMA ---------------- */
const materialSchema = new Schema(
  {
    materialCode: String,
    materialName: { type: String, required: true },
    materialType: String,

    categoryName: String,
    categoryCode: String,
    subcategoryName: String,
    subcategoryCode: String,

    quantityParameter: String,
    uom: String,
    qtyPerPiece: Number,
    wastagePercent: Number,
    colorDependent: Boolean,

    note: String,
    details: String
  },
  { _id: false }
);

/* ---------------- SIZE-WISE BOM ---------------- */
const sizeSchema = new Schema(
  {
    size: { type: String, required: true }, // XS, M, L
    notes: String,
    materials: [materialSchema]
  },
  { _id: false }
);

/* ---------------- COLOR-WISE GROUP ---------------- */
const colorSchema = new Schema(
  {
    color: { type: String, required: true },
    sizes: [sizeSchema]   // Sizes under this color
  },
  { _id: false }
);

/* ---------------- MAIN BOM SCHEMA ---------------- */
const bomSchema = new Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductType2",
      required: true
    },

    manufacturerEmail: {
      type: String,
      required: true,
      trim: true
    },

    designNumber: {
      type: String,
      required: true
    },

    colors: [colorSchema]  // Color → Sizes → Materials
  },
  { timestamps: true }
);

/* ------------ SEARCH INDEXES ------------- */
bomSchema.index(
  { productId: 1, manufacturerEmail: 1, designNumber: 1 },
  { unique: true }
);

bomSchema.index({
  designNumber: 1,
  manufacturerEmail: 1,
  "colors.color": 1,
  "colors.sizes.size": 1
});

bomSchema.index({
  "colors.sizes.materials.materialName": "text",
  "colors.sizes.materials.materialCode": "text",
  "colors.sizes.materials.categoryName": "text",
  "colors.sizes.materials.subcategoryName": "text"
});

/* plugins */
bomSchema.plugin(toJSON);
bomSchema.plugin(paginate);

module.exports = mongoose.model("ManufactureBOM", bomSchema);
