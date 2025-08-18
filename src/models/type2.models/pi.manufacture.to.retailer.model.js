const mongoose = require('mongoose');
const { paginate, toJSON } = require('../plugins');

// Embedded schema for Transport Details

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

// Embedded schema for Bank Details
const bankDetailsSchema = new mongoose.Schema({
  accountHolderName: {
    type: String,
   // required: true,
    trim: true,
  },
  accountNumber: {
    type: String,
    //required: true,
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
    //required: true,
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

// Main PerformaInvoice schema
const performaInvoiceSchema = new mongoose.Schema(
  {
    poId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PORetailerToManufacturer',
      required: true,
    },
    poNumber: {
      type: Number,
      required: true,
    },
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    invoiceDate: {
      type: Date,
      default: Date.now,
    },

    statusAll: {
      type: String,
      enum: [
        'created',
        'dispatched',
        'in_transit',
        'partially_delivered',
        'delivered',
        'cancelled',
      ],
      default: 'created',
    },

    bankDetails: bankDetailsSchema,

    manufacturerEmail: {
      type: String,
      required: true,
    },
    retailerEmail: {
      type: String,
      required: true,
    },

    deliveryItems: [
      {
        designNumber: String,
        colour: String,
        colourName: String,
        colourImage: String,
        size: String,
        quantity: Number,
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
        status: {
          type: String,
          enum: ['pending', 'dispatched', 'delivered', 'partial'],
          default: 'pending',
        },
               brandName: {
          type: String,
        },
      },
    ],
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
    totalQuantity: Number,
    transportDetails: transportDetailsSchema,
    totalAmount: Number,
    discountApplied: Number,
    finalAmount: Number,
  },
  {
    timestamps: true,
  }
);

performaInvoiceSchema.plugin(toJSON);
performaInvoiceSchema.plugin(paginate);

const M2RPerformaInvoice = mongoose.model('M2RPerformaInvoice', performaInvoiceSchema);
module.exports = M2RPerformaInvoice;
