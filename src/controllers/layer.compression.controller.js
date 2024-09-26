const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { layerCompressionService } = require('../services');

const createLayerCompression = catchAsync(async (req, res) => {
  const user = await layerCompressionService.createLayerCompression(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryLayerCompression = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await layerCompressionService.queryLayerCompression(filter, options);
  res.send(result);
});

const getLayerCompressionById = catchAsync(async (req, res) => {
  const user = await layerCompressionService.getLayerCompressionById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'LayerCompression not found');
  }
  res.send(user);
});

const updateLayerCompressionById = catchAsync(async (req, res) => {
  const user = await layerCompressionService.updateLayerCompressionById(req.params.id, req.body);
  res.send(user);
});

const deleteLayerCompressionById = catchAsync(async (req, res) => {
  await layerCompressionService.deleteLayerCompressionById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createLayerCompression,
  queryLayerCompression,
  getLayerCompressionById,
  updateLayerCompressionById,
  deleteLayerCompressionById,
};
