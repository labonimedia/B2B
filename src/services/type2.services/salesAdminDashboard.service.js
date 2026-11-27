// const httpStatus = require('http-status');
// const mongoose = require('mongoose');

// const {
//   User,
//   SalesRegistration,
//   SubscriptionPlan,
//   Payment, 
// } = require('../../models');

// const ApiError = require('../../utils/ApiError');

// const SALES_ROLES = [
//   'manufacture',
//   'wholesaler',
//   'retailer',
//   'channelPartner',
// ];

// const getDateFilter = (options = {}) => {
//   const filter = {};

//   if (options.from || options.to) {
//     filter.createdAt = {};

//     if (options.from) {
//       filter.createdAt.$gte = new Date(options.from);
//     }

//     if (options.to) {
//       const to = new Date(options.to);
//       to.setHours(23, 59, 59, 999);

//       filter.createdAt.$lte = to;
//     }
//   }

//   return filter;
// };

// const getSalesRegistrationFilter = (options = {}) => {
//   const filter = {
//     isDeleted: false,
//     ...getDateFilter(options),
//   };

//   if (options.salesmanId) {
//     if (!mongoose.Types.ObjectId.isValid(options.salesmanId)) {
//       throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid salesman ID');
//     }

//     filter.salesmanId = new mongoose.Types.ObjectId(
//       options.salesmanId
//     );
//   }

//   return filter;
// };

// const getDiscountExpression = {
//   $multiply: [
//     { $ifNull: ['$discountAmount', 0] },
//     { $ifNull: ['$discountUsedCount', 0] },
//   ],
// };

// const getRemainingDiscountExpression = {
//   $multiply: [
//     { $ifNull: ['$discountAmount', 0] },
//     {
//       $max: [
//         {
//           $subtract: [
//             { $ifNull: ['$discountMaxUses', 0] },
//             { $ifNull: ['$discountUsedCount', 0] },
//           ],
//         },
//         0,
//       ],
//     },
//   ],
// };

// /**
//  * 1. OVERVIEW
//  */
// const getDashboardOverview = async (options = {}) => {
//   const registrationFilter = getSalesRegistrationFilter(options);

//   const userDateFilter = getDateFilter(options);

//   const [
//     businessCounts,
//     salesmanCount,
//     registrationStats,
//     subscriptionCounts,
//   ] = await Promise.all([
//     User.aggregate([
//       {
//         $match: {
//           role: { $in: SALES_ROLES },
//           ...userDateFilter,
//         },
//       },
//       {
//         $group: {
//           _id: '$role',
//           count: { $sum: 1 },
//         },
//       },
//     ]),

//     User.countDocuments({
//       role: 'sales',
//       ...userDateFilter,
//     }),

//     SalesRegistration.aggregate([
//       { $match: registrationFilter },
//       {
//         $group: {
//           _id: null,

//           totalRegistrations: { $sum: 1 },

//           totalOriginalAmount: {
//             $sum: '$originalAmount',
//           },

//           totalDiscountGiven: {
//             $sum: getDiscountExpression,
//           },

//           totalDiscountAvailable: {
//             $sum: getRemainingDiscountExpression,
//           },

//           totalPaid: {
//             $sum: { $ifNull: ['$totalPaid', 0] },
//           },

//           totalDiscountUses: {
//             $sum: { $ifNull: ['$discountUsedCount', 0] },
//           },

//           activeRegistrations: {
//             $sum: {
//               $cond: [{ $eq: ['$status', 'active'] }, 1, 0],
//             },
//           },

//           completedRegistrations: {
//             $sum: {
//               $cond: [{ $eq: ['$status', 'completed'] }, 1, 0],
//             },
//           },

//           expiredRegistrations: {
//             $sum: {
//               $cond: [{ $eq: ['$status', 'expired'] }, 1, 0],
//             },
//           },

//           cancelledRegistrations: {
//             $sum: {
//               $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0],
//             },
//           },
//         },
//       },
//     ]),

//     User.aggregate([
//       {
//         $match: {
//           role: { $in: SALES_ROLES },
//           ...userDateFilter,
//         },
//       },
//       {
//         $group: {
//           _id: '$subscriptionStatus',
//           count: { $sum: 1 },
//         },
//       },
//     ]),
//   ]);

//   const businesses = {
//     manufacture: 0,
//     wholesaler: 0,
//     retailer: 0,
//     channelPartner: 0,
//   };

//   businessCounts.forEach((item) => {
//     businesses[item._id] = item.count;
//   });

//   const subscriptions = {
//     active: 0,
//     expired: 0,
//     cancelled: 0,
//   };

//   subscriptionCounts.forEach((item) => {
//     if (item._id) {
//       subscriptions[item._id] = item.count;
//     }
//   });

//   const stats = registrationStats[0] || {};

//   return {
//     businesses: {
//       ...businesses,
//       total: Object.values(businesses).reduce(
//         (sum, count) => sum + count,
//         0
//       ),
//     },

//     subscriptions,

//     sales: {
//       totalSalesmen: salesmanCount,
//       totalRegistrations: stats.totalRegistrations || 0,
//       totalDiscountUses: stats.totalDiscountUses || 0,
//       activeRegistrations: stats.activeRegistrations || 0,
//       completedRegistrations: stats.completedRegistrations || 0,
//       expiredRegistrations: stats.expiredRegistrations || 0,
//       cancelledRegistrations: stats.cancelledRegistrations || 0,
//     },

//     financial: {
//       totalOriginalAmount: stats.totalOriginalAmount || 0,
//       totalDiscountGiven: stats.totalDiscountGiven || 0,
//       totalDiscountAvailable: stats.totalDiscountAvailable || 0,
//       totalPaid: stats.totalPaid || 0,
//       pendingAmount: Math.max(
//         (stats.totalOriginalAmount || 0) -
//           (stats.totalDiscountGiven || 0) -
//           (stats.totalPaid || 0),
//         0
//       ),
//     },
//   };
// };

// /**
//  * 2. BUSINESS COUNTS
//  */
// const getBusinessCounts = async (options = {}) => {
//   const dateFilter = getDateFilter(options);

//   const [allBusinesses, salesBusinesses] = await Promise.all([
//     User.aggregate([
//       {
//         $match: {
//           role: { $in: SALES_ROLES },
//           ...dateFilter,
//         },
//       },
//       {
//         $group: {
//           _id: '$role',
//           total: { $sum: 1 },
//         },
//       },
//     ]),

//     SalesRegistration.aggregate([
//       {
//         $match: getSalesRegistrationFilter(options),
//       },
//       {
//         $group: {
//           _id: '$customerRole',
//           total: { $sum: 1 },
//         },
//       },
//     ]),
//   ]);

//   const allCounts = {};
//   const salesCounts = {};

//   allBusinesses.forEach((item) => {
//     allCounts[item._id] = item.total;
//   });

//   salesBusinesses.forEach((item) => {
//     salesCounts[item._id] = item.total;
//   });

//   return {
//     totalPlatformBusinesses: Object.values(allCounts).reduce(
//       (sum, count) => sum + count,
//       0
//     ),

//     totalSalesRegisteredBusinesses: Object.values(salesCounts).reduce(
//       (sum, count) => sum + count,
//       0
//     ),

//     platform: allCounts,
//     salesRegistered: salesCounts,
//   };
// };

// /**
//  * 3. REVENUE REPORT
//  */
// const getRevenueReport = async (options = {}) => {
//   const match = getSalesRegistrationFilter(options);

//   const [result] = await SalesRegistration.aggregate([
//     { $match: match },
//     {
//       $group: {
//         _id: null,

//         originalAmount: {
//           $sum: '$originalAmount',
//         },

//         discountGiven: {
//           $sum: getDiscountExpression,
//         },

//         paidAmount: {
//           $sum: '$totalPaid',
//         },

//         discountedPlanAmount: {
//           $sum: '$discountedAmount',
//         },

//         registrations: {
//           $sum: 1,
//         },
//       },
//     },
//   ]);

//   const data = result || {};

