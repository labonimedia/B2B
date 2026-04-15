const httpStatus = require('http-status');
const mongoose = require('mongoose');
const {
  ProductType2,
  Manufacture,
  User,
  WholesalerPriceType2,
  Brand,
  Request,
  WholesalerProductAssignment,
} = require('../../models');
const ApiError = require('../../utils/ApiError');
const { deleteFile } = require('../../utils/upload');

/**
 * fileupload
 * @param {Object} reqBody
 * @returns {Promise<ProductType2>}
 */
const fileupload = async (req, productId) => {
  const product = await ProductType2.findById(productId);

  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ProductType2 not found');
  }

  const { colour, colourName, colourImage, productImages, productVideo } = req.body;

  const newColourCollection = {
    colour,
    colourName,
    colourImage: colourImage ? colourImage[0] : null, // Save as-is
    productImages: productImages || [], // Save as-is
    productVideo: productVideo ? productVideo[0] : null, // Save as-is
  };

  product.colourCollections.push(newColourCollection);
  return product.save(); // Save the updated product
};

/**
 * Create a ProductType2
 * @param {Object} reqBody
 * @returns {Promise<ProductType2>}
 */
const createProduct = async (reqBody) => {
  if (reqBody.quantity) reqBody.initialQTY = reqBody.quantity;
  return ProductType2.create(reqBody);
};

const addProduct = async (userId, productData) => {
  const user = await User.findById(userId).populate('subscriptionId');

  const subscription = user.subscriptionId;

  // Check if the subscription is active and hasn't expired
  if (subscription.status === 'expired' || new Date() > subscription.endDate) {
    throw new Error('Subscription expired, please renew');
  }

  // Check product limit
  if (subscription.productsUsed >= subscription.productLimit) {
    throw new Error('Product limit reached, please purchase more product slots');
  }

  // Add new product
  const newProduct = new ProductType2({ ...productData, userId, subscriptionId: subscription._id });
  await newProduct.save();

  // Update the number of products used in the subscription
  subscription.productsUsed += 1;
  await subscription.save();

  return newProduct;
};

/**
 * Query for ProductType2
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryProduct = async (filter, options) => {
  const Products = await ProductType2.paginate(filter, options);
  return Products;
};

/**
 * Query for products
 * @param {Object} filter - MongoDB filter
 * @param {Object} options - Query options (e.g., pagination)
 * @returns {Promise<QueryResult>}
 */
const searchProductsWholesalerWise = async (
  filter,
  options,
  wholesalerEmail,
  manufacturerEmail
) => {
  // 🔥 STEP 1: check assignment for THIS manufacturer + wholesaler
  const assignedProducts = await WholesalerProductAssignment.find({
    wholesalerEmail,
    manufacturerEmail,
    isActive: true,
  }).select('productId');

  const assignedProductIds = assignedProducts.map((p) => p.productId);

  // 🔥 STEP 2: apply assignment logic
  if (assignedProductIds.length > 0) {
    // ✅ show only assigned products
    filter._id = { $in: assignedProductIds };
  }
  // ❗ else → show all manufacturer products (no filter needed)

  // 🔍 STEP 3: search support
  if (filter.search) {
    filter.$text = { $search: filter.search };
    delete filter.search;
  }

  // 🔥 STEP 4: fetch products
  const products = await ProductType2.paginate(filter, options);

  // 🔥 STEP 5: price status
  const wholesalerPrices = await WholesalerPriceType2.find({
    WholesalerEmail: wholesalerEmail,
  }).select('productId');

  const priceSet = new Set(
    wholesalerPrices.map((p) => p.productId.toString())
  );

  // 🔥 STEP 6: attach status
  const results = products.results.map((product) => ({
    ...product.toJSON(),
    status: priceSet.has(product._id.toString())
      ? 'Done'
      : 'Pending',
  }));

  return {
    ...products,
    isAssignedFilterApplied: assignedProductIds.length > 0, // 🔥 helpful flag
    results,
  };
};


const searchProducts = async (filter, options) => {
  if (filter.search) {
    filter.$text = { $search: filter.search }; // Add text search condition if search term is present
    delete filter.search;
  }

  const products = await ProductType2.paginate(filter, options); // Paginate with the filtered criteria
  return products;
};


