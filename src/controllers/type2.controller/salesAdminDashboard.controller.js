const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');

const {
  salesAdminDashboardService,
} = require('../../services');

/**
 * 1. Dashboard overview
 */
const getDashboardOverview = catchAsync(async (req, res) => {
  const data =
    await salesAdminDashboardService.getDashboardOverview(req.query);

  res.status(httpStatus.OK).send({
    success: true,
    data,
  });
});

/**
 * 2. Business counts
 */
const getBusinessCounts = catchAsync(async (req, res) => {
  const data =
    await salesAdminDashboardService.getBusinessCounts(req.query);

  res.status(httpStatus.OK).send({
    success: true,
    data,
  });
});

/**
 * 3. Revenue report
 */
const getRevenueReport = catchAsync(async (req, res) => {
  const data =
    await salesAdminDashboardService.getRevenueReport(req.query);

  res.status(httpStatus.OK).send({
    success: true,
    data,
  });
});

/**
 * 4. Discount report
 */
const getDiscountReport = catchAsync(async (req, res) => {
  const data =
    await salesAdminDashboardService.getDiscountReport(req.query);

  res.status(httpStatus.OK).send({
    success: true,
    data,
  });
});

/**
 * 5. Sales performance
 */
const getSalesPerformance = catchAsync(async (req, res) => {
  const data =
    await salesAdminDashboardService.getSalesPerformance(req.query);

  res.status(httpStatus.OK).send({
    success: true,
    data,
  });
});

/**
 * 6. Plan performance
 */
const getPlanPerformance = catchAsync(async (req, res) => {
  const data =
    await salesAdminDashboardService.getPlanPerformance(req.query);

  res.status(httpStatus.OK).send({
    success: true,
    data,
  });
});

/**
 * 7. Monthly trends
 */
const getMonthlyTrends = catchAsync(async (req, res) => {
  const data =
    await salesAdminDashboardService.getMonthlyTrends(req.query);

  res.status(httpStatus.OK).send({
    success: true,
    data,
  });
});

/**
 * 8. Top salesmen
 */
const getTopSalesmen = catchAsync(async (req, res) => {
  const data =
    await salesAdminDashboardService.getTopSalesmen(req.query);

  res.status(httpStatus.OK).send({
    success: true,
    data,
  });
});

/**
 * 9. Recent registrations
 */
const getRecentRegistrations = catchAsync(async (req, res) => {
  const data =
    await salesAdminDashboardService.getRecentRegistrations(req.query);

  res.status(httpStatus.OK).send({
    success: true,
    data,
  });
});

/**
 * 10. All customers
 */
const getCustomers = catchAsync(async (req, res) => {
  const data =
    await salesAdminDashboardService.getCustomers(req.query);

  res.status(httpStatus.OK).send({
    success: true,
    data,
  });
});

/**
 * 11. Single salesman report
 */
const getSalesmanDetails = catchAsync(async (req, res) => {
  const data =
    await salesAdminDashboardService.getSalesmanDetails(
      req.params.salesmanId,
      req.query
    );

  res.status(httpStatus.OK).send({
    success: true,
    data,
  });
});

/**
 * 12. Payment report
 */
const getPaymentReport = catchAsync(async (req, res) => {
  const data =
    await salesAdminDashboardService.getPaymentReport(req.query);

  res.status(httpStatus.OK).send({
    success: true,
    data,
  });
});

// =====================================================
// PAYMENT DASHBOARD CONTROLLERS
// =====================================================

const getPaymentOverview = catchAsync(async (req, res) => {
  const result = await salesAdminDashboardService.getPaymentOverview(
    req.query
  );

  res.status(httpStatus.OK).send(result);
});

const getPaymentTransactions = catchAsync(async (req, res) => {
  const result =
    await salesAdminDashboardService.getPaymentTransactions(req.query);

  res.status(httpStatus.OK).send(result);
});

const getPaymentRevenue = catchAsync(async (req, res) => {
  const result = await salesAdminDashboardService.getPaymentRevenue(
    req.query
  );

  res.status(httpStatus.OK).send(result);
});

const getPaymentMonthlyTrends = catchAsync(async (req, res) => {
  const result =
    await salesAdminDashboardService.getPaymentMonthlyTrends(req.query);

  res.status(httpStatus.OK).send(result);
});

const getPaymentMethods = catchAsync(async (req, res) => {
  const result = await salesAdminDashboardService.getPaymentMethods(
    req.query
  );

  res.status(httpStatus.OK).send(result);
});

const getPaymentPlanPerformance = catchAsync(async (req, res) => {
  const result =
    await salesAdminDashboardService.getPaymentPlanPerformance(req.query);

  res.status(httpStatus.OK).send(result);
});

const getPaymentSalesmanPerformance = catchAsync(async (req, res) => {
  const result =
    await salesAdminDashboardService.getPaymentSalesmanPerformance(
      req.query
    );

  res.status(httpStatus.OK).send(result);
});

const getRecentPayments = catchAsync(async (req, res) => {
  const result = await salesAdminDashboardService.getRecentPayments(
    req.query
  );

  res.status(httpStatus.OK).send(result);
});

const getFailedPayments = catchAsync(async (req, res) => {
  const result = await salesAdminDashboardService.getFailedPayments(
    req.query
  );

  res.status(httpStatus.OK).send(result);
});

const getRefundPayments = catchAsync(async (req, res) => {
  const result = await salesAdminDashboardService.getRefundPayments(
    req.query
  );

  res.status(httpStatus.OK).send(result);
});

module.exports = {
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
  // Your existing sales registration controllers
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