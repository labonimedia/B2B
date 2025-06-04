const mongoose = require('mongoose');
const { paginate, toJSON } = require('../plugins');

const PORetailerToManufacturerSchema = new mongoose.Schema(
  {
    set: [
      {
        productBy: String, // Manufacturer email
        designNumber: String,
        colour: String,
        colourImage: String,
        colourName: String,
        size: String,
        quantity: Number, // Requested by retailer
        availableQuantity:{
          type: Number,
          default: 0, 
        } , // Updated by manufacturer
        confirmed: {
          type: Boolean,
          default: false, // Confirmed by retailer (true = accepted, false = not yet acted or cancelled)
        },
        rejected: {
          type: Boolean,
          default: false, // Retailer rejects the updated quantity
        },
        status: {
          type: String,
          enum: ['pending', 'manufacturer_updated', 'retailer_confirmed', 'cancelled', 'processing', 'shipped', 'delivered'],
          default: 'pending',
        },
        price: String,
        productType: String,
        gender: String,
        clothing: String,
        subCategory: String,
      },
    ],
    statusAll: {
      type: String,
      enum: ['pending', 'manufacturer_updated', 'partially_confirmed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    email: String, // Retailer email
    manufacturerEmail: String,
    discount: Number,
    retailerPoDate: {
      type: Date,
      default: Date.now,
    },
    poNumber: Number,

    manufacturer: {
      email: String,
      fullName: String,
      companyName: String,
      address: String,
      state: String,
      country: String,
      pinCode: String,
      mobNumber: String,
      GSTIN: String,
    },
    retailer: {
      email: String,
      fullName: String,
      companyName: String,
      address: String,
      state: String,
      country: String,
      pinCode: String,
      mobNumber: String,
      GSTIN: String,
      logo: String,
      productDiscount: String,
      category: String,
    },

    cartId: String,
  },
  {
    timestamps: true,
  }
);

// Plugins
PORetailerToManufacturerSchema.plugin(toJSON);
PORetailerToManufacturerSchema.plugin(paginate);

// Model
const PORetailerToManufacturer = mongoose.model(
  'PORetailerToManufacturer',
  PORetailerToManufacturerSchema
);

module.exports = PORetailerToManufacturer;