// const searchForWSProducts = async (
//   filter,
//   options,
//   wholesalerEmail,
//   manufacturerEmail
// ) => {
//   // 🔥 STEP 1: Get assigned products
//   const assignedProducts = await WholesalerProductAssignment.find({
//     wholesalerEmail,
//     manufacturerEmail,
//     isActive: true,
//   }).select('productId');

//   // ✅ Convert safely to ObjectId (fix for string/ObjectId mismatch)
//   const assignedProductIds = assignedProducts.map((p) =>
//     mongoose.Types.ObjectId(p.productId)
//   );

//   // 🔥 STEP 2: Count total manufacturer products
//   const totalProducts = await ProductType2.countDocuments({
//     productBy: manufacturerEmail,
//   });

//   // 🔥 STEP 3: Apply filter ONLY if partial assignment
//   if (
//     assignedProductIds.length > 0 &&
//     assignedProductIds.length !== totalProducts
//   ) {
//     filter._id = { $in: assignedProductIds };
//   }

//   // 🔍 STEP 4: Search support
//   if (filter.search) {
//     filter.$text = { $search: filter.search };
//     delete filter.search;
//   }

//   // 🔥 STEP 5: Fetch products
//   const products = await ProductType2.paginate(filter, options);

//   // 🔥 STEP 6: Get wholesaler pricing status
//   const wholesalerPrices = await WholesalerPriceType2.find({
//     WholesalerEmail: wholesalerEmail,
//   }).select('productId');

//   const priceSet = new Set(
//     wholesalerPrices.map((p) => p.productId.toString())
//   );

//   // 🔥 STEP 7: Attach status
//   const results = products.results.map((product) => ({
//     ...product.toJSON(),
//     status: priceSet.has(product._id.toString())
//       ? 'Done'
//       : 'Pending',
//   }));

//   return {
//     ...products,
//     isAssignedFilterApplied:
//       assignedProductIds.length > 0 &&
//       assignedProductIds.length !== totalProducts,
//     results,
//   };
// };
const searchForWSProducts = async (
  filter,
  options,
  wholesalerEmail,
  manufacturerEmail
) => {
  // 🔥 STEP 1: Get assigned products
  const assignedProducts = await WholesalerProductAssignment.find({
    wholesalerEmail,
    manufacturerEmail,
    isActive: true,
  }).select('productId');

  const assignedProductIds = assignedProducts.map((p) =>
    mongoose.Types.ObjectId(p.productId)
  );

  // 🔥 STEP 2: Count total manufacturer products
  const totalProducts = await ProductType2.countDocuments({
    productBy: manufacturerEmail,
  });

  // 🔥 STEP 3: Apply assignment filter ONLY if partial assignment
  if (
    assignedProductIds.length > 0 &&
    assignedProductIds.length !== totalProducts
  ) {
    filter._id = { $in: assignedProductIds };
  }

  // 🔍 STEP 4: Search (text index)
  if (filter.search) {
    filter.$text = { $search: filter.search };
    delete filter.search;
  }

  // 🔥 STEP 5: Optional LIKE search (for productTitle etc.)
  if (filter.productTitle) {
    filter.productTitle = {
      $regex: filter.productTitle,
      $options: 'i',
    };
  }

  // 🔥 STEP 6: Fetch products
  const products = await ProductType2.paginate(filter, options);

  // 🔥 STEP 7: Get wholesaler pricing
  const wholesalerPrices = await WholesalerPriceType2.find({
    WholesalerEmail: wholesalerEmail,
  }).select('productId');

  const priceSet = new Set(
    wholesalerPrices.map((p) => p.productId.toString())
  );

  // 🔥 STEP 8: Attach status
  const results = products.results.map((product) => ({
    ...product.toJSON(),
    status: priceSet.has(product._id.toString())
      ? 'Done'
      : 'Pending',
  }));

  return {
    ...products,
    isAssignedFilterApplied:
      assignedProductIds.length > 0 &&
      assignedProductIds.length !== totalProducts,
    results,
  };
};
/**
 * Get ProductType2 by id
 * @param {ObjectId} id
 * @returns {Promise<ProductType2>}
 */
const getProductById = async (id) => {
  return ProductType2.findById(id);
};

/**
 * Get ProductType2 by id
 * @param {ObjectId} id
 * @returns {Promise<ProductType2>}
 */
const getProductBydesigneNo = async (designNumber, productBy) => {
  return ProductType2.findOne({ designNumber, productBy });
};

