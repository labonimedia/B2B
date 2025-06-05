const mongoose = require('mongoose');
const { paginate, toJSON } = require('../plugins');

const POWholesalerToManufacturerSchema = new mongoose.Schema(
  {
    set: [
      {
        designNumber: String,
        colour: String,
        colourName: String,
        size: String,
        totalQuantity: Number, // Combined quantity
        availableQuantity: {
          type: Number,
          default: 0,
        }, // Updated by manufacturer
        status: {
          type: String,
          enum: ['pending', 'processing', 'shipped', 'delivered'],
          default: 'pending',
        },
        clothing: String,
        gender: String,
        subCategory: String,
        productType: String,
        manufacturerPrice: String,
        price: String,
        retailerPoLinks: [
          {
            poId: mongoose.Schema.Types.ObjectId, // Retailer PO ID
            setItemId: mongoose.Schema.Types.ObjectId, // Specific set item ID
            quantity: Number
          }
        ]
      }
    ],
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
      productDiscount: String,
      category: String,
      profileImg: String,
      logo: String,
    },
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
      profileImg: String,
      logo: String,
    },
    manufacturerEmail: String,
    wholesalerEmail: String,
    statusAll: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered'],
      default: 'pending'
    },
    poNumber: Number,
    createdFromRetailerPoIds: [mongoose.Schema.Types.ObjectId],
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

POWholesalerToManufacturerSchema.plugin(toJSON);
POWholesalerToManufacturerSchema.plugin(paginate);
    
const POWholesalerToManufacturer = mongoose.model('POWholesalerToManufacturer', POWholesalerToManufacturerSchema);
module.exports = POWholesalerToManufacturer;