const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');

const subcategorySchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ManufactureCategory',
    },

    categoryName: String,

    manufacturerEmail: {
      type: String,
      required: true,
    },

    subcategoryName: {
      type: String,
      required: true,
      trim: true,
    },

    subcategoryCode: {
      type: String,
      unique: true,
      sparse: true,
    },

    description: String,
    isActive: { type: Boolean, default: true },
    note: String,
  },
  { timestamps: true }
);

// ✅ Unique inside category (case-insensitive)
subcategorySchema.index({ categoryId: 1, subcategoryName: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });

// ✅ Auto code
subcategorySchema.pre('save', async function (next) {
  if (!this.subcategoryCode) {
    const last = await mongoose.model('ManufactureSubcategory').findOne({}, {}, { sort: { createdAt: -1 } });

    let nextNumber = 1;

    if (last?.subcategoryCode) {
      const num = parseInt(last.subcategoryCode.replace('SUB', ''));
      if (!isNaN(num)) nextNumber = num + 1;
    }

    this.subcategoryCode = `SUB${String(nextNumber).padStart(3, '0')}`;
  }

  next();
});

subcategorySchema.plugin(toJSON);
subcategorySchema.plugin(paginate);

module.exports = mongoose.model('ManufactureSubcategory', subcategorySchema);
