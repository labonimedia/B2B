const httpStatus = require('http-status');
const { RtlToMnfCart, User,  Retailer, Manufacture, WishListType2, PORetailerToManufacturer } = require('../../models');
const ApiError = require('../../utils/ApiError');

/**
 * Create multiple RtlToMnfCart items
 * @param {Array<Object>} reqBody - Contains an array of item objects
 * @returns {Promise<Array<RtlToMnfCart>>}
 */

const createCartType2 = async (reqBody) => {
  const { email, productBy, set } = reqBody;

  const existingCart = await RtlToMnfCart.findOne({ email, productBy });

  if (existingCart) {
    // Iterate over each new set item
    set.forEach((newItem) => {
      const existingItem = existingCart.set.find(
        (item) =>
          item.designNumber === newItem.designNumber &&
          item.colour === newItem.colour &&
          item.size === newItem.size
      );

      if (existingItem) {
        // Update quantity if item already exists
        existingItem.quantity += newItem.quantity;
      } else {
        // Push new item if not found
        existingCart.set.push(newItem);
      }
    });

    await existingCart.save();

    if (reqBody.productId) {
      await WishListType2.findOneAndDelete({ productId: reqBody.productId, email });
    }

    return existingCart;
  }

  // Create a new cart if none exists
  const newCart = await RtlToMnfCart.create(reqBody);

  if (reqBody.productId) {
    await WishListType2.findOneAndDelete({ productId: reqBody.productId, email });
  }

  return newCart;
};
/**
 * Query for RtlToMnfCart
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */

const queryCartType2 = async (filter, options) => {
  // Paginate the RtlToMnfCart items
  const cartType2Items = await RtlToMnfCart.paginate(filter, options);
  if (cartType2Items.results.length === 0) {
    return cartType2Items; // Return empty results if no items found
  }

  // Extract unique productBy emails from the paginated results
  const productByEmails = [...new Set(cartType2Items.results.map((item) => item.productBy))];

  // Fetch manufacturer details based on the productBy emails
  const manufacturers = await Manufacture.find({
    email: { $in: productByEmails },
  }).select('email fullName companyName address state country pinCode mobNumber GSTIN');
  let retailer;
  if (filter.email) {
    retailer = await Retailer.findOne({
      email: filter.email,
    }).select('email fullName companyName address state country pinCode mobNumber GSTIN');
  }

  // Create a mapping of email to manufacturer details
  const manufacturerMap = manufacturers.reduce((acc, manufacturer) => {
    acc[manufacturer.email] = {
      email: manufacturer.email,
      fullName: manufacturer.fullName,
      companyName: manufacturer.companyName,
      address: manufacturer.address,
      state: manufacturer.state,
      country: manufacturer.country,
      pinCode: manufacturer.pinCode,
      mobNumber: manufacturer.mobNumber,
      GSTIN: manufacturer.GSTIN,
    };
    return acc;
  }, {});

  // Enrich each item in the results with the manufacturer details
  cartType2Items.results = cartType2Items.results.map((item) => ({
    ...item.toObject(),
    manufacturer: manufacturerMap[item.productBy] || null, // Default to null if not found
    retailer,
  }));

  return cartType2Items;
};

/**
 * Get RtlToMnfCart by id
 * @param {ObjectId} id
 * @returns {Promise<RtlToMnfCart>}
 */
const getCartType2ById = async (id) => {
  return RtlToMnfCart.findById(id);
};

const genratedeChallNO = async (email) => {
  const lastPO = await PORetailerToManufacturer.findOne({ email }).sort({ poNumber: -1 }).lean();
  return (nextdeliveryChallanNumber = lastPO ? lastPO.poNumber + 1 : 1);
};

