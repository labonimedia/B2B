const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const subCategorySchema = mongoose.Schema(
  {
    productType: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      trim: true,
    },
    category: {
        type: String,
        trim: true,
    },
    subCategory: {
        type: String,
        trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
subCategorySchema.plugin(toJSON);
subCategorySchema.plugin(paginate);

const SubCategory = mongoose.model('SubCategory', subCategorySchema);

module.exports = SubCategory;
