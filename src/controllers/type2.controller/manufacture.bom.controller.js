const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const pick = require('../../utils/pick');
const { manufactureBOMService } = require('../../services');

/* Create Single / Bulk BOM */
const createBOM = catchAsync(async (req, res) => {
  const bom = await manufactureBOMService.createBOM(req.body);
  res.status(httpStatus.CREATED).send({ success: true, data: bom });
});

/* List BOMs */
const getBOMs = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['manufacturerEmail', 'designNumber', 'color', 'size', 'productId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await manufactureBOMService.queryBOMs(filter, options);

  res.send({ success: true, data: result });
});

/* Get BOM by ID */
const getBOMById = catchAsync(async (req, res) => {
  const bom = await manufactureBOMService.getBOMById(req.params.id);
  if (!bom) return res.status(404).send({ message: 'BOM not found' });
  res.send({ success: true, data: bom });
});

/* Update BOM */
const updateBOMById = catchAsync(async (req, res) => {
  const updated = await manufactureBOMService.updateBOMById(req.params.id, req.body);
  res.send({ success: true, data: updated });
});

/* Delete BOM */
const deleteBOMById = catchAsync(async (req, res) => {
  await manufactureBOMService.deleteBOMById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

/* Get BOM by design + color (all sizes) */
const getBOMByDesignColor = catchAsync(async (req, res) => {
  const { manufacturerEmail, designNumber, color } = req.query;
  const data = await manufactureBOMService.getBOMByDesignColor(manufacturerEmail, designNumber, color, size);
  res.send({ success: true, data });
});

module.exports = {
  createBOM,
  getBOMs,
  getBOMById,
  updateBOMById,
  deleteBOMById,
  getBOMByDesignColor,
};
