const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const { CpCart, Manufacture, ChannelPartner, ChannelPartnerCustomer } = require('../../models');

/**
 * QUERY CART
 */
const queryCart = async (filter, options) => {
  const cart = await CpCart.paginate(filter, options);
  return cart;
};

const addToCart = async (body) => {
  const { cpEmail, shopkeeperEmail, manufacturerEmail, manufacturerName, items } = body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Items array is required');
  }

  let cart = await CpCart.findOne({ cpEmail, shopkeeperEmail, isDeleted: false });

  // ✅ Create cart if not exists
  if (!cart) {
    cart = await CpCart.create({
      cpEmail,
      shopkeeperEmail,
      manufacturers: [],
    });
  }

  // ✅ Find manufacturer index
  let manufacturerIndex = cart.manufacturers.findIndex((m) => m.manufacturerEmail === manufacturerEmail);

  // ✅ If NOT found → PUSH then GET reference
  if (manufacturerIndex === -1) {
    cart.manufacturers.push({
      manufacturerEmail,
      manufacturerName,
      items: [],
    });

    manufacturerIndex = cart.manufacturers.length - 1;
  }

  // ✅ ALWAYS get mongoose tracked reference
  const manufacturer = cart.manufacturers[manufacturerIndex];

  /**
   * 🔥 ADD ITEMS SAFELY
   */
  items.forEach((item) => {
    const existingIndex = manufacturer.items.findIndex(
      (i) => i.designNumber === item.designNumber && i.colour === item.colour && i.size === item.size
    );

    if (existingIndex > -1) {
      manufacturer.items[existingIndex].quantity += item.quantity;
    } else {
      manufacturer.items.push({
        ...item,
        total: Number(item.quantity) * Number(item.price),
      });
    }
  });

  /**
   * 🔥 FORCE MONGOOSE TRACKING (IMPORTANT)
   */
  cart.markModified('manufacturers');

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

const previewPO = async (cartId) => {
  const cart = await CpCart.findById(cartId);

  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }

  if (!cart.manufacturers || cart.manufacturers.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cart is empty');
  }

  // 🔹 USERS
  const cp = await ChannelPartner.findOne({ email: cart.cpEmail });
  if (!cp) throw new ApiError(404, 'Channel Partner not found');

  const shopkeeper = await ChannelPartnerCustomer.findOne({
    email: cart.shopkeeperEmail,
  });
  if (!shopkeeper) throw new ApiError(404, 'Shopkeeper not found');

  const previewList = [];

  for (const m of cart.manufacturers) {
    const manufacturer = await Manufacture.findOne({
      email: m.manufacturerEmail,
    });

    if (!manufacturer) {
      throw new ApiError(404, `Manufacturer not found: ${m.manufacturerEmail}`);
    }

    let totalQty = 0;
    let totalAmount = 0;

    /**
     * 🔥 ITEMS TRANSFORM
     */
    const items = m.items.map((item) => {
      const total = Number(item.quantity) * Number(item.price);

      totalQty += Number(item.quantity);
      totalAmount += total;

      return {
        _id: item._id,

        designNumber: item.designNumber,
        colour: item.colour,
        colourName: item.colourName,
        colourImage: item.colourImage,
        size: item.size,

        quantity: item.quantity,
        price: item.price,
        total,

        productType: item.productType,
        gender: item.gender,
        clothing: item.clothing,
        subCategory: item.subCategory,
        hsnCode: item.hsnCode,
        hsnGst: item.hsnGst,
        brandName: item.brandName,

        // lifecycle default
        confirmed: false,
        rejected: false,
        deliveredQty: 0,
        status: 'pending',
      };
    });

    /**
     * 🔥 DISCOUNT LOGIC
     */
    let finalAmount = totalAmount;

    if (m.discount) {
      if (m.discountType === 'percentage') {
        finalAmount = totalAmount - (totalAmount * m.discount) / 100;
      } else {
        finalAmount = totalAmount - m.discount;
      }
    }

    if (finalAmount < 0) finalAmount = 0;

    /**
     * 🔥 FULL PO STRUCTURE
     */
    previewList.push({
      poNumber: `PREVIEW-${Date.now()}`,

      cartId: cart._id,

      cpEmail: cp.email,
      shopKeeperEmail: shopkeeper.email,
      manufacturerEmail: manufacturer.email,

      /**
       * 🔹 CP DETAILS
       */
      cp: {
        email: cp.email,
        fullName: cp.fullName,
        companyName: cp.companyName,
        address: cp.address,
        state: cp.state,
        country: cp.country,
        pinCode: cp.pinCode,
        mobNumber: cp.mobNumber,
        GSTIN: cp.GSTIN,
      },

      /**
       * 🔹 SHOPKEEPER
       */
      shopkeeper: {
        email: shopkeeper.email,
        fullName: shopkeeper.fullName,
        shopName: shopkeeper.shopName,
        address: shopkeeper.address,
        city: shopkeeper.city,
        state: shopkeeper.state,
        pinCode: shopkeeper.pinCode,
        mobNumber: shopkeeper.mobileNumber,
        GSTIN: shopkeeper.GSTIN,
      },

      /**
       * 🔹 MANUFACTURER
       */
      manufacturer: {
        email: manufacturer.email,
        fullName: manufacturer.fullName,
        companyName: manufacturer.companyName,
        address: manufacturer.address,
        state: manufacturer.state,
        country: manufacturer.country,
        pinCode: manufacturer.pinCode,
        mobNumber: manufacturer.mobNumber,
        GSTIN: manufacturer.GSTIN,
      },

      /**
       * 🔥 ITEMS
       */
      items,

      /**
       * 🔹 CALCULATION
       */
      totalQty,
      totalAmount,
      discount: m.discount || 0,
      finalAmount,

      /**
       * 🔹 BANK DETAILS (DEFAULT FROM MANUFACTURER)
       */
      bankDetails: {
        accountHolderName: manufacturer.BankDetails?.accountHolderName || '',
        accountNumber: manufacturer.BankDetails?.accountNumber || '',
        accountType: manufacturer.BankDetails?.accountType || '',
        bankName: manufacturer.BankDetails?.bankName || '',
        branchName: manufacturer.BankDetails?.branch || '',
        ifscCode: manufacturer.BankDetails?.IFSCcode || '',
        swiftCode: manufacturer.BankDetails?.swiftCode || '',
        upiId: manufacturer.BankDetails?.upiId || '',
        bankAddress: manufacturer.BankDetails?.city || '',
      },

      /**
       * 🔹 TRANSPORT (EMPTY DEFAULT)
       */
      transportDetails: {
        transportType: '',
        transporterCompanyName: '',
        vehicleNumber: '',
        contactNumber: '',
        trackingId: '',
        modeOfTransport: 'road',
        dispatchDate: null,
        expectedDeliveryDate: null,
        deliveryDate: null,
        deliveryAddress: shopkeeper.address,
        remarks: '',
      },

      /**
       * 🔹 STATUS
       */
      statusAll: 'preview',

      /**
       * 🔹 TRACKING
       */
      poDate: new Date(),
      acceptedAt: null,
      shippedAt: null,
      deliveredAt: null,

      /**
       * 🔹 NOTES
       */
      manufacturerNote: '',
      cpNote: '',
      shopkeeperNote: '',

      /**
       * 🔹 FLAGS
       */
      isInvoiceGenerated: false,
    });
  }

  return previewList;
};

