// const httpStatus = require('http-status');
// const razorpay = require('../../../config/razorpay');
// const ApiError = require('../../../utils/ApiError');
// const { addPaymentHistory } = require('./payment.audit.helper');
// const { Payment, SubscriptionPlan, User } = require('../../../models');

// /**
//  * Create Razorpay Order
//  * @param {Object} body
//  * @param {Object} loggedInUser
//  * @returns {Promise<Object>}
//  */

// const createRazorpayOrder = async (body, loggedInUser) => {
//   const { subscriptionId } = body;

//   /*
//   |--------------------------------------------------------------------------
//   | Find Subscription
//   |--------------------------------------------------------------------------
//   */

//   const subscription = await SubscriptionPlan.findById(subscriptionId);

//   if (!subscription) {
//     throw new ApiError(
//       httpStatus.NOT_FOUND,
//       'Subscription plan not found'
//     );
//   }

//   if (subscription.isDeleted || subscription.status !== 'active') {
//     throw new ApiError(
//       httpStatus.BAD_REQUEST,
//       'Subscription plan is inactive'
//     );
//   }

//   /*
//   |--------------------------------------------------------------------------
//   | Find User
//   |--------------------------------------------------------------------------
//   */

//   const user = await User.findById(loggedInUser._id);

//   if (!user) {
//     throw new ApiError(
//       httpStatus.NOT_FOUND,
//       'User not found'
//     );
//   }

//   /*
//   |--------------------------------------------------------------------------
//   | Validate Amount
//   |--------------------------------------------------------------------------
//   */

//   const payableAmount = subscription.finalAmount;

//   if (payableAmount < 1) {
//     throw new ApiError(
//       httpStatus.BAD_REQUEST,
//       'Minimum payable amount should be ₹1'
//     );
//   }

//   /*
//   |--------------------------------------------------------------------------
//   | Create Razorpay Order
//   |--------------------------------------------------------------------------
//   */

//   const receipt = `SUB_${Date.now()}`;

//   const razorpayOrder = await razorpay.orders.create({
//     amount: payableAmount * 100,
//     currency: subscription.currency,
//     receipt,
//   });

//   /*
//   |--------------------------------------------------------------------------
//   | Save Payment
//   |--------------------------------------------------------------------------
//   */

//   const payment = new Payment({
//     userId: user._id,
//     userEmail: user.email,

//     subscriptionId: subscription._id,

//     planName: subscription.planName,
//     planCode: subscription.planCode,

//     validity: subscription.validity,
//     validityType: subscription.validityType,

//     amount: subscription.amount,

//     discount: subscription.discountValue,

//     payableAmount,

//     currency: subscription.currency,

//     razorpayOrderId: razorpayOrder.id,

//     receipt,

//     status: 'created',
//   });

//   /*
//   |--------------------------------------------------------------------------
//   | Payment History
//   |--------------------------------------------------------------------------
//   */

//   addPaymentHistory(
//     payment,
//     'order.created',
//     'created',
//     'Razorpay order created successfully',
//     {
//       orderId: razorpayOrder.id,
//       receipt,
//       amount: payableAmount,
//       currency: subscription.currency,
//     }
//   );

//   await payment.save();

//   /*
//   |--------------------------------------------------------------------------
//   | Response
//   |--------------------------------------------------------------------------
//   */

//   return {
//     paymentId: payment._id,
//     subscriptionId: subscription._id,
//     planName: subscription.planName,
//     amount: payableAmount,
//     currency: subscription.currency,
//     razorpayOrderId: razorpayOrder.id,
//     receipt,
//   };
// };

// module.exports = {
//   createRazorpayOrder,
// };

const httpStatus = require('http-status');
const razorpay = require('../../../config/razorpay');
const ApiError = require('../../../utils/ApiError');

const {
  Payment,
  SubscriptionPlan,
  User,
  SalesRegistration,
} = require('../../../models');

const { addPaymentHistory } = require('./payment.audit.helper');

const roundMoney = (value) =>
  Math.round((value + Number.EPSILON) * 100) / 100;

const createRazorpayOrder = async (body, loggedInUser) => {
  const { subscriptionId, salesRegistrationId } = body;

  const subscription = await SubscriptionPlan.findById(subscriptionId);

  if (!subscription || subscription.isDeleted || subscription.status !== 'active') {
    throw new ApiError(httpStatus.NOT_FOUND, 'Active subscription plan not found');
  }

  const user = await User.findById(loggedInUser._id);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const originalAmount = roundMoney(subscription.finalAmount);

  let payableAmount = originalAmount;
  let discountAmount = 0;
  let discountValue = 0;
  let discountType = null;
  let salesRegistration = null;

  // Apply salesman discount only when explicitly linked
  if (salesRegistrationId) {
    salesRegistration = await SalesRegistration.findOne({
      _id: salesRegistrationId,
      customerId: user._id,
      subscriptionId: subscription._id,
      isDeleted: false,
      status: 'active',
      $expr: {
        $lt: ['$discountUsedCount', '$discountMaxUses'],
      },
    });

    if (!salesRegistration) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Sales discount is invalid or already exhausted'
      );
    }

    discountType = salesRegistration.discountType;
    discountValue = salesRegistration.discountValue;
    discountAmount = salesRegistration.discountAmount;
    payableAmount = salesRegistration.discountedAmount;

    // Do not silently accept a stale or modified price snapshot.
    if (salesRegistration.originalAmount !== originalAmount) {
      throw new ApiError(
        httpStatus.CONFLICT,
        'Subscription price has changed. Please refresh the registration.'
      );
    }
  }

  if (payableAmount < 1) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Minimum payable amount should be ₹1');
  }

  const receipt = `SUB_${Date.now()}`;

  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(payableAmount * 100),
    currency: subscription.currency,
    receipt,
  });

  const payment = new Payment({
    userId: user._id,
    userEmail: user.email,

    subscriptionId: subscription._id,

    planName: subscription.planName,
    planCode: subscription.planCode,

    validity: subscription.validity,
    validityType: subscription.validityType,

    amount: originalAmount,
    discount: discountAmount,
    payableAmount,

    currency: subscription.currency,

    razorpayOrderId: razorpayOrder.id,
    receipt,
    status: 'created',

    salesRegistrationId: salesRegistration?._id || null,
    salesmanId: salesRegistration?.salesmanId || null,

    discountType,
    discountValue,
    discountAmount,
    discountApplied: false,
  });

  addPaymentHistory(
    payment,
    'order.created',
    'created',
    'Razorpay order created successfully',
    {
      orderId: razorpayOrder.id,
      receipt,
      amount: payableAmount,
      originalAmount,
      discountAmount,
      salesRegistrationId: salesRegistration?._id || null,
    }
  );

  await payment.save();

  return {
    paymentId: payment._id,
    subscriptionId: subscription._id,
    planName: subscription.planName,

    originalAmount,
    discountType,
    discountValue,
    discountAmount,
    payableAmount,

    currency: subscription.currency,
    razorpayOrderId: razorpayOrder.id,
    receipt,

    discountRemainingUses: salesRegistration
      ? salesRegistration.discountMaxUses - salesRegistration.discountUsedCount
      : 0,
  };
};

module.exports = {
  createRazorpayOrder,
};
