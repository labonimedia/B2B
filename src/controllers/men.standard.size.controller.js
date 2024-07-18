const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { menStandardSizeService } = require('../services');

const createMenStandardSize = catchAsync(async (req, res) => {
  const user = await menStandardSizeService.createMenStandardSize(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryMenStandardSize = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await menStandardSizeService.queryMenStandardSize(filter, options);
  res.send(result);
});

const getMenStandardSizeById = catchAsync(async (req, res) => {
  const user = await menStandardSizeService.getMenStandardSizeById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'MenStandardSize not found');
  }
  res.send(user);
});

const updateMenStandardSizeById = catchAsync(async (req, res) => {
  const user = await menStandardSizeService.updateMenStandardSizeById(req.params.id, req.body);
  res.send(user);
});

const deleteMenStandardSizeById = catchAsync(async (req, res) => {
  await menStandardSizeService.deleteMenStandardSizeById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createMenStandardSize,
  queryMenStandardSize,
  getMenStandardSizeById,
  updateMenStandardSizeById,
  deleteMenStandardSizeById,
};
