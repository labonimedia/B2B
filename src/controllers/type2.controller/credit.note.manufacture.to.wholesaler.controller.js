const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const pick = require('../../utils/pick');
const { m2wCreditNoteService } = require('../../services');

const createCreditNote = catchAsync(async (req, res) => {
  const data = await m2wCreditNoteService.createM2WCreditNote(req.body);
  res.status(httpStatus.CREATED).send(data);
});

const queryCreditNotes = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['manufacturerEmail', 'wholesalerEmail', 'used', 'isDeleted']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await m2wCreditNoteService.queryM2WCreditNotes(filter, options);
  res.send(result);
});

const getCreditNoteById = catchAsync(async (req, res) => {
  const data = await m2wCreditNoteService.getM2WCreditNoteById(req.params.id);
  res.send(data);
});

const deleteCreditNote = catchAsync(async (req, res) => {
  await m2wCreditNoteService.deleteM2WCreditNoteById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createCreditNote,
  queryCreditNotes,
  getCreditNoteById,
  deleteCreditNote,
};