//   return {
//     registrations: data.registrations || 0,
//     originalAmount: data.originalAmount || 0,
//     discountGiven: data.discountGiven || 0,
//     discountedPlanAmount: data.discountedPlanAmount || 0,
//     collectedAmount: data.paidAmount || 0,

//     pendingAmount: Math.max(
//       (data.discountedPlanAmount || 0) -
//         (data.paidAmount || 0),
//       0
//     ),
//   };
// };

// /**
//  * 4. DISCOUNT REPORT
//  */
// const getDiscountReport = async (options = {}) => {
//   const [result] = await SalesRegistration.aggregate([
//     {
//       $match: getSalesRegistrationFilter(options),
//     },
//     {
//       $group: {
//         _id: null,

//         totalDiscountAmount: {
//           $sum: getDiscountExpression,
//         },

//         availableDiscountAmount: {
//           $sum: getRemainingDiscountExpression,
//         },

//         totalDiscountUses: {
//           $sum: '$discountUsedCount',
//         },

//         totalDiscountAllowedUses: {
//           $sum: '$discountMaxUses',
//         },

//         totalRegistrations: {
//           $sum: 1,
//         },
//       },
//     },
//   ]);

//   const data = result || {};

//   return {
//     totalRegistrations: data.totalRegistrations || 0,
//     totalDiscountUses: data.totalDiscountUses || 0,
//     totalDiscountAllowedUses: data.totalDiscountAllowedUses || 0,
//     totalDiscountGiven: data.totalDiscountAmount || 0,
//     totalDiscountRemaining: data.availableDiscountAmount || 0,
//   };
// };

// /**
//  * 5. SALESMAN PERFORMANCE
//  */
// const getSalesPerformance = async (options = {}) => {
//   const match = getSalesRegistrationFilter(options);

//   const result = await SalesRegistration.aggregate([
//     { $match: match },
//     {
//       $group: {
//         _id: '$salesmanId',

//         salesmanName: {
//           $first: '$salesmanEmail',
//         },

//         totalBusinesses: {
//           $sum: 1,
//         },

//         totalOriginalAmount: {
//           $sum: '$originalAmount',
//         },

//         totalDiscount: {
//           $sum: getDiscountExpression,
//         },

//         totalCollected: {
//           $sum: '$totalPaid',
//         },

//         totalDiscountUses: {
//           $sum: '$discountUsedCount',
//         },
//       },
//     },
//     {
//       $lookup: {
//         from: 'users',
//         localField: '_id',
//         foreignField: '_id',
//         as: 'salesman',
//       },
//     },
//     {
//       $unwind: {
//         path: '$salesman',
//         preserveNullAndEmptyArrays: true,
//       },
//     },
//     {
//       $project: {
//         salesmanId: '$_id',
//         salesmanName: {
//           $ifNull: ['$salesman.fullName', '$salesmanName'],
//         },
//         salesmanEmail: '$salesman.email',
//         totalBusinesses: 1,
//         totalOriginalAmount: 1,
//         totalDiscount: 1,
//         totalCollected: 1,
//         totalDiscountUses: 1,
//       },
//     },
//     {
//       $sort: {
//         totalCollected: -1,
//       },
//     },
//   ]);

//   return result;
// };

// /**
//  * 6. SUBSCRIPTION PLAN PERFORMANCE
//  */
// const getPlanPerformance = async (options = {}) => {
//   return SalesRegistration.aggregate([
//     {
//       $match: getSalesRegistrationFilter(options),
//     },
//     {
//       $group: {
//         _id: '$subscriptionId',

//         planName: { $first: '$planName' },
//         planCode: { $first: '$planCode' },

//         totalBusinesses: { $sum: 1 },

//         originalAmount: {
//           $sum: '$originalAmount',
//         },

//         discountAmount: {
//           $sum: getDiscountExpression,
//         },

//         totalCollected: {
//           $sum: '$totalPaid',
//         },
//       },
//     },
//     {
//       $sort: {
//         totalBusinesses: -1,
//       },
//     },
//   ]);
// };

// /**
//  * 7. MONTHLY TRENDS
//  *
//  * Registrations and registration-based financial totals.
//  * Payment dates are not tracked separately in your current schema.
//  */
// const getMonthlyTrends = async (options = {}) => {
//   const year = Number(options.year) || new Date().getFullYear();

//   const from = new Date(`${year}-01-01T00:00:00.000Z`);
//   const to = new Date(`${year + 1}-01-01T00:00:00.000Z`);

//   return SalesRegistration.aggregate([
//     {
//       $match: {
//         isDeleted: false,
//         createdAt: {
//           $gte: from,
//           $lt: to,
//         },
//       },
//     },
//     {
//       $group: {
//         _id: {
//           month: { $month: '$createdAt' },
//           year: { $year: '$createdAt' },
//         },

//         registrations: { $sum: 1 },

//         collectedAmount: {
//           $sum: '$totalPaid',
//         },

//         discountGiven: {
//           $sum: getDiscountExpression,
//         },
//       },
//     },
//     {
//       $sort: {
//         '_id.month': 1,
//       },
//     },
//   ]);
// };

// /**
//  * 8. TOP SALESMEN
//  */
// const getTopSalesmen = async (options = {}) => {
//   const limit = Math.min(Number(options.limit) || 10, 100);

//   let sortField = 'totalCollected';

//   if (options.sortBy === 'businesses') {
//     sortField = 'totalBusinesses';
//   }

//   if (options.sortBy === 'discount') {
//     sortField = 'totalDiscount';
//   }

//   if (options.sortBy === 'customers') {
//     sortField = 'totalBusinesses';
//   }

//   return SalesRegistration.aggregate([
//     {
//       $match: getSalesRegistrationFilter(options),
//     },
//     {
//       $group: {
//         _id: '$salesmanId',

//         totalBusinesses: { $sum: 1 },

//         totalCollected: {
//           $sum: '$totalPaid',
//         },

//         totalDiscount: {
//           $sum: getDiscountExpression,
//         },

//         totalOriginalAmount: {
//           $sum: '$originalAmount',
//         },
//       },
//     },
//     {
//       $lookup: {
//         from: 'users',
//         localField: '_id',
//         foreignField: '_id',
//         as: 'salesman',
//       },
//     },
//     {
//       $unwind: {
//         path: '$salesman',
//         preserveNullAndEmptyArrays: true,
//       },
//     },
//     {
//       $project: {
//         salesmanId: '$_id',
//         salesmanName: '$salesman.fullName',
//         salesmanEmail: '$salesman.email',
//         totalBusinesses: 1,
//         totalCollected: 1,
//         totalDiscount: 1,
//         totalOriginalAmount: 1,
//       },
//     },
//     {
//       $sort: {
//         [sortField]: -1,
//       },
//     },
//     {
//       $limit: limit,
//     },
//   ]);
// };

// /**
//  * 9. RECENT REGISTRATIONS
//  */
// const getRecentRegistrations = async (options = {}) => {
//   const limit = Math.min(Number(options.limit) || 10, 100);

//   return SalesRegistration.find({
//     isDeleted: false,
//   })
//     .populate('salesmanId', 'fullName email')
//     .populate('customerId', 'fullName email role companyName')
//     .populate('subscriptionId', 'planName planCode finalAmount')
//     .sort({ createdAt: -1 })
//     .limit(limit);
// };

// /**
//  * 10. ALL REGISTERED CUSTOMERS
//  */
// const getCustomers = async (options = {}) => {
//   const filter = getSalesRegistrationFilter(options);

//   if (options.customerRole) {
//     filter.customerRole = options.customerRole;
//   }

//   if (options.status) {
//     filter.status = options.status;
//   }

//   if (options.search) {
//     filter.$or = [
//       { customerName: { $regex: options.search, $options: 'i' } },
//       { companyName: { $regex: options.search, $options: 'i' } },
//       { customerEmail: { $regex: options.search, $options: 'i' } },
//       { customerMobile: { $regex: options.search, $options: 'i' } },
//       { salesmanEmail: { $regex: options.search, $options: 'i' } },
//     ];
//   }

