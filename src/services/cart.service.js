const { Product,Cart } = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

const addToCart = async (email, productBy, productId, quantity) => {
    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
    }
  
    let cart = await Cart.findOne({ email, productBy });
    if (!cart) {
      cart = new Cart({ email, productBy, products: [] });
    }
  
    const existingProductIndex = cart.products.findIndex((p) => p.productId.toString() === productId);
    if (existingProductIndex >= 0) {
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      cart.products.push({ productId, quantity });
    }
  
    return await cart.save();
  };
  


const getCartByEmail = async (email) => {
    const cart = await Cart.findOne({ email }).populate('products.productId');
    if (!cart) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
    }
    const groupedCart = cart.products.reduce((acc, item) => {
      const productBy = item.productId.productBy;
      if (!acc[productBy]) {
        acc[productBy] = { email: productBy, products: [] };
      }
      acc[productBy].products.push({
        quantity: item.quantity,
        _id: item._id,
        productId: {
          selectedOccasion: item.productId.selectedOccasion,
          selectedlifeStyle: item.productId.selectedlifeStyle,
          specialFeature: item.productId.specialFeature,
          designNumber: item.productId.designNumber,
          brand: item.productId.brand,
          productType: item.productId.productType,
          gender: item.productId.gender,
          clothing: item.productId.clothing,
          subCategory: item.productId.subCategory,
          productTitle: item.productId.productTitle,
          productDescription: item.productId.productDescription,
          material: item.productId.material,
          materialvariety: item.productId.materialvariety,
          fabricPattern: item.productId.fabricPattern,
          fitStyle: item.productId.fitStyle,
          neckStyle: item.productId.neckStyle,
          closureType: item.productId.closureType,
          pocketDescription: item.productId.pocketDescription,
          sleeveCuffStyle: item.productId.sleeveCuffStyle,
          sleeveLength: item.productId.sleeveLength,
          careInstructions: item.productId.careInstructions,
          sizes: item.productId.sizes,
          ProductDeimension: item.productId.ProductDeimension,
          netWeight: item.productId.netWeight,
          MRP: item.productId.MRP,
          quantity: item.productId.quantity,
          dateOfManufacture: item.productId.dateOfManufacture,
          dateOfListing: item.productId.dateOfListing,
          productBy: item.productId.productBy,
          colourCollections: item.productId.colourCollections,
          id: item.productId._id,
        },
      });
      return acc;
    }, {});
  
    // Convert the object to an array of objects
    const formattedCart = Object.values(groupedCart);
  
    return formattedCart;
  };
  //   // Group products by productBy
  //   const groupedCart = cart.products.reduce((acc, item) => {
  //     const productBy = item.productId.productBy;
  //     if (!acc[productBy]) {
  //       acc[productBy] = [];
  //     }
  //     acc[productBy].push(item);
  //     return acc;
  //   }, {});
  
  //   return groupedCart;
  // };
  

/**
 * Get Cart by id
 * @param {ObjectId} id
 * @returns {Promise<Cart>}
 */
const getCartById = async (id) => {
  return Cart.findById(id);
};

/**
 * Update Cart by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<Cart>}
 */
const updateCartById = async (id, updateBody) => {
  const user = await getCartById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<ClosureType>}
 */
const deleteCartById = async (id) => {
  const user = await getCartById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }
  await user.remove();
  return user;
};
  module.exports = {
    addToCart,
    getCartByEmail,
    getCartById,
    updateCartById,
    deleteCartById,
  };
  