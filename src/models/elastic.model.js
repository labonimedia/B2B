const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const elasticSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
elasticSchema.plugin(toJSON);
elasticSchema.plugin(paginate);

const Elastic = mongoose.model('Elastic', elasticSchema);

module.exports = Elastic;
