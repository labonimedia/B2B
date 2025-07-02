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
    quantity: {
        type: Number,
        required: true,
        default: 0,
    },
    minimumQuantityAlert: {
        type: Number,
        required: true,
        default: 0,
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

const ManufactureInventory = mongoose.model('ManufactureInventory', inventorySchema);
module.exports = ManufactureInventory;