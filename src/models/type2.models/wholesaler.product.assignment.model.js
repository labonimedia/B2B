const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');

const wholesalerProductAssignmentSchema = mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductType2',
      required: true,
    },
    manufacturerEmail: {
      type: String,
      required: true,
    },
    wholesalerEmail: {
      type: String,
      required: true,
    },
    assignedBy: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    assignedDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// 🔥 Prevent duplicate assignment
wholesalerProductAssignmentSchema.index({ productId: 1, wholesalerEmail: 1 }, { unique: true });

// 🔥 Fast query for wholesaler
wholesalerProductAssignmentSchema.index({ wholesalerEmail: 1 });

wholesalerProductAssignmentSchema.plugin(toJSON);
wholesalerProductAssignmentSchema.plugin(paginate);

const WholesalerProductAssignment = mongoose.model('WholesalerProductAssignment', wholesalerProductAssignmentSchema);
module.exports = WholesalerProductAssignment;