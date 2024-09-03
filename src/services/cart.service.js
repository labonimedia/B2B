const httpStatus = require('http-status');
const { Product, Cart, Manufacture, Wholesaler, User, Retailer, OrderCounter } = require('../models');
const ApiError = require('../utils/ApiError');

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

/**
 * Get Cart by email for place order
 * @param {ObjectId} id
 * @returns {Promise<Cart>}
 */

const getCartByEmailToPlaceOrder = async (email, productBy) => {
  // Find the cart by email and populate the product details
  const cart = await Cart.findOne({ email, productBy }).populate('products.productId');
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }

  // Get user details by email to determine role
  const user = await User.findOne({ email }).select('role');
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Get wholesaler or retailer details based on user role
  let wholesaler = null;
  if (user.role === 'wholesaler' || user.role === 'retailer') {
    wholesaler =
      user.role === 'wholesaler'
        ? await Wholesaler.findOne({ email }).select(
            'fullName companyName email address country state city pinCode mobNumber GSTIN code profileImg'
          )
        : await Retailer.findOne({ email }).select(
            'fullName companyName email address country state city pinCode mobNumber GSTIN code profileImg'
          );

    if (!wholesaler) {
      throw new ApiError(httpStatus.NOT_FOUND, user.role === 'wholesaler' ? 'Wholesaler not found' : 'Retailer not found');
    }
  }

  // Extract unique manufacturer emails from cart products
  const productByEmails = [...new Set(cart.products.map((item) => item.productId.productBy))];

  // Fetch manufacturer details for all unique emails
  const manufacturers = await Manufacture.find({ email: { $in: productByEmails } }).select(
    'fullName companyName email address country state city pinCode mobNumber GSTIN'
  );

  // Map manufacturers by their email for easy lookup
  const manufacturerMap = new Map(
    manufacturers.map((manufacturer) => [
      manufacturer.email,
      {
        fullName: manufacturer.fullName,
        companyName: manufacturer.companyName,
        email: manufacturer.email,
        address: manufacturer.address,
        country: manufacturer.country,
        state: manufacturer.state,
        city: manufacturer.city,
        pinCode: manufacturer.pinCode,
        mobNumber: manufacturer.mobNumber,
        GSTIN: manufacturer.GSTIN,
      },
    ])
  );

  // Determine the financial year based on the current date
  const now = new Date();
  const currentMonth = now.getMonth(); // 0-based (0 = January, ..., 2 = March)
  let financialYear;

  if (currentMonth < 2 || (currentMonth === 2 && now.getDate() < 1)) {
    // Before March 1st
    financialYear = now.getFullYear() - 1;
  } else {
    financialYear = now.getFullYear();
  }

  // Ensure wholesaler is present for roles that require it
  if (!wholesaler) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Wholesaler information is missing.');
  }

  // Get the current order count for the wholesaler and financial year
  let orderCount;
  try {
    orderCount = await OrderCounter.findOneAndUpdate(
      { wholesalerEmail: wholesaler.email, year: financialYear },
      { $inc: { count: 1 } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Duplicate order counter entry.');
    }
    throw error;
  }

  const orderNumber = orderCount.count;

  // Group products by manufacturer email
  const groupedCart = cart.products.reduce((acc, item) => {
    const { productBy } = item.productId;
    if (!acc[productBy]) {
      acc[productBy] = {
        manufacturer: manufacturerMap.get(productBy) || {
          fullName: 'Unknown Manufacturer',
          companyName: 'Unknown Company',
          email: 'Unknown Email',
          address: {
            country: 'Unknown Country',
            state: 'Unknown State',
            city: 'Unknown City',
            pinCode: 'Unknown PinCode',
          },
          mobNumber: 'Unknown MobNumber',
        },
        products: [],
        wholesaler,
        orderNumber,
        financialYear,
      };
    }

    // Add product details to the respective manufacturer group
    acc[productBy].products.push({
      quantity: item.quantity,
      _id: item._id,
      productId: {
        designNumber: item.productId.designNumber,
        brand: item.productId.brand,
        productType: item.productId.productType,
        productTitle: item.productId.productTitle,
        productDescription: item.productId.productDescription,
        setOFnetWeight: item.productId.setOFnetWeight,
        setOfMRP: item.productId.setOfMRP,
        setOfManPrice: item.productId.setOfManPrice,
        currency: item.productId.currency,
        quantity: item.productId.quantity,
        productBy: item.productId.productBy,
        id: item.productId._id,
      },
    });

    return acc;
  }, {});

  // Convert the object to an array of objects for final output
  return Object.values(groupedCart);
};

