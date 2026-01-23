const mongoose = require('mongoose');
const { paginate, toJSON } = require('../plugins');

const { Schema } = mongoose;

const materialSchema = new Schema(
  {
    materialCode: String,
    materialName: { type: String, required: true },
    materialType: String,
    categoryName: String,
    categoryCode: String,
    subcategoryName: String,
    subcategoryCode: String,
    photo1: String,
    photo2: String,
    quantityParameter: String,
    uom: String,
    qtyPerPiece: Number,
    wastagePercent: Number,
    colorDependent: Boolean,
    note: String,
    details: String,
  },
  { _id: false }
);

const sizeSchema = new Schema(
  {
    size: { type: String, required: true },
    notes: String,
    materials: [materialSchema],
  },
  { _id: false }
);

const colorSchema = new Schema(
  {
    color: { type: String, required: true },
    sizes: [sizeSchema],
  },
  { _id: false }
);

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
    },
    colors: [colorSchema],
  },
  { timestamps: true }
);

bomSchema.index({ productId: 1, manufacturerEmail: 1, designNumber: 1 }, { unique: true });

bomSchema.index({
  designNumber: 1,
  manufacturerEmail: 1,
  'colors.color': 1,
  'colors.sizes.size': 1,
});

bomSchema.index({
  'colors.sizes.materials.materialName': 'text',
  'colors.sizes.materials.materialCode': 'text',
  'colors.sizes.materials.categoryName': 'text',
  'colors.sizes.materials.subcategoryName': 'text',
});

bomSchema.plugin(toJSON);
bomSchema.plugin(paginate);

module.exports = mongoose.model('ManufactureBOM', bomSchema);
