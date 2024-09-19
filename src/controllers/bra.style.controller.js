const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { braStyleService } = require('../services');

const createBraStyle = catchAsync(async (req, res) => {
  const user = await braStyleService.createBraStyle(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryBraStyle = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await braStyleService.queryBraStyle(filter, options);
  res.send(result);
});

const getBraStyleById = catchAsync(async (req, res) => {
  const user = await braStyleService.getBraStyleById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Manufaturer not found');
  }
  res.send(user);
});

const updateBraStyleById = catchAsync(async (req, res) => {
  const user = await braStyleService.updateBraStyleById(req.params.id, req.body);
  res.send(user);
});

const deleteBraStyleById = catchAsync(async (req, res) => {
  await braStyleService.deleteBraStyleById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createBraStyle,
  queryBraStyle,
  getBraStyleById,
  updateBraStyleById,
  deleteBraStyleById,
};