const deleteManufacturerCart = async (body) => {
  const { cartId, manufacturerEmail } = body;

  if (!cartId || !manufacturerEmail) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'cartId and manufacturerEmail required');
  }

  const cart = await CpCart.findById(cartId);

  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }

  const manufacturerExists = cart.manufacturers.find((m) => m.manufacturerEmail === manufacturerEmail);

  if (!manufacturerExists) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Manufacturer not found in cart');
  }

  // 🔥 REMOVE COMPLETE MANUFACTURER
  cart.manufacturers = cart.manufacturers.filter((m) => m.manufacturerEmail !== manufacturerEmail);

  // 🔥 IMPORTANT: mark modified
  cart.markModified('manufacturers');

  await cart.save();

  return cart;
};

const previewSingleManufacturerPO = async (cartId, manufacturerEmail) => {
  const cart = await CpCart.findById(cartId);

  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }

  const m = cart.manufacturers.find((m) => m.manufacturerEmail === manufacturerEmail);

  if (!m) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Manufacturer not found in cart');
  }

  // 🔹 USERS
  const cp = await ChannelPartner.findOne({ email: cart.cpEmail });
  const shopkeeper = await ChannelPartnerCustomer.findOne({
    email: cart.shopkeeperEmail,
  });
  const manufacturer = await Manufacture.findOne({
    email: manufacturerEmail,
  });

  if (!cp) throw new ApiError(404, 'Channel Partner not found');
  if (!shopkeeper) throw new ApiError(404, 'Shopkeeper not found');
  if (!manufacturer) throw new ApiError(404, 'Manufacturer not found');

  let totalQty = 0;
  let totalAmount = 0;

  const items = m.items.map((item) => {
    const total = item.quantity * item.price;

    totalQty += item.quantity;
    totalAmount += total;

    return {
      ...item.toObject(),
      total,
      confirmed: false,
      rejected: false,
      deliveredQty: 0,
      status: 'pending',
    };
  });

  // 🔥 DISCOUNT
  let finalAmount = totalAmount;

  if (m.discount) {
    if (m.discountType === 'percentage') {
      finalAmount = totalAmount - (totalAmount * m.discount) / 100;
    } else {
      finalAmount = totalAmount - m.discount;
    }
  }

  if (finalAmount < 0) finalAmount = 0;

  return {
    poNumber: `PREVIEW-${Date.now()}`,
    cartId: cart._id,

    cpEmail: cp.email,
    shopKeeperEmail: shopkeeper.email,
    manufacturerEmail: manufacturer.email,

    cp,
    shopkeeper,
    manufacturer,

    items,
    totalQty,
    totalAmount,
    discount: m.discount || 0,
    finalAmount,

    statusAll: 'preview',
    poDate: new Date(),
  };
};

module.exports = {
  addToCart,
  getCart,
  updateItem,
  deleteItem,
  applyDiscount,
  applyCartDiscount,
  confirmCart,
  previewPO,
  queryCart,
  deleteManufacturerCart,
  previewSingleManufacturerPO,
};
