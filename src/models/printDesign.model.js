const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const printDesignSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

printDesignSchema.plugin(toJSON);
printDesignSchema.plugin(paginate);

const PrintDesign = mongoose.model('PrintDesign', printDesignSchema);

module.exports = PrintDesign;
