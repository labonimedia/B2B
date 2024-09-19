const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { mappingService } = require('../services');

const createMapping = catchAsync(async (req, res) => {
  const user = await mappingService.createMapping(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryMapping = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'productType', 'gender', 'category', 'subCategory']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await mappingService.queryMapping(filter, options);
  res.send(result);
});

const getMappingById = catchAsync(async (req, res) => {
  const user = await mappingService.getMappingById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Mapping not found');
  }
  res.send(user);
});

const getMappingByQuery = catchAsync(async (req, res) => {
  const {productType,gender,category, subCategory} = req.body;
  const user = await mappingService.getMappingByQuery(productType,gender,category, subCategory);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Mapping not found');
  }
  res.send(user);
});

const updateMappingById = catchAsync(async (req, res) => {
  const user = await mappingService.updateMappingById(req.params.id, req.body);
  res.send(user);
});

const deleteMappingById = catchAsync(async (req, res) => {
  await mappingService.deleteMappingById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createMapping,
  queryMapping,
  getMappingById,
  getMappingByQuery,
  updateMappingById,
  deleteMappingById,
};
