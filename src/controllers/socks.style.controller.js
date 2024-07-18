const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { socksStyleService } = require('../services');

const createSocksStyle = catchAsync(async (req, res) => {
  const user = await socksStyleService.createSocksStyle(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const querySocksStyle = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await socksStyleService.querySocksStyle(filter, options);
  res.send(result);
});

const getSocksStyleById = catchAsync(async (req, res) => {
  const user = await socksStyleService.getSocksStyleById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Socks Style not found');
  }
  res.send(user);
});

const updateSocksStyleById = catchAsync(async (req, res) => {
  const user = await socksStyleService.updateSocksStyleById(req.params.id, req.body);
  res.send(user);
});

const deleteSocksStyleById = catchAsync(async (req, res) => {
  await socksStyleService.deleteSocksStyleById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createSocksStyle,
  querySocksStyle,
  getSocksStyleById,
  updateSocksStyleById,
  deleteSocksStyleById,
};
