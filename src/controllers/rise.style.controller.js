const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { riseStyleService } = require('../services');

const createRiseStyle = catchAsync(async (req, res) => {
  const user = await riseStyleService.createRiseStyle(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryRiseStyle = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await RiseStyle.queryRiseStyle(filter, options);
  res.send(result);
});

const getRiseStyleById = catchAsync(async (req, res) => {
  const user = await riseStyleService.getRiseStyleById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'RiseStyle not found');
  }
  res.send(user);
});

const updateRiseStyleById = catchAsync(async (req, res) => {
  const user = await riseStyleService.updateRiseStyleById(req.params.id, req.body);
  res.send(user);
});

const deleteRiseStyleById = catchAsync(async (req, res) => {
  await riseStyleService.deleteRiseStyleById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createRiseStyle,
  queryRiseStyle,
  getRiseStyleById,
  updateRiseStyleById,
  deleteRiseStyleById,
};
