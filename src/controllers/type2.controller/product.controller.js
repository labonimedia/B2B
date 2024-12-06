const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { productType2Service } = require('../../services');

const fileupload = catchAsync(async (req, res) => {
  const user = await productType2Service.fileupload(req, req.params.id);
  res.status(httpStatus.CREATED).send(user);
});

const createProduct = catchAsync(async (req, res) => {
  const user = await productType2Service.createProduct(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const searchProducts = catchAsync(async (req, res) => {
  const filter = {};
  const options = {};

  // Ensure 'productBy' is mandatory
  if (!req.query.productBy) {
    return res.status(httpStatus.BAD_REQUEST).send({ message: "'productBy' is required." });
  }
  filter.productBy = req.query.productBy;

  // Add optional filters only if they have values
  ['brand', 'clothing', 'gender', 'productType', 'subCategory'].forEach((key) => {
    if (req.query[key] && req.query[key].trim() !== '') {
      filter[key] = req.query[key].trim();
    }
  });

  // Handle pagination and sorting options
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

  // Fetch products based on the filter and options
  const products = await productType2Service.searchProducts(filter, options);
  res.status(httpStatus.OK).send(products);
});




const searchForWSProducts = catchAsync(async (req, res) => {
  const filter = {};
  const options = {};

  // Extract filter parameters from req.body
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] && !['sortBy', 'populate', 'limit', 'page'].includes(key)) {
      filter[key] = req.body[key];
    }
  });

  // Extract pagination and other query options from req.query
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
  // Call the service to search products
  const products = await productType2Service.searchForWSProducts(filter, options, req.query.wholesalerEmail);
  res.status(httpStatus.OK).send(products);
});

const queryProduct = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'status', 'productBy']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await productType2Service.queryProduct(filter, options);
  res.send(result);
});

const getProductById = catchAsync(async (req, res) => {
  const user = await productType2Service.getProductById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  res.send(user);
});

const getProductBydesigneNo = catchAsync(async (req, res) => {
  const { designNumber, productBy } = req.query;
  const user = await productType2Service.getProductBydesigneNo(designNumber, productBy);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  res.send(user);
});

const updateProductById = catchAsync(async (req, res) => {
  const user = await productType2Service.updateProductById(req.params.id, req.body);
  res.send(user);
});

const deleteProductById = catchAsync(async (req, res) => {
  await productType2Service.deleteProductById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

// Update
const updateColorCollection = catchAsync(async (req, res) => {
  const user = await productType2Service.updateColorCollection(req, req.query.id);
  res.status(httpStatus.OK).send(user);
});

// Delete
const deleteColorCollection = catchAsync(async (req, res) => {
  await productType2Service.deleteColorCollection(req.query.id, req.query.collectionId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getFilteredProducts = catchAsync(async (req, res) => {
  const filters = req.body;
  const result = await productType2Service.filterProductsAndFetchManufactureDetails(filters);
  res.status(httpStatus.OK).json(result);
});

module.exports = {
  fileupload,
  createProduct,
  queryProduct,
  searchProducts,
  searchForWSProducts,
  getProductById,
  getProductBydesigneNo,
  updateProductById,
  deleteProductById,
  updateColorCollection,
  deleteColorCollection,
  getFilteredProducts,
};
