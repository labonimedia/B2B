const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const weaveMethodSchema = mongoose.Schema(
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

weaveMethodSchema.plugin(toJSON);
weaveMethodSchema.plugin(paginate);

const WeaveMethod = mongoose.model('WeaveMethod', weaveMethodSchema);

module.exports = WeaveMethod;