//   return SalesRegistration.paginate(filter, {
//     page: Number(options.page) || 1,
//     limit: Math.min(Number(options.limit) || 10, 100),
//     sortBy: options.sortBy || 'createdAt:desc',
//     populate: [
//       {
//         path: 'salesmanId',
//         select: 'fullName email',
//       },
//       {
//         path: 'customerId',
//         select: 'fullName email role subscriptionStatus subscriptionExpiryDate',
//       },
//       {
//         path: 'subscriptionId',
//       },
//     ],
//   });
// };

// /**
//  * 11. SALESMAN DETAILS
//  */
// const getSalesmanDetails = async (salesmanId, options = {}) => {
//   if (!mongoose.Types.ObjectId.isValid(salesmanId)) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid salesman ID');
//   }

//   const salesman = await User.findOne({
//     _id: salesmanId,
//     role: 'sales',
//   }).select('fullName email mobileNumber createdAt isActive');

//   if (!salesman) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Salesman not found');
//   }

//   const filter = getSalesRegistrationFilter({
//     ...options,
//     salesmanId,
//   });

//   const [performance, customers] = await Promise.all([
//     SalesRegistration.aggregate([
//       { $match: filter },
//       {
//         $group: {
//           _id: null,

//           totalCustomers: { $sum: 1 },

//           totalOriginalAmount: {
//             $sum: '$originalAmount',
//           },

//           totalDiscount: {
//             $sum: getDiscountExpression,
//           },

//           totalCollected: {
//             $sum: '$totalPaid',
//           },

//           totalDiscountUses: {
//             $sum: '$discountUsedCount',
//           },
//         },
//       },
//     ]),

//     SalesRegistration.find(filter)
//       .populate('customerId', 'fullName email role subscriptionStatus')
//       .populate('subscriptionId', 'planName finalAmount')
//       .sort({ createdAt: -1 }),
//   ]);

//   return {
//     salesman,
//     performance: performance[0] || {
//       totalCustomers: 0,
//       totalOriginalAmount: 0,
//       totalDiscount: 0,
//       totalCollected: 0,
//       totalDiscountUses: 0,
//     },
//     customers,
//   };
// };

// /**
//  * 12. PAYMENT REPORT
//  *
//  * Current SalesRegistration schema has totalPaid only.
//  * This is a registration summary, NOT individual payment history.
//  */
// const getPaymentReport = async (options = {}) => {
//   const filter = getSalesRegistrationFilter(options);

//   if (options.customerRole) {
//     filter.customerRole = options.customerRole;
//   }

//   if (options.search) {
//     filter.$or = [
//       { customerName: { $regex: options.search, $options: 'i' } },
//       { customerEmail: { $regex: options.search, $options: 'i' } },
//       { salesmanEmail: { $regex: options.search, $options: 'i' } },
//     ];
//   }

//   filter.totalPaid = { $gt: 0 };

//   return SalesRegistration.paginate(filter, {
//     page: Number(options.page) || 1,
//     limit: Math.min(Number(options.limit) || 10, 100),
//     sortBy: options.sortBy || 'updatedAt:desc',
//     populate: [
//       {
//         path: 'salesmanId',
//         select: 'fullName email',
//       },
//       {
//         path: 'customerId',
//         select: 'fullName email role',
//       },
//       {
//         path: 'subscriptionId',
//       },
//     ],
//   });
// };

// // =====================================================
// // PAYMENT DASHBOARD SERVICES
// // =====================================================

// const buildPaymentDateFilter = (from, to, field = 'createdAt') => {
//   const filter = {};

//   if (from || to) {
//     filter[field] = {};

//     if (from) {
//       filter[field].$gte = new Date(from);
//     }

//     if (to) {
//       const endDate = new Date(to);
//       endDate.setHours(23, 59, 59, 999);
//       filter[field].$lte = endDate;
//     }
//   }

//   return filter;
// };

// const buildPaymentFilter = (query = {}) => {
//   const filter = {
//     isDeleted: false,
//     ...buildPaymentDateFilter(query.from, query.to),
//   };

//   if (query.status) {
//     filter.status = query.status;
//   }

//   if (query.userEmail) {
//     filter.userEmail = query.userEmail;
//   }

//   if (query.paymentMethod) {
//     filter.paymentMethod = query.paymentMethod;
//   }

//   if (query.salesmanId) {
//     filter.salesmanId = query.salesmanId;
//   }

//   if (query.subscriptionId) {
//     filter.subscriptionId = query.subscriptionId;
//   }

//   return filter;
// };


// // -----------------------------------------------------
// // 1. PAYMENT OVERVIEW
// // -----------------------------------------------------

// const getPaymentOverview = async (query = {}) => {
//   const filter = buildPaymentFilter(query);

//   const [result] = await Payment.aggregate([
//     {
//       $match: filter,
//     },
//     {
//       $group: {
//         _id: null,

//         totalTransactions: {
//           $sum: 1,
//         },

//         successfulPayments: {
//           $sum: {
//             $cond: [{ $eq: ['$status', 'paid'] }, 1, 0],
//           },
//         },

//         failedPayments: {
//           $sum: {
//             $cond: [{ $eq: ['$status', 'failed'] }, 1, 0],
//           },
//         },

//         pendingPayments: {
//           $sum: {
//             $cond: [{ $eq: ['$status', 'created'] }, 1, 0],
//           },
//         },

//         refundedPayments: {
//           $sum: {
//             $cond: [
//               {
//                 $in: [
//                   '$status',
//                   ['refunded', 'partially_refunded'],
//                 ],
//               },
//               1,
//               0,
//             ],
//           },
//         },

//         grossRevenue: {
//           $sum: {
//             $cond: [
//               { $eq: ['$status', 'paid'] },
//               '$payableAmount',
//               0,
//             ],
//           },
//         },

//         refundAmount: {
//           $sum: '$refundAmount',
//         },

//         totalDiscount: {
//           $sum: {
//             $cond: [
//               { $eq: ['$status', 'paid'] },
//               '$discountAmount',
//               0,
//             ],
//           },
//         },
//       },
//     },
//   ]);

//   const data = result || {};

//   const grossRevenue = data.grossRevenue || 0;
//   const refunds = data.refundAmount || 0;
//   const totalTransactions = data.totalTransactions || 0;
//   const successfulPayments = data.successfulPayments || 0;

//   return {
//     totalTransactions,
//     successfulPayments,
//     failedPayments: data.failedPayments || 0,
//     pendingPayments: data.pendingPayments || 0,
//     refundedPayments: data.refundedPayments || 0,

//     grossRevenue,
//     refundAmount: refunds,
//     netRevenue: grossRevenue - refunds,

//     totalDiscount: data.totalDiscount || 0,

//     successRate: totalTransactions
//       ? Number(
//           ((successfulPayments / totalTransactions) * 100).toFixed(2)
//         )
//       : 0,
//   };
// };


// // -----------------------------------------------------
// // 2. PAYMENT REVENUE
// // -----------------------------------------------------

// const getPaymentRevenue = async (query = {}) => {
//   const filter = {
//     isDeleted: false,
//     status: {
//       $in: ['paid', 'partially_refunded', 'refunded'],
//     },

//     // Revenue is based on successful payment date.
//     ...buildPaymentDateFilter(query.from, query.to, 'verifiedAt'),
//   };

//   if (query.salesmanId) {
//     filter.salesmanId = query.salesmanId;
//   }

//   if (query.subscriptionId) {
//     filter.subscriptionId = query.subscriptionId;
//   }

//   const [result] = await Payment.aggregate([
//     {
//       $match: filter,
//     },
//     {
//       $group: {
//         _id: null,

//         totalPayments: {
//           $sum: 1,
//         },

//         grossRevenue: {
//           $sum: '$payableAmount',
//         },

//         refunds: {
//           $sum: '$refundAmount',
//         },

//         discount: {
//           $sum: '$discountAmount',
//         },
//       },
//     },
//   ]);

//   const data = result || {};

//   const grossRevenue = data.grossRevenue || 0;
//   const refunds = data.refunds || 0;

