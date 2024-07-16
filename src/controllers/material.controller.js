const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { materialService } = require('../services');

const createMaterial = catchAsync(async (req, res) => {
  const user = await materialService.createMaterial(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryMaterial = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await materialService.queryMaterial(filter, options);
  res.send(result);
});

const getMaterialById = catchAsync(async (req, res) => {
  const user = await materialService.getMaterialById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Manufaturer not found');
  }
  res.send(user);
});

const updateMaterialById = catchAsync(async (req, res) => {
  const user = await materialService.updateMaterialById(req.params.id, req.body);
  res.send(user);
});

const deleteMaterialById = catchAsync(async (req, res) => {
  await materialService.deleteMaterialById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createMaterial,
  queryMaterial,
  getMaterialById,
  updateMaterialById,
  deleteMaterialById,
};
