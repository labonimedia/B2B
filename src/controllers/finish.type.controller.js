const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { finishTypeService } = require('../services');

const createFinishType = catchAsync(async (req, res) => {
  const user = await finishTypeService.createFinishType(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryFinishType = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await finishTypeService.queryFinishType(filter, options);
  res.send(result);
});

const getFinishTypeById = catchAsync(async (req, res) => {
  const user = await finishTypeService.getFinishTypeById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Manufaturer not found');
  }
  res.send(user);
});

const updateFinishTypeById = catchAsync(async (req, res) => {
  const user = await finishTypeService.updateFinishTypeById(req.params.id, req.body);
  res.send(user);
});

const deleteFinishTypeById = catchAsync(async (req, res) => {
  await finishTypeService.deleteFinishTypeById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createFinishType,
  queryFinishType,
  getFinishTypeById,
  updateFinishTypeById,
  deleteFinishTypeById,
};
