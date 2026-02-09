const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const { w2rPerformaInvoiceService } = require('../../services');
const pick = require('../../utils/pick');

const createInvoice = catchAsync(async (req, res) => {
  const invoice = await w2rPerformaInvoiceService.createW2RInvoice(req.body);
  res.status(httpStatus.CREATED).send(invoice);
});

const getInvoiceById = catchAsync(async (req, res) => {
  const invoice = await w2rPerformaInvoiceService.getSingleW2RInvoiceById(req.params.id);
  if (!invoice) return res.status(httpStatus.NOT_FOUND).send({ message: 'Invoice not found' });
  res.send(invoice);
});

const getAllInvoices = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['wholesalerEmail', 'retailerEmail', 'statusAll', 'poNumber', 'invoiceNumber']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await w2rPerformaInvoiceService.getAllW2RInvoices(filter, options);
  res.send(result);
});

const getInvoicesByWholesaler = catchAsync(async (req, res) => {
  const result = await w2rPerformaInvoiceService.getW2RInvoicesByWholesaler(req.params.wholesalerEmail);
  res.send(result);
});

const updateInvoice = catchAsync(async (req, res) => {
  const updated = await w2rPerformaInvoiceService.updateW2RInvoiceById(req.params.id, req.body);
  res.send(updated);
});

const updateDeliveryItems = catchAsync(async (req, res) => {
  const updated = await w2rPerformaInvoiceService.updateW2RInvoiceDeliveryItems(req.params.id, req.body);
  res.send(updated);
});

const deleteInvoice = catchAsync(async (req, res) => {
  await w2rPerformaInvoiceService.deleteW2RInvoiceById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

const getPerformaInvoiceByPoId = catchAsync(async (req, res) => {
  const invoice = await w2rPerformaInvoiceService.getPerformaInvoiceByPoId(req.params.poId);
  res.send(invoice);
});

const markReturnRequestGenerated = catchAsync(async (req, res) => {
  const updated = await w2rPerformaInvoiceService.markReturnRequestGenerated(req.params.id);
  res.send(updated);
});

module.exports = {
  createInvoice,
  getInvoiceById,
  getAllInvoices,
  getInvoicesByWholesaler,
  updateInvoice,
  updateDeliveryItems,
  deleteInvoice,
  getPerformaInvoiceByPoId,
  markReturnRequestGenerated,
};
