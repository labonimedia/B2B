// models/ReturnReason.js

const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');

const returnReasonSchema = new mongoose.Schema(
  {
    reason: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

returnReasonSchema.plugin(toJSON);
returnReasonSchema.plugin(paginate);

/**
 * @typedef ReturnReason
 */
const ReturnReason = mongoose.model('ReturnReason', returnReasonSchema);
module.exports = ReturnReason;
