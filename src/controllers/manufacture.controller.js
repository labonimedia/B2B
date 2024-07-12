const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { manufactureService } = require('../services');

const createManufacture = catchAsync(async (req, res) => {
  const user = await manufactureService.createManufacture(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryManufacture = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await manufactureService.queryManufacture(filter, options);
  res.send(result);
});

const getManufactureById = catchAsync(async (req, res) => {
  const user = await manufactureService.getManufactureById(req.params.Id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Manufaturer not found');
  }
  res.send(user);
});

const updateManufactureById = catchAsync(async (req, res) => {
  const user = await manufactureService.updateManufactureById(req.params.Id, req.body);
  res.send(user);
});

const deleteManufactureById = catchAsync(async (req, res) => {
  await manufactureService.deleteManufactureById(req.params.Id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createManufacture,
  queryManufacture,
  getManufactureById,
  updateManufactureById,
  deleteManufactureById,
};
