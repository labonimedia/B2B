const mongoose = require('mongoose');
const { paginate, toJSON } = require('../plugins');

// // Embedded schema for Transport Details
// const transportDetailsSchema = new mongoose.Schema({
//    transportType: {
//     type: String,
//     trim: true,
//   },
//   transporterCompanyName: {
//     type: String,
//     trim: true,
//   },
//   vehicleNumber: {
//     type: String,
//     trim: true,
//   },
//   contactNumber: {
//     type: Number,
//     trim: true,
//   },
//   altContactNumber: {
//     type: Number,
//     trim: true,
//   },
//   trackingId: {
//     type: String,
//     trim: true,
//   },
//   modeOfTransport: {
//     type: String,
//     enum: ['road', 'railway', 'air', 'sea', 'other'],
//   },
//   dispatchDate: {
//     type: Date,
//     required: true,
//   },
//   expectedDeliveryDate: {
//     type: Date,
//   },
//   deliveryDate: {
//     type: Date,
//   },
//   deliveryAddress: {
//     type: String,
//     required: true,
//   },
//   remarks: {
//     type: String,
//     trim: true,
//   },
//   gstNumber: {
//     type: String,
//     trim: true,
//     required: true,
//   },
//   contactPersonName: {
//     type: String,
//     trim: true,
//   },
// });

const PORetailerToWholesalerSchema = new mongoose.Schema(
  {
    set: [
      {
        productBy: String,
        designNumber: String,
        colour: String,
        colourImage: String,
        colourName: String,
        size: String,
        quantity: Number, // Requested by retailer
        availableQuantity:{
          type: Number,
          default: 0, 
        } , // Updated by wholesaler
        confirmed: {
          type: Boolean,
          default: false, // Confirmed by retailer if changes are made
        },
        status: {
          type: String,
          enum: ['pending','partial' ,'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
          default: 'pending',
        },
        manufacturerPrice: String,
        price: String,
        productType: String,
        gender: String,
        clothing: String,
        subCategory: String,
      },
    ],
      //transportDetails: transportDetailsSchema,
    statusAll: {
      type: String,
      enum: ['pending','wholesaler_updated', 'processing', 'delivered', 'cancelled'],
      default: 'pending',
    },
    email: String, // Retailer email
    wholesalerEmail: String,
    discount: Number,
    retailerPoDate: {
      type: Date,
      default: Date.now,
    },
    poNumber: Number,
    wholesaler: {
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
    cartId:String,
  },
  {
    timestamps: true,
  }
);

PORetailerToWholesalerSchema.plugin(toJSON);
PORetailerToWholesalerSchema.plugin(paginate);


const PORetailerToWholesaler = mongoose.model('PORetailerToWholesaler', PORetailerToWholesalerSchema);

module.exports = PORetailerToWholesaler;
