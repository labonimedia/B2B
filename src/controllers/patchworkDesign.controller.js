const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { patchworkDesignService } = require('../services');

const create = catchAsync(async (req, res) => {
  const data = await patchworkDesignService.create(req.body);
  res.status(httpStatus.CREATED).send(data);
});

const query = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await patchworkDesignService.query(filter, options);
  res.send(result);
});

const getById = catchAsync(async (req, res) => {
  const data = await patchworkDesignService.getById(req.params.id);
  res.send(data);
});

const updateById = catchAsync(async (req, res) => {
  const data = await patchworkDesignService.updateById(req.params.id, req.body);
  res.send(data);
});

const deleteById = catchAsync(async (req, res) => {
  await patchworkDesignService.deleteById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = { create, query, getById, updateById, deleteById };
