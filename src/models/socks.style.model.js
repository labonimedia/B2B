const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const socksStyleSchema = mongoose.Schema(
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
socksStyleSchema.plugin(toJSON);
socksStyleSchema.plugin(paginate);

const SocksStyle = mongoose.model('SocksStyle', socksStyleSchema);

module.exports = SocksStyle;
