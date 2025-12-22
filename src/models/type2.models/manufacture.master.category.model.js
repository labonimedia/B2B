const mongoose = require("mongoose");
const { toJSON, paginate } = require("../plugins");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    code: {
      type: String,
 // Auto-generated CAT001, CAT002...
    },

    description: {
      type: String,
    //   trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Unique category name (optional, you can remove if not needed)
categorySchema.index({ categoryName: 1 }, { unique: true });

// Plugin
categorySchema.plugin(toJSON);
categorySchema.plugin(paginate);

const ManufactureMasterCategory = mongoose.model("ManufactureCategory", categorySchema);
module.exports = ManufactureMasterCategory;
