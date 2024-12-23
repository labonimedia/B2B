const mongoose = require('mongoose');
const { paginate, toJSON } = require('../plugins');

const wholesalerReturnSchema = mongoose.Schema(
    {
        set: [
            {
                returnReason: String,
                designNumber: String,
                colour: String,
                colourImage: String,
                colourName: String,
                size: String,
                quantity: Number,
                price: String,
                productBy: String,
            },
        ],
        email: String,
        productBy: String,
        mnfDileveryClallnDate: {
            type: Date,
            default: Date.now,
        },
        status: {
            type: String,
            enum: ['pending', 'delivered', 'proceed'],
            // default: 'pending',
        },
        poNumber: Number,
        deliveryChallanNumber: Number,
        retailerPOs: [{
            email: String,
            poNumber: Number,
        }],
        manufacturer: {
            email: String,
            fullName: String,
            companyName: String,
            address: String,
            state: String,
            country: String,
            pinCode: String,
            mobNumber: String,
            GSTIN: String,
        },
        wholesaler: {
            email: String,
            fullName: String,
            companyName: String,
            address: String,
            state: String,
            country: String,
            pinCode: String,
            mobNumber: String,
            GSTIN: String,
            logo: String,
            productDiscount: String,
            category: String,
        },
    },
    {
        timestamps: true,
    }
);

// add plugin that converts mongoose to json
wholesalerReturnSchema.plugin(toJSON);
wholesalerReturnSchema.plugin(paginate);

const WholesalerReturn = mongoose.model('WholesalerReturn', wholesalerReturnSchema);

module.exports = WholesalerReturn;
