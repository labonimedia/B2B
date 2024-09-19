const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { workTypeService } = require('../services');

const createWorkType = catchAsync(async (req, res) => {
  const user = await workTypeService.createWorkType(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryWorkType = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await workTypeService.queryWorkType(filter, options);
  res.send(result);
});

const getWorkTypeById = catchAsync(async (req, res) => {
  const user = await workTypeService.getWorkTypeById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Manufaturer not found');
  }
  res.send(user);
});

const updateWorkTypeById = catchAsync(async (req, res) => {
  const user = await workTypeService.updateWorkTypeById(req.params.id, req.body);
  res.send(user);
});

const deleteWorkTypeById = catchAsync(async (req, res) => {
  await workTypeService.deleteWorkTypeById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createWorkType,
  queryWorkType,
  getWorkTypeById,
  updateWorkTypeById,
  deleteWorkTypeById,
};
