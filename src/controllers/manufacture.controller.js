const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { manufactureService } = require('../services');

const fileupload = catchAsync(async (req, res) => {
  const user = await manufactureService.fileupload(req, req.params.id);
  res.status(httpStatus.CREATED).send(user);
});


const createManufacture = catchAsync(async (req, res) => {
  const user = await manufactureService.createManufacture(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryManufacture = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'status','fullName','companyName','email']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await manufactureService.queryManufacture(filter, options);
  res.send(result);
});

const getManufactureById = catchAsync(async (req, res) => {
  const user = await manufactureService.getUserByEmail(req.params.email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Manufaturer not found');
  }
  res.send(user);
});

const getManufactureByEmail = catchAsync(async (req, res) => {
  const { refByEmail, searchKeywords } = req.query;
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const user = await manufactureService.getManufactureByEmail(refByEmail, searchKeywords, options);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Manufaturer not found');
  }
  res.send(user);
});

const updateManufactureById = catchAsync(async (req, res) => {
  const user = await manufactureService.updateManufactureById(req.params.email, req.body);
  res.send(user);
});

const deleteManufactureById = catchAsync(async (req, res) => {
  await manufactureService.deleteManufactureById(req.params.email);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createManufacture,
  queryManufacture,
  getManufactureById,
  getManufactureByEmail,
  fileupload,
  updateManufactureById,
  deleteManufactureById,
};
