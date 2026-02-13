const mongoose = require('mongoose');
const { paginate, toJSON } = require('../plugins');

const bankDetailsSchema = new mongoose.Schema({
  accountHolderName: {
    type: String,
    trim: true,
  },
  accountNumber: {
    type: String,
    trim: true,
  },
  accountType: {
    type: String,
    trim: true,
  },
  bankName: {
    type: String,
    trim: true,
  },
  branchName: {
    type: String,
    trim: true,
  },
  ifscCode: {
    type: String,
    trim: true,
  },
  swiftCode: {
    type: String,
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
  },
  expectedDeliveryDate: {
    type: Date,
  },
  deliveryDate: {
    type: Date,
  },
  deliveryAddress: {
    type: String,
  },
  remarks: {
    type: String,
    trim: true,
  },
  gstNumber: {
    type: String,
    trim: true,
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
        },
        availableQuantity: {
          type: Number,
          default: 0,
        },
        confirmed: {
          type: Boolean,
          default: false,
        },
        rejected: {
          type: Boolean,
          default: false,
        },
        status: {
          type: String,
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
        'invoice_generated',
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

PORetailerToManufacturerSchema.plugin(toJSON);
PORetailerToManufacturerSchema.plugin(paginate);

PORetailerToManufacturerSchema.index({
  manufacturerEmail: 1,
  email: 1,
  statusAll: 1,
});

const PORetailerToManufacturer = mongoose.model('PORetailerToManufacturer', PORetailerToManufacturerSchema);

module.exports = PORetailerToManufacturer;
