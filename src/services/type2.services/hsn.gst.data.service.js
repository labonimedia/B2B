const { HSN } = require('minute-designs-hsn-code'); // Import HSN utility from package

/**
 * Query HSN codes, with optional search, sorting, and pagination
 * @param {Object} filter - Filter object e.g. { search: 'cotton' }
 * @param {Object} options - Options for pagination and sorting { limit, page, sortBy }
 * @returns {Object} paginated results
 */
const queryHsnCodes = async (filter, options) => {
  let data = HSN.getHSNCodes(); // Get all HSN codes as array

  if (filter.search) {
    const searchLower = filter.search.toLowerCase();
    data = data.filter(
      (item) =>
        item.hsn.toString().includes(searchLower) ||
        (item.description && item.description.toLowerCase().includes(searchLower))
    );
  }

  // Sorting by provided key (e.g., hsn or description)
  if (options.sortBy) {
    const [key, order] = options.sortBy.split(':');
    data.sort((a, b) => {
      if (a[key] === undefined || b[key] === undefined) return 0;
      if (order === 'desc') return String(b[key]).localeCompare(String(a[key]));
      return String(a[key]).localeCompare(String(b[key]));
    });
  }

  // Pagination
  const page = parseInt(options.page, 10) || 1;
  const limit = parseInt(options.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedData = data.slice(startIndex, endIndex);

  return {
    results: paginatedData,
    page,
    limit,
    totalResults: data.length,
    totalPages: Math.ceil(data.length / limit),
  };
};

/**
 * Get a specific HSN code details
 * @param {string} hsnCode
 * @returns {Object|null} HSN code details or null if not found
 */
const getHsnCodeByCode = async (hsnCode) => {
  return HSN.getHSNCodes().find((item) => item.hsn === hsnCode);
};

module.exports = {
  queryHsnCodes,
  getHsnCodeByCode,
};
