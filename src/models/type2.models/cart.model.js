const mongoose = require('mongoose');
const { paginate, toJSON } = require('../plugins');

const SizeSchema = new mongoose.Schema({
  size: { type: String, required: true },
  quantity: { type: Number, required: true }
});

const ItemSchema = new mongoose.Schema({
  colourHex: { type: String, required: true },
  colourImage: { type: String, required: true },
  colourName: { type: String, required: true },
  sizes: [SizeSchema]  // Array of sizes
}, { timestamps: true });
// add plugin that converts mongoose to json
ItemSchema.plugin(toJSON);
ItemSchema.plugin(paginate);

const CartType2 = mongoose.model('CartType2', ItemSchema);
module.exports = CartType2;
