const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const pick = require('../../utils/pick');
const { poRetailerToManufactureService } = require('../../services');

const createRetailerPurchaseOrderType2 = catchAsync(async (req, res) => {
  const createdPO = await poRetailerToManufactureService.createPurchaseOrderRetailerType2(req.body);
  res.status(httpStatus.CREATED).send(createdPO);
});
const makeToOrderPO = catchAsync(async (req, res) => {
  const createdPO = await poRetailerToManufactureService.makeToOrderPO(req.body);
  res.status(httpStatus.CREATED).send(createdPO);
});
const getAllPoRetailerToManufacture = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['productBy', 'manufacturerEmail', 'email', 'statusAll']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const RetailerPurchaseOrderType2Items = await poRetailerToManufactureService.getAllPoRetailerToManufacture(
    filter,
    options
  );
  res.status(httpStatus.OK).send(RetailerPurchaseOrderType2Items);
});

const getRetailerPOByManufacture = catchAsync(async (req, res) => {
  const { manufacturerEmail } = req.params;
  const pos = await poRetailerToManufactureService.getRetailerPOByManufacture(manufacturerEmail);
  res.status(httpStatus.OK).send(pos);
});
// update PO details such as available quantity so on ... on retailers PO
const updateRetailerPOSetItem = catchAsync(async (req, res) => {
  const { poId } = req.params;
  const updatedPO = await poRetailerToManufactureService.updateRetailerPOSetItem(poId, req.body);
  res.status(httpStatus.OK).send(updatedPO);
});

const getSinglePoRetailerToManufacture = catchAsync(async (req, res) => {
  const cartItem = await poRetailerToManufactureService.getSinglePoRetailerToManufacture(req.params.id);
  if (!cartItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Single Retailer To Manufacture PO not found');
  }
  res.status(httpStatus.OK).send(cartItem);
});

const updateSinglePoRetailerToManufacture = catchAsync(async (req, res) => {
  const updatedCartItem = await poRetailerToManufactureService.updateSinglePoRetailerToManufacture(req.params.id, req.body);
  res.status(httpStatus.OK).send(updatedCartItem);
});

const deleteSinglePoRetailerToManufacture = catchAsync(async (req, res) => {
  await poRetailerToManufactureService.deleteSinglePoRetailerToManufacture(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createRetailerPurchaseOrderType2,
  getRetailerPOByManufacture,
  updateRetailerPOSetItem,
  getAllPoRetailerToManufacture,
  deleteSinglePoRetailerToManufacture,
  updateSinglePoRetailerToManufacture,
  getSinglePoRetailerToManufacture,
  makeToOrderPO,
};
