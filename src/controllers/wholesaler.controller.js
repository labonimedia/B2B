const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { wholesalerService } = require('../services');

const fileupload = catchAsync(async (req, res) => {
  const user = await wholesalerService.fileupload(req, req.params.id);
  res.status(httpStatus.CREATED).send(user);
});

const createWholesaler = catchAsync(async (req, res) => {
  if (!req.body.logo || req.body.logo.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Wholeseller logo not provided');
  }
  const brandLogoUrl = req.body.logo[0];
  const brandLogoPath = new URL(brandLogoUrl).pathname;
  req.body.logo = brandLogoPath;
  const user = await wholesalerService.createWholesaler(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryWholesaler = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await wholesalerService.queryWholesaler(filter, options);
  res.send(result);
});

const getWholesalerById = catchAsync(async (req, res) => {
  const user = await wholesalerService.getUserByEmail(req.params.email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Wholesaler not found');
  }
  res.send(user);
});

const updateWholesalerById = catchAsync(async (req, res) => {
  const user = await wholesalerService.updateWholesalerById(req.params.email, req.body);
  res.send(user);
});

const deleteWholesalerById = catchAsync(async (req, res) => {
  await wholesalerService.deleteWholesalerById(req.params.email);
  res.status(httpStatus.NO_CONTENT).send();
});

// const getManufactureList = catchAsync(async (req, res) => {
//   const { email } = req.params;
//   const user = await wholesalerService.getUser(email);
//   if (!user) {
//     return res.status(httpStatus.NOT_FOUND).send({ message: 'User not found' });
//   }
//   const refByEmail = user.refByEmail || [];
//   const refUsers = await wholesalerService.getUsersByEmails(refByEmail);
//   res.status(httpStatus.OK).send(refUsers);
// });

const getManufactureList = catchAsync(async (req, res) => {
  const { email } = req.params;
  const options = pick(req.query, ['limit', 'page']);
  const user = await wholesalerService.getUser(email);
  if (!user) {
    return res.status(httpStatus.NOT_FOUND).send({ message: 'User not found' });
  }
  const refByEmail = user.refByEmail || [];
  const refUsers = await wholesalerService.getUsersByEmails(refByEmail, options);
  res.status(httpStatus.OK).send(refUsers);
});


const getRetailerByEmail = catchAsync(async (req, res) => {
  const { refByEmail, searchKeywords } = req.query;
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  // Retrieve retailer data from the service
  const user = await wholesalerService.getRetailerByEmail(refByEmail, searchKeywords, options);
  
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Manufacturer not found');
  }
  
  res.send(user);
});

const assignDiscount = catchAsync(async (req, res) => {
  const { wholesalerId } = req.params;
  const { discountGivenBy, discountPercentage } = req.body;
  const wholesaler = await wholesalerService.assignOrUpdateDiscount(wholesalerId, discountGivenBy, discountPercentage);
  res.status(httpStatus.OK).send(wholesaler);
});

const getDiscountByGivenBy = catchAsync(async (req, res) => {
  const { wholesalerId, discountGivenBy } = req.params;
  const discount = await wholesalerService.getDiscountByGivenBy(wholesalerId, discountGivenBy);
  res.status(httpStatus.OK).send(discount);
})
module.exports = {
  createWholesaler,
  queryWholesaler,
  getWholesalerById,
  getRetailerByEmail,
  fileupload,
  updateWholesalerById,
  deleteWholesalerById,
  getManufactureList,
  assignDiscount,
  getDiscountByGivenBy
};
