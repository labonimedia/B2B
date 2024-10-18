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

// const searchWholesalerProducts = catchAsync(async (req, res) => {
//   const filter = {};
//   const options = {};
//   // Extract filter parameters from req.body
//   if (req.body.brand) {
//     filter.brand = req.body.brand;
//   }
//   // Extract pagination options from req.query
//   if (req.query.sortBy) {
//     options.sortBy = req.query.sortBy;
//   }
//   if (req.query.limit) {
//     options.limit = parseInt(req.query.limit, 10);
//   }
//   if (req.query.page) {
//     options.page = parseInt(req.query.page, 10);
//   }
//   const result = await wholesalerProductsService.searchWholesalerProductsByBrand(filter, options);
//   res.status(httpStatus.OK).send(result);
// });

// const searchWholesalerProducts = catchAsync(async (req, res) => {
//   const filter = {};
//   const options = {};

//   // If the brand is provided, use regex to perform partial matching
//   if (req.body.brand) {
//     filter.brand = { $regex: req.body.brand, $options: 'i' }; // 'i' for case-insensitive
//   }

//   // Handle pagination options
//   if (req.query.sortBy) {
//     options.sortBy = req.query.sortBy;
//   }
//   if (req.query.limit) {
//     options.limit = parseInt(req.query.limit, 10);
//   }
//   if (req.query.page) {
//     options.page = parseInt(req.query.page, 10);
//   }

//   const result = await wholesalerProductsService.searchWholesalerProductsByBrand(filter, options);
//   res.status(httpStatus.OK).send(result);
// });
const searchWholesalerProducts = catchAsync(async (req, res) => {
  const filter = {};
  const options = {};

  // If the brand is provided, use regex to perform partial matching
  if (req.body.brand) {
    filter.brand = { $regex: req.body.brand, $options: 'i' }; // 'i' for case-insensitive
  }

  // Handle pagination options
  if (req.query.sortBy) {
    options.sortBy = req.query.sortBy;
  }
  if (req.query.limit) {
    options.limit = parseInt(req.query.limit, 10);
  }
  if (req.query.page) {
    options.page = parseInt(req.query.page, 10);
  }

  // Extract requestByEmail from body
  const { requestByEmail } = req.body;

  // Pass filter, options, and requestByEmail to the service
  const result = await wholesalerProductsService.searchWholesalerProductsByBrand(filter, options, requestByEmail);
  res.status(httpStatus.OK).send(result);
});

const filterProducts = async (req, res) => {
  try {
    const filters = req.body; // Filters will be sent in the request body
    const options = {
      limit: req.query.limit || 10, // Pagination options
      page: req.query.page || 1,
    };

    const data = await wholesalerProductsService.filterWholesalerProducts(filters, options);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUniqueBrands = catchAsync(async (req, res) => {
  try {
    const { wholesalerEmail } = req.params;
    const uniqueBrands = await wholesalerProductsService.getUniqueBrandsByEmail(wholesalerEmail);
    res.status(200).json({ uniqueBrands });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

const filterWholesalerProducts = catchAsync(async (req, res) => {
  const filters = req.body; // Filters will be passed in the request body
  const page = parseInt(req.query.page, 10) || 1; // Default page is 1
  const limit = parseInt(req.query.limit, 10) || 10; // Default limit is 10

  const products = await wholesalerProductsService.productTypeFilter(filters, page, limit);

  res.status(200).json({
    success: true,
    page,
    limit,
    products,
  });
});

module.exports = {
  fileupload,
  getProductByWholealer,
  createProduct,
  queryProduct,
  searchProducts,
  getProductById,
  updateProductById,
  deleteProductById,
  searchWholesalerProducts,
  filterProducts,
  getUniqueBrands,
  filterWholesalerProducts,
};
