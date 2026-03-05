const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');
const pick = require('../../utils/pick');
const { poWholesalerToManufactureService } = require('../../services');

const createPurchaseOrderWholesalerToManufacturer = catchAsync(async (req, res) => {
  const createdPO = await poWholesalerToManufactureService.createPurchaseOrderWholesalerToManufacturer(req.body);

  res.status(httpStatus.CREATED).send(createdPO);
});

const getAllPOWholesalerToManufacturer = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['wholesalerEmail', 'manufacturerEmail', 'statusAll']);

  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await poWholesalerToManufactureService.getAllPOWholesalerToManufacturer(filter, options);

  res.status(httpStatus.OK).send(result);
});

const getPOWholesalerToManufacturerByWholesaler = catchAsync(async (req, res) => {
  const { wholesalerEmail } = req.params;

  const pos = await poWholesalerToManufactureService.getRetailerPOByWholesaler(wholesalerEmail);

  res.status(httpStatus.OK).send(pos);
});

const updatePOSetItem = catchAsync(async (req, res) => {
  const { poId } = req.params;

  const updatedPO = await poWholesalerToManufactureService.updateRetailerPOSetItem(poId, req.body);

  res.status(httpStatus.OK).send(updatedPO);
});

const getSinglePOWholesalerToManufacturer = catchAsync(async (req, res) => {
  const po = await poWholesalerToManufactureService.getSinglePOWholesalerToManufacturer(req.params.id);

  if (!po) {
    throw new ApiError(httpStatus.NOT_FOUND, 'PO not found');
  }

  res.status(httpStatus.OK).send(po);
});

const updateSinglePOWholesalerToManufacturer = catchAsync(async (req, res) => {
  const updatedPO = await poWholesalerToManufactureService.updateSinglePOWholesalerToManufacturer(req.params.id, req.body);

  res.status(httpStatus.OK).send(updatedPO);
});

const deleteSinglePOWholesalerToManufacturer = catchAsync(async (req, res) => {
  await poWholesalerToManufactureService.deleteSinglePOWholesalerToManufacturer(req.params.id);

  res.status(httpStatus.NO_CONTENT).send();
});

const makeToOrderPO = catchAsync(async (req, res) => {
  const createdPO = await poWholesalerToManufactureService.makeToOrderPO(req.body);

  res.status(httpStatus.CREATED).send(createdPO);
});

const updatePoData = catchAsync(async (req, res) => {
  const updatedPO = await poWholesalerToManufactureService.updatePoData(req.params.poId, req.body);

  res.status(httpStatus.OK).json({
    success: true,
    data: updatedPO,
  });
});

module.exports = {
  createPurchaseOrderWholesalerToManufacturer,
  getPOWholesalerToManufacturerByWholesaler,
  updatePOSetItem,
  getAllPOWholesalerToManufacturer,
  deleteSinglePOWholesalerToManufacturer,
  updateSinglePOWholesalerToManufacturer,
  getSinglePOWholesalerToManufacturer,
  updatePoData,
  makeToOrderPO,
};
