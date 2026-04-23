const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');

/**
 * 🔹 BANK DETAILS
 */
const bankDetailsSchema = new mongoose.Schema(
  {
    accountHolderName: { type: String, trim: true },
    accountNumber: { type: String, trim: true },
    accountType: { type: String, trim: true },
    bankName: { type: String, trim: true },
    branchName: { type: String, trim: true },
    ifscCode: { type: String, trim: true, uppercase: true },
    swiftCode: { type: String, trim: true },
    upiId: { type: String, trim: true },
    bankAddress: { type: String, trim: true },
  },
  { _id: false }
);

/**
 * 🔹 TRANSPORT DETAILS
 */
const transportDetailsSchema = new mongoose.Schema(
  {
    transportType: { type: String, trim: true },
    transporterCompanyName: { type: String, trim: true },
    vehicleNumber: { type: String, trim: true },
    contactNumber: { type: Number },
    trackingId: { type: String, trim: true },
    modeOfTransport: {
      type: String,
      enum: ['road', 'railway', 'air', 'sea', 'other', 'self'],
    },
    dispatchDate: Date,
    expectedDeliveryDate: Date,
    deliveryDate: Date,
    deliveryAddress: String,
    remarks: String,
  },
  { _id: false }
);

/**
 * 🔹 ITEMS
 */
const itemSchema = new mongoose.Schema(
  {
    designNumber: { type: String, required: true },
    colour: String,
    colourName: String,
    colourImage: String,
    size: String,

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    total: {
      type: Number,
      min: 0,
    },

    productType: String,
    gender: String,
    clothing: String,
    subCategory: String,
    hsnCode: String,
    hsnGst: Number,
    brandName: String,

    confirmed: { type: Boolean, default: false },
    rejected: { type: Boolean, default: false },
    deliveredQty: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'processing', 'partial', 'shipped', 'delivered'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

/**
 * 🔥 MAIN PO SCHEMA
 */
const cpToManufacturerPOSchema = new mongoose.Schema(
  {
    poNumber: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },

    cartId: { type: String },

    // 🔹 CP
    cp: {
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

    // 🔹 SHOPKEEPER
    shopkeeper: {
      email: String,
      fullName: String,
      shopName: String,
      address: String,
      city: String,
      state: String,
      pinCode: String,
      mobNumber: String,
      GSTIN: String,
    },

    // 🔹 MANUFACTURER
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

    manufacturerEmail: {
      type: String,
      required: true,
      index: true,
    },

    cpEmail: {
      type: String,
      required: true,
      index: true,
    },

    shopKeeperEmail: {
      type: String,
      required: true,
      index: true,
    },

    // 🔥 ITEMS
    items: {
      type: [itemSchema],
      default: [],
    },

    // 🔹 CALCULATION
    totalQty: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    finalAmount: { type: Number, default: 0 },

    // 🔹 PAYMENT
    bankDetails: bankDetailsSchema,

    // 🔹 TRANSPORT
    transportDetails: transportDetailsSchema,

    // 🔹 STATUS
    statusAll: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'processing', 'partial', 'shipped', 'delivered', 'cancelled', 'preview'],
      default: 'pending',
      index: true,
    },

    // 🔹 TRACKING
    poDate: {
      type: Date,
      default: Date.now,
    },
    acceptedAt: Date,
    shippedAt: Date,
    deliveredAt: Date,

    // 🔹 NOTES
    manufacturerNote: String,
    cpNote: String,
    shopkeeperNote: String,

    // 🔹 FLAGS
    isInvoiceGenerated: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * 🔥 PRE SAVE (AUTO CALCULATION)
 */
cpToManufacturerPOSchema.pre('save', function (next) {
  let totalQty = 0;
  let totalAmount = 0;

  this.items.forEach((item) => {
    item.total = item.quantity * item.price;
    totalQty += item.quantity;
    totalAmount += item.total;
  });

  this.totalQty = totalQty;
  this.totalAmount = totalAmount;
  this.finalAmount = totalAmount - (this.discount || 0);

  next();
});

/**
 * 🔥 INDEXES
 */
cpToManufacturerPOSchema.index({ cpEmail: 1, statusAll: 1 });
cpToManufacturerPOSchema.index({ manufacturerEmail: 1, statusAll: 1 });
cpToManufacturerPOSchema.index({ shopKeeperEmail: 1 });
cpToManufacturerPOSchema.index({ createdAt: -1 });

// 🔥 UNIQUE PO PER CP + MANUFACTURER
cpToManufacturerPOSchema.index({ poNumber: 1, manufacturerEmail: 1, cpEmail: 1 }, { unique: true });

/**
 * 🔹 PLUGINS
 */
cpToManufacturerPOSchema.plugin(toJSON);
cpToManufacturerPOSchema.plugin(paginate);

const PoCpToManufacturer = mongoose.model('PoCpToManufacturer', cpToManufacturerPOSchema);
module.exports = PoCpToManufacturer;
