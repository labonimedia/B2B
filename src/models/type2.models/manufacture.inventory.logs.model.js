const mongoose = require('mongoose');
const { paginate, toJSON } = require('../plugins');

const inventoryRecordSchema = new mongoose.Schema({
  updatedQuantity: {
    type: Number,
    required: true,
  },
  previousRemainingQuantity: {
    type: Number,
    required: true,
  },
status: {
  type: String,
  enum: ['stock_added', 'stock_removed'],
  required: true,
},
  lastUpdatedBy: {
    type: String,
  },
  lastUpdatedAt: {
    type: Date,
    default: Date.now,
  },
});

const inventoryLogSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductType2',
    required: true,
  },
  designNumber: {
    type: String,
    required: true,
  },
  colour: {
    type: String,
    required: true,
  },
  brandName: {
    type: String,
    required: true,
  },
  colourName: {
    type: String,
    required: true,
  },
  brandSize: {
    type: String,
    required: true,
  },
  standardSize: {
    type: String,
    required: true,
  },

  // History of updates
  recordsArray: {
    type: [inventoryRecordSchema],
    default: [],
  },
});

inventoryLogSchema.plugin(toJSON);
inventoryLogSchema.plugin(paginate);

const ManufactureInventoryLogs = mongoose.model('ManufactureInventoryLogs', inventoryLogSchema);

module.exports = ManufactureInventoryLogs;
