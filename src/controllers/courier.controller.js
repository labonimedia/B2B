const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { courierService } = require('../services');

const createCourier = catchAsync(async (req, res) => {
  const user = await courierService.createCourier(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryCourier = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await courierService.queryCourier(filter, options);
  res.send(result);
});

const getCourierById = catchAsync(async (req, res) => {
  const user = await courierService.getCourierById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Courier not found');
  }
  res.send(user);
});

const updateCourierById = catchAsync(async (req, res) => {
  const user = await courierService.updateCourierById(req.params.id, req.body);
  res.send(user);
});

const deleteCourierById = catchAsync(async (req, res) => {
  await courierService.deleteCourierById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createCourier,
  queryCourier,
  getCourierById,
  updateCourierById,
  deleteCourierById,
};
