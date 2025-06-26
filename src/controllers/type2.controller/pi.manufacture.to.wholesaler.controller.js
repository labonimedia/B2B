const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const { M2WPerformaInvoiceService } = require('../../services');
const pick = require('../../utils/pick');

/**
 * Create new M2W Performa Invoice
 */
const createInvoice = catchAsync(async (req, res) => {
  const invoice = await M2WPerformaInvoiceService.createM2WInvoice(req.body);
  res.status(httpStatus.CREATED).send(invoice);
});

/**
 * Get single invoice by ID
 */
const getInvoiceById = catchAsync(async (req, res) => {
  const invoice = await M2WPerformaInvoiceService.getSingleM2WInvoiceById(req.params.id);
  if (!invoice) {
    res.status(httpStatus.NOT_FOUND).send({ message: 'Invoice not found' });
    return;
  }
  res.send(invoice);
});

/**
 * Get paginated list of invoices
 */
const getAllInvoices = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['manufacturerEmail', 'wholesalerEmail', 'statusAll', 'poNumber', 'invoiceNumber']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await M2WPerformaInvoiceService.getAllM2WInvoices(filter, options);
  res.send(result);
});

/**
 * Get invoices by manufacturer email
 */
const getInvoicesByManufacturer = catchAsync(async (req, res) => {
  const { manufacturerEmail } = req.params;
  const result = await M2WPerformaInvoiceService.getM2WInvoicesByManufacturer(manufacturerEmail);
  res.send(result);
});

/**
 * Update full invoice
 */
const updateInvoice = catchAsync(async (req, res) => {
  const updated = await M2WPerformaInvoiceService.updateM2WInvoiceById(req.params.id, req.body);
  res.send(updated);
});

/**
 * Update only deliveryItems
 */
const updateDeliveryItems = catchAsync(async (req, res) => {
  const updated = await M2WPerformaInvoiceService.updateM2WInvoiceDeliveryItems(req.params.id, req.body);
  res.send(updated);
});

/**
 * Delete invoice
 */
const deleteInvoice = catchAsync(async (req, res) => {
  await M2WPerformaInvoiceService.deleteM2WInvoiceById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createInvoice,
  getInvoiceById,
  getAllInvoices,
  getInvoicesByManufacturer,
  updateInvoice,
  updateDeliveryItems,
  deleteInvoice,
};
