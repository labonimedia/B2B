const mongoose = require('mongoose');
const { paginate, toJSON } = require('./plugins');

const productSchema = mongoose.Schema(
  {
    currency: {
      type: String,
    },
    productBy: {
      type: String,
    },
    dateOfManufacture: {
      type: Date,
    },
    dateOfListing: {
      type: Date,
    },
    designNumber: {
      type: String,
    },
    quantity: { type: Number },
    discount: {
      type: String,
    },
    quantity: { type: Number },
    brand: { type: String },
    productType: { type: String },
    gender: { type: String },
    clothing: { type: String },
    subCategory: { type: String },
    productTitle: { type: String },
    productDescription: { type: String },
    material: { type: String },
    materialvariety: { type: String },
    fabricPattern: { type: String },
    selectedOccasion: { type: [String] },
    selectedlifeStyle: { type: [String] },
    specialFeature: { type: [String] },
    fitStyle: { type: String },
    neckStyle: { type: String },
    closureType: { type: String },
    pocketDescription: { type: String },
    sleeveCuffStyle: { type: String },
    sleeveLength: { type: String },
    careInstructions: { type: String },
    sizes: { type: [String], default: [] },
    ProductDeimension: [
      {
        length: { type: String },
        width: { type: String },
        height: { type: String },
      },
    ],
    setOFnetWeight: { type: String },
    setOfMRP: { type: String },
    setOfManPrice: { type: String },
    sizes: [
      {
        standardSize: {
          type: String,
        },
        brandSize: {
          type: String,
        },
        chestSize: {
          type: String,
        },
        shoulderSize: {
          type: String,
        },
        frontLength: {
          type: String,
        },
        length: { type: String },
        width: { type: String },
        height: { type: String },
        weight: { type: String },
        manufacturerPrice: { type: String },
        singleMRP: { type: String },
      },
    ],
    colourCollections: [
      {
        colour: {
          type: String,
        },
        colourName: { type: String },
        colourImage: { type: String },
        productImages: [{ type: String }],
        productVideo: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);
// Add text index to searchable fields
productSchema.index({
  productBy: 'text',
  brand: 'text',
  productType: 'text',
  gender: 'text',
  clothing: 'text',
  subCategory: 'text',
  productTitle: 'text',
  productDescription: 'text',
  material: 'text',
  materialvariety: 'text',
  fabricPattern: 'text',
  selectedOccasion: 'text',
  selectedlifeStyle: 'text',
  specialFeature: 'text',
  fitStyle: 'text',
  neckStyle: 'text',
  closureType: 'text',
  pocketDescription: 'text',
  sleeveCuffStyle: 'text',
  sleeveLength: 'text',
  careInstructions: 'text',
});
// add plugin that converts mongoose to json
productSchema.plugin(toJSON);
productSchema.plugin(paginate);

/**
 * @typedef Product
 */

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
