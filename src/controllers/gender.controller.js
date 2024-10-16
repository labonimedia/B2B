const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { genderService } = require('../services');

const createGender = catchAsync(async (req, res) => {
  const user = await genderService.createGender(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryGender = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await genderService.queryGender(filter, options);
  res.send(result);
});

const getGenderById = catchAsync(async (req, res) => {
  const user = await genderService.getGenderById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Manufaturer not found');
  }
  res.send(user);
});

const updateGenderById = catchAsync(async (req, res) => {
  const user = await genderService.updateGenderById(req.params.id, req.body);
  res.send(user);
});

const deleteGenderById = catchAsync(async (req, res) => {
  await genderService.deleteGenderById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createGender,
  queryGender,
  getGenderById,
  updateGenderById,
  deleteGenderById,
};
