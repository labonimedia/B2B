const httpStatus = require("http-status");
const ApiError = require("../../utils/ApiError");
const { ManufactureBOM } = require('../../models');

/* -----------------------------------------------------------
    CREATE BOM (Single or Multiple)
------------------------------------------------------------ */
const createBOM = async (reqBody) => {
  if (Array.isArray(reqBody)) {
    return ManufactureBOM.insertMany(reqBody);
  }
  return ManufactureBOM.create(reqBody);
};

/* -----------------------------------------------------------
    PAGINATED QUERY
------------------------------------------------------------ */
const queryBOMs = async (filter, options) => {
  return ManufactureBOM.paginate(filter, options);
};

/* -----------------------------------------------------------
    GET BOM BY ID
------------------------------------------------------------ */
const getBOMById = async (id) => {
  return ManufactureBOM.findById(id);
};

/* -----------------------------------------------------------
    UPDATE BOM BY ID
------------------------------------------------------------ */
const updateBOMById = async (id, updateBody) => {
  const bom = await getBOMById(id);
  if (!bom) {
    throw new ApiError(httpStatus.NOT_FOUND, "BOM not found");
  }

  Object.assign(bom, updateBody);
  await bom.save();
  return bom;
};

/* -----------------------------------------------------------
    DELETE BOM BY ID
------------------------------------------------------------ */
const deleteBOMById = async (id) => {
  const bom = await getBOMById(id);
  if (!bom) {
    throw new ApiError(httpStatus.NOT_FOUND, "BOM not found");
  }
  await bom.remove();
  return bom;
};

/* -----------------------------------------------------------
    GET BOM — By manufacturer + design
------------------------------------------------------------ */
const getBOMByDesign = async (manufacturerEmail, designNumber) => {
  return ManufactureBOM.find({ manufacturerEmail, designNumber });
};

/* -----------------------------------------------------------
    ADVANCED SEARCH (with pagination)
    - Supports: global search, nested search, multiple filters
------------------------------------------------------------ */
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

  /* ---- BASIC FILTERS ---- */
  if (productId) filter.productId = productId;
  if (manufacturerEmail) filter.manufacturerEmail = manufacturerEmail;
  if (designNumber) filter.designNumber = designNumber;

  /* ---- NESTED FILTERS ---- */
  const andFilters = [];

  if (color) {
    andFilters.push({ "colors.color": color });
  }

  if (size) {
    andFilters.push({ "colors.sizes.size": size });
  }

  if (andFilters.length > 0) {
    filter.$and = andFilters;
  }

  /* ---- GLOBAL SEARCH ---- */
  if (search && search.trim() !== "") {
    const regex = new RegExp(search, "i");

    filter.$or = [
      { manufacturerEmail: regex },
      { designNumber: regex },
      { "colors.color": regex },
      { "colors.sizes.size": regex },
      { "colors.sizes.materials.materialName": regex },
      { "colors.sizes.materials.materialCode": regex },
      { "colors.sizes.materials.categoryName": regex },
      { "colors.sizes.materials.subcategoryName": regex },
    ];
  }

  /* ---- PAGINATION OPTIONS ---- */
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
  getBOMByDesign,
  searchBOM,
};