const getCartByEmail = async (email) => {
  // Find all carts by email and populate the product details
  const carts = await Cart.find({ email }).populate('products.productId');
  if (!carts || carts.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No carts found for this email');
  }

  // Extract unique manufacturer emails from all cart products
  const productByEmails = [...new Set(carts.flatMap((cart) => cart.products.map((item) => item.productId.productBy)))];

  // Fetch manufacturers based on extracted emails
  const manufacturers = await Manufacture.find({ email: { $in: productByEmails } });
  const manufacturerMap = new Map(manufacturers.map((manufacturer) => [manufacturer.email, manufacturer.fullName]));
  const groupedCart = carts.reduce((acc, cart) => {
    cart.products.forEach((item) => {
      const { productBy } = item.productId;
      if (!acc[productBy]) {
        acc[productBy] = {
          fullName: manufacturerMap.get(productBy) || 'Unknown Manufacturer',
          products: [],
        };
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
          setOFnetWeight: item.productId.setOFnetWeight,
          setOfMRP: item.productId.setOfMRP,
          setOfManPrice: item.productId.setOfManPrice,
          currency: item.productId.currency,
          quantity: item.productId.quantity,
          dateOfManufacture: item.productId.dateOfManufacture,
          dateOfListing: item.productId.dateOfListing,
          productBy: item.productId.productBy,
          colourCollections: item.productId.colourCollections,
          id: item.productId._id,
        },
      });
    });
    return acc;
  }, {});

  // Convert the grouped object to an array of objects
  const formattedCart = Object.values(groupedCart);

  return formattedCart;
};

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
 * @param {Parameters} email
 * @param {Parameters} productId
 * @param {Parameters} quantity
 * @param {Object} updateBody
 * @returns {Promise<Cart>}
 */
const updateCartByEmail = async (email, productId, quantity) => {
  const cart = await Cart.findOne({ email });
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }

  const productIndex = cart.products.findIndex((item) => item.productId.toString() === productId);

  if (productIndex === -1) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found in cart');
  }

  if (quantity <= 0) {
    cart.products.splice(productIndex, 1);
  } else {
    cart.products[productIndex].quantity = quantity;
  }

  await cart.save();
  return cart;
};
// const updateCartById = async (id, updateBody) => {
//   const user = await getCartById(id);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
//   }
//   Object.assign(user, updateBody);
//   await user.save();
//   return user;
// };

/**
 * Delete user by id
 * @param {ObjectId} productId
 * @returns {Promise<ClosureType>}
 */
const deleteCartItemByEmail = async (email, productId) => {
  const cart = await Cart.findOne({ email });
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }

  const productIndex = cart.products.findIndex((item) => item.productId.toString() === productId);

  if (productIndex === -1) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found in cart');
  }

  cart.products.splice(productIndex, 1);
  await cart.save();
  return cart;
};
// const deleteCartById = async (id) => {
//   const user = await getCartById(id);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
//   }
//   await user.remove();
//   return user;
// };
module.exports = {
  addToCart,
  getCartByEmail,
  getCartById,
  getCartByEmailToPlaceOrder,
  updateCartByEmail,
  deleteCartItemByEmail,
};
