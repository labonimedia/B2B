const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const pick = require('../../utils/pick');
const { wholesalerProductAssignmentService } = require('../../services');

/**
 * ASSIGN PRODUCTS
 */
const assignProductsToWholesaler = catchAsync(async (req, res) => {
  const manufacturerEmail = req.user.email;
  const { wholesalerEmail, productIds } = req.body;

  const result = await wholesalerProductAssignmentService.assignProducts(manufacturerEmail, wholesalerEmail, productIds);

  res.status(httpStatus.OK).send(result);
});

/**
 * GET LIST
 */
const getAssignments = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['wholesalerEmail', 'manufacturerEmail', 'assignedBy']);
  const options = pick(req.query, ['limit', 'page', 'sortBy']);

  const result = await wholesalerProductAssignmentService.queryAssignments(filter, options);

  res.send(result);
});

/**
 * GET BY ID
 */
const getAssignment = catchAsync(async (req, res) => {
  const result = await wholesalerProductAssignmentService.getAssignmentById(req.params.id);

  res.send(result);
});

/**
 * REMOVE PRODUCT
 */
const removeAssignment = catchAsync(async (req, res) => {
  const { productId, wholesalerEmail } = req.body;

  const result = await wholesalerProductAssignmentService.removeAssignment(productId, wholesalerEmail);

  res.send(result);
});

/**
 * TOGGLE ACTIVE
 */
const toggleAssignmentStatus = catchAsync(async (req, res) => {
  const result = await wholesalerProductAssignmentService.toggleAssignmentStatus(req.params.id, req.body.isActive);

  res.send(result);
});

module.exports = {
  assignProductsToWholesaler,
  getAssignments,
  getAssignment,
  removeAssignment,
  toggleAssignmentStatus,
};
