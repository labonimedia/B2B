const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { ethnicDesignService } = require('../services');

const createEthnicDesign = catchAsync(async (req, res) => {
  const user = await ethnicDesignService.createEthnicDesign(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryEthnicDesign = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await ethnicDesignService.queryEthnicDesign(filter, options);
  res.send(result);
});

const getEthnicDesignById = catchAsync(async (req, res) => {
  const user = await ethnicDesignService.getEthnicDesignById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Manufaturer not found');
  }
  res.send(user);
});

const updateEthnicDesignById = catchAsync(async (req, res) => {
  const user = await ethnicDesignService.updateEthnicDesignById(req.params.id, req.body);
  res.send(user);
});

const deleteEthnicDesignById = catchAsync(async (req, res) => {
  await ethnicDesignService.deleteEthnicDesignById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createEthnicDesign,
  queryEthnicDesign,
  getEthnicDesignById,
  updateEthnicDesignById,
  deleteEthnicDesignById,
};
