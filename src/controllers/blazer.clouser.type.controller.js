const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { blazerClouserTypeService } = require('../services');

const createBlazerClouserType = catchAsync(async (req, res) => {
  const user = await blazerClouserTypeService.createBlazerClouserType(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryBlazerClouserType = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await blazerClouserTypeService.queryBlazerClouserType(filter, options);
  res.send(result);
});

const getBlazerClouserTypeById = catchAsync(async (req, res) => {
  const user = await blazerClouserTypeService.getBlazerClouserTypeById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Manufaturer not found');
  }
  res.send(user);
});

const updateBlazerClouserTypeById = catchAsync(async (req, res) => {
  const user = await blazerClouserTypeService.updateBlazerClouserTypeById(req.params.id, req.body);
  res.send(user);
});

const deleteBlazerClouserTypeById = catchAsync(async (req, res) => {
  await blazerClouserTypeService.deleteBlazerClouserTypeById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createBlazerClouserType,
  queryBlazerClouserType,
  getBlazerClouserTypeById,
  updateBlazerClouserTypeById,
  deleteBlazerClouserTypeById,
};
