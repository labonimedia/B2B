const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const invitationSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
    },
    companyName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    contryCode: {
      type: String,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted'],
      default: 'pending',
    },
    invitedBy: [
      {
        type: String,
      },
    ],
    role: {
      type: String,
    },
    category: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

invitationSchema.index({ invitedBy: 1, status: 1 });
invitationSchema.index({ invitedBy: 1, role: 1 });
// add plugin that converts mongoose to json
invitationSchema.plugin(toJSON);
invitationSchema.plugin(paginate);

/**
 * @typedef Invitation
 */

const Invitation = mongoose.model('Invitation', invitationSchema);

module.exports = Invitation;
