const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const { cpToManufacturerPOService } = require('../../services');

/**
 * 🔥 CREATE PO
 */
const createPO = catchAsync(async (req, res) => {
  const { cartId } = req.body;

  if (!cartId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'cartId is required');
  }

  const data = await cpToManufacturerPOService.createPOFromCart(cartId);

  res.status(httpStatus.CREATED).send({
    status: 'success',
    message: 'PO created successfully',
    data,
  });
});

/**
 * 🔥 GET PO LIST (SIMPLE FILTER)
 */
const getPOList = catchAsync(async (req, res) => {
  const data = await cpToManufacturerPOService.getPOList(req.query);

  res.status(httpStatus.OK).send({
    status: 'success',
    results: data.length,
    data,
  });
});

/**
 * 🔥 GET SINGLE PO
 */
const getPO = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'PO id is required');
  }

  const data = await cpToManufacturerPOService.getPOById(id);

  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'PO not found');
  }

  res.status(httpStatus.OK).send({
    status: 'success',
    data,
  });
});

/**
 * 🔥 UPDATE STATUS
 */
const updateStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!id || !status) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'id and status are required');
  }

  const data = await cpToManufacturerPOService.updatePOStatus(id, status);

  res.status(httpStatus.OK).send({
    status: 'success',
    message: 'PO status updated successfully',
    data,
  });
});

/**
 * 🔥 DELETE PO
 */
const deletePO = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'PO id is required');
  }

  await cpToManufacturerPOService.deletePO(id);

  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * 🔥 GET ALL PO (PAGINATION + FILTER)
 */
const getAllPO = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['manufacturerEmail', 'cpEmail', 'shopKeeperEmail', 'statusAll']);

  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const data = await cpToManufacturerPOService.getAllPO(filter, options);

  res.status(httpStatus.OK).send({
    status: 'success',
    ...data, // includes docs, page, limit, totalPages
  });
});

/**
 * 🔥 GET BY MANUFACTURER
 */
const getPOByManufacture = catchAsync(async (req, res) => {
  const { manufacturerEmail } = req.params;

  if (!manufacturerEmail) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'manufacturerEmail is required');
  }

  const data = await cpToManufacturerPOService.getPOByManufacture(manufacturerEmail);

  res.status(httpStatus.OK).send({
    status: 'success',
    results: data.length,
    data,
  });
});

/**
 * 🔥 UPDATE ITEMS (NESTED)
 */
const updatePOItems = catchAsync(async (req, res) => {
  const { poId } = req.params;

  if (!poId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'poId is required');
  }

  const data = await cpToManufacturerPOService.updatePOItems(poId, req.body);

  res.status(httpStatus.OK).send({
    status: 'success',
    message: 'PO items updated successfully',
    data,
  });
});

module.exports = {
  createPO,
  getPOList,
  getPO,
  updateStatus,
  deletePO,
  getAllPO,
  getPOByManufacture,
  updatePOItems,
};
