const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { waistTypeService } = require('../services');

const createWaistType = catchAsync(async (req, res) => {
  const user = await waistTypeService.createWaistType(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryWaistType = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await waistTypeService.queryWaistType(filter, options);
  res.send(result);
});

const getWaistTypeById = catchAsync(async (req, res) => {
  const user = await waistTypeService.getWaistTypeById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Manufaturer not found');
  }
  res.send(user);
});

const updateWaistTypeById = catchAsync(async (req, res) => {
  const user = await waistTypeService.updateWaistTypeById(req.params.id, req.body);
  res.send(user);
});

const deleteWaistTypeById = catchAsync(async (req, res) => {
  await waistTypeService.deleteWaistTypeById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createWaistType,
  queryWaistType,
  getWaistTypeById,
  updateWaistTypeById,
  deleteWaistTypeById,
};
