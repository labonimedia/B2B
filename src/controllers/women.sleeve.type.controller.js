const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { womenSleeveTypeService } = require('../services');

const createWomenSleeveType = catchAsync(async (req, res) => {
  const user = await womenSleeveTypeService.createWomenSleeveType(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryWomenSleeveType = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await womenSleeveTypeService.queryWomenSleeveType(filter, options);
  res.send(result);
});

const getWomenSleeveTypeById = catchAsync(async (req, res) => {
  const user = await womenSleeveTypeService.getWomenSleeveTypeById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'WomenSleeveType not found');
  }
  res.send(user);
});

const updateWomenSleeveTypeById = catchAsync(async (req, res) => {
  const user = await womenSleeveTypeService.updateWomenSleeveTypeById(req.params.id, req.body);
  res.send(user);
});

const deleteWomenSleeveTypeById = catchAsync(async (req, res) => {
  await womenSleeveTypeService.deleteWomenSleeveTypeById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createWomenSleeveType,
  queryWomenSleeveType,
  getWomenSleeveTypeById,
  updateWomenSleeveTypeById,
  deleteWomenSleeveTypeById,
};
