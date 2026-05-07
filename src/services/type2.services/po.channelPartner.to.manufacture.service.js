const ApiError = require('../../utils/ApiError');
const {
  CpCart,
  PoCpToManufacturer,
  Manufacture,
  ChannelPartner,
  ChannelPartnerCustomer,
  PoCounterCpToMfg,
} = require('../../models');

/**
 * 🔥 GENERATE PO NUMBER
 */
const generatePONumber = async () => {
  const counter = await PoCounterCpToMfg.findOneAndUpdate(
    { key: 'PO_NUMBER' },
    { $inc: { sequence: 1 } },
    { new: true, upsert: true }
  );

  return counter.sequence;
};

/**
 * 🔥 CREATE PO
 */
const createPOFromCart = async (cartId) => {
  const cart = await CpCart.findById(cartId);
  if (!cart) throw new ApiError(404, 'Cart not found');

  const cp = await ChannelPartner.findOne({ email: cart.cpEmail });
  const shopkeeper = await ChannelPartnerCustomer.findOne({ email: cart.shopkeeperEmail });

  const poList = [];

  for (const m of cart.manufacturers) {
    const manufacturer = await Manufacture.findOne({ email: m.manufacturerEmail });

    const poNumber = await generatePONumber();

    const po = await PoCpToManufacturer.create({
      poNumber,
      cartId: cart._id,

      cp,
      shopkeeper,
      manufacturer,

      manufacturerEmail: manufacturer.email,
      cpEmail: cp.email,
      shopKeeperEmail: shopkeeper.email,

      items: m.items,
      totalQty: m.totalQty,
      totalAmount: m.totalAmount,
      discount: m.discount,
      finalAmount: m.finalAmount,
    });

    poList.push(po);
  }

  cart.status = 'confirmed';
  await cart.save();

  return poList;
};

/**
 * EXISTING
 */
const getPOList = async (filter) => {
  return PoCpToManufacturer.find(filter).sort({ createdAt: -1 });
};

const getPOById = async (id) => {
  const po = await PoCpToManufacturer.findById(id);
  if (!po) throw new ApiError(404, 'PO not found');
  return po;
};

const updatePOStatus = async (id, status) => {
  const po = await PoCpToManufacturer.findById(id);
  if (!po) throw new ApiError(404, 'PO not found');

  po.statusAll = status;
  await po.save();

  return po;
};

const deletePO = async (id) => {
  const po = await PoCpToManufacturer.findById(id);
  if (!po) throw new ApiError(404, 'PO not found');

  po.isDeleted = true;
  await po.save();
};

/**
 * 🔥 NEW
 */
const getAllPO = async (filter, options) => {
  return PoCpToManufacturer.paginate(filter, options);
};

const getPOByManufacture = async (manufacturerEmail) => {
  return PoCpToManufacturer.find({ manufacturerEmail }).sort({ createdAt: -1 });
};

const updatePOItems = async (poId, body) => {
  const po = await PoCpToManufacturer.findById(poId);
  if (!po) throw new ApiError(404, 'PO not found');

  if (Array.isArray(body.items)) {
    body.items.forEach((incoming) => {
      const existing = po.items.id(incoming._id);
      if (existing) Object.assign(existing, incoming);
    });
  }

  await po.save();
  return po;
};
const createSingleManufacturerPO = async (body) => {
  const {
    cartId,
    manufacturerEmail,
    poNumber,
    items,
    ...rest // 🔥 everything else allowed
  } = body;

  if (!cartId || !manufacturerEmail) {
    throw new ApiError(400, 'cartId and manufacturerEmail are required');
  }

  const cart = await CpCart.findById(cartId);
  if (!cart) throw new ApiError(404, 'Cart not found');

  const m = cart.manufacturers.find(
    (m) => m.manufacturerEmail === manufacturerEmail
  );

  if (!m) {
    throw new ApiError(404, 'Manufacturer not found in cart');
  }

  // 🔹 USERS
  const cp = await ChannelPartner.findOne({ email: cart.cpEmail });
  const shopkeeper = await ChannelPartnerCustomer.findOne({
    email: cart.shopkeeperEmail,
  });
  const manufacturer = await Manufacture.findOne({ email: manufacturerEmail });

  if (!cp) throw new ApiError(404, 'Channel Partner not found');
  if (!shopkeeper) throw new ApiError(404, 'Shopkeeper not found');
  if (!manufacturer) throw new ApiError(404, 'Manufacturer not found');

  // 🔥 AUTO PO NUMBER
  let finalPoNumber = poNumber;

  if (!finalPoNumber) {
    finalPoNumber = await generatePONumber();
  }

  // 🔥 USE ITEMS FROM BODY OR FALLBACK TO CART
  const finalItems = Array.isArray(items) && items.length > 0 ? items : m.items;

  if (!finalItems || finalItems.length === 0) {
    throw new ApiError(400, 'Items are required');
  }

  // 🔥 CREATE PO
  const po = await PoCpToManufacturer.create({
    poNumber: finalPoNumber,
    cartId: cart._id,

    cp,
    shopkeeper,
    manufacturer,

    manufacturerEmail,
    cpEmail: cp.email,
    shopKeeperEmail: shopkeeper.email,

    items: finalItems,

    // 🔥 allow override OR fallback
    totalQty: rest.totalQty ?? m.totalQty,
    totalAmount: rest.totalAmount ?? m.totalAmount,
    discount: rest.discount ?? m.discount,
    finalAmount: rest.finalAmount ?? m.finalAmount,

    // 🔥 FULL FLEXIBILITY
    ...rest,
  });

  /**
   * 🔥 REMOVE MANUFACTURER FROM CART
   */
  cart.manufacturers = cart.manufacturers.filter(
    (x) => x.manufacturerEmail !== manufacturerEmail
  );

  if (cart.manufacturers.length === 0) {
    cart.status = 'confirmed';
  }

  cart.markModified('manufacturers');
  await cart.save();

  return po;
};

module.exports = {
  createPOFromCart,
  getPOList,
  getPOById,
  updatePOStatus,
  deletePO,

  // new
  getAllPO,
  getPOByManufacture,
  updatePOItems,
  createSingleManufacturerPO,
};
