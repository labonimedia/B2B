const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { docService } = require('../services');

const createDoc = catchAsync(async (req, res) => {
  const user = await docService.createDoc(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryDoc = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await docService.queryDoc(filter, options);
  res.send(result);
});

const getDocById = catchAsync(async (req, res) => {
  const user = await docService.getDocById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Doc not found');
  }
  res.send(user);
});

const updateDocById = catchAsync(async (req, res) => {
  const user = await docService.updateDocById(req.params.id, req.body);
  res.send(user);
});

const deleteDocById = catchAsync(async (req, res) => {
  await docService.deleteDocById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createDoc,
  queryDoc,
  getDocById,
  updateDocById,
  deleteDocById,
};
