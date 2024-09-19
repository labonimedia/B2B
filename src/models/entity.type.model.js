const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const entitySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
entitySchema.plugin(toJSON);
entitySchema.plugin(paginate);

const Entity = mongoose.model('Entity', entitySchema);

module.exports = Entity;
