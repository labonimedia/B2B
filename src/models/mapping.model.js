const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const mappingSchema = mongoose.Schema(
  {
    productType:{
        type: String,
    },
    gender:{
        type: String,
    },
    category:{
        type: String,
    } ,
    subCategory: {
        type: String,
    },
    inputs: [ String]
},
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
mappingSchema.plugin(toJSON);
mappingSchema.plugin(paginate);

const Mapping = mongoose.model('Mapping', mappingSchema);

module.exports = Mapping;
