const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const sizeSchema = new mongoose.Schema({
    wordSize: { type: String },
    size: { type: Number }
}, { _id: false });


const sizeChartSchema = new mongoose.Schema({
    sizeType: { type: String, required: true },
    sizeChart: { type: [String], required: true },
    Sizes: [sizeSchema]
});

sizeSchema.plugin(toJSON);
sizeSchema.plugin(paginate);
// Create the model
const SizeChart = mongoose.model('SizeChart', sizeChartSchema);

module.exports = SizeChart;