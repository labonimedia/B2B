// const mongoose = require('mongoose');
// const { toJSON, paginate } = require('../plugins');

// const categorySchema = new mongoose.Schema(
//   {
//     manufacturerEmail: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     code: {
//       type: String,
//     },
//     description: {
//       type: String,
//     },
//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//     note: String,
//   },
//   {
//     timestamps: true,
//   }
// );

// categorySchema.index({ categoryName: 1 }, { unique: true });

// categorySchema.plugin(toJSON);
// categorySchema.plugin(paginate);

// const ManufactureMasterCategory = mongoose.model('ManufactureCategory', categorySchema);
// module.exports = ManufactureMasterCategory;
const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');

const categorySchema = new mongoose.Schema(
  {
    manufacturerEmail: {
      type: String,
      required: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    code: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    note: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

//
// ✅ FIXED INDEX (IMPORTANT)
// Unique per manufacturer (BEST PRACTICE)
//
categorySchema.index({ name: 1, manufacturerEmail: 1 }, { unique: true });

categorySchema.plugin(toJSON);
categorySchema.plugin(paginate);

const ManufactureMasterCategory = mongoose.model('ManufactureCategory', categorySchema);

module.exports = ManufactureMasterCategory;
