const httpStatus = require('http-status');
const { Brand, Manufacture, Request, User, Wholesaler } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a Brand
 * @param {Object} reqBody
 * @returns {Promise<Brand>}
 */
const createBrand = async (reqBody) => {
  return Brand.create(reqBody);
};

/**
 * Query for Brand
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryBrand = async (filter, options) => {
  const Brands = await Brand.paginate(filter, options);
  return Brands;
};

/**
 * Get Brand by id
 * @param {ObjectId} id
 * @returns {Promise<Brand>}
 */
const getBrandById = async (id) => {
  return Brand.findById(id);
};

/**
 * Get Brand by id
 * @param {ObjectId} email
 * @returns {Promise<Brand>}
 */
const getBrandByEmail = async (email) => {
  return Brand.find({ brandOwner: email });
};

/**
 * Get Brand by id
 * @param {ObjectId} email
 * @param {ObjectId} visibility
 * @returns {Promise<Brand>}
 */
const getBrandByEmailAndVisibility = async (email, visibility) => {
  return Brand.find({ brandOwner: email, visibility });
};

/**
 * Update Brand by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<Brand>}
 */
const updateBrandById = async (id, updateBody) => {
  const user = await getBrandById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Brand not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<Brand>}
 */
const deleteBrandById = async (id) => {
  const user = await getBrandById(id);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Brand not found');
  }
  await user.remove();
  return user;
};

// const searchBrandAndOwnerDetails = async (brandName) => {
//   const brands = await Brand.find({ brandName: { $regex: brandName, $options: 'i' } });

//   if (brands.length === 0) {
//     return [];
//   }
//   const brandOwners = brands.map((brand) => brand.brandOwner);
//   const ownersDetails = await Manufacture.find({
//     email: { $in: brandOwners },
//   });

//   // Create a map to easily associate each brandOwner email with its corresponding owner details
//   const ownerDetailsMap = new Map(ownersDetails.map((owner) => [owner.email, owner]));
//   // Combine brand details with corresponding owner details
//   const combinedDetails = brands.map((brand) => {
//     const ownerDetails = ownerDetailsMap.get(brand.brandOwner) || {};
//     return {
//       ...brand.toObject(),
//       ownerDetails: ownerDetails.toObject ? ownerDetails.toObject() : ownerDetails,
//     };
//   });

//   return combinedDetails;
// };
// const searchBrandAndOwnerDetails = async (brandName, requestByEmail) => {
//   // Search for brands matching the brandName
//   const brands = await Brand.find({ brandName: { $regex: brandName, $options: 'i' } });

//   if (brands.length === 0) {
//     return [];
//   }

//   // Extract the emails of brand owners
//   const brandOwners = brands.map((brand) => brand.brandOwner);

//   // Fetch the owner details for the brand owners
//   const ownersDetails = await Manufacture.find({ email: { $in: brandOwners } });

//   // Fetch the request details based on requestByEmail and brandOwner (email)
//   const requestDetails = await Request.find({
//     email: { $in: brandOwners },
//     requestByEmail,
//   });

//   // Create a map for owner details and request details
//   const ownerDetailsMap = new Map(ownersDetails.map((owner) => [owner.email, owner]));
//   const requestDetailsMap = new Map(requestDetails.map((request) => [request.email, request]));

//   // Combine brand details with corresponding owner and request details
//   const combinedDetails = brands.map((brand) => {
//     const ownerDetails = ownerDetailsMap.get(brand.brandOwner) || {};
//     const requestDetail = requestDetailsMap.get(brand.brandOwner) || {}; // get request by email

//     return {
//       ...brand.toObject(),
//       ownerDetails: ownerDetails.toObject ? ownerDetails.toObject() : ownerDetails,
//       requestDetails: requestDetail.toObject ? requestDetail.toObject() : requestDetail,
//     };
//   });

//   return combinedDetails;
// };

const searchBrandAndOwnerDetails = async (brandName, requestByEmail) => {
  // Search for brands matching the brandName
  const brands = await Brand.find({ brandName: { $regex: brandName, $options: 'i' } });

  if (brands.length === 0) {
    return [];
  }

  // Extract the emails of brand owners
  const brandOwners = brands.map((brand) => brand.brandOwner);

  // Fetch the owner details for the brand owners
  const ownersDetails = await Manufacture.find({ email: { $in: brandOwners } });

  // Fetch the request details based on requestByEmail and brandOwner (email)
  const requestDetails = await Request.find({
    email: { $in: brandOwners },
    requestByEmail,
  });

  // Filter out request details with status 'accepted'
  const filteredRequestDetails = requestDetails.filter((request) => request.status !== 'accepted');

  // Create a map for owner details and filtered request details
  const ownerDetailsMap = new Map(ownersDetails.map((owner) => [owner.email, owner]));
  const requestDetailsMap = new Map(filteredRequestDetails.map((request) => [request.email, request]));

  // Combine brand details with corresponding owner and request details
  const combinedDetails = brands.map((brand) => {
    const ownerDetails = ownerDetailsMap.get(brand.brandOwner) || {};
    const requestDetail = requestDetailsMap.get(brand.brandOwner) || {}; // get request by email

    return {
      ...brand.toObject(),
      ownerDetails: ownerDetails.toObject ? ownerDetails.toObject() : ownerDetails,
      requestDetails: requestDetail.toObject ? requestDetail.toObject() : requestDetail,
    };
  });

  return combinedDetails;
};

