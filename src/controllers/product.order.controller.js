const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { productOrderService } = require('../services');

const createProductOrder = catchAsync(async (req, res) => {
  const user = await productOrderService.createProductOrder(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const queryProductOrder = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'productType', 'gender', 'category', 'subCategory']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await productOrderService.queryProductOrder(filter, options);
  res.send(result);
});

const getProductOrderById = catchAsync(async (req, res) => {
  const user = await productOrderService.getProductOrderById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ProductOrder not found');
  }
  res.send(user);
});

const getProductOrderBySupplyer = catchAsync(async (req, res) => {
    const user = await productOrderService.getProductOrderBySupplyer(req.query.supplierEmail);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'ProductOrder not found');
    }
    res.send(user);
  });

const updateProductOrderById = catchAsync(async (req, res) => {
  const user = await productOrderService.updateProductOrderById(req.params.id, req.body);
  res.send(user);
});

const deleteProductOrderById = catchAsync(async (req, res) => {
  await productOrderService.deleteProductOrderById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createProductOrder,
  queryProductOrder,
  getProductOrderById,
  getProductOrderBySupplyer,
  updateProductOrderById,
  deleteProductOrderById,
};
