const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { manufactureCommissionService } = require('../services');

const checkCommission = catchAsync(async (req, res) => {
  const result = await manufactureCommissionService.checkCommission({
    manufacturerEmail: req.body.manufacturerEmail,
    channelPartnerEmail: req.body.channelPartnerEmail,
  });

  res.status(httpStatus.OK).send(result);
});

const createCommissionCategory = catchAsync(async (req, res) => {
  const data = await manufactureCommissionService.createCommissionCategory({
    ...req.body,
    categoryBy: req.user.email, // 🔥 auto set manufacturer
  });

  res.status(httpStatus.CREATED).send(data);
});

const queryCommissionCategory = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['category', 'categoryBy']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await manufactureCommissionService.queryCommissionCategory(filter, options);
  res.send(result);
});

const getCommissionCategoryById = catchAsync(async (req, res) => {
  const data = await manufactureCommissionService.getCommissionCategoryById(req.params.id);

  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Commission Category not found');
  }

  res.send(data);
});

const updateCommissionCategoryById = catchAsync(async (req, res) => {
  const data = await manufactureCommissionService.updateCommissionCategoryById(
    req.params.id,
    req.body,
    req.user.email // 🔥 pass manufacturer
  );

  res.send(data);
});

const deleteCommissionCategoryById = catchAsync(async (req, res) => {
  await manufactureCommissionService.deleteCommissionCategoryById(
    req.params.id,
    req.user.email // 🔥 pass manufacturer
  );

  res.status(httpStatus.NO_CONTENT).send();
});

// ✅ Assign
const assignCommission = catchAsync(async (req, res) => {
  const data = await manufactureCommissionService.assignCommission({
    ...req.body,
    manufacturerEmail: req.user.email,
  });

  res.status(httpStatus.CREATED).send(data);
});

// ✅ Update
const updateAssignedCommission = catchAsync(async (req, res) => {
  const data = await manufactureCommissionService.updateAssignedCommission({
    ...req.body,
    manufacturerEmail: req.user.email,
  });

  res.send(data);
});

// ✅ Delete
const deleteAssignedCommission = catchAsync(async (req, res) => {
  const data = await manufactureCommissionService.deleteAssignedCommission({
    ...req.body,
    manufacturerEmail: req.user.email,
  });

  res.send(data);
});

module.exports = {
  createCommissionCategory,
  queryCommissionCategory,
  getCommissionCategoryById,
  updateCommissionCategoryById,
  deleteCommissionCategoryById,
  assignCommission,
  updateAssignedCommission,
  deleteAssignedCommission,
  checkCommission,
};
