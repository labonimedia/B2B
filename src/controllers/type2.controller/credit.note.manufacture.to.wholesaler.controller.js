// const httpStatus = require('http-status');
// const catchAsync = require('../../utils/catchAsync');
// const pick = require('../../utils/pick');
// const { m2wCreditNoteService } = require('../../services');

// const createCreditNote = catchAsync(async (req, res) => {
//   const data = await m2wCreditNoteService.createM2WCreditNote(req.body);
//   res.status(httpStatus.CREATED).send(data);
// });

// const queryCreditNotes = catchAsync(async (req, res) => {
//   const filter = pick(req.query, ['manufacturerEmail', 'wholesalerEmail', 'used', 'isDeleted']);
//   const options = pick(req.query, ['sortBy', 'limit', 'page']);
//   const result = await m2wCreditNoteService.queryM2WCreditNotes(filter, options);
//   res.send(result);
// });

// const getCreditNoteById = catchAsync(async (req, res) => {
//   const data = await m2wCreditNoteService.getM2WCreditNoteById(req.params.id);
//   res.send(data);
// });

// const deleteCreditNote = catchAsync(async (req, res) => {
//   await m2wCreditNoteService.deleteM2WCreditNoteById(req.params.id);
//   res.status(httpStatus.NO_CONTENT).send();
// });

// module.exports = {
//   createCreditNote,
//   queryCreditNotes,
//   getCreditNoteById,
//   deleteCreditNote,
// };

const httpStatus = require('http-status');
const { m2wCreditNoteService } = require('../../services');
const pick = require('../../utils/pick');
const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');

/* ---------- Bulk Upload ---------- */

const arrayUpload = catchAsync(async (req, res) => {
  const data = req.body;

  if (!Array.isArray(data) || data.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Request body must be a non-empty array');
  }

  const result = await m2wCreditNoteService.bulkUploadM2WCreditNote(data);

  res.status(httpStatus.CREATED).send({
    message: 'Bulk upload completed',
    result,
  });
});

/* ---------- Create ---------- */

const createCreditNote = catchAsync(async (req, res) => {
  const data = await m2wCreditNoteService.createM2WCreditNote(req.body);
  res.status(httpStatus.CREATED).send(data);
});

/* ---------- Query ---------- */

const queryCreditNotes = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['manufacturerEmail', 'wholesalerEmail', 'used', 'isDeleted']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await m2wCreditNoteService.queryM2WCreditNotes(filter, options);

  res.send(result);
});

/* ---------- Group ---------- */

const groupCreditNotes = catchAsync(async (req, res) => {
  const query = pick(req.query, ['manufacturerEmail', 'wholesalerEmail', 'used', 'page', 'limit']);

  const result = await m2wCreditNoteService.groupM2WCreditNotes(query);

  res.status(httpStatus.OK).send({
    success: true,
    message: 'Grouped credit notes fetched successfully',
    result,
  });
});

/* ---------- Get by ID ---------- */

const getCreditNoteById = catchAsync(async (req, res) => {
  const data = await m2wCreditNoteService.getM2WCreditNoteById(req.params.id);

  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Credit Note not found');
  }

  res.send(data);
});

/* ---------- Update ---------- */

const updateCreditNote = catchAsync(async (req, res) => {
  const data = await m2wCreditNoteService.updateM2WCreditNoteById(req.params.id, req.body);
  res.send(data);
});

/* ---------- Delete ---------- */

const deleteCreditNote = catchAsync(async (req, res) => {
  await m2wCreditNoteService.deleteM2WCreditNoteById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

/* ---------- Bulk Update ---------- */

const bulkUpdateCreditNotes = catchAsync(async (req, res) => {
  const result = await m2wCreditNoteService.bulkUpdateCreditNotes(req.body);

  res.status(200).send({
    message: 'Credit Notes updated successfully',
    count: result.length,
    data: result,
  });
});

module.exports = {
  arrayUpload,
  createCreditNote,
  queryCreditNotes,
  groupCreditNotes,
  getCreditNoteById,
  updateCreditNote,
  deleteCreditNote,
  bulkUpdateCreditNotes,
};