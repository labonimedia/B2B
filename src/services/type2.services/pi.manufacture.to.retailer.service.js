const httpStatus = require('http-status');
const { M2RPerformaInvoice } = require('../../models');
const ApiError = require('../../utils/ApiError');

/**
 * Get Performa Invoice by PO Id
 * @param {ObjectId} poId
 * @returns {Promise<M2RPerformaInvoice>}
 */
const getPerformaInvoiceByPoId = async (poId) => {
  const invoice = await M2RPerformaInvoice.findOne({ poId });
  if (!invoice) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Performa Invoice not found for this PO');
  }
  return invoice;
};

/**
 * Get a single M2R Performa Invoice by ID
 */
const getSingleM2RInvoiceById = async (id) => {
  return M2RPerformaInvoice.findById(id);
};

// /**
//  * Create a new M2R Performa Invoice
//  */
// const createM2RInvoice = async (reqBody) => {
//   const invoice = await M2RPerformaInvoice.create(reqBody);
//   return invoice;
// };
const createM2RInvoice = async (reqBody) => {
  const { manufacturerEmail } = reqBody;

  if (!manufacturerEmail) {
    throw new ApiError(httpStatus.BAD_REQUEST, "'manufacturerEmail' is required to generate invoice number.");
  }

  // Find the highest invoice number for this manufacturer
  const lastInvoice = await M2RPerformaInvoice.findOne({ manufacturerEmail }).sort({ invoiceNumber: -1 }).lean();

  let nextInvoiceNumber = '1';

  if (lastInvoice && lastInvoice.invoiceNumber) {
    const lastNumber = parseInt(lastInvoice.invoiceNumber, 10);
    if (!isNaN(lastNumber)) {
      nextInvoiceNumber = (lastNumber + 1).toString();
    }
  }

  reqBody.invoiceNumber = nextInvoiceNumber;

  const invoice = await M2RPerformaInvoice.create(reqBody);
  return invoice;
};

/**
 * Get paginated list of M2R Invoices
 */
const getAllM2RInvoices = async (filter, options) => {
  return M2RPerformaInvoice.paginate(filter, options);
};

/**
 * Get invoices by manufacturer email
 */
const getM2RInvoicesByManufacturer = async (manufacturerEmail) => {
  return M2RPerformaInvoice.find({ manufacturerEmail }).sort({ createdAt: -1 });
};

/**
 * Update a full M2R Performa Invoice
 */
const updateM2RInvoiceById = async (id, updateBody) => {
  const invoice = await getSingleM2RInvoiceById(id);
  if (!invoice) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invoice not found');
  }

  Object.assign(invoice, updateBody);
  await invoice.save();
  return invoice;
};

/**
 * Update deliveryItems inside an M2R Invoice
 */
const updateM2RInvoiceDeliveryItems = async (invoiceId, updateBody) => {
  const invoice = await M2RPerformaInvoice.findById(invoiceId);
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
 * Delete an M2R Performa Invoice
 */
const deleteM2RInvoiceById = async (id) => {
  const invoice = await getSingleM2RInvoiceById(id);
  if (!invoice) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invoice not found');
  }
  await invoice.remove();
  return invoice;
};

module.exports = {
  createM2RInvoice,
  getSingleM2RInvoiceById,
  getAllM2RInvoices,
  getM2RInvoicesByManufacturer,
  updateM2RInvoiceById,
  updateM2RInvoiceDeliveryItems,
  deleteM2RInvoiceById,
  getPerformaInvoiceByPoId,
};
