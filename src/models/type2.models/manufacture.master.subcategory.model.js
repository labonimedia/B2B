const mongoose = require("mongoose");
const { toJSON, paginate } = require("../plugins");

const { Schema } = mongoose;

const subcategorySchema = new Schema(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "ManufactureCategory", // Parent Category
    //   required: true,
    },

    categoryName: {
     type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    code: {
      type: String,  
      trim: true,  // Auto-generated: SUB001, SUB002...
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

// Ensure unique subcategory name inside same category
subcategorySchema.index(
  { categoryId: 1, name: 1 },
  { unique: true }
);

// Ensure unique subcategory code
subcategorySchema.index({ code: 1 }, { unique: true });

// Plugins
subcategorySchema.plugin(toJSON);
subcategorySchema.plugin(paginate);

const ManufactureMasterSubcategory = mongoose.model(
  "ManufactureSubcategory",
  subcategorySchema
);

module.exports = ManufactureMasterSubcategory;
