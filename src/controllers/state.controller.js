const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { stateService } = require('../services');

const createState = catchAsync(async (req, res) => {
  const user = await stateService.createState(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryState = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name','country_name','country_id','state_code']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await stateService.queryState(filter, options);
  res.send(result);
});

const getStateById = catchAsync(async (req, res) => {
  const user = await stateService.getStateById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'State not found');
  }
  res.send(user);
});

const updateStateById = catchAsync(async (req, res) => {
  const user = await stateService.updateStateById(req.params.id, req.body);
  res.send(user);
});

const deleteStateById = catchAsync(async (req, res) => {
  await stateService.deleteStateById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});
const getState = catchAsync(async (req, res) => {
  const {limit = 10, page = 1 } = req.query; // Query parameters
  const {country_name} = req.body;
  const cities = await stateService.findStates(country_name, limit, page);
  res.status(httpStatus.OK).send({ success: true, data: cities });
});
module.exports = {
  createState,
  queryState,
  getStateById,
  updateStateById,
  deleteStateById,
  getState,
};
