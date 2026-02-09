const httpStatus = require('http-status');
const { W2RPerformaInvoice } = require('../../models');
const ApiError = require('../../utils/ApiError');
//const { getNextW2RInvoiceNumber } = require('./w2r.invoicegenerator.service');

const getPerformaInvoiceByPoId = async (poId) => {
  const invoice = await W2RPerformaInvoice.findOne({ poId });
  if (!invoice) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Performa Invoice not found for this PO');
  }
  return invoice;
};

const getSingleW2RInvoiceById = async (id) => {
  return W2RPerformaInvoice.findById(id);
};

const createW2RInvoice = async (reqBody) => {
  const { wholesalerEmail } = reqBody;

  if (!wholesalerEmail) {
    throw new ApiError(httpStatus.BAD_REQUEST, "'wholesalerEmail' is required");
  }

  const invoiceNumber = await getNextW2RInvoiceNumber(wholesalerEmail);

  try {
    return await W2RPerformaInvoice.create({
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

const getAllW2RInvoices = async (filter, options) => {
  return W2RPerformaInvoice.paginate(filter, options);
};

const getW2RInvoicesByWholesaler = async (wholesalerEmail) => {
  return W2RPerformaInvoice.find({ wholesalerEmail }).sort({ createdAt: -1 });
};

const updateW2RInvoiceById = async (id, updateBody) => {
  const invoice = await getSingleW2RInvoiceById(id);
  if (!invoice) throw new ApiError(httpStatus.NOT_FOUND, 'Invoice not found');

  Object.assign(invoice, updateBody);
  await invoice.save();
  return invoice;
};

const updateW2RInvoiceDeliveryItems = async (invoiceId, updateBody) => {
  const invoice = await W2RPerformaInvoice.findById(invoiceId);
  if (!invoice) throw new ApiError(httpStatus.NOT_FOUND, 'Invoice not found');

  Object.keys(updateBody).forEach((key) => {
    if (key !== 'deliveryItems') invoice[key] = updateBody[key];
  });

  if (Array.isArray(updateBody.deliveryItems)) {
    updateBody.deliveryItems.forEach((incomingItem) => {
      const existingItem = invoice.deliveryItems.id(incomingItem._id);
      if (existingItem) {
        Object.keys(incomingItem).forEach((field) => {
          if (field !== '_id') existingItem[field] = incomingItem[field];
        });
      }
    });
  }

  await invoice.save();
  return invoice;
};

const deleteW2RInvoiceById = async (id) => {
  const invoice = await getSingleW2RInvoiceById(id);
  if (!invoice) throw new ApiError(httpStatus.NOT_FOUND, 'Invoice not found');
  await invoice.remove();
};

const markReturnRequestGenerated = async (id) => {
  const invoice = await W2RPerformaInvoice.findById(id);
  if (!invoice) throw new ApiError(httpStatus.NOT_FOUND, 'Invoice not found');

  invoice.returnRequestGenerated = 'true';
  await invoice.save();
  return invoice;
};

module.exports = {
  createW2RInvoice,
  getSingleW2RInvoiceById,
  getAllW2RInvoices,
  getW2RInvoicesByWholesaler,
  updateW2RInvoiceById,
  updateW2RInvoiceDeliveryItems,
  deleteW2RInvoiceById,
  getPerformaInvoiceByPoId,
  markReturnRequestGenerated,
};
