const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const newCountrySchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  iso3: { type: String, required: true },
  iso2: { type: String, required: true },
  numeric_code: { type: String, required: true },
  phonecode: { type: String, required: true },
  capital: { type: String },
  currency: { type: String },
  currency_name: { type: String },
  currency_symbol: { type: String },
  tld: { type: String }, // Top-level domain
  native: { type: String },
  region: { type: String },
  region_id: { type: String },
  subregion: { type: String },
  subregion_id: { type: String },
  nationality: { type: String },
  timezones: { type: [String] },
  latitude: { type: Number },
  longitude: { type: Number },
  emoji: { type: String },
  emojiU: { type: String },
}, { timestamps: true }); // Add timestamps for createdAt and updatedAt

// add plugin that converts mongoose to json
newCountrySchema.plugin(toJSON);
newCountrySchema.plugin(paginate);

const NewCountry = mongoose.model('NewCountry', newCountrySchema);

module.exports = NewCountry;
