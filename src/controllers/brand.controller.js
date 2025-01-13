const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { brandService } = require('../services');
const { deleteFile } = require('../utils/upload');

const createBrand = catchAsync(async (req, res) => {
  if (!req.body.brandLogo || req.body.brandLogo.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No brand logo provided');
  }
  const brandLogoUrl = req.body.brandLogo[0];
  const brandLogoPath = new URL(brandLogoUrl).pathname;

  req.body.brandLogo = brandLogoPath;
  const user = await brandService.createBrand(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryBrand = catchAsync(async (req, res) => {
  const { name, brandOwner } = req.query;
  let filter = {};
  // eslint-disable-next-line security/detect-non-literal-regexp
  if (name) filter = { name: new RegExp(name, 'i') };
  if (brandOwner) filter = { brandOwner };
  // const filter = pick(req.query, ['name', 'brandOwner']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await brandService.queryBrand(filter, options);
  res.send(result);
});

const getBrandById = catchAsync(async (req, res) => {
  const user = await brandService.getBrandById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Care Instruction not found');
  }
  res.send(user);
});

const getBrandByEmail = catchAsync(async (req, res) => {
  const user = await brandService.getBrandByEmail(req.params.email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Brand Not Found');
  }
  res.send(user);
});

const getBrandByEmailAndVisibility = catchAsync(async (req, res) => {
  const { email, visibility } = req.params;
  const user = await brandService.getBrandByEmailAndVisibility(email, visibility);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Brand Not Found');
  }
  res.send(user);
});

const updateBrandById = catchAsync(async (req, res) => {
  const brand = await brandService.getBrandById(req.params.id);
  if (!brand) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Brand not found');
  }

  if (req.body.brandLogo && req.body.brandLogo.length > 0) {
    // Delete old brand logo
    if (brand.brandLogo) {
      await deleteFile(brand.brandLogo);
    }
    // Upload new brand logo
    const brandLogoUrl = req.body.brandLogo[0];
    const brandLogoPath = new URL(brandLogoUrl).pathname;
    req.body.brandLogo = brandLogoPath;
  }
  const user = await brandService.updateBrandById(req.params.id, req.body);
  res.send(user);
});

const updatevisibility = catchAsync(async (req, res) => {
  const user = await brandService.updateBrandById(req.params.id, req.body);
  res.send(user);
});

const deleteBrandById = catchAsync(async (req, res) => {
  await brandService.deleteBrandById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

// const searchBrandAndOwnerDetails = catchAsync(async (req, res) => {
//   const { brandName } = req.body;
//   if (!brandName) {
//     return res.status(httpStatus.BAD_REQUEST).send({ message: 'Brand name is required' });
//   }
//   const data = await brandService.searchBrandAndOwnerDetails(brandName);
//   res.status(httpStatus.OK).send(data);
// });
const searchBrandAndOwnerDetails = catchAsync(async (req, res) => {
  const { brandName, requestByEmail } = req.body;

  if (!brandName) {
    return res.status(httpStatus.BAD_REQUEST).send({ message: 'Brand name is required' });
  }

  const data = await brandService.searchBrandAndOwnerDetails(brandName, requestByEmail);
  res.status(httpStatus.OK).send(data);
});

const getBrandsAndWholesalers = catchAsync(async (req, res) => {
  const { brandName, requestByEmail } = req.body;
  if (!brandName) {
    return res.status(httpStatus.BAD_REQUEST).send({ message: 'Brand name is required' });
  }
  const data = await brandService.getBrandsAndWholesalers(brandName, requestByEmail);
  res.status(httpStatus.OK).send(data);
});

module.exports = {
  createBrand,
  queryBrand,
  getBrandById,
  getBrandsAndWholesalers,
  updateBrandById,
  deleteBrandById,
  searchBrandAndOwnerDetails,
  getBrandByEmail,
  getBrandByEmailAndVisibility,
  updatevisibility,
};
