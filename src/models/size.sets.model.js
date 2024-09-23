const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const sizeSchema = new mongoose.Schema(
  {
    wordSize: { type: String },
    size: { type: String }
}, { _id: false });


const sizeChartSchema = new mongoose.Schema({
  sizeType: { type: String, required: true },
  sizeChart: { type: [String], required: true },
  Sizes: [sizeSchema],
});

sizeChartSchema.plugin(toJSON);
sizeChartSchema.plugin(paginate);
// Create the model
const SizeSet = mongoose.model('SizeSet', sizeChartSchema);

module.exports = SizeSet;
