const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { productService } = require('../services');

const fileupload = catchAsync(async (req, res) => {
    const user = await productService.fileupload(req, req.params.id);
    res.status(httpStatus.CREATED).send(user);
  });

const createProduct = catchAsync(async (req, res) => {
  const user = await productService.createProduct(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryProduct = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await productService.queryProduct(filter, options);
  res.send(result);
});

const getProductById = catchAsync(async (req, res) => {
  const user = await productService.getProductById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  res.send(user);
});

const updateProductById = catchAsync(async (req, res) => {
  const user = await productService.updateProductById(req.params.id, req.body);
  res.send(user);
});

const deleteProductById = catchAsync(async (req, res) => {
  await productService.deleteProductById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    fileupload,
  createProduct,
  queryProduct,
  getProductById,
  updateProductById,
  deleteProductById,
};
