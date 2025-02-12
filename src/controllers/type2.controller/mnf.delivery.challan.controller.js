const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { mnfDeliveryChallanService } = require('../../services');

const createMnfDeliveryChallan = catchAsync(async (req, res) => {
  const createdItems = await mnfDeliveryChallanService.createMnfDeliveryChallan(req.body);
  res.status(httpStatus.CREATED).send(createdItems);
});

const queryMnfDeliveryChallan = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['productBy', 'email', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const PurchaseOrderType2Items = await mnfDeliveryChallanService.queryMnfDeliveryChallan(filter, options);
  res.status(httpStatus.OK).send(PurchaseOrderType2Items);
});

const getMnfDeliveryChallanById = catchAsync(async (req, res) => {
  const cartItem = await mnfDeliveryChallanService.getMnfDeliveryChallanById(req.params.id);
  if (!cartItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }
  res.status(httpStatus.OK).send(cartItem);
});

const genratedeChallNO = catchAsync(async (req, res) => {
  const cartItem = await mnfDeliveryChallanService.genratedeChallNO(req.params.manufacturerEmail);
  if (!cartItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }
  res.status(httpStatus.OK).send(cartItem);
});

const updateMnfDeliveryChallanById = catchAsync(async (req, res) => {
  const updatedCartItem = await mnfDeliveryChallanService.updateMnfDeliveryChallanById(req.params.id, req.body);
  res.status(httpStatus.OK).send(updatedCartItem);
});

const deleteMnfDeliveryChallanById = catchAsync(async (req, res) => {
  await mnfDeliveryChallanService.deleteMnfDeliveryChallanById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

const getDeliveryChallanByManufactureEmail = async (req, res) => {
  const { manufacturerEmail, page, limit, sortBy, filter } = req.query;
  const options = {
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    sortBy: sortBy || '-createdAt', // default sorting by newest first
  };
  const data = await mnfDeliveryChallanService.getDeliveryChallanByManufactureEmail(manufacturerEmail, filter, options);
  res.status(200).send({ success: true, data });
};

const processRetailerOrders = catchAsync(async (req, res) => {
  const cartItem = await mnfDeliveryChallanService.processRetailerOrders(req.query.deliveryChallanId);
  if (!cartItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Delivery challan  not found');
  }
  res.status(httpStatus.OK).send(cartItem);
});
module.exports = {
  createMnfDeliveryChallan,
  queryMnfDeliveryChallan,
  getMnfDeliveryChallanById,
  genratedeChallNO,
  updateMnfDeliveryChallanById,
  deleteMnfDeliveryChallanById,
  getDeliveryChallanByManufactureEmail,
  processRetailerOrders,
};
