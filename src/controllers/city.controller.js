const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { cityService } = require('../services');

const createCity = catchAsync(async (req, res) => {
  const user = await cityService.createCity(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryCity = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name','country_name','country_id','City_code',' state_name','state_code','state_id']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await cityService.queryCity(filter, options);
  res.send(result);
});

const getCityById = catchAsync(async (req, res) => {
  const user = await cityService.getCityById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'City not found');
  }
  res.send(user);
});

const updateCityById = catchAsync(async (req, res) => {
  const user = await cityService.updateCityById(req.params.id, req.body);
  res.send(user);
});

const deleteCityById = catchAsync(async (req, res) => {
  await cityService.deleteCityById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

const getCities = catchAsync(async (req, res) => {
    const {limit = 10, page = 1 } = req.query; // Query parameters
    const {country_name, state_name } = req.body;
    const cities = await cityService.findCities(country_name, state_name, limit, page);
    res.status(httpStatus.OK).send({ success: true, data: cities });
  });
  
module.exports = {
  createCity,
  queryCity,
  getCityById,
  updateCityById,
  deleteCityById,
  getCities,
};