/**
 * Update ProductType2 by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<ProductType2>}
 */
const updateProductById = async (id, updateBody) => {
  const product = await getProductById(id);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  Object.assign(product, updateBody);
  await product.save();
  return product;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<Product>}
 */
const deleteProductById = async (id) => {
  const user = await getProductById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  await user.remove();
  return user;
};

/**
 * Update ProductType2 by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<ProductType2>}
 */
const updateColorCollection = async (req, productId) => {
  const uploadedFiles = []; // To track uploaded files for cleanup
  try {
    const product = await ProductType2.findById(productId);

    if (!product) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
    }

    // const { colour, colourName } = req.body;

    const { colour, colourName, colourImage, productImages, productVideo } = req.body;

    // Track uploaded files for rollback
    if (colourImage) uploadedFiles.push(colourImage);
    if (productImages && productImages.length > 0) uploadedFiles.push(...productImages);
    if (productVideo) uploadedFiles.push(productVideo);

    const newColourCollection = {
      colour,
      colourName,
      colourImage: colourImage ? colourImage[0] : null, // Save as-is
      productImages: productImages || [], // Save as-is
      productVideo: productVideo ? productVideo[0] : null, // Save as-is
    };

    // Find the existing collection and update it
    const collectionIndex = product.colourCollections.findIndex((c) => c._id.toString() === req.query.collectionId);

    if (collectionIndex === -1) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Colour collection not found');
    }

    // Update the collection
    product.colourCollections[collectionIndex] = newColourCollection;

    // Save the product
    await product.save();
  } catch (err) {
    // Rollback: Delete uploaded files
    try {
      if (uploadedFiles.length > 0) {
        console.log('Rolling back uploaded files:', uploadedFiles);
        await Promise.all(uploadedFiles.map((file) => deleteFile(file)));
      }
    } catch (deleteErr) {
      console.error('Error during rollback:', deleteErr.message);
    }
    throw err;
  }
};

const updateProductVideo = async (req, productId) => {
  try {
    const { productVideo } = req.body;
    const { collectionId } = req.query;

    if (!productVideo || !productVideo[0]) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'No video provided');
    }

    const product = await ProductType2.findOneAndUpdate(
      { _id: productId, 'colourCollections._id': collectionId },
      { $set: { 'colourCollections.$.productVideo': productVideo[0] } },
      { new: true }
    );

    if (!product) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product or Colour Collection not found');
    }

    return product;
  } catch (err) {
    throw err;
  }
};

const updateProductImages = async (req) => {
  try {
    const { productImage } = req.body;
    const { productId, collectionId } = req.params;

    if (!productImage) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'No image provided');
    }

    const updatedProduct = await ProductType2.findOneAndUpdate(
      { _id: productId, 'colourCollections._id': collectionId },
      { $set: { 'colourCollections.$.productImages': [productImage] } }, // Replaces existing images with the new one
      { new: true }
    );

    if (!updatedProduct) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product or Colour Collection not found');
    }

    return updatedProduct;
  } catch (err) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Error to updateProduct Images update ');
  }
};

/**
 * Delete user by id
 * @param {ObjectId} Id
 * @returns {Promise<ProductType2>}
 */
const deleteColorCollection = async (productId, collectionId) => {
  const product = await ProductType2.findById(productId);

  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  const collectionIndex = product.colourCollections.findIndex((c) => c._id.toString() === collectionId);
  if (collectionIndex === -1) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Colour collection not found');
  }

  const collection = product.colourCollections[collectionIndex];

  // Delete files from S3
  if (collection.colourImage) {
    await deleteFile(collection.colourImage);
  }
  if (collection.productImages && collection.productImages.length > 0) {
    await Promise.all(collection.productImages.map((image) => deleteFile(image)));
  }
  if (collection.productVideo) {
    await deleteFile(collection.productVideo);
  }

  product.colourCollections.splice(collectionIndex, 1);
  await product.save();
};

/**
 * Filter products and fetch manufacturer details
 * @param {ObjectId} productId
 *  @param {ObjectId} collectionId
 * @returns {Promise<Object[]>}
 */

