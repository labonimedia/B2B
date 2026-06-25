const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { paymentService } = require('../services');

const createOrder = catchAsync(async (req, res) => {
  const order = await paymentService.createOrder(
    req.body,
    req.user
  );

  res.status(httpStatus.CREATED).send(order);
});

const verifyPayment = catchAsync(async (req, res) => {
  const response =
    await paymentService.verifyPayment(req.body);

  res.send(response);
});

module.exports = {
  createOrder,
  verifyPayment,
};