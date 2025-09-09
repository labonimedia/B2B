const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const { M2RPerformaInvoiceService } = require('../../services');
const pick = require('../../utils/pick');

/**
 * Create a new M2R Performa Invoice
 */
const createInvoice = catchAsync(async (req, res) => {
  const invoice = await M2RPerformaInvoiceService.createM2RInvoice(req.body);
  res.status(httpStatus.CREATED).send(invoice);
});

/**
 * Get a single M2R Invoice by ID
 */
const getInvoiceById = catchAsync(async (req, res) => {
  const invoice = await M2RPerformaInvoiceService.getSingleM2RInvoiceById(req.params.id);
  if (!invoice) {
    res.status(httpStatus.NOT_FOUND).send({ message: 'Invoice not found' });
    return;
  }
  res.send(invoice);
});

/**
 * Get all M2R invoices with filter, sort, paginate
 */
const getAllInvoices = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['manufacturerEmail', 'retailerEmail', 'statusAll', 'poNumber', 'invoiceNumber']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await M2RPerformaInvoiceService.getAllM2RInvoices(filter, options);
  res.send(result);
});

/**
 * Get all invoices by manufacturer email (direct call without pagination)
 */
const getInvoicesByManufacturer = catchAsync(async (req, res) => {
  const { manufacturerEmail } = req.params;
  const result = await M2RPerformaInvoiceService.getM2RInvoicesByManufacturer(manufacturerEmail);
  res.send(result);
});

/**
 * Update full invoice
 */
const updateInvoice = catchAsync(async (req, res) => {
  const updated = await M2RPerformaInvoiceService.updateM2RInvoiceById(req.params.id, req.body);
  res.send(updated);
});

/**
 * Update deliveryItems inside invoice
 */
const updateDeliveryItems = catchAsync(async (req, res) => {
  const updated = await M2RPerformaInvoiceService.updateM2RInvoiceDeliveryItems(req.params.id, req.body);
  res.send(updated);
});

/**
 * Delete an invoice
 */
const deleteInvoice = catchAsync(async (req, res) => {
  await M2RPerformaInvoiceService.deleteM2RInvoiceById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

const getPerformaInvoiceByPoId = catchAsync(async (req, res) => {
  const { poId } = req.params;
  const invoice = await M2RPerformaInvoiceService.getPerformaInvoiceByPoId(poId);
  res.status(httpStatus.OK).send(invoice);
});

module.exports = {
  createInvoice,
  getInvoiceById,
  getAllInvoices,
  getInvoicesByManufacturer,
  updateInvoice,
  updateDeliveryItems,
  deleteInvoice,
  getPerformaInvoiceByPoId,
};
