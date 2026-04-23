// const mongoose = require('mongoose');
// const { paginate, toJSON } = require('../plugins');

// const cpCartSchema = new mongoose.Schema(
//   {
//     cpEmail: { type: String, required: true },
//     shopkeeperEmail: { type: String, required: true },
//     productBy: { type: String, required: true },

//     set: [
//       {
//         designNumber: String,
//         colour: String,
//         colourImage: String,
//         colourName: String,
//         size: String,
//         quantity: Number,
//         price: String,
//         productType: String,
//         gender: String,
//         clothing: String,
//         subCategory: String,
//         hsnCode: String,
//         hsnGst: Number,
//         hsnDescription: String,
//         brandName: String,
//       },
//     ],
//   },
//   { timestamps: true }
// );

// cpCartSchema.index({ cpEmail: 1, shopkeeperEmail: 1, productBy: 1 });

// cpCartSchema.plugin(toJSON);
// cpCartSchema.plugin(paginate);

// module.exports = mongoose.model('CpCart', cpCartSchema);

const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');

/**
 * 🔹 ITEM SCHEMA (Product inside cart)
 */
const itemSchema = new mongoose.Schema(
  {
    // 🔥 Product Identity
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductType2',
    },
    designNumber: {
      type: String,
      required: true,
      trim: true,
    },

    // 🔹 Variant Info
    colour: { type: String, trim: true },
    colourName: { type: String, trim: true },
    colourImage: { type: String },
    size: { type: String, trim: true },

    // 🔹 Pricing
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    total: {
      type: Number,
      min: 0,
    },

    // 🔹 Extra (important for future)
    hsnCode: String,
    hsnGst: Number,
    brandName: String,
    productType: String,
    gender: String,
    clothing: String,
    subCategory: String,

    // 🔹 Inventory safety
    availableQty: Number,

    // 🔹 Status
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { _id: true, timestamps: true }
);

/**
 * 🔹 MANUFACTURER GROUP
 */
const manufacturerCartSchema = new mongoose.Schema(
  {
    manufacturerEmail: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    manufacturerName: {
      type: String,
      trim: true,
    },

    // 🔥 Items grouped under manufacturer
    items: [itemSchema],

    // 🔹 Calculation Fields
    totalQty: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // 🔥 Discount (CP level)
    discountType: {
      type: String,
      enum: ['flat', 'percentage'],
      default: 'flat',
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    finalAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // 🔹 Future Ready (Commission + Tax)
    commissionAmount: {
      type: Number,
      default: 0,
    },
    gstAmount: {
      type: Number,
      default: 0,
    },

    // 🔹 Status for PO
    status: {
      type: String,
      enum: ['pending', 'ordered'],
      default: 'pending',
    },
  },
  { _id: true }
);

/**
 * 🔹 MAIN CART
 */
const cpCartSchema = new mongoose.Schema(
  {
    cpEmail: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },

    shopkeeperEmail: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },

    // 🔥 Manufacturer grouped carts
    manufacturers: [manufacturerCartSchema],

    // 🔹 Cart Level Calculations
    cartTotalQty: {
      type: Number,
      default: 0,
      min: 0,
    },

    cartTotalAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    cartDiscount: {
      type: Number,
      default: 0,
    },

    cartFinalAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // 🔹 Lifecycle
    status: {
      type: String,
      enum: ['active', 'confirmed', 'cancelled'],
      default: 'active',
      index: true,
    },

    // 🔹 Audit
    confirmedAt: Date,
    cancelledAt: Date,

    // 🔹 Extra (future scaling)
    notes: String,

    // 🔹 Soft delete
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
 * 🔥 INDEXES (IMPORTANT FOR PERFORMANCE)
 */
cpCartSchema.index({ cpEmail: 1, shopkeeperEmail: 1 }, { unique: true });
cpCartSchema.index({ 'manufacturers.manufacturerEmail': 1 });
cpCartSchema.index({ createdAt: -1 });

/**
 * 🔹 PLUGINS
 */
cpCartSchema.plugin(toJSON);
cpCartSchema.plugin(paginate);

/**
 * 🔥 PRE SAVE (AUTO CALCULATION SAFETY)
 */
cpCartSchema.pre('save', function (next) {
  let cartQty = 0;
  let cartAmount = 0;

  this.manufacturers.forEach((m) => {
    let totalQty = 0;
    let totalAmount = 0;

    m.items.forEach((i) => {
      i.total = i.quantity * i.price;
      totalQty += i.quantity;
      totalAmount += i.total;
    });

    m.totalQty = totalQty;
    m.totalAmount = totalAmount;

    // Discount logic
    if (m.discountType === 'percentage') {
      m.finalAmount = totalAmount - (totalAmount * m.discount) / 100;
    } else {
      m.finalAmount = totalAmount - m.discount;
    }

    cartQty += totalQty;
    cartAmount += m.finalAmount;
  });

  this.cartTotalQty = cartQty;
  this.cartTotalAmount = cartAmount;
  this.cartFinalAmount = cartAmount - (this.cartDiscount || 0);

  next();
});

/**
 * 🔥 MODEL EXPORT
 */

const CpCart = mongoose.model('CpCart', cpCartSchema);
module.exports = CpCart;
