const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const productOrderShema = mongoose.Schema(
  {
    buyerEmail: {
        type: String,
    },
    buyerAddress: {
      type: String,
    },
    buyerDetails: {
      type: String,
    },
    buyerGSTIN: {
      type: String,
    },
    buyerName: {
      type: String,
    },
    buyerPhone: {
      type: String,
    },
    deliveryDate: {
      type: Date,
    },
    logoUrl: {
      type: String,
    },
    orderDate: {
      type: Date,
    },
    orderNo: {
      type: String,
    },
    poDate: {
      type: String,
    },
    poNumber: {
      type: String,
    },
    products: [
      {
        designNo: {
          type: String,
        },
        gst: {
          type: String,
        },
        mrp: {
          type: String,
        },
        name: {
          type: String,
        },
        qty: {
          type: String,
        },
        rate: {
          type: String,
        },
        srNo: {
          type: String,
        },
        taxableValue: {
          type: String,
        },
        total: {
          type: String,
        },
      },
    ],
    roundedOffTotal: {
      type: String,
    },
    supplierAddress: {
      type: String,
    },
    supplierContact: {
      type: String,
    },
    supplierDetails: {
      type: String,
    },
    supplierEmail: {
        type: String,
    },
    supplierGSTIN: {
      type: String,
    },
    supplierName: {
      type: String,
    },
    totalAmount: {
      type: String,
    },
    totalGST: {
      type: String,
    },
    totalInWords: {
      type: String,
    },
    totalRate: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
productOrderShema.plugin(toJSON);
productOrderShema.plugin(paginate);

const ProductOrder = mongoose.model('ProductOrder', productOrderShema);

module.exports = ProductOrder;
