const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { careInstructionService } = require('../services');

const createCareInstruction = catchAsync(async (req, res) => {
  const user = await careInstructionService.createCareInstruction(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryCareInstruction = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await careInstructionService.queryCareInstruction(filter, options);
  res.send(result);
});

const getCareInstructionById = catchAsync(async (req, res) => {
  const user = await careInstructionService.getCareInstructionById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Care Instruction not found');
  }
  res.send(user);
});

const updateCareInstructionById = catchAsync(async (req, res) => {
  const user = await careInstructionService.updateCareInstructionById(req.params.id, req.body);
  res.send(user);
});

const deleteCareInstructionById = catchAsync(async (req, res) => {
  await careInstructionService.deleteCareInstructionById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createCareInstruction,
  queryCareInstruction,
  getCareInstructionById,
  updateCareInstructionById,
  deleteCareInstructionById,
};
