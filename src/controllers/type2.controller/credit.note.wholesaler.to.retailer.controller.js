const httpStatus = require('http-status');
const { w2rCreditNoteService } = require('../../services');
const pick = require('../../utils/pick');
const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');

const arrayUpload = catchAsync(async (req, res) => {
  if (!Array.isArray(req.body) || req.body.length === 0) throw new ApiError(httpStatus.BAD_REQUEST, 'Array required');

  const result = await w2rCreditNoteService.bulkUploadW2RCreditNote(req.body);
  res.status(httpStatus.CREATED).send(result);
});

const createCreditNote = catchAsync(async (req, res) => {
  const result = await w2rCreditNoteService.createW2RCreditNote(req.body);
  res.status(httpStatus.CREATED).send(result);
});

const queryW2RCreditNote = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['retailerEmail', 'wholesalerEmail', 'used', 'isDeleted']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await w2rCreditNoteService.queryW2RCreditNote(filter, options);
  res.send(result);
});

const groupW2RCreditNote = catchAsync(async (req, res) => {
  const result = await w2rCreditNoteService.groupW2RCreditNote(req.query);
  res.send(result);
});

const getW2RCreditNoteById = catchAsync(async (req, res) => {
  const result = await w2rCreditNoteService.getW2RCreditNoteById(req.params.id);
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, 'Credit Note not found');
  res.send(result);
});

const updateW2RCreditNoteById = catchAsync(async (req, res) => {
  const result = await w2rCreditNoteService.updateW2RCreditNoteById(req.params.id, req.body);
  res.send(result);
});

const deleteW2RCreditNoteById = catchAsync(async (req, res) => {
  await w2rCreditNoteService.deleteW2RCreditNoteById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

const bulkUpdateCreditNotes = catchAsync(async (req, res) => {
  const result = await w2rCreditNoteService.bulkUpdateCreditNotes(req.body);
  res.send(result);
});

module.exports = {
  arrayUpload,
  createCreditNote,
  queryW2RCreditNote,
  groupW2RCreditNote,
  getW2RCreditNoteById,
  updateW2RCreditNoteById,
  deleteW2RCreditNoteById,
  bulkUpdateCreditNotes,
};
