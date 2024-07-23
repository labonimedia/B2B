const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { brandService } = require('../services');

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
  const filter = pick(req.query, ['name']);
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

const updateBrandById = catchAsync(async (req, res) => {
  if (req.body.brandLogo && req.body.brandLogo.length > 0) {
    const brandLogoUrl = req.body.brandLogo[0];
    const brandLogoPath = new URL(brandLogoUrl).pathname;
    req.body.brandLogo = brandLogoPath;
  }
  const user = await brandService.updateBrandById(req.params.id, req.body);
  res.send(user);
});

const deleteBrandById = catchAsync(async (req, res) => {
  await brandService.deleteBrandById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createBrand,
  queryBrand,
  getBrandById,
  updateBrandById,
  deleteBrandById,
};
