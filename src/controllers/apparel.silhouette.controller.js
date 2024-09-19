const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { apparelSilhouetteService } = require('../services');

const createApparelSilhouette = catchAsync(async (req, res) => {
  const user = await apparelSilhouetteService.createApparelSilhouette(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryApparelSilhouette = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await apparelSilhouetteService.queryApparelSilhouette(filter, options);
  res.send(result);
});

const getApparelSilhouetteById = catchAsync(async (req, res) => {
  const user = await apparelSilhouetteService.getApparelSilhouetteById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Manufaturer not found');
  }
  res.send(user);
});

const updateApparelSilhouetteById = catchAsync(async (req, res) => {
  const user = await apparelSilhouetteService.updateApparelSilhouetteById(req.params.id, req.body);
  res.send(user);
});

const deleteApparelSilhouetteById = catchAsync(async (req, res) => {
  await apparelSilhouetteService.deleteApparelSilhouetteById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createApparelSilhouette,
  queryApparelSilhouette,
  getApparelSilhouetteById,
  updateApparelSilhouetteById,
  deleteApparelSilhouetteById,
};