const getCartByEmailToPlaceOrder = async (email, productBy) => {
  const carts = await RtlToMnfCart.find({ email, productBy });
  if (!carts || carts.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No carts found for this email and productBy');
  }

  const user = await User.findOne({ email }).select('role');
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  let retailer = null;
  let discountDetails = null;

  if (user.role === 'retailer') {
    retailer = await Retailer.findOne({ email }).select(
      'fullName companyName email address country state city pinCode mobNumber GSTIN code profileImg pan discountGiven'
    );

    if (!retailer) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Retailer not found');
    }

    // 🔍 Get discount details from retailer.discountGiven array
    const discountEntry = retailer.discountGiven.find(
      (entry) => entry.discountGivenBy === productBy
    );

    if (discountEntry) {
      discountDetails = {
        productDiscount: discountEntry.productDiscount,
        category: discountEntry.category,
      };
    }
  }

  // 🏭 Manufacturer details
  const manufacturer = await Manufacture.findOne({ email: productBy }).select(
    'fullName companyName email address country state city pinCode mobNumber GSTIN pan'
  );

  if (!manufacturer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Manufacturer not found');
  }

  if (!retailer) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Retailer information is missing.');
  }

  // 🛒 Construct detailed product list with full set
  const orderDetails = carts.map((cart) => ({
    _id: cart._id,
    productId: {
      designNumber: cart.designNumber || '',
      brand: cart.brand || 'Brand not available',
      id: cart._id || null,
    },
    set: cart.set.map((setItem) => ({
      productBy: setItem.productBy,
      designNumber: setItem.designNumber,
      colour: setItem.colour,
      colourImage: setItem.colourImage,
      colourName: setItem.colourName,
      size: setItem.size,
      quantity: setItem.quantity,
      availableQuantity: setItem.availableQuantity,
      confirmed: setItem.confirmed,
      status: setItem.status,
      manufacturerPrice: setItem.manufacturerPrice,
      price: setItem.price,
      productType: setItem.productType,
      gender: setItem.gender,
      clothing: setItem.clothing,
      subCategory: setItem.subCategory,
      hsnCode: setItem.hsnCode,
      brandName: setItem.brandName,
      hsnGst: setItem.hsnGst,
        hsnDescription: setItem.hsnDescription,
    })),
  }));

  const orderNumber = await genratedeChallNO(email);
  
  const result = {
    productBy: manufacturer.email,
    email: retailer.email,
    orderNumber,
    manufacturer: {
      fullName: manufacturer.fullName,
      companyName: manufacturer.companyName,
      email: manufacturer.email,
      pan: manufacturer.pan,
      address: manufacturer.address,
      country: manufacturer.country,
      state: manufacturer.state,
      city: manufacturer.city,
      pinCode: manufacturer.pinCode,
      mobNumber: manufacturer.mobNumber,
      GSTIN: manufacturer.GSTIN,
    },
    retailer: {
      fullName: retailer.fullName,
      companyName: retailer.companyName,
      email: retailer.email,
      address: retailer.address,
      country: retailer.country,
      state: retailer.state,
      city: retailer.city,
      pinCode: retailer.pinCode,
      mobNumber: retailer.mobNumber,
      GSTIN: retailer.GSTIN,
      code: retailer.code,
      profileImg: retailer.profileImg,
      pan: retailer.pan,
      productDiscount: discountDetails?.productDiscount || null,
      category: discountDetails?.category || null,
    },
    products: orderDetails,
  };

  return result;
};

/**
 *
 * @param {} email
 * @returns
 */
const getCartByEmail = async (email) => {
  // Find all cart items by email and populate the product details (productId)
  const cartItems = await RtlToMnfCart.find({ email }).populate('productId');
  if (!cartItems || cartItems.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No carts found for this email');
  }
  // Extract unique manufacturer emails from all cart products (based on productBy)
  const productByEmails = [...new Set(cartItems.map((item) => item.productBy))];

  // Fetch manufacturers based on the extracted emails
  const manufacturers = await Manufacture.find({ email: { $in: productByEmails } });
  const manufacturerMap = new Map(manufacturers.map((manufacturer) => [manufacturer.email, manufacturer.fullName]));

  // Group the cart items by the `productBy` field
  const groupedCart = cartItems.reduce((acc, item) => {
    const { productBy } = item;

    if (!acc[productBy]) {
      acc[productBy] = {
        fullName: manufacturerMap.get(productBy) || 'Unknown Manufacturer',
        manufacturer: productBy,
        products: [],
      };
    }

    acc[productBy].products.push({
      set: item.set.map((setItem) => ({
        designNumber: setItem.designNumber || '',
        colour: setItem.colour,
        colourImage: setItem.colourImage,
        colourName: setItem.colourName,
        size: setItem.size,
        quantity: setItem.quantity,
        price: setItem.price,
      })),
      _id: item._id,
      productId: {
        designNumber: item.productId.designNumber,
        brand: item.productId.brand,
        id: item.productId._id,
      },
    });

    return acc;
  }, {});

  // Convert the grouped object to an array of objects
  const formattedCart = Object.values(groupedCart);

  return formattedCart;
};

/**
 * Update RtlToMnfCart by id
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<RtlToMnfCart>}
 */
const updateCartType2ById = async (id, updateBody) => {
  const cart = await getCartType2ById(id);
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }
  Object.assign(cart, updateBody);
  await cart.save();
  return cart;
};

/**
 * Delete RtlToMnfCart by id
 * @param {ObjectId} id
 * @returns {Promise<RtlToMnfCart>}
 */
const deleteCartType2ById = async (id) => {
  const cart = await getCartType2ById(id);
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }
  await cart.remove();
  return cart;
};

const updateSetItem = async (cartId, setId, updateBody) => {
  const cart = await getCartType2ById(cartId)

  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }

  const item = cart.set.id(setId);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Set item not found');
  }

  // Update fields
  Object.keys(updateBody).forEach((key) => {
    item[key] = updateBody[key];
  });

  await cart.save();
  return cart;
};


const deleteCartSetItem = async (cartId, setId) => {
  const cart = await getCartType2ById(cartId)
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }

  const initialLength = cart.set.length;
  cart.set = cart.set.filter((item) => item._id.toString() !== setId);

  if (cart.set.length === initialLength) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Set item not found');
  }

  await cart.save();
  return cart;
};

module.exports = {
  createCartType2,
  queryCartType2,
  getCartByEmail,
  getCartByEmailToPlaceOrder,
  getCartType2ById,
  updateCartType2ById,
  deleteCartType2ById,
  updateSetItem,
  deleteCartSetItem
};