const deleteProductImages = async (productId, collectionId) => {
  const product = await ProductType2.findById(productId);

  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  const collectionIndex = product.colourCollections.findIndex((c) => c._id.toString() === collectionId);
  if (collectionIndex === -1) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Colour collection not found');
  }

  const collection = product.colourCollections[collectionIndex];

  // Delete files from S3 only for productImages
  if (collection.productImages && collection.productImages.length > 0) {
    await Promise.all(collection.productImages.map((image) => deleteFile(image)));
  }

  // Remove productImages from the collection (set it to an empty array)
  product.colourCollections[collectionIndex].productImages = [];

  await product.save();
};

/**
 * Delete product video
 * @param {ObjectId} productId
 *  @param {ObjectId} collectionId
 * @returns {Promise<Object[]>}
 */
const deleteProductVideo = async (productId, collectionId) => {
  const product = await ProductType2.findById(productId);

  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  const collectionIndex = product.colourCollections.findIndex((c) => c._id.toString() === collectionId);
  if (collectionIndex === -1) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Colour collection not found');
  }

  const collection = product.colourCollections[collectionIndex];

  // Delete file from S3 only for productVideo
  if (collection.productVideo) {
    await deleteFile(collection.productVideo);
  }

  product.colourCollections[collectionIndex].productVideo = null;

  await product.save();
};

const filterProductsAndFetchManufactureDetails = async (filters) => {
  const query = {};

  // Build the query based on the filters provided
  if (filters.productType) {
    query.productType = filters.productType;
  }
  if (filters.gender) {
    query.gender = filters.gender;
  }
  if (filters.clothing) {
    query.clothing = filters.clothing;
  }
  if (filters.subCategory) {
    query.subCategory = filters.subCategory;
  }
  if (filters.productTitle) {
    query.productTitle = { $regex: filters.productTitle, $options: 'i' };
  }
  if (filters.country) {
    query.country = filters.country;
  }
  if (filters.city) {
    query.city = filters.city;
  }
  if (filters.state) {
    query.state = filters.state;
  }

  // Get filtered products
  const products = await ProductType2.find(query);

  // Fetch manufacturer, brand, and request details for each product
  const productDetails = await Promise.all(
    products.map(async (product) => {
      // Fetch manufacturer details
      const manufacturer = await Manufacture.findOne({ email: product.productBy });

      // Fetch brand details by productBy
      const brand = await Brand.findOne({ brandOwner: product.productBy });

      // Fetch request details by both email and requestByEmail
      const requestDetails = await Request.findOne({
        email: product.productBy, // Match product's productBy email
        requestByEmail: filters.requestByEmail, // Match filters requestByEmail
      });

      // Only include request if status is not 'accepted'
      if (requestDetails && requestDetails.status === 'accepted') {
        return null; // Skip this product if the request is accepted
      }

      return {
        product,
        manufacturer,
        brand, // Include the brand object
        requestDetails, // Include the requestDetails object
      };
    })
  );

  // Filter out null results (where the request was 'accepted')
  return productDetails.filter((detail) => detail !== null);
};
const checkProductExistence = async (designNumber, brand) => {
  const product = await ProductType2.findOne({ designNumber, brand });
  return product;
};

const assignProductsToWholesaler = async (
  manufacturerEmail,
  wholesalerEmail,
  productIds
) => {

  // 🔥 STEP 1: Validate products belong to manufacturer
  const products = await ProductType2.find({
    _id: { $in: productIds },
    productBy: manufacturerEmail,
  });

  if (products.length !== productIds.length) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Some products do not belong to this manufacturer'
    );
  }

  // 🔥 STEP 2: Prepare bulk operations
  const bulkOps = productIds.map((productId) => ({
    updateOne: {
      filter: {
        productId,
        wholesalerEmail,
      },
      update: {
        productId,
        wholesalerEmail,
        manufacturerEmail,
        assignedBy: manufacturerEmail,
        isActive: true,
        assignedDate: new Date(),
      },
      upsert: true, // ✅ create if not exists
    },
  }));

  // 🔥 STEP 3: Execute bulk
  await WholesalerProductAssignment.bulkWrite(bulkOps);

  return {
    message: 'Products assigned successfully',
    totalAssigned: productIds.length,
  };
};

