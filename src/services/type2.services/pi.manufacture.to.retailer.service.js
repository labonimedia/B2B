const httpStatus = require('http-status');
const { M2RPerformaInvoice } = require('../../models');
const ApiError = require('../../utils/ApiError');
const { getNextM2RInvoiceNumber } = require('../type2.services/m2r.invoicegenerator.service');

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

const getSingleM2RInvoiceById = async (id) => {
  return M2RPerformaInvoice.findById(id);
};

const createM2RInvoice = async (reqBody) => {
  const { manufacturerEmail } = reqBody;

  if (!manufacturerEmail) {
    throw new ApiError(httpStatus.BAD_REQUEST, "'manufacturerEmail' is required");
  }
  const invoiceNumber = await getNextM2RInvoiceNumber(manufacturerEmail);
  try {
    const invoice = await M2RPerformaInvoice.create({
      ...reqBody,
      invoiceNumber,
    });

    return invoice;
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(httpStatus.CONFLICT, 'Invoice number conflict. Please retry.');
    }
    throw error;
  }
};

const getAllM2RInvoices = async (filter, options) => {
  return M2RPerformaInvoice.paginate(filter, options);
};

const getM2RInvoicesByManufacturer = async (manufacturerEmail) => {
  return M2RPerformaInvoice.find({ manufacturerEmail }).sort({ createdAt: -1 });
};

const updateM2RInvoiceById = async (id, updateBody) => {
  const invoice = await getSingleM2RInvoiceById(id);
  if (!invoice) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invoice not found');
  }

  Object.assign(invoice, updateBody);
  await invoice.save();
  return invoice;
};

const updateM2RInvoiceDeliveryItems = async (invoiceId, updateBody) => {
  const invoice = await M2RPerformaInvoice.findById(invoiceId);
  if (!invoice) throw new ApiError(httpStatus.NOT_FOUND, 'Invoice not found');

  Object.keys(updateBody).forEach((key) => {
    if (key !== 'deliveryItems') {
      invoice[key] = updateBody[key];
    }
  });

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

const deleteM2RInvoiceById = async (id) => {
  const invoice = await getSingleM2RInvoiceById(id);
  if (!invoice) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invoice not found');
  }
  await invoice.remove();
  return invoice;
};

const markReturnRequestGenerated = async (id) => {
  const invoice = await M2RPerformaInvoice.findById(id);

  if (!invoice) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invoice not found');
  }

  invoice.returnRequestGenerated = 'true';
  await invoice.save();

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
  markReturnRequestGenerated,
};
