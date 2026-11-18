
const httpStatus = require('http-status');
const mongoose = require('mongoose');

const {
  User,
  SubscriptionPlan,
  SalesRegistration,
} = require('../../models');

const ApiError = require('../../utils/ApiError');
const userService = require('../user.service');

const roundMoney = (value) =>
  Math.round((value + Number.EPSILON) * 100) / 100;

/**
 * Create customer with salesman discount
 */
const createSalesRegistration = async (body, loggedInUser) => {
  if (!['sales', 'superadmin'].includes(loggedInUser.role)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Only sales or superadmin can register customers');
  }

  const {
    customer,
    subscriptionId,
    discountType,
    discountValue,
    discountMaxUses,
    remarks,
  } = body;

  // Validate customer role
  const allowedRoles = [
    'manufacture',
    'wholesaler',
    'retailer',
    'channelPartner',
  ];

  if (!allowedRoles.includes(customer.role)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid customer role');
  }

  const email = customer.email.toLowerCase();

  // Check duplicate customer
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Customer email already registered');
  }

  // Find subscription plan
  const plan = await SubscriptionPlan.findOne({
    _id: subscriptionId,
    status: 'active',
    isDeleted: false,
  });

  if (!plan) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Subscription plan not found');
  }

  const originalAmount = roundMoney(plan.finalAmount);

  if (originalAmount < 1) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid subscription amount');
  }

  // Validate discount
  if (!['percentage', 'fixed'].includes(discountType)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid discount type');
  }

  if (!Number.isFinite(discountValue) || discountValue < 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid discount value');
  }

  // Example company policy: maximum 30% discount
  if (discountType === 'percentage' && discountValue > 30) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Maximum discount allowed is 30%');
  }

  if (discountType === 'fixed' && discountValue >= originalAmount) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Discount must be less than plan amount');
  }

  if (
    !Number.isInteger(discountMaxUses) ||
    discountMaxUses < 1 ||
    discountMaxUses > 100
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Discount uses must be between 1 and 100');
  }

  const discountAmount = roundMoney(
    discountType === 'percentage'
      ? (originalAmount * discountValue) / 100
      : discountValue
  );

  const discountedAmount = roundMoney(originalAmount - discountAmount);

  if (discountedAmount < 1) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Minimum payable amount is ₹1');
  }

  // Create customer using existing user service
  const createdUser = await userService.createUser(
    {
      ...customer,
      email,
    },
    loggedInUser
  );

  try {
    const registration = await SalesRegistration.create({
      salesmanId: loggedInUser._id,
      salesmanEmail: loggedInUser.email,

      customerId: createdUser._id,
      customerName: createdUser.fullName,
      companyName: createdUser.companyName || '',
      customerEmail: createdUser.email,
      customerMobile: createdUser.mobileNumber,
      customerRole: createdUser.role,

      subscriptionId: plan._id,
      planName: plan.planName,
      planCode: plan.planCode,

      originalAmount,
      discountType,
      discountValue,
      discountAmount,
      discountedAmount,

      discountMaxUses,
      discountUsedCount: 0,

      totalPaid: 0,
      status: 'active',
      remarks: remarks || '',
    });

    return registration;
  } catch (error) {
    // Do not silently leave an untracked customer.
    // In production, use a MongoDB transaction for both creations.
    throw error;
  }
};

/**
 * Get salesman-wise customers
 */
const getSalesRegistrations = async (loggedInUser, options = {}) => {
  const filter = {
    isDeleted: false,
  };

  if (loggedInUser.role === 'sales') {
    filter.salesmanId = loggedInUser._id;
  } else if (loggedInUser.role === 'superadmin') {
    if (options.salesmanId) {
      filter.salesmanId = options.salesmanId;
    }
  } else {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized');
  }

  if (options.customerRole) {
    filter.customerRole = options.customerRole;
  }

  if (options.status) {
    filter.status = options.status;
  }

  if (options.search) {
    filter.$or = [
      { customerName: { $regex: options.search, $options: 'i' } },
      { companyName: { $regex: options.search, $options: 'i' } },
      { customerEmail: { $regex: options.search, $options: 'i' } },
      { customerMobile: { $regex: options.search, $options: 'i' } },
    ];
  }

  return SalesRegistration.paginate(filter, {
    page: Number(options.page) || 1,
    limit: Math.min(Number(options.limit) || 10, 100),
    sortBy: options.sortBy || 'createdAt:desc',
  });
};

/**
 * Salesman / Super Admin dashboard
 */
const getSalesDashboard = async (loggedInUser) => {
  const match = {
    isDeleted: false,
  };

  if (loggedInUser.role === 'sales') {
    match.salesmanId = loggedInUser._id;
  } else if (loggedInUser.role !== 'superadmin') {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized');
  }

  const [dashboard] = await SalesRegistration.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,

        totalCustomers: { $sum: 1 },

        totalDiscountUses: {
          $sum: '$discountUsedCount',
        },

        totalDiscountAmount: {
          $sum: {
            $multiply: ['$discountAmount', '$discountUsedCount'],
          },
        },

        totalPaid: { $sum: '$totalPaid' },
      },
    },
  ]);

  return dashboard || {
    totalCustomers: 0,
    totalDiscountUses: 0,
    totalDiscountAmount: 0,
    totalPaid: 0,
  };
};

/**
 * Get logged-in customer's salesman registration and assigned plan
 */
const getMySalesOffer = async (loggedInUser) => {
  const registration = await SalesRegistration.findOne({
    customerId: loggedInUser._id,
    isDeleted: false,
  })
    .sort({ createdAt: -1 })
    .populate('subscriptionId');

  if (!registration) {
    return null;
  }

  const subscription = registration.subscriptionId;

  if (!subscription) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Assigned subscription plan not found'
    );
  }

  const originalAmount = Number(
    subscription.amount
  );

  const discountUsedCount = Number(
    registration.discountUsedCount || 0
  );

  const discountMaxUses = Number(
    registration.discountMaxUses || 0
  );

  const remainingUses = Math.max(
    discountMaxUses - discountUsedCount,
    0
  );

  const discountAvailable = remainingUses > 0;

  let discountAmount = 0;

  if (discountAvailable) {
    if (registration.discountType === 'percentage') {
      discountAmount =
        (originalAmount * registration.discountValue) / 100;
    } else if (registration.discountType === 'fixed') {
      discountAmount = Number(registration.discountValue);
    }
  }

  // Never allow discount greater than plan price
  discountAmount = Math.min(
    Math.max(discountAmount, 0),
    originalAmount
  );

  const payableAmount = Math.max(
    originalAmount - discountAmount,
    0
  );

  return {
    salesRegistration: {
      _id: registration._id,
      salesmanId: registration.salesmanId,
      customerId: registration.customerId,
      customerEmail: registration.customerEmail,
      discountType: registration.discountType,
      discountValue: registration.discountValue,
      discountMaxUses,
      discountUsedCount,
      remainingUses,
      status: registration.status,
    },

    subscription,

    pricing: {
      originalAmount,
      discountType: registration.discountType,
      discountValue: registration.discountValue,
      discountAmount,
      payableAmount,
      discountAvailable,
      remainingUses,
    },
  };
};


module.exports = {
  createSalesRegistration,
  getSalesRegistrations,
  getSalesDashboard,
  getMySalesOffer,
};
