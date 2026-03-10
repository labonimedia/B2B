const httpStatus = require('http-status');
const { WholesalerCartToManufacturer, Wholesaler, Manufacture, POWholesalerToManufacturer } = require('../../models');
const ApiError = require('../../utils/ApiError');

/**
 * Create or update cart
 */
const createWholesalerCart = async (reqBody) => {
  const { wholesalerEmail, manufacturerEmail, set } = reqBody;

  const existingCart = await WholesalerCartToManufacturer.findOne({
    wholesalerEmail,
    manufacturerEmail,
  });

  if (existingCart) {
    set.forEach((newItem) => {
      const existingItem = existingCart.set.find(
        (item) => item.designNumber === newItem.designNumber && item.colour === newItem.colour && item.size === newItem.size
      );

      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        existingCart.set.push(newItem);
      }
    });

    await existingCart.save();
    return existingCart;
  } else {
    const newCart = await WholesalerCartToManufacturer.create(reqBody);
    return newCart;
  }
};

/**
 * Query cart
 */

// const queryWholesalerCart = async (filter, options) => {
//   const cartItems = await WholesalerCartToManufacturer.paginate(filter, options);

//   if (cartItems.results.length === 0) {
//     return cartItems;
//   }

//   const manufacturerEmails = [...new Set(cartItems.results.map((item) => item.manufacturerEmail))];

//   const manufacturers = await Manufacture.find({
//     email: { $in: manufacturerEmails },
//   }).select('email fullName companyName address state country pinCode mobNumber profileImg GSTIN');

//   const wholesaler = await Wholesaler.findOne({
//     email: filter.wholesalerEmail,
//   }).select('email fullName companyName address state country pinCode mobNumber profileImg GSTIN');

//   const manufacturerMap = manufacturers.reduce((acc, m) => {
//     acc[m.email] = {
//       email: m.email,
//       fullName: m.fullName,
//       companyName: m.companyName,
//       address: m.address,
//       state: m.state,
//       country: m.country,
//       pinCode: m.pinCode,
//       mobNumber: m.mobNumber,
//       profileImg: m.profileImg,
//       GSTIN: m.GSTIN,
//     };
//     return acc;
//   }, {});

//   cartItems.results = cartItems.results.map((item) => ({
//     ...item.toObject(),
//     manufacturer: manufacturerMap[item.manufacturerEmail] || null,
//     wholesaler,
//   }));

//   return cartItems;
// };

const queryWholesalerCart = async (filter, options) => {
  const cartItems = await WholesalerCartToManufacturer.paginate(filter, options);

  if (!cartItems.results || cartItems.results.length === 0) {
    return cartItems;
  }

  // manufacturer emails
  const manufacturerEmails = [...new Set(cartItems.results.map((item) => item.manufacturerEmail))];

  // fetch manufacturers
  const manufacturers = await Manufacture.find({
    email: { $in: manufacturerEmails },
  }).lean();

  // fetch wholesaler
  let wholesaler = null;

  if (filter.wholesalerEmail) {
    wholesaler = await Wholesaler.findOne({
      email: filter.wholesalerEmail,
    }).lean();
  }

  // manufacturer map
  const manufacturerMap = {};

  manufacturers.forEach((m) => {
    manufacturerMap[m.email] = {
      email: m.email,
      fullName: m.fullName,
      companyName: m.companyName,
      address: m.address,
      state: m.state,
      country: m.country,
      pinCode: m.pinCode,
      mobNumber: m.mobNumber,
      profileImg: m.profileImg,
      GSTIN: m.GSTIN,
    };
  });

  // attach manufacturer + wholesaler
  cartItems.results = cartItems.results.map((item) => {
    const cart = item.toObject ? item.toObject() : item;

    return {
      ...cart,
      manufacturer: manufacturerMap[cart.manufacturerEmail] || null,
      wholesaler: wholesaler || null,
    };
  });

  return cartItems;
};

/**
 * Get cart by id
 */
const getCartById = async (id) => {
  const cart = await WholesalerCartToManufacturer.findById(id);

  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }

  return cart;
};

/**
 * Generate PO data from cart
 */
const generatePOFromCart = async (cartId) => {
  const cart = await WholesalerCartToManufacturer.findById(cartId);

  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }

  const wholesaler = await Wholesaler.findOne({
    email: cart.wholesalerEmail,
  }).select('email fullName companyName address state country pinCode mobNumber profileImg GSTIN logo');

  const manufacturer = await Manufacture.findOne({
    email: cart.manufacturerEmail,
  }).select('email fullName companyName address state country pinCode mobNumber profileImg GSTIN logo');

  const lastPO = await POWholesalerToManufacturer.findOne({
    wholesalerEmail: cart.wholesalerEmail,
  })
    .sort({ poNumber: -1 })
    .lean();

  const poNumber = lastPO ? lastPO.poNumber + 1 : 1;

  return {
    ...cart.toObject(),
    poNumber,
    wholesaler,
    manufacturer,
  };
};

/**
 * Get cart by wholesaler
 */
const getCartByWholesaler = async (wholesalerEmail) => {
  return WholesalerCartToManufacturer.find({
    wholesalerEmail,
  }).sort({ createdAt: -1 });
};

/**
 * Update cart
 */
const updateCart = async (cartId, updateBody) => {
  const cart = await getCartById(cartId);

  Object.assign(cart, updateBody);

  await cart.save();

  return cart;
};

/**
 * Delete cart
 */
const deleteCart = async (cartId) => {
  const cart = await getCartById(cartId);

  await cart.remove();

  return cart;
};

/**
 * Delete set item
 */
const deleteCartSetItem = async (cartId, setId) => {
  const cart = await getCartById(cartId);

  const initialLength = cart.set.length;

  cart.set = cart.set.filter((item) => item._id.toString() !== setId);

  if (cart.set.length === initialLength) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Set item not found');
  }

  await cart.save();

  return cart;
};

/**
 * Update set item
 */
const updateSetItem = async (cartId, setId, updateBody) => {
  const cart = await getCartById(cartId);

  const item = cart.set.id(setId);

  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Set item not found');
  }

  Object.keys(updateBody).forEach((key) => {
    item[key] = updateBody[key];
  });

  await cart.save();

  return cart;
};

module.exports = {
  createWholesalerCart,
  queryWholesalerCart,
  generatePOFromCart,
  getCartByWholesaler,
  getCartById,
  updateCart,
  deleteCart,
  deleteCartSetItem,
  updateSetItem,
};
