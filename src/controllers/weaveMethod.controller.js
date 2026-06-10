const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { weaveMethodService } = require('../services');

const create = catchAsync(async (req, res) => {
  const data = await weaveMethodService.create(req.body);
  res.status(httpStatus.CREATED).send(data);
});

const query = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await weaveMethodService.query(filter, options);
  res.send(result);
});

const getById = catchAsync(async (req, res) => {
  const data = await weaveMethodService.getById(req.params.id);
  res.send(data);
});

const updateById = catchAsync(async (req, res) => {
  const data = await weaveMethodService.updateById(req.params.id, req.body);
  res.send(data);
});

const deleteById = catchAsync(async (req, res) => {
  await weaveMethodService.deleteById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = { create, query, getById, updateById, deleteById };
