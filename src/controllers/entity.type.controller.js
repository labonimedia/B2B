const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { entityService } = require('../services');

const createEntity = catchAsync(async (req, res) => {
  const user = await entityService.createEntity(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryEntity = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await entityService.queryEntity(filter, options);
  res.send(result);
});

const getEntityById = catchAsync(async (req, res) => {
  const user = await entityService.getEntityById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Manufaturer not found');
  }
  res.send(user);
});

const updateEntityById = catchAsync(async (req, res) => {
  const user = await entityService.updateEntityById(req.params.id, req.body);
  res.send(user);
});

const deleteEntityById = catchAsync(async (req, res) => {
  await entityService.deleteEntityById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createEntity,
  queryEntity,
  getEntityById,
  updateEntityById,
  deleteEntityById,
};