const getWholesalerProducts = async (
  wholesalerEmail,
  filter,
  options
) => {
  // 🔥 Step 1: get assigned products
  const assignmentFilter = {
    wholesalerEmail,
    isActive: true,
  };

  if (filter.manufacturerEmail) {
    assignmentFilter.manufacturerEmail = filter.manufacturerEmail;
  }

  const assignments = await WholesalerProductAssignment.find(
    assignmentFilter
  ).select('productId manufacturerEmail');

  const productIds = assignments.map((a) => a.productId);

  if (!productIds.length) {
    return {
      results: [],
      page: 1,
      limit: options.limit || 10,
      totalPages: 0,
      totalResults: 0,
    };
  }

  // 🔥 Step 2: fetch products
  const products = await ProductType2.paginate(
    { _id: { $in: productIds } },
    options
  );

  // 🔥 Step 3: price status
  const prices = await WholesalerPriceType2.find({
    WholesalerEmail: wholesalerEmail,
  }).select('productId');

  const priceSet = new Set(
    prices.map((p) => p.productId.toString())
  );

  // 🔥 Step 4: attach manufacturer + status
  const results = products.results.map((product) => {
    const assignment = assignments.find(
      (a) => a.productId.toString() === product._id.toString()
    );

    return {
      ...product.toJSON(),
      manufacturerEmail: assignment?.manufacturerEmail,
      status: priceSet.has(product._id.toString())
        ? 'Done'
        : 'Pending',
    };
  });

  return {
    ...products,
    results,
  };
};


// const getProductsByManufacturerForWholesaler = async (
//   wholesalerEmail,
//   manufacturerEmail,
//   filter,
//   options
// ) => {
//   // 🔥 STEP 1: get assigned products
//   const assignments = await WholesalerProductAssignment.find({
//     wholesalerEmail,
//     manufacturerEmail,
//     isActive: true,
//   }).select('productId');

//   const productIds = assignments.map((a) => a.productId);

//   if (!productIds.length) {
//     return {
//       results: [],
//       page: 1,
//       limit: options.limit,
//       totalPages: 0,
//       totalResults: 0,
//     };
//   }

//   // 🔥 STEP 2: apply filters
//   const productFilter = {
//     _id: { $in: productIds },
//     ...filter,
//   };

//   // 🔍 Search support
//   if (filter.search) {
//     productFilter.$text = { $search: filter.search };
//     delete productFilter.search;
//   }

//   // 🔥 STEP 3: fetch products
//   const products = await ProductType2.paginate(productFilter, options);

//   // 🔥 STEP 4: get pricing status
//   const prices = await WholesalerPriceType2.find({
//     WholesalerEmail: wholesalerEmail,
//   }).select('productId');

//   const priceSet = new Set(prices.map((p) => p.productId.toString()));

//   // 🔥 STEP 5: manufacturer details
//   const manufacturer = await Manufacture.findOne({
//     email: manufacturerEmail,
//   }).select('fullName companyName profileImg');

//   // 🔥 STEP 6: attach status
//   const results = products.results.map((product) => ({
//     ...product.toJSON(),
//     status: priceSet.has(product._id.toString())
//       ? 'Done'
//       : 'Pending',
//   }));

//   return {
//     manufacturer,
//     ...products,
//     results,
//   };
// };
const getProductsByManufacturerForWholesaler = async (
  wholesalerEmail,
  manufacturerEmail,
  filter,
  options
) => {
  // 🔥 STEP 1: assigned products
  const assignments = await WholesalerProductAssignment.find({
    wholesalerEmail,
    manufacturerEmail,
    isActive: true,
  }).select('productId');

  const productIds = assignments.map((a) => a.productId);

  if (!productIds.length) {
    return {
      results: [],
      page: 1,
      limit: options.limit,
      totalPages: 0,
      totalResults: 0,
    };
  }

  // 🔥 STEP 2: filters
  const productFilter = {
    _id: { $in: productIds },
  };

  // Apply normal filters
  Object.keys(filter).forEach((key) => {
    if (filter[key] && key !== 'search') {
      productFilter[key] = filter[key];
    }
  });

  // 🔍 Search
  if (filter.search) {
    productFilter.$text = { $search: filter.search };
  }

  // 🔥 STEP 3: fetch products
  const products = await ProductType2.paginate(productFilter, options);

  // 🔥 STEP 4: price status
  const prices = await WholesalerPriceType2.find({
    WholesalerEmail: wholesalerEmail,
  }).select('productId');

  const priceSet = new Set(
    prices.map((p) => p.productId.toString())
  );

  // 🔥 STEP 5: manufacturer details
  const manufacturer = await Manufacture.findOne({
    email: manufacturerEmail,
  }).select('fullName companyName profileImg');

  // 🔥 STEP 6: attach status
  const results = products.results.map((product) => ({
    ...product.toJSON(),
    status: priceSet.has(product._id.toString())
      ? 'Done'
      : 'Pending',
  }));

  return {
    manufacturer,
    ...products,
    results,
  };
};

