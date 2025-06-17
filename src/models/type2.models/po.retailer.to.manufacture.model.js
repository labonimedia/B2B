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
         // enum: ['pending', 'manufacturer_updated', 'retailer_confirmed', 'cancelled', 'processing', 'shipped', 'delivered', 'partial'],
         enum: [
          'pending',             // Initial status
          'm_confirmed',         // Manufacturer confirmed
          'm_cancelled',         // Manufacturer cancelled
          'm_partial_delivery',  // Manufacturer partially delivered
          'r_confirmed',         // Retailer confirmed
          'r_cancelled',         // Retailer cancelled
          'shipped',             // Fully shipped
          'delivered'            // Fully delivered
        ],        
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
      enum: [
        'pending',
        'm_order_confirmed',
        'm_order_updated',
        'm_order_cancelled',
        'm_partial_delivery',
        'r_order_confirmed',
        'r_order_cancelled',
        'shipped',
        'delivered'
      ],
      default: 'pending'
    },

    // New Fields
    deliveryDate: {
      type: Date, // Expected or actual delivery date
    },

    retailerConfirmedAt: {
      type: Date, // When retailer confirms the PO
    },
    manufacturerNote: {
      type: String,
      trim: true,
    },
    retailerNote: {
      type: String,
      trim: true,
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

// const mongoose = require('mongoose');
// const { paginate, toJSON } = require('../plugins');

// const PORetailerToManufacturerSchema = new mongoose.Schema(
//   {
//     set: [
//       {
//         designNumber: String,
//         colour: String,
//         colourName: String,
//         size: String,
//         totalQuantity: Number,
//         availableQuantity: {
//           type: Number,
//           default: 0,
//         },
//         status: {
//           type: String,
//           enum: [
//             'pending',
//             'm_cancelled',
//             'm_confirmed',
//             'm_partial_delivery',
//             'r_confirmed',
//             'r_cancelled'
//           ],
//           default: 'pending',
//         },
//         clothing: String,
//         gender: String,
//         subCategory: String,
//         productType: String,
//         manufacturerPrice: String,
//         price: String,
//         retailerPoLinks: [
//           {
//             poId: mongoose.Schema.Types.ObjectId,
//             setItemId: mongoose.Schema.Types.ObjectId,
//             quantity: Number
//           }
//         ]
//       }
//     ],
//     wholesaler: {
//       email: String,
//       fullName: String,
//       companyName: String,
//       address: String,
//       state: String,
//       country: String,
//       pinCode: String,
//       mobNumber: String,
//       GSTIN: String,
//       productDiscount: String,
//       category: String,
//       profileImg: String,
//       logo: String,
//     },
//     manufacturer: {
//       email: String,
//       fullName: String,
//       companyName: String,
//       address: String,
//       state: String,
//       country: String,
//       pinCode: String,
//       mobNumber: String,
//       GSTIN: String,
//       profileImg: String,
//       logo: String,
//     },
//     manufacturerEmail: String,
//     wholesalerEmail: String,

//     // Status for the whole PO
//     statusAll: {
//       type: String,
//       enum: [
//         'pending',
//         'm_order_confirmed',
//         'm_order_cancelled',
//         'm_partial_delivery',
//         'r_order_confirmed',
//         'r_order_cancelled',
//         'shipped',
//         'delivered'
//       ],
//       default: 'pending'
//     },

//     // New Fields
//     deliveryDate: {
//       type: Date, // Expected or actual delivery date
//     },

//     retailerConfirmedAt: {
//       type: Date, // When retailer confirms the PO
//     },
//     manufacturerNote: {
//       type: String,
//       trim: true,
//     },
//     retailerNote: {
//       type: String,
//       trim: true,
//     },

//     poNumber: Number,
//     wholesalerPODateCreated: {
//       type: Date,
//       default: Date.now
//     },
//     createdFromRetailerPoIds: [mongoose.Schema.Types.ObjectId],

//     createdAt: {
//       type: Date,
//       default: Date.now
//     }
//   },
//   {
//     timestamps: true
//   }
// );

// PORetailerToManufacturerSchema.plugin(toJSON);
// PORetailerToManufacturerSchema.plugin(paginate);

// const PORetailerToManufacturer = mongoose.model('PORetailerToManufacturer', PORetailerToManufacturerSchema);

// module.exports = PORetailerToManufacturer;
