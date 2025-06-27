const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const { poRetailerToWholesalerService } = require('../../services');
const pick = require('../../utils/pick');

const createRetailerPurchaseOrderType2 = catchAsync(async (req, res) => {
  const createdPO = await poRetailerToWholesalerService.createPurchaseOrderRetailerType2(req.body);
  res.status(httpStatus.CREATED).send(createdPO);
});

const getAllPoRetailerToWholesaler = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['productBy', 'wholesalerEmail', 'email']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const RetailerPurchaseOrderType2Items = await poRetailerToWholesalerService.getAllPoRetailerToWholesaler(
      filter,
      options
    );
    res.status(httpStatus.OK).send(RetailerPurchaseOrderType2Items);
  });

const getRetailerPOByWholesaler = catchAsync(async (req, res) => {
  const { wholesalerEmail } = req.params;
  const pos = await poRetailerToWholesalerService.getRetailerPOByWholesaler(wholesalerEmail);
  res.status(httpStatus.OK).send(pos);
});

const updateRetailerPOSetItem = catchAsync(async (req, res) => {
  const { poId } = req.params;
  const updatedPO = await poRetailerToWholesalerService.updateRetailerPOSetItem(poId, req.body);
  res.status(httpStatus.OK).send(updatedPO);
});

const getSinglePoRetailerToWholesaler = catchAsync(async (req, res) => {
  const cartItem = await poRetailerToWholesalerService.getSinglePoRetailerToWholesaler(req.params.id);
  if (!cartItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Single Retailer To Wholesaler PO not found');
  }
  res.status(httpStatus.OK).send(cartItem);
});

const updateSinglePoRetailerToWholesaler = catchAsync(async (req, res) => {
    const updatedCartItem = await poRetailerToWholesalerService.updateSinglePoRetailerToWholesaler(
      req.params.id,
      req.body
    );
    res.status(httpStatus.OK).send(updatedCartItem);
  });
  
const deleteSinglePoRetailerToWholesaler = catchAsync(async (req, res) => {
  await poRetailerToWholesalerService.deleteSinglePoRetailerToWholesaler(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

const getPOsByMultipleIds = catchAsync(async (req, res) => {
  const { ids } = req.body;
  const result = await poRetailerToWholesalerService.getPOsByIds(ids);
  res.status(httpStatus.OK).send(result);
});

module.exports = {
  createRetailerPurchaseOrderType2,
  getRetailerPOByWholesaler,
  updateRetailerPOSetItem,
  getAllPoRetailerToWholesaler,
  deleteSinglePoRetailerToWholesaler,
  updateSinglePoRetailerToWholesaler,
  getSinglePoRetailerToWholesaler,
  getPOsByMultipleIds,
};
