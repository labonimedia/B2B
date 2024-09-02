const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { shirtSizeSetService } = require('../services');

const createShirtSizeSet = catchAsync(async (req, res) => {
  const user = await shirtSizeSetService.createShirtSizeSet(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryShirtSizeSet = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'productType', 'gender', 'category', 'subCategory']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await shirtSizeSetService.queryShirtSizeSet(filter, options);
  res.send(result);
});

const getShirtSizeSetById = catchAsync(async (req, res) => {
  const user = await shirtSizeSetService.getShirtSizeSetById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ShirtSizeSet not found');
  }
  res.send(user);
});

const updateShirtSizeSetById = catchAsync(async (req, res) => {
  const user = await shirtSizeSetService.updateShirtSizeSetById(req.params.id, req.body);
  res.send(user);
});

const deleteShirtSizeSetById = catchAsync(async (req, res) => {
  await shirtSizeSetService.deleteShirtSizeSetById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createShirtSizeSet,
  queryShirtSizeSet,
  getShirtSizeSetById,
  updateShirtSizeSetById,
  deleteShirtSizeSetById,
};
