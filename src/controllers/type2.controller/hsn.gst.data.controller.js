const catchAsync = require('../../utils/catchAsync');
const pick = require('../../utils/pick');
const { gstHsnService } = require('../../services');

/**
 * GET /api/hsn
 * Get list of GST HSN codes, optional filters & pagination
 */
const getHsnCodes = catchAsync(async (req, res) => {
  // Example: Allow query params like `limit`, `page`, or `search`
  const filter = pick(req.query, ['search']); // extend filters as needed
  const options = pick(req.query, ['limit', 'page', 'sortBy']);

  const result = await gstHsnService.queryHsnCodes(filter, options);
   res.status(httpStatus.CREATED).send(result);
});

/**
 * GET /api/hsn/:hsnCode
 * Get details of specific HSN code
 */
const getHsnCodeDetails = catchAsync(async (req, res) => {
  const hsnCode = req.params.hsnCode;
  const hsnDetails = await gstHsnService.getHsnCodeByCode(hsnCode);

  if (!hsnDetails) {
    return res.status(404).json({ message: 'HSN code not found' });
  }

   res.status(httpStatus.CREATED).send(hsnDetails);
});

module.exports = {
  getHsnCodes,
  getHsnCodeDetails,
};
