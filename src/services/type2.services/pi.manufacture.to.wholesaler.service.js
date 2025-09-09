const httpStatus = require('http-status');
const { M2WPerformaInvoice } = require('../../models');
const ApiError = require('../../utils/ApiError');

/**
 * Get a single M2W Performa Invoice by ID
 */
const getSingleM2WInvoiceById = async (id) => {
  return M2WPerformaInvoice.findById(id);
};

/**
 * Create a new M2W Performa Invoice with auto-increment invoiceNumber
 */
const createM2WInvoice = async (reqBody) => {
  const { manufacturerEmail } = reqBody;

  if (!manufacturerEmail) {
    throw new ApiError(httpStatus.BAD_REQUEST, "'manufacturerEmail' is required to generate invoice number.");
  }

  // Get latest invoiceNumber for that manufacturer
  const lastInvoice = await M2WPerformaInvoice.findOne({ manufacturerEmail }).sort({ invoiceNumber: -1 }).lean();

  let nextInvoiceNumber = '1';
  if (lastInvoice && lastInvoice.invoiceNumber) {
    const lastNumber = parseInt(lastInvoice.invoiceNumber, 10);
    if (!isNaN(lastNumber)) {
      nextInvoiceNumber = (lastNumber + 1).toString();
    }
  }

  reqBody.invoiceNumber = nextInvoiceNumber;

  const invoice = await M2WPerformaInvoice.create(reqBody);
  return invoice;
};

/**
 * Get all M2W invoices (paginated)
 */
const getAllM2WInvoices = async (filter, options) => {
  return M2WPerformaInvoice.paginate(filter, options);
};

/**
 * Get invoices by manufacturer email
 */
const getM2WInvoicesByManufacturer = async (manufacturerEmail) => {
  return M2WPerformaInvoice.find({ manufacturerEmail }).sort({ createdAt: -1 });
};

/**
 * Update an entire invoice document
 */
const updateM2WInvoiceById = async (id, updateBody) => {
  const invoice = await getSingleM2WInvoiceById(id);
  if (!invoice) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invoice not found');
  }

  Object.assign(invoice, updateBody);
  await invoice.save();
  return invoice;
};

/**
 * Update deliveryItems only
 */
const updateM2WInvoiceDeliveryItems = async (invoiceId, updateBody) => {
  const invoice = await M2WPerformaInvoice.findById(invoiceId);
  if (!invoice) throw new ApiError(httpStatus.NOT_FOUND, 'Invoice not found');

  if (Array.isArray(updateBody.deliveryItems)) {
    updateBody.deliveryItems.forEach((incomingItem) => {
      if (!incomingItem._id) return;

      const existingItem = invoice.deliveryItems.id(incomingItem._id);
      if (existingItem) {
        Object.keys(incomingItem).forEach((field) => {
          if (field !== '_id') {
            existingItem[field] = incomingItem[field];
          }
        });
      }
    });
  }

  await invoice.save();
  return invoice;
};

/**
 * Delete invoice by ID
 */
const deleteM2WInvoiceById = async (id) => {
  const invoice = await getSingleM2WInvoiceById(id);
  if (!invoice) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invoice not found');
  }
  await invoice.remove();
  return invoice;
};

module.exports = {
  createM2WInvoice,
  getSingleM2WInvoiceById,
  getAllM2WInvoices,
  getM2WInvoicesByManufacturer,
  updateM2WInvoiceById,
  updateM2WInvoiceDeliveryItems,
  deleteM2WInvoiceById,
};
