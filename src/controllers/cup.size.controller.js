const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { cupSizeService } = require('../services');

const createCupSize = catchAsync(async (req, res) => {
  const user = await cupSizeService.createCupSize(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryCupSize = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await cupSizeService.queryCupSize(filter, options);
  res.send(result);
});

const getCupSizeById = catchAsync(async (req, res) => {
  const user = await cupSizeService.getCupSizeById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Manufaturer not found');
  }
  res.send(user);
});

const updateCupSizeById = catchAsync(async (req, res) => {
  const user = await cupSizeService.updateCupSizeById(req.params.id, req.body);
  res.send(user);
});

const deleteCupSizeById = catchAsync(async (req, res) => {
  await cupSizeService.deleteCupSizeById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createCupSize,
  queryCupSize,
  getCupSizeById,
  updateCupSizeById,
  deleteCupSizeById,
};
