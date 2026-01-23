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
  if (!req.body.productBy) {
    return res.status(httpStatus.BAD_REQUEST).send({ message: "'productBy' is required." });
  }
  filter.productBy = req.body.productBy;

  ['brand', 'clothing', 'gender', 'productType', 'subCategory', 'bomFilled'].forEach((key) => {
    if (req.body[key] && req.body[key].trim() !== '') {
      filter[key] = req.body[key].trim();
    }
  });
  if (req.body.sortBy) {
    options.sortBy = req.body.sortBy;
  }
  if (req.body.populate) {
    options.populate = req.body.populate;
  }
  if (req.body.limit) {
    options.limit = parseInt(req.body.limit, 10);
  }
  if (req.body.page) {
    options.page = parseInt(req.body.page, 10);
  }
  const products = await productType2Service.searchProducts(filter, options);
  res.status(httpStatus.OK).send(products);
});

const searchForWSProducts = catchAsync(async (req, res) => {
  const filter = {};
  const options = {};

  Object.keys(req.body).forEach((key) => {
    if (req.body[key] && !['sortBy', 'populate', 'limit', 'page'].includes(key)) {
      filter[key] = req.body[key];
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
  const products = await productType2Service.searchForWSProducts(filter, options, req.query.wholesalerEmail);
  res.status(httpStatus.OK).send(products);
});

const queryProduct = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'status', 'productBy', 'bomFilled']);
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

const updateColorCollection = catchAsync(async (req, res) => {
  const user = await productType2Service.updateColorCollection(req, req.query.id);
  res.status(httpStatus.OK).send(user);
});

const updateProductVideo = catchAsync(async (req, res) => {
  const user = await productType2Service.updateProductVideo(req, req.query.id);
  res.status(httpStatus.OK).send(user);
});

const deleteProductVideo = catchAsync(async (req, res) => {
  const user = await productType2Service.deleteProductVideo(req.query.id, req.query.collectionId);
  res.status(httpStatus.OK).send(user);
});

const updateProductImages = catchAsync(async (req, res) => {
  const user = await productType2Service.updateProductImages(req);
  res.status(httpStatus.OK).send(user);
});

const deleteColorCollection = catchAsync(async (req, res) => {
  await productType2Service.deleteColorCollection(req.query.id, req.query.collectionId);
  res.status(httpStatus.NO_CONTENT).send();
});

const deleteProductImages = catchAsync(async (req, res) => {
  await productType2Service.deleteProductImages(req.query.id, req.query.collectionId);
});

const getFilteredProducts = catchAsync(async (req, res) => {
  const filters = req.body;
  const result = await productType2Service.filterProductsAndFetchManufactureDetails(filters);
  res.status(httpStatus.OK).json(result);
});

const checkProductExistence = catchAsync(async (req, res) => {
  try {
    const { designNumber, brand } = req.body;

    if (!designNumber || !brand) {
      return res.status(400).json({ message: 'designNumber and brand are required.' });
    }

    const productExists = await productType2Service.checkProductExistence(designNumber, brand);

    if (productExists) {
      return res.status(200).json({ message: 'Product exists', product: productExists });
    }
    return res.status(404).json({ message: 'Product does not exist' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
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
  updateProductVideo,
  updateProductImages,
  deleteProductVideo,
  deleteColorCollection,
  getFilteredProducts,
  deleteProductImages,
  checkProductExistence,
};
