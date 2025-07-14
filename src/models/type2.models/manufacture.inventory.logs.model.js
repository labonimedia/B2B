const mongoose = require('mongoose');
const { paginate, toJSON } = require('../plugins');

const inventorySchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductType2',
        required: true,
    },
    designNumber: {
        type: String,
        required: true,
    },
    colour: {
        type: String,
        required: true,
    },
    brandName: {
        type: String,
        required: true,
    },
    colourName: {
        type: String,
        required: true,
    },
    brandSize: {
        type: String,
        required: true,
    },

    standardSize: {
        type: String,
        required: true,
    },
    previousQuantity: {
        type: Number,
        required: true,
    },
    updatedQuantity: {
        type: Number,
        required: true,
    },
    previousRemainingQuantity: {
        type: Number,
        required: true,
    },
    lastUpdatedBy: {
        type: String,
    },
    lastUpdatedAt: {
        type: Date,
        default: Date.now,
    },
});

inventorySchema.plugin(toJSON);
inventorySchema.plugin(paginate);

const ManufactureInventoryLogs = mongoose.model('ManufactureInventoryLogs', inventorySchema);
module.exports = ManufactureInventoryLogs;