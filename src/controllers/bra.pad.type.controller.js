const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { braPadTypeService } = require('../services');

const createBraPadType = catchAsync(async (req, res) => {
  const user = await braPadTypeService.createBraPadType(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryBraPadType = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await braPadTypeService.queryBraPadType(filter, options);
  res.send(result);
});

const getBraPadTypeById = catchAsync(async (req, res) => {
  const user = await braPadTypeService.getBraPadTypeById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Manufaturer not found');
  }
  res.send(user);
});

const updateBraPadTypeById = catchAsync(async (req, res) => {
  const user = await braPadTypeService.updateBraPadTypeById(req.params.id, req.body);
  res.send(user);
});

const deleteBraPadTypeById = catchAsync(async (req, res) => {
  await braPadTypeService.deleteBraPadTypeById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createBraPadType,
  queryBraPadType,
  getBraPadTypeById,
  updateBraPadTypeById,
  deleteBraPadTypeById,
};
