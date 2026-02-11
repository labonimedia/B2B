const mongoose = require('mongoose');
const { paginate, toJSON } = require('../plugins');

const inventorySchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  designNumber: { type: String, required: true },
  colour: { type: String, required: true },
  colourName: { type: String, required: true },
  size: { type: String, required: true },
  brandName: { type: String, required: true },
  brandSize: { type: String, required: true },
  standardSize: { type: String, required: true },
  quantity: { type: Number, default: 0 },
  minimumQuantityAlert: { type: Number, default: 0 },
  lastUpdatedBy: { type: String },
  lastUpdatedAt: { type: Date, default: Date.now },
});

inventorySchema.plugin(toJSON);
inventorySchema.plugin(paginate);

inventorySchema.index(
  {
    userEmail: 1,
    designNumber: 1,
    colour: 1,
    brandSize: 1,
    standardSize: 1,
  },
  { unique: true }
);

const WholesalerInventory = mongoose.model('WholesalerInventory', inventorySchema);

module.exports = WholesalerInventory;
