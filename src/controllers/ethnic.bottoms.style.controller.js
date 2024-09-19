const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { ethnicBottomsStyleService } = require('../services');

const createEthnicBottomsStyle = catchAsync(async (req, res) => {
  const user = await ethnicBottomsStyleService.createEthnicBottomsStyle(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryEthnicBottomsStyle = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await ethnicBottomsStyleService.queryEthnicBottomsStyle(filter, options);
  res.send(result);
});

const getEthnicBottomsStyleById = catchAsync(async (req, res) => {
  const user = await ethnicBottomsStyleService.getEthnicBottomsStyleById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Manufaturer not found');
  }
  res.send(user);
});

const updateEthnicBottomsStyleById = catchAsync(async (req, res) => {
  const user = await ethnicBottomsStyleService.updateEthnicBottomsStyleById(req.params.id, req.body);
  res.send(user);
});

const deleteEthnicBottomsStyleById = catchAsync(async (req, res) => {
  await ethnicBottomsStyleService.deleteEthnicBottomsStyleById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createEthnicBottomsStyle,
  queryEthnicBottomsStyle,
  getEthnicBottomsStyleById,
  updateEthnicBottomsStyleById,
  deleteEthnicBottomsStyleById,
};
