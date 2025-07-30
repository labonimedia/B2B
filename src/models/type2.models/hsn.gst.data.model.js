const mongoose = require('mongoose');
const { paginate, toJSON } = require('../plugins');

const inventorySchema = new mongoose.Schema({
    hsnCode: {
        type: String,
        required: true,
    },
    gstRate: {
          type: Number,
        required: true,
    },
    description: {
        type: String,
        // required: true,
    },
   
});

inventorySchema.plugin(toJSON);
inventorySchema.plugin(paginate);

const HsnGst = mongoose.model('HsnGst', inventorySchema);
module.exports = HsnGst;