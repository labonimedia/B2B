const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { seasonService } = require('../services');

const createSeason = catchAsync(async (req, res) => {
  const user = await seasonService.createSeason(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const querySeason = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await seasonService.querySeason(filter, options);
  res.send(result);
});

const getSeasonById = catchAsync(async (req, res) => {
  const user = await seasonService.getSeasonById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Manufaturer not found');
  }
  res.send(user);
});

const updateSeasonById = catchAsync(async (req, res) => {
  const user = await seasonService.updateSeasonById(req.params.id, req.body);
  res.send(user);
});

const deleteSeasonById = catchAsync(async (req, res) => {
  await seasonService.deleteSeasonById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createSeason,
  querySeason,
  getSeasonById,
  updateSeasonById,
  deleteSeasonById,
};
