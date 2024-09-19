const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { opacityService } = require('../services');

const createOpacity = catchAsync(async (req, res) => {
  const user = await opacityService.createOpacity(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryOpacity = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await opacityService.queryOpacity(filter, options);
  res.send(result);
});

const getOpacityById = catchAsync(async (req, res) => {
  const user = await opacityService.getOpacityById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Manufaturer not found');
  }
  res.send(user);
});

const updateOpacityById = catchAsync(async (req, res) => {
  const user = await opacityService.updateOpacityById(req.params.id, req.body);
  res.send(user);
});

const deleteOpacityById = catchAsync(async (req, res) => {
  await opacityService.deleteOpacityById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createOpacity,
  queryOpacity,
  getOpacityById,
  updateOpacityById,
  deleteOpacityById,
};