// const searchBrandAndOwnerDetails = async (brandName, requestByEmail) => {
//   // Step 1: Fetch the user based on requestByEmail
//   const user = await User.findOne({ email: requestByEmail });
//   if (!user) {
//     throw new Error('User not found');
//   }
//   // Step 2: Get the refByEmail array from the user
//   const { refByEmail } = user;
//   // Step 3: Search for brands matching the brandName
//   const brands = await Brand.find({ brandName: { $regex: brandName, $options: 'i' } });
//   if (brands.length === 0) {
//     return [];
//   }
//   // Step 4: Extract the emails of brand owners
//   const brandOwners = brands.map((brand) => brand.brandOwner);
//   // Step 5: Fetch the owner details for the brand owners
//   const ownersDetails = await Manufacture.find({ email: { $in: brandOwners } });
//   // Step 6: Fetch the request details based on requestByEmail and brandOwner (email)
//   const requestDetails = await Request.find({
//     email: { $in: brandOwners },
//     requestByEmail,
//   });

//   // Step 7: Filter out request details with status 'accepted'
//   const filteredRequestDetails = requestDetails.filter((request) => request.status !== 'accepted');
//   // Step 8: Create a map for owner details and filtered request details
//   const ownerDetailsMap = new Map(ownersDetails.map((owner) => [owner.email, owner]));
//   const requestDetailsMap = new Map(filteredRequestDetails.map((request) => [request.email, request]));
//   // Step 9: Combine brand details with corresponding owner and request details
//   const combinedDetails = brands.map((brand) => {
//     const ownerDetails = ownerDetailsMap.get(brand.brandOwner) || {};
//     const requestDetail = requestDetailsMap.get(brand.brandOwner) || {}; // get request by email
//     if (refByEmail.includes(brand.brandOwner)) {
//       return null;
//     }
//     return {
//       ...brand.toObject(),
//       ownerDetails: ownerDetails.toObject ? ownerDetails.toObject() : ownerDetails,
//       requestDetails: requestDetail.toObject ? requestDetail.toObject() : requestDetail,
//     };
//   });
//   // Step 11: Filter out null values (those where brandOwner was in refByEmail)
//   return combinedDetails.filter((detail) => detail !== null);
// };

const getBrandsAndWholesalers = async (brandNamePattern, requestByEmail) => {
  // Step 1: Find brands matching the pattern
  const brands = await Brand.find({ brandName: { $regex: brandNamePattern, $options: 'i' } }).exec();
  if (!brands || brands.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No brands found matching the criteria');
  }

  // Extract brand owners' emails
  const brandOwnerEmails = brands.map((brand) => brand.brandOwner);

  // Step 2: Find users with the specified criteria
  const users = await User.find({
    refByEmail: { $in: brandOwnerEmails },
    role: 'wholesaler',
    userCategory: 'orderwise',
  }).exec();

  if (!users || users.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No wholesalers found for the specified brands');
  }

  // Step 3: Get wholesalers' details from the Wholesaler collection
  const wholesalerEmails = users.map((user) => user.email);
  const wholesalers = await Wholesaler.find({ email: { $in: wholesalerEmails } }).exec();

  // Step 4: Fetch request details based on `requestByEmail` and brandOwner
  const requestDetails = await Request.find({
    email: { $in: wholesalerEmails },
    requestByEmail,
  });

  // Filter out request details with status 'accepted'
  const filteredRequestDetails = requestDetails.filter((request) => request.status !== 'accepted');

  // Create a map for request details
  const requestDetailsMap = new Map(
    filteredRequestDetails.map((request) => [request.email, request])
  );

  // Step 5: Combine brands with their associated wholesalers and request details
  const result = brands.map((brand) => {
    const associatedWholesalers = users
      .filter((user) => user.refByEmail.includes(brand.brandOwner))
      .map((user) => wholesalers.find((wholesaler) => wholesaler.email === user.email));
    const requestDetail = requestDetailsMap.get(brand.brandOwner) || {};
    return {
      brand: brand.toObject(),
      wholesalers: associatedWholesalers.map((wholesaler) =>
        wholesaler ? wholesaler.toObject() : null
      ),
      requestDetails: requestDetail.toObject ? requestDetail.toObject() : requestDetail,
    };
  });

  return result;
};


module.exports = {
  createBrand,
  queryBrand,
  getBrandById,
  getBrandsAndWholesalers,
  updateBrandById,
  deleteBrandById,
  searchBrandAndOwnerDetails,
  getBrandByEmail,
  getBrandByEmailAndVisibility,
};
