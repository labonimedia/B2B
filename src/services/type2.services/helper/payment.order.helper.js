const httpStatus = require('http-status');
const razorpay = require('../../../config/razorpay');
const ApiError = require('../../../utils/ApiError');
const { addPaymentHistory } = require('./payment.audit.helper');
const { Payment, SubscriptionPlan, User } = require('../../../models');

/**
 * Create Razorpay Order
 * @param {Object} body
 * @param {Object} loggedInUser
 * @returns {Promise<Object>}
 */
// const createRazorpayOrder = async (body, loggedInUser) => {
//   const { subscriptionId } = body;

//   // Check Subscription
//   const subscription = await SubscriptionPlan.findById(subscriptionId);

//   if (!subscription) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Subscription plan not found');
//   }

//   if (subscription.status !== 'active' || subscription.isDeleted) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Subscription plan is inactive');
//   }

//   // Check User
//   const user = await User.findById(loggedInUser._id);

//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//   }

//   // Final Amount (Paise)
//   const payableAmount = subscription.finalAmount * 100;

//   if (payableAmount < 100) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Minimum payable amount should be ₹1');
//   }

//   const receipt = `SUB_${Date.now()}`;

//   // Razorpay Order
//   const razorpayOrder = await razorpay.orders.create({
//     amount: payableAmount,
//     currency: subscription.currency,
//     receipt,
//   });

//   // Save Payment Record
//   // const payment = await Payment.create({
//   //   userId: user._id,
//   //   userEmail: user.email,

//   //   subscriptionId: subscription._id,

//   //   planName: subscription.planName,
//   //   planCode: subscription.planCode,

//   //   validity: subscription.validity,
//   //   validityType: subscription.validityType,

//   //   amount: subscription.amount,

//   //   discount: subscription.discountValue,

//   //   payableAmount: subscription.finalAmount,

//   //   currency: subscription.currency,

//   //   razorpayOrderId: razorpayOrder.id,

//   //   receipt,

//   //   status: 'created',
//   // });
//   const payment = await Payment.create({
//     userId: user._id,
//     userEmail: user.email,

//     subscriptionId: subscription._id,

//     planName: subscription.planName,
//     planCode: subscription.planCode,

//     validity: subscription.validity,
//     validityType: subscription.validityType,

//     amount: subscription.amount,

//     discount: subscription.discountValue,

//     payableAmount: subscription.finalAmount,

//     currency: subscription.currency,

//     razorpayOrderId: razorpayOrder.id,

//     receipt,

//     status: 'created',

//     history: [
//       {
//         event: 'order.created',
//         status: 'created',
//         message: 'Razorpay order created successfully',
//         payload: {
//           orderId: razorpayOrder.id,
//           receipt,
//           amount: subscription.finalAmount,
//           currency: subscription.currency,
//         },
//       },
//     ],
//   });
//   return {
//     paymentId: payment._id,

//     subscriptionId: subscription._id,

//     planName: subscription.planName,

//     amount: subscription.finalAmount,

//     currency: subscription.currency,

//     razorpayOrderId: razorpayOrder.id,

//     receipt,
//   };
// };
const createRazorpayOrder = async (body, loggedInUser) => {
  const { subscriptionId } = body;

  /*
  |--------------------------------------------------------------------------
  | Find Subscription
  |--------------------------------------------------------------------------
  */

  const subscription = await SubscriptionPlan.findById(subscriptionId);

  if (!subscription) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Subscription plan not found'
    );
  }

  if (subscription.isDeleted || subscription.status !== 'active') {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Subscription plan is inactive'
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Find User
  |--------------------------------------------------------------------------
  */

  const user = await User.findById(loggedInUser._id);

  if (!user) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'User not found'
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Validate Amount
  |--------------------------------------------------------------------------
  */

  const payableAmount = subscription.finalAmount;

  if (payableAmount < 1) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Minimum payable amount should be ₹1'
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Create Razorpay Order
  |--------------------------------------------------------------------------
  */

  const receipt = `SUB_${Date.now()}`;

  const razorpayOrder = await razorpay.orders.create({
    amount: payableAmount * 100,
    currency: subscription.currency,
    receipt,
  });

  /*
  |--------------------------------------------------------------------------
  | Save Payment
  |--------------------------------------------------------------------------
  */

  const payment = new Payment({
    userId: user._id,
    userEmail: user.email,

    subscriptionId: subscription._id,

    planName: subscription.planName,
    planCode: subscription.planCode,

    validity: subscription.validity,
    validityType: subscription.validityType,

    amount: subscription.amount,

    discount: subscription.discountValue,

    payableAmount,

    currency: subscription.currency,

    razorpayOrderId: razorpayOrder.id,

    receipt,

    status: 'created',
  });

  /*
  |--------------------------------------------------------------------------
  | Payment History
  |--------------------------------------------------------------------------
  */

  addPaymentHistory(
    payment,
    'order.created',
    'created',
    'Razorpay order created successfully',
    {
      orderId: razorpayOrder.id,
      receipt,
      amount: payableAmount,
      currency: subscription.currency,
    }
  );

  await payment.save();

  /*
  |--------------------------------------------------------------------------
  | Response
  |--------------------------------------------------------------------------
  */

  return {
    paymentId: payment._id,
    subscriptionId: subscription._id,
    planName: subscription.planName,
    amount: payableAmount,
    currency: subscription.currency,
    razorpayOrderId: razorpayOrder.id,
    receipt,
  };
};

module.exports = {
  createRazorpayOrder,
};
