const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const dyeingDesignSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

dyeingDesignSchema.plugin(toJSON);
dyeingDesignSchema.plugin(paginate);

const DyeingDesign = mongoose.model('DyeingDesign', dyeingDesignSchema);

module.exports = DyeingDesign;
