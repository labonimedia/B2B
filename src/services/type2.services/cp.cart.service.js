const httpStatus = require('http-status');
const { CpCart, Manufacture } = require('../../models');
const ApiError = require('../../utils/ApiError');

/**
 * ADD TO CART
 */
const addToCart = async (body) => {
  const { cpEmail, shopkeeperEmail, productBy, set } = body;

  let cart = await CpCart.findOne({ cpEmail, shopkeeperEmail, productBy });

  if (cart) {
    set.forEach((newItem) => {
      const existing = cart.set.find(
        (i) => i.designNumber === newItem.designNumber && i.colour === newItem.colour && i.size === newItem.size
      );

      if (existing) {
        existing.quantity += newItem.quantity;
      } else {
        cart.set.push(newItem);
      }
    });

    await cart.save();
  } else {
    cart = await CpCart.create(body);
  }

  return cart;
};

/**
 * GET CART (Grouped by Manufacturer)
 */
const getCart = async (cpEmail, shopkeeperEmail) => {
  const carts = await CpCart.find({ cpEmail, shopkeeperEmail });

  if (!carts.length) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart empty');
  }

  const manufacturers = await Manufacture.find({
    email: { $in: carts.map((c) => c.productBy) },
  });

  const map = new Map(manufacturers.map((m) => [m.email, m.fullName]));

  return carts.map((c) => ({
    manufacturer: c.productBy,
    manufacturerName: map.get(c.productBy),
    items: c.set,
    cartId: c._id,
  }));
};

/**
 * UPDATE ITEM
 */
const updateSetItem = async (cartId, setId, body) => {
  const cart = await CpCart.findById(cartId);
  if (!cart) throw new ApiError(404, 'Cart not found');

  const item = cart.set.id(setId);
  if (!item) throw new ApiError(404, 'Item not found');

  Object.assign(item, body);
  await cart.save();

  return cart;
};

/**
 * DELETE ITEM
 */
const deleteItem = async (cartId, setId) => {
  const cart = await CpCart.findById(cartId);
  if (!cart) throw new ApiError(404, 'Cart not found');

  cart.set = cart.set.filter((i) => i._id.toString() !== setId);
  await cart.save();

  return cart;
};

module.exports = {
  addToCart,
  getCart,
  updateSetItem,
  deleteItem,
};
