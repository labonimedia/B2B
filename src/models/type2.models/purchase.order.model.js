const mongoose = require('mongoose');
const { paginate, toJSON } = require('../plugins');

// Size Schema
const SizeSchema = new mongoose.Schema({
  // _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  colourName: { type: String, required: true },
  colour: { type: String, required: true },
  colourImage: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  size: { type: String, required: true },
});

// Product Schema
const ProductSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductType2',
  },
  designNumber: {
    type: String,
  },
  colour: { type: String, required: true },
  colourName: { type: String, required: true },
  colourImage: { type: String },
  sizes: [SizeSchema],
});

// Main Schema for the Purchase Order
const PurchaseOrderSchema = new mongoose.Schema({
  buyerAddress: { type: String, required: true },
  buyerDetails: { type: String, required: true },
  buyerEmail: { type: String, required: true },
  buyerGSTIN: { type: String, required: true },
  buyerName: { type: String, required: true },
  buyerPhone: { type: String, required: true },
  deliveryDate: { type: String },
  designNumber: { type: String, required: true },
  logoUrl: { type: String },
  orderDate: { type: String, required: true },
  orderNo: { type: String, required: true },
  poDate: { type: String, required: true },
  poNumber: { type: Number, required: true },
  product: [ProductSchema], // Array of products
  supplierAddress: { type: String, required: true },
  supplierContact: { type: String, required: true },
  supplierDetails: { type: String, required: true },
  supplierEmail: { type: String, required: true },
  supplierGSTIN: { type: String, required: true },
  supplierName: { type: String, required: true },
  totalInWords: { type: String },
});

PurchaseOrderSchema.plugin(toJSON);
PurchaseOrderSchema.plugin(paginate);
// Create the model
const PurchaseOrderType2 = mongoose.model('PurchaseOrderType2', PurchaseOrderSchema);

module.exports = PurchaseOrderType2;