//   return {
//     totalPayments: data.totalPayments || 0,
//     grossRevenue,
//     refunds,
//     netRevenue: grossRevenue - refunds,
//     totalDiscount: data.discount || 0,
//   };
// };


// // -----------------------------------------------------
// // 3. MONTHLY PAYMENT TRENDS
// // -----------------------------------------------------

// const getPaymentMonthlyTrends = async ({ year }) => {
//   const startDate = new Date(`${year}-01-01T00:00:00.000Z`);

//   const endDate = new Date(
//     `${Number(year) + 1}-01-01T00:00:00.000Z`
//   );

//   const result = await Payment.aggregate([
//     {
//       $match: {
//         isDeleted: false,
//         verifiedAt: {
//           $gte: startDate,
//           $lt: endDate,
//         },
//       },
//     },
//     {
//       $group: {
//         _id: {
//           month: {
//             $month: '$verifiedAt',
//           },
//         },

//         transactions: {
//           $sum: 1,
//         },

//         successfulPayments: {
//           $sum: {
//             $cond: [{ $eq: ['$status', 'paid'] }, 1, 0],
//           },
//         },

//         revenue: {
//           $sum: {
//             $cond: [
//               {
//                 $in: [
//                   '$status',
//                   ['paid', 'partially_refunded', 'refunded'],
//                 ],
//               },
//               '$payableAmount',
//               0,
//             ],
//           },
//         },

//         refunds: {
//           $sum: '$refundAmount',
//         },
//       },
//     },
//     {
//       $sort: {
//         '_id.month': 1,
//       },
//     },
//   ]);

//   const months = Array.from({ length: 12 }, (_, i) => ({
//     month: i + 1,
//     transactions: 0,
//     successfulPayments: 0,
//     revenue: 0,
//     refunds: 0,
//     netRevenue: 0,
//   }));

//   result.forEach((item) => {
//     const index = item._id.month - 1;

//     months[index] = {
//       month: item._id.month,
//       transactions: item.transactions,
//       successfulPayments: item.successfulPayments,
//       revenue: item.revenue,
//       refunds: item.refunds,
//       netRevenue: item.revenue - item.refunds,
//     };
//   });

//   return {
//     year: Number(year),
//     months,
//   };
// };


// // -----------------------------------------------------
// // 4. PAYMENT METHOD ANALYTICS
// // -----------------------------------------------------

// const getPaymentMethods = async (query = {}) => {
//   return Payment.aggregate([
//     {
//       $match: {
//         isDeleted: false,
//         status: {
//           $in: ['paid', 'partially_refunded', 'refunded'],
//         },
//         ...buildPaymentDateFilter(query.from, query.to, 'verifiedAt'),
//       },
//     },
//     {
//       $group: {
//         _id: {
//           $ifNull: ['$paymentMethod', 'unknown'],
//         },

//         transactions: {
//           $sum: 1,
//         },

//         revenue: {
//           $sum: '$payableAmount',
//         },

//         refunds: {
//           $sum: '$refundAmount',
//         },
//       },
//     },
//     {
//       $project: {
//         paymentMethod: '$_id',
//         transactions: 1,
//         revenue: 1,
//         refunds: 1,
//         netRevenue: {
//           $subtract: ['$revenue', '$refunds'],
//         },
//       },
//     },
//     {
//       $sort: {
//         revenue: -1,
//       },
//     },
//   ]);
// };


// // -----------------------------------------------------
// // 5. PLAN PERFORMANCE
// // -----------------------------------------------------

// const getPaymentPlanPerformance = async (query = {}) => {
//   return Payment.aggregate([
//     {
//       $match: {
//         isDeleted: false,
//         status: {
//           $in: ['paid', 'partially_refunded', 'refunded'],
//         },
//         ...buildPaymentDateFilter(query.from, query.to, 'verifiedAt'),
//       },
//     },
//     {
//       $group: {
//         _id: '$subscriptionId',

//         planName: {
//           $first: '$planName',
//         },

//         planCode: {
//           $first: '$planCode',
//         },

//         totalSales: {
//           $sum: 1,
//         },

//         revenue: {
//           $sum: '$payableAmount',
//         },

//         refunds: {
//           $sum: '$refundAmount',
//         },
//       },
//     },
//     {
//       $project: {
//         subscriptionId: '$_id',
//         planName: 1,
//         planCode: 1,
//         totalSales: 1,
//         revenue: 1,
//         refunds: 1,
//         netRevenue: {
//           $subtract: ['$revenue', '$refunds'],
//         },
//       },
//     },
//     {
//       $sort: {
//         revenue: -1,
//       },
//     },
//   ]);
// };


// // -----------------------------------------------------
// // 6. SALESMAN PAYMENT PERFORMANCE
// // -----------------------------------------------------

// const getPaymentSalesmanPerformance = async (query = {}) => {
//   const filter = {
//     isDeleted: false,
//     status: {
//       $in: ['paid', 'partially_refunded', 'refunded'],
//     },
//     salesmanId: {
//       $ne: null,
//     },
//     ...buildPaymentDateFilter(query.from, query.to, 'verifiedAt'),
//   };

//   if (query.salesmanId) {
//     filter.salesmanId = query.salesmanId;
//   }

//   const result = await Payment.aggregate([
//     {
//       $match: filter,
//     },
//     {
//       $group: {
//         _id: '$salesmanId',

//         transactions: {
//           $sum: 1,
//         },

//         revenue: {
//           $sum: '$payableAmount',
//         },

//         refunds: {
//           $sum: '$refundAmount',
//         },

//         discounts: {
//           $sum: '$discountAmount',
//         },

//         customers: {
//           $addToSet: '$userId',
//         },
//       },
//     },
//     {
//       $project: {
//         salesmanId: '$_id',
//         transactions: 1,
//         revenue: 1,
//         refunds: 1,
//         discounts: 1,

//         netRevenue: {
//           $subtract: ['$revenue', '$refunds'],
//         },

//         customersCount: {
//           $size: '$customers',
//         },
//       },
//     },
//     {
//       $sort: {
//         revenue: -1,
//       },
//     },
//   ]);

//   return result;
// };


// // -----------------------------------------------------
// // 7. RECENT PAYMENTS
// // -----------------------------------------------------

// const getRecentPayments = async (query = {}) => {
//   const filter = {
//     isDeleted: false,
//     ...buildPaymentDateFilter(query.from, query.to),
//   };

//   return Payment.find(filter)
//     .sort({ createdAt: -1 })
//     .limit(Number(query.limit) || 10)
//     .select(
//       '-gatewayResponse -webhookPayload -razorpaySignature -history'
//     )
//     .populate('userId', 'fullName companyName email role')
//     .populate('subscriptionId', 'name planName')
//     .populate('salesmanId', 'fullName email')
//     .lean();
// };


// // -----------------------------------------------------
// // 8. FAILED PAYMENT REPORT
// // -----------------------------------------------------

// const getFailedPayments = async (query = {}) => {
//   const filter = {
//     isDeleted: false,
//     status: 'failed',
//     ...buildPaymentDateFilter(query.from, query.to),
//   };

//   if (query.search) {
//     filter.$or = [
//       {
//         userEmail: {
//           $regex: query.search,
//           $options: 'i',
//         },
//       },
//       {
//         razorpayOrderId: {
//           $regex: query.search,
//           $options: 'i',
//         },
//       },
//       {
//         failureReason: {
//           $regex: query.search,
//           $options: 'i',
//         },
//       },
//     ];
//   }

//   return Payment.paginate(filter, {
//     page: Number(query.page) || 1,
//     limit: Number(query.limit) || 20,
//     sortBy: 'createdAt:desc',
//     populate: 'userId subscriptionId salesmanId',
//   });
// };


// // -----------------------------------------------------
// // 9. REFUND REPORT
// // -----------------------------------------------------

// const getRefundPayments = async (query = {}) => {
//   const filter = {
//     isDeleted: false,
//     refundAmount: {
//       $gt: 0,
//     },
//     ...buildPaymentDateFilter(query.from, query.to),
//   };

//   if (query.refundStatus) {
//     filter.refundStatus = query.refundStatus;
//   }

