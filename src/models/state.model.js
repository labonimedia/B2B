const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const stateSchema = new mongoose.Schema({
  id: { type: Number, required: true }, // Unique identifier for the region
  name: { type: String, required: true }, // Name of the region (state/province)
  country_id: { type: Number, required: true }, // Associated country ID
  country_code: { type: String, required: true }, // ISO2 country code
  country_name: { type: String, required: true }, // Country name
  state_code: { type: String, required: true }, // State code
  type: { type: String }, // Type of region (e.g., province, state)
  latitude: { type: Number }, // Latitude of the region
  longitude: { type: Number }, // Longitude of the region
}, { timestamps: true }); // Automatically add createdAt and updatedAt fields


// add plugin that converts mongoose to json
stateSchema.plugin(toJSON);
stateSchema.plugin(paginate);

const state = mongoose.model('State', stateSchema);

module.exports = state;
