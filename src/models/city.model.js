const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const citySchema = new mongoose.Schema(
  {
    id: { type: Number, required: true }, // Unique identifier
    name: { type: String, required: true }, // Name of the location
    state_id: { type: Number, required: true }, // Unique identifier for the state
    state_code: { type: String, required: true }, // Code for the state
    state_name: { type: String, required: true }, // Full name of the state
    country_id: { type: Number, required: true }, // Unique identifier for the country
    country_code: { type: String, required: true }, // ISO2 country code
    country_name: { type: String, required: true }, // Full name of the country
    latitude: { type: Number }, // Latitude coordinate of the location
    longitude: { type: Number }, // Longitude coordinate of the location
    wikiDataId: { type: String }, // Reference ID from Wikidata
  },
  { timestamps: true }
); // Automatically adds createdAt and updatedAt timestamps

// add plugin that converts mongoose to json
citySchema.plugin(toJSON);
citySchema.plugin(paginate);

const city = mongoose.model('City', citySchema);
module.exports = city;
