const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { waistSizeSetService } = require('../services');

const createWaistSizeSet = catchAsync(async (req, res) => {
  const user = await waistSizeSetService.createWaistSizeSet(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryWaistSizeSet
 = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await waistSizeSetService.queryWaistSizeSet
(filter, options);
  res.send(result);
});

const getWaistSizeSetById = catchAsync(async (req, res) => {
  const user = await waistSizeSetService.getWaistSizeSetById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'WaistSizeSet not found');
  }
  res.send(user);
});

const updateWaistSizeSetById = catchAsync(async (req, res) => {
  const user = await waistSizeSetService.updateWaistSizeSetById(req.params.id, req.body);
  res.send(user);
});

const deleteWaistSizeSetById = catchAsync(async (req, res) => {
  await waistSizeSetService.deleteWaistSizeSetById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    createWaistSizeSet,
  queryWaistSizeSet,
  getWaistSizeSetById,
  updateWaistSizeSetById,
  deleteWaistSizeSetById,
};
