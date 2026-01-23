const mongoose = require('mongoose');
const crypto = require('crypto');
const { paginate, toJSON } = require('../plugins');

// Utility function to convert a string to title case
const toTitleCase = (str) => {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

const productSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      // required: true,
    },
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
      // required: true,
    },
    bomFilled: { type: Boolean, default: false },
    FSIN: {
      type: String,
      unique: true,
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
    initialQTY: { type: Number },
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

    seasons: { type: String },
    noOfPockets: { type: String },
    scoksStyle: { type: String },
    troursePocketDescription: { type: String },
    layerCompression: { type: String },
    Waistband: { type: String },
    includedComponents: { type: String },
    riseStyle: { type: String },
    trouserFitStyle: { type: String }, // is trouser fit type
    troursePocket: { type: String },
    trourseRiseStyle: { type: String },
    trourseStyle: { type: String },
    trourseLength: { type: String },
    coinPocket: { type: String },

    /// newly added fields
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

    dimensions: {
      height: {
        type: String,
      },
      width: {
        type: String,
      },
      length: {
        type: String,
      },
      weight: {
        type: String,
      },
    },

    // sizes: { type: [String], default: [] },
    hsnCode: {
      type: String,
    },
    hsnDescription: {
      type: String,
    },
      bomId: {
      type: String,
    },
    hsnGst: {
      type: Number,
    },
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
        neckSize: {
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
        RtlPrice: { type: Number },
        onlinePrice: { type: Number },
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
    inventory: [
      {
        colourName: { type: String },
        colourImage: { type: String },
        colour: { type: String },
        quantity: { type: Number },
        size: { type: String },
      },
    ],
    minimumStock: [
      {
        colourName: { type: String },
        colourImage: { type: String },
        colour: { type: String },
        quantity: { type: Number },
        size: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);
productSchema.index({ productBy: 1, designNumber: 1 }, { unique: true });
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

  womenSleeveType: 'text',
  fitType: 'text',
  neckline: 'text',
  elasticity: 'text',
  topStyle: 'text',
  workType: 'text',
  collarstyle: 'text',
  itemLength: 'text',
  embellishmentFeature: 'text',
  itemStyle: 'text',
  waistType: 'text',
  waistRise: 'text',
  weaveType: 'text',
  ethnicDesign: 'text',
  sareeStyle: 'text',
  apparelSilhouette: 'text',
  bottomIncluded: 'text',
  ethnicBottomsStyle: 'text',
  womenStyle: 'text',
  gheraInMTR: 'text',
  finishType: 'text',
});
// add plugin that converts mongoose to json
productSchema.plugin(toJSON);
productSchema.plugin(paginate);

// Pre-save hook to ensure colourName in inventory is saved in title case
productSchema.pre('save', function (next) {
  const product = this;

  // Ensure colourName in inventory is title-cased
  if (product.inventory) {
    product.inventory.forEach((item) => {
      if (item.colourName) {
        item.colourName = toTitleCase(item.colourName);
      }
    });
  }

  // Generate the unique code for FSIN if it hasn't been set
  if (!product.FSIN) {
    const uniqueCode = crypto.randomBytes(6).toString('hex').toUpperCase();
    product.FSIN = uniqueCode;
  }

  next();
});
productSchema.pre('find', function (next) {
  const currentDate = new Date();
  this.where({ dateOfListing: { $lte: currentDate } }); // Apply filter on every 'find' query
  next();
});
productSchema.statics.findUpcomingProducts = function () {
  const currentDate = new Date();

  return this.find({ dateOfListing: { $gt: currentDate } }); // Filter products where dateOfListing is greater than the current date
};

const ProductType2 = mongoose.model('ProductType2', productSchema);
module.exports = ProductType2;
