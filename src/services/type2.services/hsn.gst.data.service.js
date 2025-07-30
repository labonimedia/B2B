const { HsnGst } = require('../../models');

/**
 * Query HSN codes, with optional search, sorting, and pagination
 * @param {Object} filter - Filter object e.g. { search: 'cotton' }
 * @param {Object} options - Options for pagination and sorting { limit, page, sortBy }
 * @returns {Object} paginated results
 */
const queryHsnCodes = async (filter, options) => {
  return HsnGst.paginate(filter, options);
};

/**
 * Get a specific HSN code details
 * @param {string} hsnCode
 * @returns {Object|null} HSN code details or null if not found
 */
const getHsnCodeByCode = async (hsnCode) => {
/**
 * Get a single M2R Performa Invoice by ID
 */
  return HsnGst.findOne({hsnCode:hsnCode});

};
/**
 * Bulk Upload HSN-GST Records from CSV
 * @param {Array<Object>} hsnArray - Parsed CSV data as array of objects
 * @param {String|null} csvFilePath - Not used anymore
 * @param {Object} user - Logged-in user (optional, can log uploader info if needed)
 * @returns {Promise<Array<Object>>} - Created or updated HSN entries
 */
const bulkUpload = async (hsnArray = [], csvFilePath = null,) => {
  if (!hsnArray || !Array.isArray(hsnArray) || !hsnArray.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Missing or empty HSN data array');
  }

  const results = await Promise.all(
    hsnArray.map(async (record) => {
      const { hsnCode, gst, description } = record;

      // Basic validation
      if (!hsnCode || !gst) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'HSN Code and GST are required fields');
      }

      // Check if the HSN code already exists
      const existing = await HsnGst.findOne({ hsnCode });

      if (existing) {
        // Update existing record if needed
        existing.gst = gst;
        if (description) existing.description = description;
        return existing.save();
      }

      // Create new record
      return HsnGst.create({
        hsnCode,
        gst,
        description: description || null,
      });
    })
  );

  return results;
};

module.exports = {
  queryHsnCodes,
  getHsnCodeByCode,
  bulkUpload,
};
