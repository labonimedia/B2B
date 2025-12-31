const httpStatus = require("http-status");
const catchAsync = require("../../utils/catchAsync");
const pick = require("../../utils/pick");
const { manufactureBOMService } = require("../../services");

/* -----------------------------------------------------------
    CREATE BOM (Single or Multiple)
------------------------------------------------------------ */
const createBOM = catchAsync(async (req, res) => {
  const bom = await manufactureBOMService.createBOM(req.body);
  res.status(httpStatus.CREATED).send({ success: true, data: bom });
});

/* -----------------------------------------------------------
    LIST BOMs (Simple Pagination List)
------------------------------------------------------------ */
const getBOMs = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["productId", "manufacturerEmail", "designNumber"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);

  const result = await manufactureBOMService.queryBOMs(filter, options);

  res.send({ success: true, data: result });
});

/* -----------------------------------------------------------
    GET BOM BY ID
------------------------------------------------------------ */
const getBOMById = catchAsync(async (req, res) => {
  const bom = await manufactureBOMService.getBOMById(req.params.id);
  if (!bom) return res.status(404).send({ message: "BOM not found" });

  res.send({ success: true, data: bom });
});

/* -----------------------------------------------------------
    UPDATE BOM
------------------------------------------------------------ */
const updateBOMById = catchAsync(async (req, res) => {
  const updated = await manufactureBOMService.updateBOMById(req.params.id, req.body);
  res.send({ success: true, data: updated });
});

/* -----------------------------------------------------------
    DELETE BOM
------------------------------------------------------------ */
const deleteBOMById = catchAsync(async (req, res) => {
  await manufactureBOMService.deleteBOMById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

/* -----------------------------------------------------------
    GET BOM BY DESIGN (ALL COLORS + ALL SIZES)
------------------------------------------------------------ */
const getBOMByDesign = catchAsync(async (req, res) => {
  const { manufacturerEmail, designNumber } = req.query;

  if (!manufacturerEmail || !designNumber) {
    return res.status(400).send({
      success: false,
      message: "manufacturerEmail and designNumber are required",
    });
  }

  const data = await manufactureBOMService.getBOMByDesign(
    manufacturerEmail,
    designNumber
  );

  res.send({ success: true, data });
});

/* -----------------------------------------------------------
    SEARCH BOM (Advanced Search + Pagination)
------------------------------------------------------------ */
const searchBOM = catchAsync(async (req, res) => {
  const result = await manufactureBOMService.searchBOM(req.body);

  res.status(httpStatus.OK).send({
    success: true,
    total: result.total,
    totalPages: result.totalPages,
    page: result.page,
    limit: result.limit,
    data: result.data,
  });
});

module.exports = {
  createBOM,
  getBOMs,
  getBOMById,
  updateBOMById,
  deleteBOMById,
  getBOMByDesign,
  searchBOM,
};
