const httpStatus = require('http-status');
const { CartType2, User, Wholesaler, Retailer, Manufacture, POCountertype2 } = require('../../models');
const ApiError = require('../../utils/ApiError');

/**
 * Create multiple CartType2 items
 * @param {Array<Object>} reqBody - Contains an array of item objects
 * @returns {Promise<Array<CartType2>>}
 */
const createCartType2 = async (reqBody) => {
  return CartType2.create(reqBody);
};

/**
 * Query for CartType2
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryCartType2 = async (filter, options) => {
  const cartType2Items = await CartType2.paginate(filter, options);
  return cartType2Items;
};

/**
 * Get CartType2 by id
 * @param {ObjectId} id
 * @returns {Promise<CartType2>}
 */
const getCartType2ById = async (id) => {
  return CartType2.findById(id);
};
const getCartByEmailToPlaceOrder = async (email, productBy) => {
  // Find the cart by email and productBy, and populate the product details
  const carts = await CartType2.find({ email, productBy }).populate('productId');
  if (!carts || carts.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No carts found for this email and productBy');
  }

  // Get user details by email to determine the role
  const user = await User.findOne({ email }).select('role');
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Ensure wholesaler or retailer details are fetched based on the user's role
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

  // Extract the manufacturer email from the product in the cart
  // const productManufacturerEmail = cart.productBy;

  // Fetch manufacturer details for the product's manufacturer
  const manufacturer = await Manufacture.findOne({ email: productBy }).select(
    'fullName companyName email address country state city pinCode mobNumber GSTIN'
  );

  if (!manufacturer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Manufacturer not found');
  }

  // Determine the financial year based on the current date
  const now = new Date();
  const currentMonth = now.getMonth();
  let financialYear;

  if (currentMonth < 2 || (currentMonth === 2 && now.getDate() < 1)) {
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
    orderCount = await POCountertype2.findOneAndUpdate(
      { wholesalerEmail: wholesaler.email, year: financialYear },
      { $inc: { count: 1 } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Duplicate order counter entry.');
    }
    throw error;
  }

  const orderNumber = orderCount.count;

  // Prepare the cart and order details

  const orderDetails = carts.map((cart) => ({
    productId: {
      designNumber: cart.designNumber || "",
      brand: cart.productId.brand,
      productType: cart.productId.productType,
      productTitle: cart.productId.productTitle,
      productDescription: cart.productId.productDescription,
      setOFnetWeight: cart.productId.setOFnetWeight,
      setOfMRP: cart.productId.setOfMRP,
      setOfManPrice: cart.productId.setOfManPrice,
      currency: cart.productId.currency,
      quantity: cart.productId.quantity,
      productBy: cart.productId.productBy,
      id: cart.productId._id,
    },
    products: cart.set.map((setItem) => ({
      set: {
        designNumber: cart.designNumber || "",
        colour: setItem.colour,
        colourImage: setItem.colourImage,
        colourName: setItem.colourName,
        size: setItem.size,
        quantity: setItem.quantity,
        price: setItem.price,
      },

    })),
  }));
  const result = {
    manufacturer: {
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
    orderDetails,
  }
  
  return result;
  
};


// const getCartByEmail = async (email) => {
//   // Find all cart items by email and populate the product details (productId)
//   const cartItems = await CartType2.find({ email }).populate('productId');
//   if (!cartItems || cartItems.length === 0) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'No carts found for this email');
//   }

//   // Extract unique manufacturer emails from all cart products (based on productBy)
//   const productByEmails = [...new Set(cartItems.map((item) => item.productBy))];

//   // Fetch manufacturers based on the extracted emails
//   const manufacturers = await Manufacture.find({ email: { $in: productByEmails } });
//   const manufacturerMap = new Map(manufacturers.map((manufacturer) => [manufacturer.email, manufacturer]));

//   // Group the cart items by the `productBy` field
//   const groupedCart = cartItems.reduce((acc, item) => {
//     const { productBy } = item;
//     const manufacturer = manufacturerMap.get(productBy);

//     if (!acc[productBy]) {
//       acc[productBy] = {
//         fullName: manufacturer ? manufacturer.fullName : 'Unknown Manufacturer',
//         manufacturer: productBy, // Add manufacturer email
//         manufacturerEmail: manufacturer ? manufacturer.email : 'Unknown', // Include manufacturer email
//         products: [],
//       };
//     }

//     acc[productBy].products.push({
//       set: item.set.map((setItem) => ({
//         designNumber: setItem.designNumber || "" ,
//         colour: setItem.colour,
//         colourImage: setItem.colourImage,
//         colourName: setItem.colourName,
//         size: setItem.size,
//         quantity: setItem.quantity,
//         price: setItem.price,
//       })),
//       _id: item._id,
//       productId: {
//         designNumber: item.productId.designNumber,
//         brand: item.productId.brand,
//         id: item.productId._id,
//       },
//     });

//     return acc;
//   }, {});

//   return groupedCart;
// };


const getCartByEmail = async (email) => {
  // Find all cart items by email and populate the product details (productId)
  const cartItems = await CartType2.find({ email }).populate('productId');
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
        designNumber: setItem.designNumber || "" ,
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
 * Update CartType2 by id
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<CartType2>}
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
 * Delete CartType2 by id
 * @param {ObjectId} id
 * @returns {Promise<CartType2>}
 */
const deleteCartType2ById = async (id) => {
  const cart = await getCartType2ById(id);
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }
  await cart.remove();
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
};
