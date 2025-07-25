const httpStatus = require('http-status');
const { CartType2, User, Wholesaler, Retailer, Manufacture, POCountertype2, WishListType2 } = require('../../models');
const ApiError = require('../../utils/ApiError');

/**
 * Create multiple CartType2 items
 * @param {Array<Object>} reqBody - Contains an array of item objects
 * @returns {Promise<Array<CartType2>>}
 */
// const createCartType2 = async (reqBody) => {
//   const { email, productBy, set } = reqBody;
//     // Check if a cart already exists with the same email and productBy
//     const existingCart = await CartType2.findOne({ email, productBy });
//     if (existingCart) {
//       // Push new set data into the existing cart's set array
//       existingCart.set.push(...set);
//       await existingCart.save();
//       await WishListType2.findOneAndDelete({productId: reqBody.productId, email})
//       return  existingCart
//     } else {
//       // If no cart exists, create a new one
//       const newCart = await CartType2.create(reqBody);
//       await WishListType2.findOneAndDelete({productId: reqBody.productId, email})
//       return  newCart;
//     }
// };


const createCartType2 = async (reqBody) => {
  const { email, productBy, set } = reqBody;

  const existingCart = await CartType2.findOne({ email, productBy });

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
  const newCart = await CartType2.create(reqBody);

  if (reqBody.productId) {
    await WishListType2.findOneAndDelete({ productId: reqBody.productId, email });
  }

  return newCart;
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
// const queryCartType2 = async (filter, options) => {
//   const cartType2Items = await CartType2.paginate(filter, options);
//   return cartType2Items;
// };

const queryCartType2 = async (filter, options) => {
  // Paginate the CartType2 items
  const cartType2Items = await CartType2.paginate(filter, options);
  if (cartType2Items.results.length === 0) {
    return cartType2Items; // Return empty results if no items found
  }

  // Extract unique productBy emails from the paginated results
  const productByEmails = [...new Set(cartType2Items.results.map((item) => item.productBy))];

  // Fetch manufacturer details based on the productBy emails
  const manufacturers = await Manufacture.find({
    email: { $in: productByEmails },
  }).select('email fullName companyName address state country pinCode mobNumber GSTIN');
  let wholesaler;
if(filter.email){
  wholesaler = await Wholesaler.findOne({
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
    ...item.toObject(), // Convert mongoose document to plain object
    manufacturer: manufacturerMap[item.productBy] || null, // Default to null if not found
    wholesaler,
  }));

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
/**
 * Get cart items for a specific user and productBy
 * @param {string} email - User's email
 * @param {string} productBy - Product's manufacturer email
 */

const genratePOCartType2 = async (id) => {
  // Fetch the CartType2 document by its ID
  const cartItem = await CartType2.findById(id);
  if (!cartItem) {
    throw new Error("Cart item not found");
  }

  // Fetch manufacturer details based on the `productBy` email
  const manufacturer = await Manufacture.findOne({
    email: cartItem.productBy,
  }).select('email fullName companyName address state country pinCode mobNumber GSTIN');

  // Fetch wholesaler details based on the provided `email` (if any)
  let wholesaler = null;
  let discountDetails = null;

  if (cartItem.email) {
    // Fetch wholesaler details and discount array
    wholesaler = await Wholesaler.findOne({
      email: cartItem.email,
    }).select(
      'email fullName companyName address state country pinCode mobNumber GSTIN logo discountGiven'
    );

    if (wholesaler) {
      // Find the discount entry for the `productBy` field
      const discountEntry = wholesaler.discountGiven.find(
        (discount) => discount.discountGivenBy === cartItem.productBy
      );

      if (discountEntry) {
        discountDetails = {
          productDiscount: discountEntry.productDiscount,
          category: discountEntry.category,
        };
      }
    }
  }

  // Determine the financial year for the order number
  const now = new Date();
  const currentMonth = now.getMonth();
  let financialYear =
    currentMonth < 2 || (currentMonth === 2 && now.getDate() < 1)
      ? now.getFullYear() - 1
      : now.getFullYear();

  // Get the current order count for the wholesaler and financial year
  let orderCount;
  try {
    orderCount = await POCountertype2.findOneAndUpdate(
      { email: wholesaler?.email, year: financialYear },
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

  // Prepare the enriched response
  const enrichedCartItem = {
    ...cartItem.toObject(),
    poNumber: orderNumber, // Purchase Order Number
    manufacturer: manufacturer
      ? {
          email: manufacturer.email,
          fullName: manufacturer.fullName,
          companyName: manufacturer.companyName,
          address: manufacturer.address,
          state: manufacturer.state,
          country: manufacturer.country,
          pinCode: manufacturer.pinCode,
          mobNumber: manufacturer.mobNumber,
          GSTIN: manufacturer.GSTIN,
        }
      : null, // Default to null if manufacturer not found
    wholesaler: wholesaler
      ? {
          email: wholesaler.email,
          fullName: wholesaler.fullName,
          companyName: wholesaler.companyName,
          address: wholesaler.address,
          state: wholesaler.state,
          country: wholesaler.country,
          pinCode: wholesaler.pinCode,
          mobNumber: wholesaler.mobNumber,
          GSTIN: wholesaler.GSTIN,
          logo: wholesaler.logo,
          ...discountDetails, // Include discount details (if found)
        }
      : null, // Default to null if wholesaler not found
  };

  return enrichedCartItem;
};




/**
 * Get cart items for a specific user and productBy
 * @param {string} email - User's email
 * @param {string} productBy - Product's manufacturer email
 */
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

  // Fetch wholesaler or retailer details based on the user's role
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
  let financialYear = currentMonth < 2 || (currentMonth === 2 && now.getDate() < 1) ? now.getFullYear() - 1 : now.getFullYear();

  // Ensure wholesaler is present for roles that require it
  if (!wholesaler) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Wholesaler information is missing.');
  }


  // Prepare the cart and order details with the desired format
  const orderDetails = carts.map((cart) => ({
    _id: cart._id,
    productId: {
      designNumber: cart.designNumber || "",
      brand: cart.productId.brand,
      id: cart.productId._id,
    },
    set: cart.set.map((setItem) => ({
      designNumber: cart.designNumber || "",
      colour: setItem.colour,
      colourImage: setItem.colourImage || null,
      colourName: setItem.colourName,
      size: setItem.size,
      quantity: setItem.quantity,
      price: setItem.price,
    })),
  }));

  // Return the final response structure
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
    wholesaler,
    orderNumber,
    products: orderDetails,
  };

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


/**
 * 
 * @param {} email 
 * @returns 
 */
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
const updateSetItem = async (cartId, setId, updateBody) => {
  const cart = await getCartType2ById(cartId);

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
  const cart = await getCartType2ById(cartId);
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
  genratePOCartType2,
  getCartByEmailToPlaceOrder,
  getCartType2ById,
  updateCartType2ById,
  deleteCartType2ById,
  deleteCartSetItem,
  updateSetItem,
};
