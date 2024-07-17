const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { pocketDiscriptionService } = require('../services');

const createPocketDiscription = catchAsync(async (req, res) => {
  const user = await pocketDiscriptionService.createPocketDiscription(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryPocketDiscription = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await pocketDiscriptionService.queryPocketDiscription(filter, options);
  res.send(result);
});

const getPocketDiscriptionById = catchAsync(async (req, res) => {
  const user = await pocketDiscriptionService.getPocketDiscriptionById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Manufaturer not found');
  }
  res.send(user);
});

const updatePocketDiscriptionById = catchAsync(async (req, res) => {
  const user = await pocketDiscriptionService.updatePocketDiscriptionById(req.params.id, req.body);
  res.send(user);
});

const deletePocketDiscriptionById = catchAsync(async (req, res) => {
  await pocketDiscriptionService.deletePocketDiscriptionById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createPocketDiscription,
  queryPocketDiscription,
  getPocketDiscriptionById,
  updatePocketDiscriptionById,
  deletePocketDiscriptionById,
};
