const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { printDesignService } = require('../services');

const create = catchAsync(async (req, res) => {
  const data = await printDesignService.create(req.body);
  res.status(httpStatus.CREATED).send(data);
});

const query = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await printDesignService.query(filter, options);
  res.send(result);
});

const getById = catchAsync(async (req, res) => {
  const data = await printDesignService.getById(req.params.id);
  res.send(data);
});

const updateById = catchAsync(async (req, res) => {
  const data = await printDesignService.updateById(req.params.id, req.body);
  res.send(data);
});

const deleteById = catchAsync(async (req, res) => {
  await printDesignService.deleteById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = { create, query, getById, updateById, deleteById };