//   return Payment.paginate(filter, {
//     page: Number(query.page) || 1,
//     limit: Number(query.limit) || 20,
//     sortBy: 'createdAt:desc',
//     populate: 'userId subscriptionId salesmanId',
//   });
// };


// // -----------------------------------------------------
// // 10. PAYMENT TRANSACTIONS
// // -----------------------------------------------------

// const getPaymentTransactions = async (query = {}) => {
//   const filter = buildPaymentFilter(query);

//   if (query.search) {
//     filter.$or = [
//       {
//         userEmail: {
//           $regex: query.search,
//           $options: 'i',
//         },
//       },
//       {
//         razorpayOrderId: {
//           $regex: query.search,
//           $options: 'i',
//         },
//       },
//       {
//         razorpayPaymentId: {
//           $regex: query.search,
//           $options: 'i',
//         },
//       },
//       {
//         planName: {
//           $regex: query.search,
//           $options: 'i',
//         },
//       },
//       {
//         invoiceNumber: {
//           $regex: query.search,
//           $options: 'i',
//         },
//       },
//     ];
//   }

//   return Payment.paginate(filter, {
//     page: Number(query.page) || 1,
//     limit: Number(query.limit) || 20,
//     sortBy: query.sortBy || 'createdAt:desc',
//     populate: 'userId subscriptionId salesmanId',
//   });
// };

// module.exports = {
//   getDashboardOverview,
//   getBusinessCounts,
//   getRevenueReport,
//   getDiscountReport,
//   getSalesPerformance,
//   getPlanPerformance,
//   getMonthlyTrends,
//   getTopSalesmen,
//   getRecentRegistrations,
//   getCustomers,
//   getSalesmanDetails,
//   getPaymentReport,
//    // Keep all existing SalesRegistration dashboard exports

//   getPaymentOverview,
//   getPaymentTransactions,
//   getPaymentRevenue,
//   getPaymentMonthlyTrends,
//   getPaymentMethods,
//   getPaymentPlanPerformance,
//   getPaymentSalesmanPerformance,
//   getRecentPayments,
//   getFailedPayments,
//   getRefundPayments,
// };

const httpStatus = require('http-status');
const mongoose = require('mongoose');

const {
  User,
  SalesRegistration,
  SubscriptionPlan,
  Payment,
} = require('../../models');

const ApiError = require('../../utils/ApiError');

const SALES_ROLES = [
  'manufacture',
  'wholesaler',
  'retailer',
  'channelPartner',
];

const getDateFilter = (options = {}) => {
  const filter = {};

  if (options.from || options.to) {
    filter.createdAt = {};

    if (options.from) {
      filter.createdAt.$gte = new Date(options.from);
    }

    if (options.to) {
      const to = new Date(options.to);
      to.setHours(23, 59, 59, 999);
      filter.createdAt.$lte = to;
    }
  }

  return filter;
};

const getSalesRegistrationFilter = (options = {}) => {
  const filter = {
    isDeleted: false,
    ...getDateFilter(options),
  };

  if (options.salesmanId) {
    if (!mongoose.Types.ObjectId.isValid(options.salesmanId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid salesman ID');
    }

    filter.salesmanId = new mongoose.Types.ObjectId(options.salesmanId);
  }

  return filter;
};

const getDiscountExpression = {
  $multiply: [
    { $ifNull: ['$discountAmount', 0] },
    { $ifNull: ['$discountUsedCount', 0] },
  ],
};

const getRemainingDiscountExpression = {
  $multiply: [
    { $ifNull: ['$discountAmount', 0] },
    {
      $max: [
        {
          $subtract: [
            { $ifNull: ['$discountMaxUses', 0] },
            { $ifNull: ['$discountUsedCount', 0] },
          ],
        },
        0,
      ],
    },
  ],
};

/**
 * 1. OVERVIEW
 */
const getDashboardOverview = async (options = {}) => {
  const registrationFilter = getSalesRegistrationFilter(options);
  const userDateFilter = getDateFilter(options);

  const [
    businessCounts,
    salesmanCount,
    registrationStats,
    subscriptionCounts,
  ] = await Promise.all([
    User.aggregate([
      {
        $match: {
          role: { $in: SALES_ROLES },
          ...userDateFilter,
        },
      },
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
        },
      },
    ]),

    User.countDocuments({
      role: 'sales',
      ...userDateFilter,
    }),

    SalesRegistration.aggregate([
      { $match: registrationFilter },
      {
        $group: {
          _id: null,
          totalRegistrations: { $sum: 1 },
          totalOriginalAmount: { $sum: '$originalAmount' },
          totalDiscountGiven: { $sum: getDiscountExpression },
          totalDiscountAvailable: {
            $sum: getRemainingDiscountExpression,
          },
          totalPaid: {
            $sum: { $ifNull: ['$totalPaid', 0] },
          },
          totalDiscountUses: {
            $sum: { $ifNull: ['$discountUsedCount', 0] },
          },
          activeRegistrations: {
            $sum: {
              $cond: [{ $eq: ['$status', 'active'] }, 1, 0],
            },
          },
          completedRegistrations: {
            $sum: {
              $cond: [{ $eq: ['$status', 'completed'] }, 1, 0],
            },
          },
          expiredRegistrations: {
            $sum: {
              $cond: [{ $eq: ['$status', 'expired'] }, 1, 0],
            },
          },
          cancelledRegistrations: {
            $sum: {
              $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0],
            },
          },
        },
      },
    ]),

    User.aggregate([
      {
        $match: {
          role: { $in: SALES_ROLES },
          ...userDateFilter,
        },
      },
      {
        $group: {
          _id: '$subscriptionStatus',
          count: { $sum: 1 },
        },
      },
    ]),
  ]);

  const businesses = {
    manufacture: 0,
    wholesaler: 0,
    retailer: 0,
    channelPartner: 0,
  };

  businessCounts.forEach((item) => {
    businesses[item._id] = item.count;
  });

  const subscriptions = {
    active: 0,
    expired: 0,
    cancelled: 0,
  };

  subscriptionCounts.forEach((item) => {
    if (item._id) {
      subscriptions[item._id] = item.count;
    }
  });

  const stats = registrationStats[0] || {};

  return {
    businesses: {
      ...businesses,
      total: Object.values(businesses).reduce(
        (sum, count) => sum + count,
        0
      ),
    },

    subscriptions,

    sales: {
      totalSalesmen: salesmanCount,
      totalRegistrations: stats.totalRegistrations || 0,
      totalDiscountUses: stats.totalDiscountUses || 0,
      activeRegistrations: stats.activeRegistrations || 0,
      completedRegistrations: stats.completedRegistrations || 0,
      expiredRegistrations: stats.expiredRegistrations || 0,
      cancelledRegistrations: stats.cancelledRegistrations || 0,
    },

    financial: {
      totalOriginalAmount: stats.totalOriginalAmount || 0,
      totalDiscountGiven: stats.totalDiscountGiven || 0,
      totalDiscountAvailable: stats.totalDiscountAvailable || 0,
      totalPaid: stats.totalPaid || 0,
      pendingAmount: Math.max(
        (stats.totalOriginalAmount || 0) -
          (stats.totalDiscountGiven || 0) -
          (stats.totalPaid || 0),
        0
      ),
    },
  };
};

/**
 * 2. BUSINESS COUNTS
 */
const getBusinessCounts = async (options = {}) => {
  const dateFilter = getDateFilter(options);

  const [allBusinesses, salesBusinesses] = await Promise.all([
    User.aggregate([
      {
        $match: {
          role: { $in: SALES_ROLES },
          ...dateFilter,
        },
      },
      {
        $group: {
          _id: '$role',
          total: { $sum: 1 },
        },
      },
    ]),

    SalesRegistration.aggregate([
      {
        $match: getSalesRegistrationFilter(options),
      },
      {
        $group: {
          _id: '$customerRole',
          total: { $sum: 1 },
        },
      },
    ]),
  ]);

  const allCounts = {};
  const salesCounts = {};

  allBusinesses.forEach((item) => {
    allCounts[item._id] = item.total;
  });

  salesBusinesses.forEach((item) => {
    salesCounts[item._id] = item.total;
  });

  return {
    totalPlatformBusinesses: Object.values(allCounts).reduce(
      (sum, count) => sum + count,
      0
    ),

    totalSalesRegisteredBusinesses: Object.values(salesCounts).reduce(
      (sum, count) => sum + count,
      0
    ),

    platform: allCounts,
    salesRegistered: salesCounts,
  };
};

