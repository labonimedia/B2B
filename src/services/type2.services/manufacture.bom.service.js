const httpStatus = require("http-status");
const ApiError = require("../../utils/ApiError");
const { ManufactureBOM } = require('../../models');

/* Create BOM (Single or Multiple Sizes) */
const createBOM = async (reqBody) => {
  // If array -> bulk insert
  if (Array.isArray(reqBody)) {
    return ManufactureBOM.insertMany(reqBody);
  }

  // Single BOM
  return ManufactureBOM.create(reqBody);
};

/* Query BOM with pagination */
const queryBOMs = async (filter, options) => {
  return ManufactureBOM.paginate(filter, options);
};

/* Get BOM by ID */
const getBOMById = async (id) => {
  return ManufactureBOM.findById(id);
};

/* Update BOM */
const updateBOMById = async (id, updateBody) => {
  const bom = await getBOMById(id);
  if (!bom) {
    throw new ApiError(httpStatus.NOT_FOUND, "BOM not found");
  }
  Object.assign(bom, updateBody);
  await bom.save();
  return bom;
};

/* Delete BOM */
const deleteBOMById = async (id) => {
  const bom = await getBOMById(id);
  if (!bom) {
    throw new ApiError(httpStatus.NOT_FOUND, "BOM not found");
  }
  await bom.remove();
  return bom;
};

/* Get BOM for a Product by Design + Color (all sizes) */
const getBOMByDesignColor = async (manufacturerEmail, designNumber) => {
  return ManufactureBOM.find({ manufacturerEmail, designNumber });
};


/**
 * Search BOM with pagination & multiple filters
 */
const searchBOM = async (reqBody) => {
  let {
    search,
    productId,
    manufacturerEmail,
    designNumber,
    color,
    size,
    page = 1,
    limit = 10,
  } = reqBody;

  const filter = {};

  // ✔ Exact filters
  if (productId) filter.productId = productId;
  if (manufacturerEmail) filter.manufacturerEmail = manufacturerEmail;
  if (designNumber) filter.designNumber = designNumber;

  // ✔ Size + Color filter (inside nested array)
  if (color || size) {
    filter.sizes = {
      $elemMatch: {},
    };

    if (color) filter.sizes.$elemMatch.color = color;
    if (size) filter.sizes.$elemMatch.size = size;
  }

  // ✔ Global search (partial match across fields)
  if (search && search.trim() !== "") {
    const regex = new RegExp(search, "i");

    filter.$or = [
      { manufacturerEmail: regex },
      { designNumber: regex },
      { "sizes.color": regex },
      { "sizes.size": regex },
      { "sizes.materials.materialName": regex },
      { "sizes.materials.materialCode": regex },
    ];
  }

  const options = {
    page: Number(page),
    limit: Number(limit),
    sortBy: "createdAt:desc",
  };

  const result = await ManufactureBOM.paginate(filter, options);

  return {
    total: result.totalResults,
    totalPages: result.totalPages,
    page: result.page,
    limit: result.limit,
    data: result.results,
  };
};

module.exports = {
  createBOM,
  queryBOMs,
  getBOMById,
  updateBOMById,
  deleteBOMById,
  getBOMByDesignColor,
  searchBOM,
};
