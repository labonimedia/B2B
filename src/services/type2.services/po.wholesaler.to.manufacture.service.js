const httpStatus = require('http-status');
const { POWholesalerToManufacturer, WholesalerCartToManufacturer } = require('../../models');

const ApiError = require('../../utils/ApiError');

/**
 * Get PO by ID
 */
const getSinglePOWholesalerToManufacturer = async (id) => {
  return POWholesalerToManufacturer.findById(id);
};

/**
 * Create PO and delete cart
 */
const createPurchaseOrderWholesalerToManufacturer = async (reqBody) => {
  const { cartId } = reqBody;

  if (!cartId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "'cartId' is required.");
  }

  await WholesalerCartToManufacturer.findByIdAndDelete({ _id: cartId });

  const purchaseOrder = await POWholesalerToManufacturer.create(reqBody);

  return purchaseOrder;
};

/**
 * Query for POs
 */
const getAllPOWholesalerToManufacturer = async (filter, options) => {
  const poWholesalerToManufacturer = await POWholesalerToManufacturer.paginate(filter, options);

  return poWholesalerToManufacturer;
};

/**
 * Get PO by wholesaler
 */
const getRetailerPOByWholesaler = async (wholesalerEmail) => {
  return POWholesalerToManufacturer.find({ wholesalerEmail }).sort({
    createdAt: -1,
  });
};

/**
 * Update PO set item
 */
const updateRetailerPOSetItem = async (poId, updateBody) => {
  const { designNumber, colour, size, updatedFields } = updateBody;

  const po = await POWholesalerToManufacturer.findById(poId);

  if (!po) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Purchase Order not found');
  }

  const item = po.set.find((item) => item.designNumber === designNumber && item.colour === colour && item.size === size);

  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Set item not found in PO');
  }

  Object.keys(updatedFields).forEach((key) => {
    item[key] = updatedFields[key];
  });

  await po.save();

  return po;
};

/**
 * Update PO by ID
 */
const updateSinglePOWholesalerToManufacturer = async (id, updateBody) => {
  const po = await getSinglePOWholesalerToManufacturer(id);

  if (!po) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Purchase Order not found');
  }

  Object.assign(po, updateBody);

  await po.save();

  return po;
};

/**
 * Delete PO by ID
 */
const deleteSinglePOWholesalerToManufacturer = async (id) => {
  const po = await getSinglePOWholesalerToManufacturer(id);

  if (!po) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Purchase Order not found');
  }

  await po.remove();

  return po;
};

/**
 * Update PO data (top-level + set items)
 */
const updatePoData = async (poId, updateBody) => {
  const po = await POWholesalerToManufacturer.findById(poId);

  if (!po) {
    throw new ApiError(httpStatus.NOT_FOUND, 'PO not found');
  }

  /* -------------------------
     UPDATE TOP LEVEL FIELDS
  --------------------------*/
  Object.keys(updateBody).forEach((key) => {
    if (key !== 'set' && key !== '_id') {
      po[key] = updateBody[key];
    }
  });

  /* -------------------------
     UPDATE SET ARRAY ITEMS
  --------------------------*/
  if (Array.isArray(updateBody.set)) {
    updateBody.set.forEach((updatedSetItem) => {
      if (!updatedSetItem._id) return;

      const existingItem = po.set.id(updatedSetItem._id);

      if (existingItem) {
        Object.keys(updatedSetItem).forEach((field) => {
          if (field !== '_id') {
            existingItem[field] = updatedSetItem[field];
          }
        });
      }
    });
  }

  await po.save();

  return po;
};

/**
 * Generate PO Number
 */
const generatePoNumber = async (wholesalerEmail) => {
  const lastPO = await POWholesalerToManufacturer.findOne({
    wholesalerEmail,
  })
    .sort({ poNumber: -1 })
    .select('poNumber')
    .lean();

  return lastPO ? lastPO.poNumber + 1 : 1001;
};

/**
 * Make to order PO
 */
const makeToOrderPO = async (reqBody) => {
  if (!reqBody.wholesalerEmail) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Wholesaler email is required to generate PO Number');
  }

  // Generate PO number
  const nextPoNumber = await generatePoNumber(reqBody.wholesalerEmail);

  reqBody.poNumber = nextPoNumber;

  reqBody.statusAll = 'make_to_order';

  // Set items processing
  if (Array.isArray(reqBody.set)) {
    reqBody.set = reqBody.set.map((item) => ({
      ...item,
      status: 'processing',
    }));
  }

  const purchaseOrder = await POWholesalerToManufacturer.create(reqBody);

  // Delete cart
  if (reqBody.cartId) {
    await WholesalerCartToManufacturer.findByIdAndDelete(reqBody.cartId);
  }

  return purchaseOrder;
};

module.exports = {
  createPurchaseOrderWholesalerToManufacturer,
  getRetailerPOByWholesaler,
  updateRetailerPOSetItem,
  getAllPOWholesalerToManufacturer,
  updateSinglePOWholesalerToManufacturer,
  deleteSinglePOWholesalerToManufacturer,
  getSinglePOWholesalerToManufacturer,
  updatePoData,
  makeToOrderPO,
};
