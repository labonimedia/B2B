const mongoose = require('mongoose');

const OrderCounterSchema = mongoose.Schema({
    email: { 
        type: String,
        required: true, 
        unique: true
    },
    count: {
        type: Number,
        default: 1 
    },
    resetDate: {
        type: Date,
        required: true,
        default: function() {
          // Set the default reset date to March 1st of the current year
          const now = new Date();
          const currentYear = now.getFullYear();
          const resetDate = new Date(currentYear, 2, 1); // March 1st of the current year
          if (now < resetDate) {
            resetDate.setFullYear(currentYear - 1);
          }
          return resetDate;
        },
      },
    });

const orderCounter = mongoose.model('orderCounter', OrderCounterSchema);
module.exports = orderCounter;
