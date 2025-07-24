
const mongoose = require('mongoose');
const { paginate, toJSON } = require('../plugins');

 // Embedded schema for Transport Details
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

const POWholesalerToManufacturerSchema = new mongoose.Schema(
  {
    set: [
      {
        designNumber: String,
        colour: String,
        colourName: String,
        size: String,
        totalQuantity: Number,
        availableQuantity: {
          type: Number,
          default: 0,
        },
        status: {
          type: String,
          enum: [
            'pending',
            'm_cancelled',
            'm_confirmed',
            'm_partial_delivery',
            'w_confirmed',
            'w_cancelled'
          ],
          default: 'pending',
        },
        clothing: String,
        gender: String,
        subCategory: String,
        productType: String,
        manufacturerPrice: String,
          //transportDetails: transportDetailsSchema,
        price: String,
        retailerPoLinks: [
          {
            poId: mongoose.Schema.Types.ObjectId,
            setItemId: mongoose.Schema.Types.ObjectId,
            quantity: Number
          }
        ]
      }
    ],
     // transportDetails: transportDetailsSchema,
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
      enum: [
        'pending',
        'm_order_confirmed',
         'm_order_updated',
        'm_order_cancelled',
        'm_partial_delivery',
        'w_order_confirmed',
        'w_order_cancelled',
        'shipped',
        'delivered'
      ],
      default: 'pending'
    },

    expDeliveryDate: {
      type: Date, // Expected or actual delivery date
    },
    partialDeliveryDate: {
      type: Date, // partail or actual delivery date
    },

    wholesalerConfirmedAt: {
      type: Date, // When retailer confirms the PO
    },
    manufacturerNote: {
      type: String,
      trim: true,
    },
    wholesalerNote: {
      type: String,
      trim: true,
    },

    poNumber: Number,
    wholesalerPODateCreated: {
      type: Date,
      default: Date.now
    },
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

const POWholesalerToManufacturer = mongoose.model(
  'POWholesalerToManufacturer',
  POWholesalerToManufacturerSchema
);

module.exports = POWholesalerToManufacturer;
