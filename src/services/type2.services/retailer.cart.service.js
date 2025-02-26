const httpStatus = require('http-status');
const { RetailerCartType2, User, Wholesaler, Retailer, Manufacture, POCountertype2, WishListType2, PurchaseOrderRetailerType2 } = require('../../models');
const ApiError = require('../../utils/ApiError');

/**
 * Create multiple RetailerCartType2 items
 * @param {Array<Object>} reqBody - Contains an array of item objects
 * @returns {Promise<Array<RetailerCartType2>>}
 */
const createRetailerCartType2 = async (reqBody) => {
  const { email, wholesalerEmail, set } = reqBody;
  // Check if a cart already exists with the same email and productBy
  const existingCart = await RetailerCartType2.findOne({ email, wholesalerEmail });
  if (existingCart) {
    // Push new set data into the existing cart's set array
    existingCart.set.push(...set);
    await existingCart.save();
    await WishListType2.findOneAndDelete({ productId: reqBody.productId, email })
    return existingCart
  } else {
    // If no cart exists, create a new one
    const newCart = await RetailerCartType2.create(reqBody);
    await WishListType2.findOneAndDelete({ productId: reqBody.productId, email })
    return newCart;
  }
};


/**
 * Query for RetailerCartType2
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
// const queryRetailerCartType2 = async (filter, options) => {
//   const RetailerCartType2Items = await RetailerCartType2.paginate(filter, options);
//   return RetailerCartType2Items;
// };

const queryRetailerCartType2 = async (filter, options) => {
  // Paginate the RetailerCartType2 items
  const RetailerCartType2Items = await RetailerCartType2.paginate(filter, options);
  if (RetailerCartType2Items.results.length === 0) {
    return RetailerCartType2Items; // Return empty results if no items found
  }

  // Extract unique productBy emails from the paginated results
  const wholesalerEmails = [...new Set(RetailerCartType2Items.results.map((item) => item.wholesalerEmail))];

  // Fetch manufacturer details based on the productBy emails
  const wholesalers = await Wholesaler.find({
    email: { $in: wholesalerEmails },
  }).select('email fullName companyName address state country pinCode profileImg mobNumber GSTIN');
  let retailer;
  if (filter.email) {
    retailer = await Retailer.findOne({
      email: filter.email,
    }).select('email fullName companyName address state country pinCode profileImg mobNumber GSTIN');

  }

  // Create a mapping of email to manufacturer details
  const wholesalerMap = wholesalers.reduce((acc, wholesaler) => {
    acc[wholesaler.email] = {
      email: wholesaler.email,
      fullName: wholesaler.fullName,
      companyName: wholesaler.companyName,
      address: wholesaler.address,
      state: wholesaler.state,
      country: wholesaler.country,
      pinCode: wholesaler.pinCode,
      mobNumber: wholesaler.mobNumber,
      profileImg: wholesaler.profileImg,
      GSTIN: wholesaler.GSTIN,
    };
    return acc;
  }, {});

  // Enrich each item in the results with the manufacturer details
  RetailerCartType2Items.results = RetailerCartType2Items.results.map((item) => ({
    ...item.toObject(), // Convert mongoose document to plain object
    wholesaler: wholesalerMap[item.wholesalerEmail] || null, // Default to null if not found
    retailer,
  }));

  return RetailerCartType2Items;
};

/**
 * Get RetailerCartType2 by id
 * @param {ObjectId} id
 * @returns {Promise<RetailerCartType2>}
 */
const getRetailerCartType2ById = async (id) => {
  return RetailerCartType2.findById(id);
};
/**
 * Get cart items for a specific user and productBy
 * @param {string} email - User's email
 * @param {string} productBy - Product's manufacturer email
 */

const genratePORetailerCartType2 = async (id) => {
  // Fetch the RetailerCartType2 document by its ID
  const cartItem = await RetailerCartType2.findById(id);
  if (!cartItem) {
    throw new Error("Cart item not found");
  }

  // Fetch manufacturer details based on the `productBy` email
  const wholesaler = await Wholesaler.findOne({
    email: cartItem.wholesalerEmail,
  }).select('email fullName companyName address state country pinCode mobNumber profileImg GSTIN');

  // Fetch wholesaler details based on the provided `email` (if any)
  let retailer = null;
  let discountDetails = null;

  if (cartItem.email) {
    // Fetch wholesaler details and discount array
    retailer = await Retailer.findOne({
      email: cartItem.email,
    }).select(
      'email fullName companyName address state country pinCode mobNumber GSTIN logo profileImg discountGiven'
    );

    if (retailer) {
      // Find the discount entry for the `productBy` field
      const discountEntry = retailer.discountGiven.find(
        (discount) => discount.discountGivenBy === cartItem.wholesalerEmail
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
  const lastPO = await PurchaseOrderRetailerType2.findOne({ email: cartItem.email })
    .sort({ poNumber: -1 })
    .lean();
  orderCount = lastPO ? lastPO.poNumber + 1 : 1;

  const orderNumber = orderCount.count;

  // Prepare the enriched response
  const enrichedCartItem = {
    ...cartItem.toObject(),
    poNumber: orderNumber, // Purchase Order Number
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
        profileImg: wholesaler.profileImg,
        GSTIN: wholesaler.GSTIN,
      }
      : null, // Default to null if manufacturer not found
    retailer: retailer
      ? {
        email: retailer.email,
        fullName: retailer.fullName,
        companyName: retailer.companyName,
        address: retailer.address,
        state: retailer.state,
        country: retailer.country,
        pinCode: retailer.pinCode,
        mobNumber: retailer.mobNumber,
        GSTIN: retailer.GSTIN,
        logo: retailer.logo,
        profileImg: retailer.profileImg,
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
  const carts = await RetailerCartType2.find({ email, productBy }).populate('productId');
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
    'fullName companyName email address country state city profileImg pinCode mobNumber GSTIN'
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
//   const cartItems = await RetailerCartType2.find({ email }).populate('productId');
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
  const cartItems = await RetailerCartType2.find({ email }).populate('productId');
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
 * Update RetailerCartType2 by id
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<RetailerCartType2>}
 */
const updateRetailerCartType2ById = async (id, updateBody) => {
  const cart = await getRetailerCartType2ById(id);
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }
  Object.assign(cart, updateBody);
  await cart.save();
  return cart;
};

/**
 * Delete RetailerCartType2 by id
 * @param {ObjectId} id
 * @returns {Promise<RetailerCartType2>}
 */
const deleteRetailerCartType2ById = async (id) => {
  const cart = await getRetailerCartType2ById(id);
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }
  await cart.remove();
  return cart;
};

module.exports = {
  createRetailerCartType2,
  queryRetailerCartType2,
  getCartByEmail,
  genratePORetailerCartType2,
  getCartByEmailToPlaceOrder,
  getRetailerCartType2ById,
  updateRetailerCartType2ById,
  deleteRetailerCartType2ById,
};
