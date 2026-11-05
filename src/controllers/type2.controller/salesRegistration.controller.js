
const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const { salesRegistrationService } = require('../../services');

/**
 * Register Customer
 */
const createSalesRegistration = catchAsync(async (req, res) => {
  const registration =
    await salesRegistrationService.createSalesRegistration(
      req.body,
      req.user
    );

  res.status(httpStatus.CREATED).send({
    success: true,
    message: 'Customer registered successfully',
    registration,
  });
});

/**
 * My Referred Customers
 */
const getSalesRegistrations = catchAsync(async (req, res) => {
  const result = await salesRegistrationService.getSalesRegistrations(
    req.user,
    req.query
  );

  res.status(httpStatus.OK).send(result);
});

/**
 * Dashboard Counts
 */
const getSalesDashboard = catchAsync(async (req, res) => {
  const result = await salesRegistrationService.getSalesDashboard(req.user);

  res.status(httpStatus.OK).send({
    success: true,
    data: result,
  });
});

module.exports = {
  createSalesRegistration,
  getSalesRegistrations,
  getSalesDashboard,
};
