const httpStatus = require('http-status');
const { RtlToMnfCart, User, Wholesaler, Retailer, Manufacture, WishListType2 } = require('../../models');
const ApiError = require('../../utils/ApiError');

/**
 * Create multiple RtlToMnfCart items
 * @param {Array<Object>} reqBody - Contains an array of item objects
 * @returns {Promise<Array<RtlToMnfCart>>}
 */
const createCartType2 = async (reqBody) => {
    const { email, productBy, set } = reqBody;
    // Check if a cart already exists with the same email and productBy
    const existingCart = await RtlToMnfCart.findOne({ email, productBy });
    if (existingCart) {
        // Push new set data into the existing cart's set array
        existingCart.set.push(...set);
        await existingCart.save();
        await WishListType2.findOneAndDelete({ productId: reqBody.productId, email })
        return existingCart
    } else {
        // If no cart exists, create a new one
        const newCart = await RtlToMnfCart.create(reqBody);
        await WishListType2.findOneAndDelete({ productId: reqBody.productId, email })
        return newCart;
    }
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
// const queryCartType2 = async (filter, options) => {
//   const cartType2Items = await RtlToMnfCart.paginate(filter, options);
//   return cartType2Items;
// };

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

// /**
//  * Get cart items for a specific user and productBy
//  * @param {string} email - User's email
//  * @param {string} productBy - Product's manufacturer email
//  */
// const getCartByEmailToPlaceOrder = async (email, productBy) => {
//     // Find the cart by email and productBy, and populate the product details
//     const carts = await RtlToMnfCart.find({ email, productBy }).populate('productId');
//     if (!carts || carts.length === 0) {
//         throw new ApiError(httpStatus.NOT_FOUND, 'No carts found for this email and productBy');
//     }
//     const user = await User.findOne({ email }).select('role');
//     if (!user) {
//         throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//     }
//     let retailer = null;
//     if (user.role === 'retailer') {
//         retailer = await Retailer.findOne({ email }).select(
//             'fullName companyName email address country state city pinCode mobNumber GSTIN code profileImg');

//         if (!retailer) {
//             throw new ApiError(httpStatus.NOT_FOUND, 'Retailer not found');
//         }
//     }

//     // Fetch manufacturer details for the product's manufacturer
//     const manufacturer = await Manufacture.findOne({ email: productBy }).select(
//         'fullName companyName email address country state city pinCode mobNumber GSTIN'
//     );

//     if (!manufacturer) {
//         throw new ApiError(httpStatus.NOT_FOUND, 'Manufacturer not found');
//     }

//     // Ensure wholesaler is present for roles that require it
//     if (!retailer) {
//         throw new ApiError(httpStatus.BAD_REQUEST, 'Wholesaler information is missing.');
//     }


//     // Prepare the cart and order details with the desired format
//     const orderDetails = carts.map((cart) => ({
//         _id: cart._id,
//         productId: {
//             designNumber: cart.designNumber || "",
//             brand: cart.productId.brand,
//             id: cart.productId._id,
//         },
//         set: cart.set.map((setItem) => ({
//             designNumber: cart.designNumber || "",
//             colour: setItem.colour,
//             colourImage: setItem.colourImage || null,
//             colourName: setItem.colourName,
//             size: setItem.size,
//             quantity: setItem.quantity,
//             price: setItem.price,
//         })),
//     }));

//     // Return the final response structure
//     const result = {
//         manufacturer: {
//             fullName: manufacturer.fullName,
//             companyName: manufacturer.companyName,
//             email: manufacturer.email,
//             address: manufacturer.address,
//             country: manufacturer.country,
//             state: manufacturer.state,
//             city: manufacturer.city,
//             pinCode: manufacturer.pinCode,
//             mobNumber: manufacturer.mobNumber,
//             GSTIN: manufacturer.GSTIN,
//         },
//         retailer,
//         orderNumber,
//         products: orderDetails,
//     };
//     return result;
// };
const getCartByEmailToPlaceOrder = async (email, productBy) => {
    // Find the cart by email and productBy, and populate the product details
    const carts = await RtlToMnfCart.find({ email, productBy }).populate('productId');
    if (!carts || carts.length === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, 'No carts found for this email and productBy');
    }
    const user = await User.findOne({ email }).select('role');
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    let retailer = null;
    if (user.role === 'retailer') {
        retailer = await Retailer.findOne({ email }).select(
            'fullName companyName email address country state city pinCode mobNumber GSTIN code profileImg');

        if (!retailer) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Retailer not found');
        }
    }

    // Fetch manufacturer details for the product's manufacturer
    const manufacturer = await Manufacture.findOne({ email: productBy }).select(
        'fullName companyName email address country state city pinCode mobNumber GSTIN'
    );

    if (!manufacturer) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Manufacturer not found');
    }

    // Ensure wholesaler is present for roles that require it
    if (!retailer) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Wholesaler information is missing.');
    }

    // Prepare the cart and order details with the desired format
    const orderDetails = carts.map((cart) => {
        const product = cart.productId;
        return {
            _id: cart._id,
            productId: {
                designNumber: cart.designNumber || "",
                brand: product?.brand || "Brand not available",  // Defensive check for undefined
                id: product?._id || null,
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
        };
    });

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
        retailer,
        orderNumber,
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

module.exports = {
    createCartType2,
    queryCartType2,
    getCartByEmail,
    getCartByEmailToPlaceOrder,
    getCartType2ById,
    updateCartType2ById,
    deleteCartType2ById,
};
