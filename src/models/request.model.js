// const mongoose = require('mongoose');
// const validator = require('validator');
// const { toJSON, paginate } = require('./plugins');

// const requestSchema = mongoose.Schema(
//   {
//     fullName: {
//       type: String,
//       trim: true,
//     },
//     companyName: {
//       type: String,
//     },
//     email: {
//       type: String,
//       required: true,
//       trim: true,
//       lowercase: true,
//       validate(value) {
//         if (!validator.isEmail(value)) {
//           throw new Error('Invalid email');
//         }
//       },
//     },
//     code: {
//       type: String,
//     },
//     mobileNumber: {
//       type: String,
//       required: true,
//     },
//     status: {
//       type: String,
//       enum: ['pending', 'accepted'],
//       default: 'pending',
//     },
//     requestBy: {
//       type: String,
//     },
//     role: {
//       type: String,
//     },
//     category: {
//       type: String,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // add plugin that converts mongoose to json
// requestSchema.plugin(toJSON);
// requestSchema.plugin(paginate);

// /**
//  * @typedef Request
//  */

// const Request = mongoose.model('Request', requestSchema);

// module.exports = Request;

const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const requestSchema = mongoose.Schema(
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
    code: {
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
    // Updated requestBy fields
    requestByFullName: {
      type: String,
      trim: true,
    },
    requestByCompanyName: {
      type: String,
    },
    requestByEmail: {
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
    requestByCountry: {
      type: String,
    },
    requestByCity: {
      type: String,
    },
    requestByState: {
      type: String,
    },
    requestByMobileNumber: {
      type: String,
      required: true,
    },
    requestByRole: {
      type: String,
    },
    role: {
      type: String,
    },
    state: {
      type: String,
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
requestSchema.plugin(toJSON);
requestSchema.plugin(paginate);

/**
 * @typedef Request
 */

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
