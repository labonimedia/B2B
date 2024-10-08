const mongoose = require('mongoose');
const { paginate, toJSON } = require('./plugins');

const wholesalerProductSchema = mongoose.Schema(
  {
    setOfWholesalerPrice: {
      type: String,
    },
    wholesalerEmail: {
      type: String,
    },
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
    // quantity: { type: Number },
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
    minimumOrderQty: { type: Number },
    closureType: { type: String },
    pocketDescription: { type: String },
    sleeveCuffStyle: { type: String },
    sleeveLength: { type: String },
    careInstructions: { type: String },
    country: { type: String },
    city: { type: String },
    state: { type: String },

    // new aded properties
    seasons: { type: String },
    noOfPockets: { type: String },
    scoksStyle: { type: String },
    troursePocketDescription: { type: String },
    layerCompression: { type: String },
    Waistband: { type: String },
    includedComponents: { type: String },
    riseStyle: { type: String },
    trouserFitStyle: { type: String },
    troursePocket: { type: String },
    trourseRiseStyle: { type: String },
    trourseStyle: { type: String },
    trourseLength: { type: String },
    coinPocket: { type: String },

    womenSleeveType: { type: String },
    fitType: { type: String },
    neckline: { type: String },
    elasticity: { type: String },
    topStyle: { type: String },
    workType: { type: String },
    collarstyle: { type: String },
    itemLength: { type: String },
    embellishmentFeature: { type: String },
    itemStyle: { type: String },
    waistType: { type: String },
    waistRise: { type: String },
    weaveType: { type: String },
    ethnicDesign: { type: String },
    sareeStyle: { type: String },
    apparelSilhouette: { type: String },
    bottomIncluded: { type: String },
    ethnicBottomsStyle: { type: String },
    womenStyle: { type: String },
    gheraInMTR: { type: String },
    finishType: { type: String },

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
        waistSizeSetStandardSize: {
          type: String,
        },
        waist: {
          type: String,
        },
        inseam: {
          type: String,
        },
        lengthIn: {
          type: String,
        },
        rise: {
          type: String,
        },
        length: { type: String },
        width: { type: String },
        height: { type: String },
        weight: { type: String },
        manufacturerPrice: { type: String },
        wholesalerPrice: { type: Number },
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
// wholesalerProductSchema.index({ productBy: 1, designNumber: 1 }, { unique: true });
// Add text index to searchable fields
wholesalerProductSchema.index({
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
wholesalerProductSchema.plugin(toJSON);
wholesalerProductSchema.plugin(paginate);

/**
 * @typedef Product
 */

const WholesalerProducts = mongoose.model('WholesalerProducts', wholesalerProductSchema);
module.exports = WholesalerProducts;