/**
 * 3. REVENUE REPORT
 */
const getRevenueReport = async (options = {}) => {
  const match = getSalesRegistrationFilter(options);

  const [result] = await SalesRegistration.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        originalAmount: { $sum: '$originalAmount' },
        discountGiven: { $sum: getDiscountExpression },
        paidAmount: { $sum: '$totalPaid' },
        discountedPlanAmount: { $sum: '$discountedAmount' },
        registrations: { $sum: 1 },
      },
    },
  ]);

  const data = result || {};

  return {
    registrations: data.registrations || 0,
    originalAmount: data.originalAmount || 0,
    discountGiven: data.discountGiven || 0,
    discountedPlanAmount: data.discountedPlanAmount || 0,
    collectedAmount: data.paidAmount || 0,

    pendingAmount: Math.max(
      (data.discountedPlanAmount || 0) -
        (data.paidAmount || 0),
      0
    ),
  };
};

/**
 * 4. DISCOUNT REPORT
 */
const getDiscountReport = async (options = {}) => {
  const [result] = await SalesRegistration.aggregate([
    {
      $match: getSalesRegistrationFilter(options),
    },
    {
      $group: {
        _id: null,
        totalDiscountAmount: { $sum: getDiscountExpression },
        availableDiscountAmount: {
          $sum: getRemainingDiscountExpression,
        },
        totalDiscountUses: { $sum: '$discountUsedCount' },
        totalDiscountAllowedUses: { $sum: '$discountMaxUses' },
        totalRegistrations: { $sum: 1 },
      },
    },
  ]);

  const data = result || {};

  return {
    totalRegistrations: data.totalRegistrations || 0,
    totalDiscountUses: data.totalDiscountUses || 0,
    totalDiscountAllowedUses: data.totalDiscountAllowedUses || 0,
    totalDiscountGiven: data.totalDiscountAmount || 0,
    totalDiscountRemaining: data.availableDiscountAmount || 0,
  };
};
/**
 * 5. SALESMAN PERFORMANCE
 */
const getSalesPerformance = async (options = {}) => {
  const match = getSalesRegistrationFilter(options);

  const result = await SalesRegistration.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$salesmanId',
        salesmanName: { $first: '$salesmanEmail' },
        totalBusinesses: { $sum: 1 },
        totalOriginalAmount: { $sum: '$originalAmount' },
        totalDiscount: { $sum: getDiscountExpression },
        totalCollected: { $sum: '$totalPaid' },
        totalDiscountUses: { $sum: '$discountUsedCount' },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'salesman',
      },
    },
    {
      $unwind: {
        path: '$salesman',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        salesmanId: '$_id',
        salesmanName: {
          $ifNull: ['$salesman.fullName', '$salesmanName'],
        },
        salesmanEmail: '$salesman.email',
        totalBusinesses: 1,
        totalOriginalAmount: 1,
        totalDiscount: 1,
        totalCollected: 1,
        totalDiscountUses: 1,
      },
    },
    {
      $sort: {
        totalCollected: -1,
      },
    },
  ]);

  return result;
};

/**
 * 6. SUBSCRIPTION PLAN PERFORMANCE
 */
const getPlanPerformance = async (options = {}) => {
  return SalesRegistration.aggregate([
    {
      $match: getSalesRegistrationFilter(options),
    },
    {
      $group: {
        _id: '$subscriptionId',
        planName: { $first: '$planName' },
        planCode: { $first: '$planCode' },
        totalBusinesses: { $sum: 1 },
        originalAmount: { $sum: '$originalAmount' },
        discountAmount: { $sum: getDiscountExpression },
        totalCollected: { $sum: '$totalPaid' },
      },
    },
    {
      $sort: {
        totalBusinesses: -1,
      },
    },
  ]);
};

/**
 * 7. MONTHLY TRENDS
 *
 * Registration-based financial totals.
 */
const getMonthlyTrends = async (options = {}) => {
  const year = Number(options.year) || new Date().getFullYear();

  const from = new Date(`${year}-01-01T00:00:00.000Z`);
  const to = new Date(`${year + 1}-01-01T00:00:00.000Z`);

  return SalesRegistration.aggregate([
    {
      $match: {
        isDeleted: false,
        createdAt: {
          $gte: from,
          $lt: to,
        },
      },
    },
    {
      $group: {
        _id: {
          month: { $month: '$createdAt' },
          year: { $year: '$createdAt' },
        },
        registrations: { $sum: 1 },
        collectedAmount: { $sum: '$totalPaid' },
        discountGiven: { $sum: getDiscountExpression },
      },
    },
    {
      $sort: {
        '_id.month': 1,
      },
    },
  ]);
};

/**
 * 8. TOP SALESMEN
 */
const getTopSalesmen = async (options = {}) => {
  const limit = Math.min(Number(options.limit) || 10, 100);

  let sortField = 'totalCollected';

  if (options.sortBy === 'businesses') {
    sortField = 'totalBusinesses';
  }

  if (options.sortBy === 'discount') {
    sortField = 'totalDiscount';
  }

  if (options.sortBy === 'customers') {
    sortField = 'totalBusinesses';
  }

  return SalesRegistration.aggregate([
    {
      $match: getSalesRegistrationFilter(options),
    },
    {
      $group: {
        _id: '$salesmanId',
        totalBusinesses: { $sum: 1 },
        totalCollected: { $sum: '$totalPaid' },
        totalDiscount: { $sum: getDiscountExpression },
        totalOriginalAmount: { $sum: '$originalAmount' },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'salesman',
      },
    },
    {
      $unwind: {
        path: '$salesman',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        salesmanId: '$_id',
        salesmanName: '$salesman.fullName',
        salesmanEmail: '$salesman.email',
        totalBusinesses: 1,
        totalCollected: 1,
        totalDiscount: 1,
        totalOriginalAmount: 1,
      },
    },
    {
      $sort: {
        [sortField]: -1,
      },
    },
    {
      $limit: limit,
    },
  ]);
};

/**
 * 9. RECENT REGISTRATIONS
 */
const getRecentRegistrations = async (options = {}) => {
  const limit = Math.min(Number(options.limit) || 10, 100);

  return SalesRegistration.find({
    isDeleted: false,
  })
    .populate('salesmanId', 'fullName email')
    .populate('customerId', 'fullName email role companyName')
    .populate('subscriptionId', 'planName planCode finalAmount')
    .sort({ createdAt: -1 })
    .limit(limit);
};

/**
 * 10. ALL REGISTERED CUSTOMERS
 */
const getCustomers = async (options = {}) => {
  const filter = getSalesRegistrationFilter(options);

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
      { salesmanEmail: { $regex: options.search, $options: 'i' } },
    ];
  }

  return SalesRegistration.paginate(filter, {
    page: Number(options.page) || 1,
    limit: Math.min(Number(options.limit) || 10, 100),
    sortBy: options.sortBy || 'createdAt:desc',
    populate: [
      {
        path: 'salesmanId',
        select: 'fullName email',
      },
      {
        path: 'customerId',
        select: 'fullName email role subscriptionStatus subscriptionExpiryDate',
      },
      {
        path: 'subscriptionId',
      },
    ],
  });
};

/**
 * 11. SALESMAN DETAILS
 */