const getAssignedProductsWholesalerWise = async (
  manufacturerEmail,
  wholesalerEmail,
  filter,
  options
) => {
  // 🔥 STEP 1: Get assignments
  const assignmentFilter = {
    manufacturerEmail,
    isActive: true,
  };

  if (wholesalerEmail) {
    assignmentFilter.wholesalerEmail = wholesalerEmail;
  }

  const assignments = await WholesalerProductAssignment.find(
    assignmentFilter
  ).select('productId wholesalerEmail');

  if (!assignments.length) {
    return [];
  }

  // 🔥 STEP 2: Group productIds by wholesaler
  const wholesalerMap = {};

  assignments.forEach((a) => {
    if (!wholesalerMap[a.wholesalerEmail]) {
      wholesalerMap[a.wholesalerEmail] = [];
    }
    wholesalerMap[a.wholesalerEmail].push(a.productId);
  });

  const wholesalerEmails = Object.keys(wholesalerMap);

  // 🔥 STEP 3: Get wholesaler details
  const wholesalers = await User.find({
    email: { $in: wholesalerEmails },
  }).select('email fullName companyName');

  const wholesalerDetailsMap = {};
  wholesalers.forEach((w) => {
    wholesalerDetailsMap[w.email] = w;
  });

  // 🔥 STEP 4: Fetch products per wholesaler
  const finalData = [];

  for (const email of wholesalerEmails) {
    let productFilter = {
      _id: { $in: wholesalerMap[email] },
    };

    // Apply filters
    Object.keys(filter).forEach((key) => {
      if (filter[key] && key !== 'search') {
        productFilter[key] = filter[key];
      }
    });

    if (filter.search) {
      productFilter.$text = { $search: filter.search };
    }

    const products = await ProductType2.paginate(
      productFilter,
      options
    );

    finalData.push({
      wholesalerEmail: email,
      wholesaler:
        wholesalerDetailsMap[email] || null,
      ...products,
    });
  }

  return finalData;
};

const getProductsByWholesalerForManufacturer = async (
  manufacturerEmail,
  wholesalerEmail,
  filter,
  options
) => {
  // 🔥 STEP 1: Get assigned products
  const assignments = await WholesalerProductAssignment.find({
    manufacturerEmail,
    wholesalerEmail,
    isActive: true,
  }).select('productId');

  const productIds = assignments.map((a) => a.productId);

  if (!productIds.length) {
    return {
      wholesaler: null,
      results: [],
      page: 1,
      limit: options.limit,
      totalPages: 0,
      totalResults: 0,
    };
  }

  // 🔥 STEP 2: Build product filter
  const productFilter = {
    _id: { $in: productIds },
  };

  Object.keys(filter).forEach((key) => {
    if (filter[key] && key !== 'search') {
      productFilter[key] = filter[key];
    }
  });

  if (filter.search) {
    productFilter.$text = { $search: filter.search };
  }

  // 🔥 STEP 3: Get products
  const products = await ProductType2.paginate(productFilter, options);

  // 🔥 STEP 4: Get wholesaler details
  const wholesaler = await User.findOne({
    email: wholesalerEmail,
  }).select('email fullName companyName');

  return {
    wholesaler,
    ...products,
  };
};

module.exports = {
  fileupload,
  createProduct,
  queryProduct,
  searchProducts,
  searchProductsWholesalerWise,
  searchForWSProducts,
  getProductById,
  getProductBydesigneNo,
  updateProductById,
  deleteProductById,
  updateColorCollection,
  updateProductVideo,
  updateProductImages,
  deleteColorCollection,
  deleteProductVideo,
  deleteProductImages,
  assignProductsToWholesaler,
  filterProductsAndFetchManufactureDetails,
  checkProductExistence,
  getWholesalerProducts,
  getProductsByManufacturerForWholesaler,
  getAssignedProductsWholesalerWise,
  getProductsByWholesalerForManufacturer,
};
