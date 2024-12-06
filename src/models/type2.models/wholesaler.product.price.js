
const mongoose = require('mongoose');
const { paginate, toJSON } = require('../plugins');

const wholesalerPriceSchema = mongoose.Schema(
  {
    set: [
      {
        designNumber: String,
        size: String,
        wholesalerPrice: String,
        manufacturerPrice: String,
      },
    ],
    brandName: {
        type: String,
        
    },
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductType2',
        required: true,
    },
    WholesalerEmail: String,
    manufacturerEmail: String,
    priceAddedDate: {
        type: Date,
        default: Date.now,
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
wholesalerPriceSchema.plugin(toJSON);
wholesalerPriceSchema.plugin(paginate);

const WholesalerPriceType2 = mongoose.model('WholesalerPriceType2', wholesalerPriceSchema);

module.exports = WholesalerPriceType2;