const getSalesmanDetails = async (salesmanId, options = {}) => {
  if (!mongoose.Types.ObjectId.isValid(salesmanId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid salesman ID');
  }

  const salesman = await User.findOne({
    _id: salesmanId,
    role: 'sales',
  }).select('fullName email mobileNumber createdAt isActive');

  if (!salesman) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Salesman not found');
  }

  const filter = getSalesRegistrationFilter({
    ...options,
    salesmanId,
  });

  const [performance, customers] = await Promise.all([
    SalesRegistration.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalCustomers: { $sum: 1 },
          totalOriginalAmount: { $sum: '$originalAmount' },
          totalDiscount: { $sum: getDiscountExpression },
          totalCollected: { $sum: '$totalPaid' },
          totalDiscountUses: { $sum: '$discountUsedCount' },
        },
      },
    ]),

    SalesRegistration.find(filter)
      .populate('customerId', 'fullName email role subscriptionStatus')
      .populate('subscriptionId', 'planName finalAmount')
      .sort({ createdAt: -1 }),
  ]);

  return {
    salesman,
    performance: performance[0] || {
      totalCustomers: 0,
      totalOriginalAmount: 0,
      totalDiscount: 0,
      totalCollected: 0,
      totalDiscountUses: 0,
    },
    customers,
  };
};

/**
 * 12. PAYMENT REPORT
 *
 * SalesRegistration totalPaid summary.
 * This is NOT individual payment history.
 */
const getPaymentReport = async (options = {}) => {
  const filter = getSalesRegistrationFilter(options);

  if (options.customerRole) {
    filter.customerRole = options.customerRole;
  }

  if (options.search) {
    filter.$or = [
      { customerName: { $regex: options.search, $options: 'i' } },
      { customerEmail: { $regex: options.search, $options: 'i' } },
      { salesmanEmail: { $regex: options.search, $options: 'i' } },
    ];
  }

  filter.totalPaid = { $gt: 0 };

  return SalesRegistration.paginate(filter, {
    page: Number(options.page) || 1,
    limit: Math.min(Number(options.limit) || 10, 100),
    sortBy: options.sortBy || 'updatedAt:desc',
    populate: [
      {
        path: 'salesmanId',
        select: 'fullName email',
      },
      {
        path: 'customerId',
        select: 'fullName email role',
      },
      {
        path: 'subscriptionId',
      },
    ],
  });
};
// =====================================================
// PAYMENT DASHBOARD SERVICES
// =====================================================

const buildPaymentDateFilter = (from, to, field = 'createdAt') => {
  const filter = {};

  if (from || to) {
    filter[field] = {};

    if (from) {
      filter[field].$gte = new Date(from);
    }

    if (to) {
      const endDate = new Date(to);
      endDate.setHours(23, 59, 59, 999);
      filter[field].$lte = endDate;
    }
  }

  return filter;
};

const buildPaymentFilter = (query = {}) => {
  const filter = {
    isDeleted: false,
    ...buildPaymentDateFilter(query.from, query.to),
  };

  if (query.status) filter.status = query.status;
  if (query.userEmail) filter.userEmail = query.userEmail;
  if (query.paymentMethod) filter.paymentMethod = query.paymentMethod;

  if (
    query.salesmanId &&
    mongoose.Types.ObjectId.isValid(query.salesmanId)
  ) {
    filter.salesmanId = new mongoose.Types.ObjectId(query.salesmanId);
  }

  if (
    query.subscriptionId &&
    mongoose.Types.ObjectId.isValid(query.subscriptionId)
  ) {
    filter.subscriptionId = new mongoose.Types.ObjectId(query.subscriptionId);
  }

  return filter;
};

// -----------------------------------------------------
// 1. PAYMENT OVERVIEW
// -----------------------------------------------------

const getPaymentOverview = async (query = {}) => {
  const filter = buildPaymentFilter(query);

  const [result] = await Payment.aggregate([
    {
      $match: filter,
    },
    {
      $group: {
        _id: null,

        totalTransactions: {
          $sum: 1,
        },

        successfulPayments: {
          $sum: {
            $cond: [{ $eq: ['$status', 'paid'] }, 1, 0],
          },
        },

        failedPayments: {
          $sum: {
            $cond: [{ $eq: ['$status', 'failed'] }, 1, 0],
          },
        },

        pendingPayments: {
          $sum: {
            $cond: [{ $eq: ['$status', 'created'] }, 1, 0],
          },
        },

        refundedPayments: {
          $sum: {
            $cond: [
              {
                $in: [
                  '$status',
                  ['refunded', 'partially_refunded'],
                ],
              },
              1,
              0,
            ],
          },
        },

        grossRevenue: {
          $sum: {
            $cond: [
              {
                $in: [
                  '$status',
                  ['paid', 'partially_refunded', 'refunded'],
                ],
              },
              { $ifNull: ['$payableAmount', 0] },
              0,
            ],
          },
        },

        refundAmount: {
          $sum: { $ifNull: ['$refundAmount', 0] },
        },

        totalDiscount: {
          $sum: {
            $cond: [
              {
                $in: [
                  '$status',
                  ['paid', 'partially_refunded', 'refunded'],
                ],
              },
              { $ifNull: ['$discountAmount', 0] },
              0,
            ],
          },
        },
      },
    },
  ]);

  const data = result || {};

  const grossRevenue = data.grossRevenue || 0;
  const refunds = data.refundAmount || 0;
  const totalTransactions = data.totalTransactions || 0;
  const successfulPayments = data.successfulPayments || 0;

  return {
    totalTransactions,
    successfulPayments,
    failedPayments: data.failedPayments || 0,
    pendingPayments: data.pendingPayments || 0,
    refundedPayments: data.refundedPayments || 0,

    grossRevenue,
    refundAmount: refunds,
    netRevenue: grossRevenue - refunds,

    totalDiscount: data.totalDiscount || 0,

    successRate: totalTransactions
      ? Number(
          ((successfulPayments / totalTransactions) * 100).toFixed(2)
        )
      : 0,
  };
};

// -----------------------------------------------------
// 2. PAYMENT REVENUE
// -----------------------------------------------------

const getPaymentRevenue = async (query = {}) => {
  const filter = {
    isDeleted: false,
    status: {
      $in: ['paid', 'partially_refunded', 'refunded'],
    },

    // Revenue is based on successful payment date.
    ...buildPaymentDateFilter(query.from, query.to, 'verifiedAt'),
  };

  if (
    query.salesmanId &&
    mongoose.Types.ObjectId.isValid(query.salesmanId)
  ) {
    filter.salesmanId = new mongoose.Types.ObjectId(query.salesmanId);
  }

  if (
    query.subscriptionId &&
    mongoose.Types.ObjectId.isValid(query.subscriptionId)
  ) {
    filter.subscriptionId = new mongoose.Types.ObjectId(query.subscriptionId);
  }

  const [result] = await Payment.aggregate([
    {
      $match: filter,
    },
    {
      $group: {
        _id: null,

        totalPayments: {
          $sum: 1,
        },

        grossRevenue: {
          $sum: '$payableAmount',
        },

        refunds: {
          $sum: '$refundAmount',
        },

        discount: {
          $sum: '$discountAmount',
        },
      },
    },
  ]);

  const data = result || {};

  const grossRevenue = data.grossRevenue || 0;
  const refunds = data.refunds || 0;

  return {
    totalPayments: data.totalPayments || 0,
    grossRevenue,
    refunds,
    netRevenue: grossRevenue - refunds,
    totalDiscount: data.discount || 0,
  };
};

// -----------------------------------------------------
// 3. MONTHLY PAYMENT TRENDS
// -----------------------------------------------------

const getPaymentMonthlyTrends = async ({ year }) => {
  const startDate = new Date(`${year}-01-01T00:00:00.000Z`);

  const endDate = new Date(
    `${Number(year) + 1}-01-01T00:00:00.000Z`
  );

  const result = await Payment.aggregate([
    {
      $match: {
        isDeleted: false,
        verifiedAt: {
          $gte: startDate,
          $lt: endDate,
        },
      },
    },
    {
      $group: {
        _id: {
          month: {
            $month: '$verifiedAt',
          },
        },

        transactions: {
          $sum: 1,
        },

        successfulPayments: {
          $sum: {
            $cond: [{ $eq: ['$status', 'paid'] }, 1, 0],
          },
        },

        revenue: {
          $sum: {
            $cond: [
              {
                $in: [
                  '$status',
                  ['paid', 'partially_refunded', 'refunded'],
                ],
              },
              '$payableAmount',
              0,
            ],
          },
        },

        refunds: {
          $sum: '$refundAmount',
        },
      },
    },
    {
      $sort: {
        '_id.month': 1,
      },
    },
  ]);

  const months = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    transactions: 0,
    successfulPayments: 0,
    revenue: 0,
    refunds: 0,
    netRevenue: 0,
  }));

  result.forEach((item) => {
    const index = item._id.month - 1;

    months[index] = {
      month: item._id.month,
      transactions: item.transactions,
      successfulPayments: item.successfulPayments,
      revenue: item.revenue,
      refunds: item.refunds,
      netRevenue: item.revenue - item.refunds,
    };
  });

  return {
    year: Number(year),
    months,
  };
};

