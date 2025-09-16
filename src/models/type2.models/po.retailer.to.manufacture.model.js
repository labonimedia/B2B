const mongoose = require('mongoose');
const { paginate, toJSON } = require('../plugins');

// // Embe
// Embedded schema for Bank Details
const bankDetailsSchema = new mongoose.Schema({
  accountHolderName: {
    type: String,
    // required: true,w
    trim: true,
  },
  accountNumber: {
    type: String,
    // required: true,
    trim: true,
  },
  accountType: {
    type: String,
    // required: true,
    trim: true,
  },
  bankName: {
    type: String,
    // required: true,
    trim: true,
  },
  branchName: {
    type: String,
    trim: true,
  },
  ifscCode: {
    type: String,
    // required: true,
    trim: true,
  },
  swiftCode: {
    type: String,
    // required: true,
    trim: true,
  },
  upiId: {
    type: String,
    trim: true,
  },
  bankAddress: {
    type: String,
    trim: true,
  },
});

const transportDetailsSchema = new mongoose.Schema({
  transportType: {
    type: String,
    trim: true,
  },
  transporterCompanyName: {
    type: String,
    trim: true,
  },
  vehicleNumber: {
    type: String,
    trim: true,
  },
  contactNumber: {
    type: Number,
    trim: true,
  },
  altContactNumber: {
    type: Number,
    trim: true,
  },
  trackingId: {
    type: String,
    trim: true,
  },
  modeOfTransport: {
    type: String,
    enum: ['road', 'railway', 'air', 'sea', 'other', 'self'],
  },
  dispatchDate: {
    type: Date,
    // required: true,
  },
  expectedDeliveryDate: {
    type: Date,
  },
  deliveryDate: {
    type: Date,
  },
  deliveryAddress: {
    type: String,
    // required: true,
  },
  remarks: {
    type: String,
    trim: true,
  },
  gstNumber: {
    type: String,
    trim: true,
    // required: true,
  },
  contactPersonName: {
    type: String,
    trim: true,
  },
  note: {
    type: String,
    trim: true,
  },
});

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
        quantity: Number,
        expectedQty: {
          type: Number,
          //    default: 0,
        }, // Requested by retailer
        availableQuantity: {
          type: Number,
          default: 0,
        }, // Updated by manufacturer
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
            'pending', // Initial status
            'm_confirmed', // Manufacturer confirmed
            'm_cancelled', // Manufacturer cancelled
            'm_partial_delivery', // Manufacturer partially delivered
            'r_confirmed', // Retailer confirmed
            'r_cancelled', // Retailer cancelled
            'shipped', // Fully shipped
            'delivered',
            'make_to_order', // Fully delivered
          ],
          default: 'pending',
        },
        price: String,
        productType: String,
        gender: String,
        clothing: String,
        subCategory: String,
        hsnCode: {
          type: String,
        },
        hsnGst: {
          type: Number,
        },
        hsnDescription: {
          type: String,
        },
        brandName: {
          type: String,
        },
      },
    ],
    transportDetails: transportDetailsSchema,
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
        'make_to_order',
        'shipped',
        'delivered',
      ],
      default: 'pending',
    },

    expDeliveryDate: {
      type: Date, // Expected or actual delivery date
    },
    partialDeliveryDate: {
      type: Date, // partail or actual delivery date
    },
    invoiceGenerated: {
      type: Boolean,
      default: false, // partail or actual delivery date
    },
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'M2RPerformaInvoice',
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
    previousPoNumber: String,
    previousPoId: String,
    cartId: String,
    bankDetails: bankDetailsSchema,
  },
  {
    timestamps: true,
  }
);

// Plugins
PORetailerToManufacturerSchema.plugin(toJSON);
PORetailerToManufacturerSchema.plugin(paginate);

// Model
const PORetailerToManufacturer = mongoose.model('PORetailerToManufacturer', PORetailerToManufacturerSchema);

module.exports = PORetailerToManufacturer;
