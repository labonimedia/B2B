const httpStatus = require('http-status');
const { mtoRCreditNoteService } = require('../../services');
const pick = require('../../utils/pick');
const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');

const arrayUpload = catchAsync(async (req, res) => {
  const data = req.body;

  if (!Array.isArray(data) || data.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Request body must be a non-empty array');
  }

  const result = await mtoRCreditNoteService.bulkUploadMtoRCreditNote(data);
  res.status(httpStatus.CREATED).send({ message: 'Bulk upload completed', result });
});

const createCreditNote = catchAsync(async (req, res) => {
  const user = await mtoRCreditNoteService.createMtoRCreditNote(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryMtoRCreditNote = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['createdByEmail']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await mtoRCreditNoteService.queryMtoRCreditNote(filter, options);
  res.send(result);
});

const getMtoRCreditNoteById = catchAsync(async (req, res) => {
  const user = await mtoRCreditNoteService.getMtoRCreditNoteById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Care Instruction not found');
  }
  res.send(user);
});

const updateMtoRCreditNoteById = catchAsync(async (req, res) => {
  const user = await mtoRCreditNoteService.updateMtoRCreditNoteById(req.params.id, req.body);
  res.send(user);
});

const deleteMtoRCreditNoteById = catchAsync(async (req, res) => {
  await mtoRCreditNoteService.deleteMtoRCreditNoteById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  arrayUpload,
  deleteMtoRCreditNoteById,
  updateMtoRCreditNoteById,
  getMtoRCreditNoteById,
  queryMtoRCreditNote,
  createCreditNote,
};