// -----------------------------------------------------
// 4. PAYMENT METHOD ANALYTICS
// -----------------------------------------------------

const getPaymentMethods = async (query = {}) => {
  return Payment.aggregate([
    {
      $match: {
        isDeleted: false,
        status: {
          $in: ['paid', 'partially_refunded', 'refunded'],
        },
        ...buildPaymentDateFilter(query.from, query.to, 'verifiedAt'),
      },
    },
    {
      $group: {
        _id: {
          $ifNull: ['$paymentMethod', 'unknown'],
        },

        transactions: {
          $sum: 1,
        },

        revenue: {
          $sum: '$payableAmount',
        },

        refunds: {
          $sum: '$refundAmount',
        },
      },
    },
    {
      $project: {
        paymentMethod: '$_id',
        transactions: 1,
        revenue: 1,
        refunds: 1,
        netRevenue: {
          $subtract: ['$revenue', '$refunds'],
        },
      },
    },
    {
      $sort: {
        revenue: -1,
      },
    },
  ]);
};
// -----------------------------------------------------
// 5. PLAN PERFORMANCE
// -----------------------------------------------------

const getPaymentPlanPerformance = async (query = {}) => {
  return Payment.aggregate([
    {
      $match: {
        isDeleted: false,
        status: {
          $in: ['paid', 'partially_refunded', 'refunded'],
        },
        ...buildPaymentDateFilter(query.from, query.to, 'verifiedAt'),
      },
    },
    {
      $group: {
        _id: '$subscriptionId',
        planName: { $first: '$planName' },
        planCode: { $first: '$planCode' },
        totalSales: { $sum: 1 },
        revenue: { $sum: '$payableAmount' },
        refunds: { $sum: '$refundAmount' },
      },
    },
    {
      $project: {
        subscriptionId: '$_id',
        planName: 1,
        planCode: 1,
        totalSales: 1,
        revenue: 1,
        refunds: 1,
        netRevenue: {
          $subtract: ['$revenue', '$refunds'],
        },
      },
    },
    {
      $sort: {
        revenue: -1,
      },
    },
  ]);
};

// -----------------------------------------------------
// 6. SALESMAN PAYMENT PERFORMANCE
// -----------------------------------------------------

const getPaymentSalesmanPerformance = async (query = {}) => {
  const filter = {
    isDeleted: false,
    status: {
      $in: ['paid', 'partially_refunded', 'refunded'],
    },
    salesmanId: {
      $ne: null,
    },
    ...buildPaymentDateFilter(query.from, query.to, 'verifiedAt'),
  };

  if (
    query.salesmanId &&
    mongoose.Types.ObjectId.isValid(query.salesmanId)
  ) {
    filter.salesmanId = new mongoose.Types.ObjectId(query.salesmanId);
  }

  const result = await Payment.aggregate([
    {
      $match: filter,
    },
    {
      $group: {
        _id: '$salesmanId',
        transactions: { $sum: 1 },
        revenue: { $sum: '$payableAmount' },
        refunds: { $sum: '$refundAmount' },
        discounts: { $sum: '$discountAmount' },
        customers: {
          $addToSet: '$userId',
        },
      },
    },
    {
      $project: {
        salesmanId: '$_id',
        transactions: 1,
        revenue: 1,
        refunds: 1,
        discounts: 1,
        netRevenue: {
          $subtract: ['$revenue', '$refunds'],
        },
        customersCount: {
          $size: '$customers',
        },
      },
    },
    {
      $sort: {
        revenue: -1,
      },
    },
  ]);

  return result;
};

// -----------------------------------------------------
// 7. RECENT PAYMENTS
// -----------------------------------------------------

const getRecentPayments = async (query = {}) => {
  const filter = {
    isDeleted: false,
    ...buildPaymentDateFilter(query.from, query.to),
  };

  return Payment.find(filter)
    .sort({ createdAt: -1 })
    .limit(Number(query.limit) || 10)
    .select(
      '-gatewayResponse -webhookPayload -razorpaySignature -history'
    )
    .populate('userId', 'fullName companyName email role')
    .populate('subscriptionId', 'name planName')
    .populate('salesmanId', 'fullName email')
    .lean();
};

// -----------------------------------------------------
// 8. FAILED PAYMENT REPORT
// -----------------------------------------------------

const getFailedPayments = async (query = {}) => {
  const filter = {
    isDeleted: false,
    status: 'failed',
    ...buildPaymentDateFilter(query.from, query.to),
  };

  if (query.search) {
    filter.$or = [
      {
        userEmail: {
          $regex: query.search,
          $options: 'i',
        },
      },
      {
        razorpayOrderId: {
          $regex: query.search,
          $options: 'i',
        },
      },
      {
        failureReason: {
          $regex: query.search,
          $options: 'i',
        },
      },
    ];
  }

  return Payment.paginate(filter, {
    page: Number(query.page) || 1,
    limit: Number(query.limit) || 20,
    sortBy: 'createdAt:desc',
    populate: 'userId subscriptionId salesmanId',
  });
};

// -----------------------------------------------------
// 9. REFUND REPORT
// -----------------------------------------------------

const getRefundPayments = async (query = {}) => {
  const filter = {
    isDeleted: false,
    refundAmount: {
      $gt: 0,
    },
    ...buildPaymentDateFilter(query.from, query.to),
  };

  if (query.refundStatus) {
    filter.refundStatus = query.refundStatus;
  }

  return Payment.paginate(filter, {
    page: Number(query.page) || 1,
    limit: Number(query.limit) || 20,
    sortBy: 'createdAt:desc',
    populate: 'userId subscriptionId salesmanId',
  });
};

// -----------------------------------------------------
// 10. PAYMENT TRANSACTIONS
// -----------------------------------------------------

const getPaymentTransactions = async (query = {}) => {
  const filter = buildPaymentFilter(query);

  if (query.search) {
    filter.$or = [
      {
        userEmail: {
          $regex: query.search,
          $options: 'i',
        },
      },
      {
        razorpayOrderId: {
          $regex: query.search,
          $options: 'i',
        },
      },
      {
        razorpayPaymentId: {
          $regex: query.search,
          $options: 'i',
        },
      },
      {
        planName: {
          $regex: query.search,
          $options: 'i',
        },
      },
      {
        invoiceNumber: {
          $regex: query.search,
          $options: 'i',
        },
      },
    ];
  }

  return Payment.paginate(filter, {
    page: Number(query.page) || 1,
    limit: Number(query.limit) || 20,
    sortBy: query.sortBy || 'createdAt:desc',
    populate: 'userId subscriptionId salesmanId',
  });
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  // Existing SalesRegistration dashboard APIs
  getDashboardOverview,
  getBusinessCounts,
  getRevenueReport,
  getDiscountReport,
  getSalesPerformance,
  getPlanPerformance,
  getMonthlyTrends,
  getTopSalesmen,
  getRecentRegistrations,
  getCustomers,
  getSalesmanDetails,
  getPaymentReport,

  // Payment dashboard APIs
  getPaymentOverview,
  getPaymentTransactions,
  getPaymentRevenue,
  getPaymentMonthlyTrends,
  getPaymentMethods,
  getPaymentPlanPerformance,
  getPaymentSalesmanPerformance,
  getRecentPayments,
  getFailedPayments,
  getRefundPayments,
};