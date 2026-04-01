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
      unique: true,
      sparse: true,
    },

    description: String,

    isActive: {
      type: Boolean,
      default: true,
    },

    note: String,
  },
  { timestamps: true }
);

// ✅ Case-insensitive unique
categorySchema.index({ name: 1, manufacturerEmail: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });

// ✅ Safe-ish auto code (better than count)
categorySchema.pre('save', async function (next) {
  if (!this.code) {
    const last = await mongoose.model('ManufactureCategory').findOne({}, {}, { sort: { createdAt: -1 } });

    let nextNumber = 1;

    if (last?.code) {
      const num = parseInt(last.code.replace('RM_CAT', ''));
      if (!isNaN(num)) nextNumber = num + 1;
    }

    this.code = `RM_CAT${String(nextNumber).padStart(3, '0')}`;
  }

  next();
});

categorySchema.plugin(toJSON);
categorySchema.plugin(paginate);

module.exports = mongoose.model('ManufactureCategory', categorySchema);
