const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const cdnPathSchema = mongoose.Schema(
    {
        name: {
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

// add plugin that converts mongoose to json
cdnPathSchema.plugin(toJSON);
cdnPathSchema.plugin(paginate);

const cdnpath = mongoose.model('cdnpath', cdnPathSchema);

module.exports = cdnpath;
