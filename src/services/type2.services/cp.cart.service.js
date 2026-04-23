const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const { CpCart } = require('../../models');

/**
 * ADD TO CART
 */
const addToCart = async (body) => {
  const { cpEmail, shopkeeperEmail, manufacturerEmail, manufacturerName, item } = body;

  let cart = await CpCart.findOne({ cpEmail, shopkeeperEmail, isDeleted: false });

  // 👉 create cart if not exist
  if (!cart) {
    cart = await CpCart.create({
      cpEmail,
      shopkeeperEmail,
      manufacturers: [],
    });
  }

  // 👉 find manufacturer
  const manufacturer = cart.manufacturers.find((m) => m.manufacturerEmail === manufacturerEmail);

  if (manufacturer) {
    // 👉 check existing item
    const existing = manufacturer.items.find(
      (i) => i.designNumber === item.designNumber && i.colour === item.colour && i.size === item.size
    );

    if (existing) {
      existing.quantity += item.quantity;
    } else {
      manufacturer.items.push(item);
    }
  } else {
    // 👉 new manufacturer entry
    cart.manufacturers.push({
      manufacturerEmail,
      manufacturerName,
      items: [item],
    });
  }

  await cart.save();
  return cart;
};

/**
 * 🔥 GET CART (Grouped by Manufacturer)
 */
const getCart = async (cpEmail, shopkeeperEmail) => {
  const cart = await CpCart.findOne({ cpEmail, shopkeeperEmail, isDeleted: false });

  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart empty');
  }

  return cart;
};

/**
 * 🔥 UPDATE ITEM
 */
const updateItem = async (body) => {
  const { cartId, manufacturerEmail, itemId, quantity } = body;

  const cart = await CpCart.findById(cartId);
  if (!cart) throw new ApiError(404, 'Cart not found');

  const manufacturer = cart.manufacturers.find((m) => m.manufacturerEmail === manufacturerEmail);
  if (!manufacturer) throw new ApiError(404, 'Manufacturer not found');

  const item = manufacturer.items.id(itemId);
  if (!item) throw new ApiError(404, 'Item not found');

  item.quantity = quantity;

  await cart.save();
  return cart;
};

/**
 * 🔥 DELETE ITEM
 */
const deleteItem = async (body) => {
  const { cartId, manufacturerEmail, itemId } = body;

  const cart = await CpCart.findById(cartId);
  if (!cart) throw new ApiError(404, 'Cart not found');

  const manufacturer = cart.manufacturers.find((m) => m.manufacturerEmail === manufacturerEmail);
  if (!manufacturer) throw new ApiError(404, 'Manufacturer not found');

  manufacturer.items = manufacturer.items.filter((i) => i._id.toString() !== itemId);

  // 👉 remove manufacturer if empty
  if (manufacturer.items.length === 0) {
    cart.manufacturers = cart.manufacturers.filter((m) => m.manufacturerEmail !== manufacturerEmail);
  }

  await cart.save();
  return cart;
};

/**
 * 🔥 APPLY DISCOUNT (MANUFACTURER LEVEL)
 */
const applyDiscount = async (body) => {
  const { cartId, manufacturerEmail, discount, discountType } = body;

  const cart = await CpCart.findById(cartId);
  if (!cart) throw new ApiError(404, 'Cart not found');

  const manufacturer = cart.manufacturers.find((m) => m.manufacturerEmail === manufacturerEmail);
  if (!manufacturer) throw new ApiError(404, 'Manufacturer not found');

  manufacturer.discount = discount || 0;
  manufacturer.discountType = discountType || 'flat';

  await cart.save();
  return cart;
};

/**
 * 🔥 APPLY CART LEVEL DISCOUNT
 */
const applyCartDiscount = async (body) => {
  const { cartId, discount } = body;

  const cart = await CpCart.findById(cartId);
  if (!cart) throw new ApiError(404, 'Cart not found');

  cart.cartDiscount = discount || 0;

  await cart.save();
  return cart;
};

/**
 * 🔥 CONFIRM CART (PO READY)
 */
const confirmCart = async (cartId) => {
  const cart = await CpCart.findById(cartId);
  if (!cart) throw new ApiError(404, 'Cart not found');

  if (!cart.manufacturers.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cart is empty');
  }

  cart.status = 'confirmed';
  cart.confirmedAt = new Date();

  await cart.save();

  return cart;
};

module.exports = {
  addToCart,
  getCart,
  updateItem,
  deleteItem,
  applyDiscount,
  applyCartDiscount,
  confirmCart,
};
