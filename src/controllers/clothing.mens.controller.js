const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { clothingMensService } = require('../services');

const createClothingMens = catchAsync(async (req, res) => {
  const user = await clothingMensService.createClothingMens(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryClothingMens = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await clothingMensService.queryClothingMens(filter, options);
  res.send(result);
});

const getClothingMensById = catchAsync(async (req, res) => {
  const user = await clothingMensService.getClothingMensById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Manufaturer not found');
  }
  res.send(user);
});

const updateClothingMensById = catchAsync(async (req, res) => {
  const user = await clothingMensService.updateClothingMensById(req.params.id, req.body);
  res.send(user);
});

const deleteClothingMensById = catchAsync(async (req, res) => {
  await clothingMensService.deleteClothingMensById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createClothingMens,
  queryClothingMens,
  getClothingMensById,
  updateClothingMensById,
  deleteClothingMensById,
};
