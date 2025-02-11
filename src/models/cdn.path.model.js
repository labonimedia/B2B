const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

// Define schema
const cdnPathSchema = mongoose.Schema(
  {
    bucketName: {
      type: String,
      required: true,
      trim: true,
    },
    region: {
      type: String,
      required: true,
      trim: true,
    },
    accessKey: {
      type: String,
      required: true,
      trim: true,
    },
    secreteKey: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'inactive',
    },
  },
  {
    timestamps: true,
  }
);

// Index for quick querying by status
cdnPathSchema.index({ status: 1 });

// Middleware to ensure only one active bucket
// cdnPathSchema.pre('save', async function (next) {
//     const currentBucket = this;

//     // If the status is set to 'active'
//     if (currentBucket.status === 'active') {
//         // Update all other documents to 'inactive'
//         await mongoose.model('CdnPath').updateMany(
//             { status: 'active', _id: { $ne: currentBucket._id } },
//             { $set: { status: 'inactive' } }
//         );
//     }

//     next();
// });

// Add pagination and toJSON plugins
cdnPathSchema.plugin(toJSON);
cdnPathSchema.plugin(paginate);

// Create and export model
const CdnPath = mongoose.model('CdnPath', cdnPathSchema);

module.exports = CdnPath;
