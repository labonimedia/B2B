const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');

const { Schema } = mongoose;

const subcategorySchema = new Schema(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'ManufactureCategory', // Parent Category
    },
    categoryName: {
      type: String,
      required: true,
    },
    manufacturerEmail: {
      type: String,
      required: true,
      trim: true,
    },
    subcategoryName: {
      type: String,
      required: true,
      trim: true,
    },
    subcategoryCode: {
      type: String,
      trim: true, // Auto-generated: SUB001, SUB002...
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    note: String,
  },
  { timestamps: true }
);

subcategorySchema.index({ categoryId: 1, subcategoryName: 1 }, { unique: true });

subcategorySchema.index({ code: 1 }, { unique: true });

subcategorySchema.plugin(toJSON);
subcategorySchema.plugin(paginate);

const ManufactureMasterSubcategory = mongoose.model('ManufactureSubcategory', subcategorySchema);

module.exports = ManufactureMasterSubcategory;
