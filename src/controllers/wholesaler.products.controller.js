const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { wholesalerProductsService } = require('../services');

const fileupload = catchAsync(async (req, res) => {
  const user = await wholesalerProductsService.fileupload(req, req.params.id);
  res.status(httpStatus.CREATED).send(user);
});

const createProduct = catchAsync(async (req, res) => {
  const user = await wholesalerProductsService.createProduct(req.body);
  res.status(httpStatus.CREATED).send(user);
});

// const searchProducts = catchAsync(async (req, res) => {
//   const filter = {};
//   const options = {};

//   // Build the filter object based on the query parameters
//   Object.keys(req.query).forEach((key) => {
//     if (req.query[key]) {
//       filter[key] = req.query[key];
//     }
//   });

//   const products = await wholesalerProductsService.searchProducts(filter, options);
//   res.status(httpStatus.OK).send(products);
// });

const searchProducts = catchAsync(async (req, res) => {
  const filter = {};
  const options = {};

  Object.keys(req.query).forEach((key) => {
    if (req.query[key] && !['sortBy', 'populate', 'limit', 'page'].includes(key)) {
      filter[key] = req.query[key];
    }
  });
  if (req.query.sortBy) {
    options.sortBy = req.query.sortBy;
  }
  if (req.query.populate) {
    options.populate = req.query.populate;
  }
  if (req.query.limit) {
    options.limit = parseInt(req.query.limit, 10);
  }
  if (req.query.page) {
    options.page = parseInt(req.query.page, 10);
  }
  const products = await wholesalerProductsService.searchProducts(filter, options);
  res.status(httpStatus.OK).send(products);
});

const queryProduct = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'status', 'wholesalerEmail']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await wholesalerProductsService.queryProduct(filter, options);
  res.send(result);
});

const getProductById = catchAsync(async (req, res) => {
  const user = await wholesalerProductsService.getProductById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  res.send(user);
});

const getProductByWholealer = catchAsync(async (req, res) => {
  const user = await wholesalerProductsService.getProductByWholealer(req.query.wholesalerEmail);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  res.send(user);
});

const updateProductById = catchAsync(async (req, res) => {
  const user = await wholesalerProductsService.updateProductById(req.params.id, req.body);
  res.send(user);
});

const deleteProductById = catchAsync(async (req, res) => {
  await wholesalerProductsService.deleteProductById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

// // Update
// const updateColorCollection = catchAsync(async (req, res) => {
//   const user = await wholesalerProductsService.updateColorCollection(req, req.query.id);
//   res.status(httpStatus.OK).send(user);
// });

// // Delete
// const deleteColorCollection = catchAsync(async (req, res) => {
//   await wholesalerProductsService.deleteColorCollection(req.query.id, req.query.collectionId);
//   res.status(httpStatus.NO_CONTENT).send();
// });

module.exports = {
  fileupload,
  getProductByWholealer,
  createProduct,
  queryProduct,
  searchProducts,
  getProductById,
  updateProductById,
  deleteProductById,
};
