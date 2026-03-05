const httpStatus = require('http-status');
const { M2WPerformaInvoice } = require('../../models');
const ApiError = require('../../utils/ApiError');
const { getNextM2WInvoiceNumber } = require('./m2r.invoicegenerator.service');

/**
 * Get invoice by PO id
 */
const getPerformaInvoiceByPoId = async (poId) => {
  const invoice = await M2WPerformaInvoice.findOne({ poId });

  if (!invoice) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Performa Invoice not found for this PO');
  }

  return invoice;
};

/**
 * Get invoice by ID
 */
const getSingleM2WInvoiceById = async (id) => {
  return M2WPerformaInvoice.findById(id);
};

/**
 * Create invoice
 */
const createM2WInvoice = async (reqBody) => {
  const { manufacturerEmail } = reqBody;

  if (!manufacturerEmail) {
    throw new ApiError(httpStatus.BAD_REQUEST, "'manufacturerEmail' is required");
  }

  const invoiceNumber = await getNextM2WInvoiceNumber(manufacturerEmail);

  try {
    return await M2WPerformaInvoice.create({
      ...reqBody,
      invoiceNumber,
    });
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(httpStatus.CONFLICT, 'Invoice number conflict. Please retry.');
    }

    throw error;
  }
};

/**
 * Get all invoices
 */
const getAllM2WInvoices = async (filter, options) => {
  return M2WPerformaInvoice.paginate(filter, options);
};

/**
 * Get invoices by manufacturer
 */
const getM2WInvoicesByManufacturer = async (manufacturerEmail) => {
  return M2WPerformaInvoice.find({ manufacturerEmail }).sort({ createdAt: -1 });
};

/**
 * Update invoice
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
 * Update delivery items
 */
const updateM2WInvoiceDeliveryItems = async (invoiceId, updateBody) => {
  const invoice = await M2WPerformaInvoice.findById(invoiceId);

  if (!invoice) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invoice not found');
  }

  /* Update top-level fields */
  Object.keys(updateBody).forEach((key) => {
    if (key !== 'deliveryItems') {
      invoice[key] = updateBody[key];
    }
  });

  /* Update delivery items */
  if (Array.isArray(updateBody.deliveryItems)) {
    updateBody.deliveryItems.forEach((incomingItem) => {
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
 * Delete invoice
 */
const deleteM2WInvoiceById = async (id) => {
  const invoice = await getSingleM2WInvoiceById(id);

  if (!invoice) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invoice not found');
  }

  await invoice.remove();
};

/**
 * Mark return request generated
 */
const markReturnRequestGenerated = async (id) => {
  const invoice = await M2WPerformaInvoice.findById(id);

  if (!invoice) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invoice not found');
  }

  invoice.returnRequestGenerated = 'true';

  await invoice.save();

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
  getPerformaInvoiceByPoId,
  markReturnRequestGenerated,
};