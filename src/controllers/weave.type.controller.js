const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { weaveTypeService } = require('../services');

const createWeaveType = catchAsync(async (req, res) => {
  const user = await weaveTypeService.createWeaveType(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryWeaveType = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await weaveTypeService.queryWeaveType(filter, options);
  res.send(result);
});

const getWeaveTypeById = catchAsync(async (req, res) => {
  const user = await weaveTypeService.getWeaveTypeById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Manufaturer not found');
  }
  res.send(user);
});

const updateWeaveTypeById = catchAsync(async (req, res) => {
  const user = await weaveTypeService.updateWeaveTypeById(req.params.id, req.body);
  res.send(user);
});

const deleteWeaveTypeById = catchAsync(async (req, res) => {
  await weaveTypeService.deleteWeaveTypeById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createWeaveType,
  queryWeaveType,
  getWeaveTypeById,
  updateWeaveTypeById,
  deleteWeaveTypeById,
};
