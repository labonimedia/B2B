const Cart = require('../models/cart');
const Product = require('../models/product');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

const addToCart = async (productBy, productId, quantity) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  let cart = await Cart.findOne({ productBy });
  if (!cart) {
    cart = new Cart({ productBy, products: [] });
  }

  const existingProductIndex = cart.products.findIndex((p) => p.productId.toString() === productId);
  if (existingProductIndex >= 0) {
    cart.products[existingProductIndex].quantity += quantity;
  } else {
    cart.products.push({ productId, quantity });
  }

  return await cart.save();
};

const getCartByProductBy = async (productBy) => {
    const cart = await Cart.findOne({ productBy }).populate('products.productId');
    if (!cart) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
    }
    return cart;
  };
  
  module.exports = {
    addToCart,
    getCartByProductBy,
  };
  