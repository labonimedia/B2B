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
const getBOMByDesignColor = async (manufacturerEmail, designNumber, color, size) => {
  return ManufactureBOM.find({ manufacturerEmail, designNumber, color, size});
};

module.exports = {
  createBOM,
  queryBOMs,
  getBOMById,
  updateBOMById,
  deleteBOMById,
  getBOMByDesignColor,
};
