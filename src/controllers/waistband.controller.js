const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { waistBandService } = require('../services');

const createWaistBand = catchAsync(async (req, res) => {
  const user = await waistBandService.createWaistBand(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryWaistBand = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await waistBandService.queryWaistBand(filter, options);
  res.send(result);
});

const getWaistBandById = catchAsync(async (req, res) => {
  const user = await waistBandService.getWaistBandById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'WaistBand not found');
  }
  res.send(user);
});

const updateWaistBandById = catchAsync(async (req, res) => {
  const user = await waistBandService.updateWaistBandById(req.params.id, req.body);
  res.send(user);
});

const deleteWaistBandById = catchAsync(async (req, res) => {
  await waistBandService.deleteWaistBandById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createWaistBand,
  queryWaistBand,
  getWaistBandById,
  updateWaistBandById,
  deleteWaistBandById,
};
