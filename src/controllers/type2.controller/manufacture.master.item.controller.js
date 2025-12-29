const httpStatus = require("http-status");
const catchAsync = require("../../utils/catchAsync");
const pick = require("../../utils/pick");
const { manufactureItemService } = require("../../services");

// Convert uploaded file arrays to string URLs
const normalizePhotos = (body) => {
  if (body.photo1 && Array.isArray(body.photo1)) {
    body.photo1 = body.photo1[0]; // Take 1st uploaded file
  }
  if (body.photo2 && Array.isArray(body.photo2)) {
    body.photo2 = body.photo2[0];
  }
  return body;
};

const createItem = catchAsync(async (req, res) => {
  const normalizedBody = normalizePhotos(req.body);
  const item = await manufactureItemService.createItem(normalizedBody);
  res.status(httpStatus.CREATED).send({ success: true, data: item });
});

const getItems = catchAsync(async (req, res) => {
  const filter = pick(req.query, [
    "categoryName",
    "subcategoryName",
    "categoryId",,
    "subcategoryId",
    "name",
    "code",
    "subcategoryCode",
    "categoryCode",
    "itemName",
    "isActive",
    "manufacturerEmail"
  ]);

  const options = pick(req.query, ["sortBy", "limit", "page"]);

  const result = await manufactureItemService.queryItems(filter, options);
  res.send({ success: true, data: result });
});

const getItemById = catchAsync(async (req, res) => {
  const item = await manufactureItemService.getItemById(req.params.id);
  if (!item) return res.status(404).send({ message: "Item not found" });

  res.send({ success: true, data: item });
});

const updateItemById = catchAsync(async (req, res) => {
  const normalizedBody = normalizePhotos(req.body);
  const updated = await manufactureItemService.updateItemById(
    req.params.id,
    normalizedBody
  );

  res.send({ success: true, data: updated });
});

const deleteItemById = catchAsync(async (req, res) => {
  await manufactureItemService.deleteItemById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});
// const getItemsByCategorySubcategory = catchAsync(async (req, res) => {
//   const result = await manufactureItemService.getItemsByCategorySubcategory(req.body);
//   res.status(httpStatus.OK).send({ success: true, data: result });
// });

const getItemsByCategorySubcategory = catchAsync(async (req, res) => {
  const filter = pick(req.body, [
    "categoryId",
    "subcategoryId",
    "categoryName",
    "subcategoryName",
    "itemName"
  ]);

  const options = pick(req.body, ["sortBy", "limit", "page"]);

  const result = await manufactureItemService.getItemsByCategorySubcategory(filter, options);
  res.send({ success: true, data: result });
});
module.exports = {
  createItem,
  getItems,
  getItemById,
  updateItemById,
  deleteItemById,
  getItemsByCategorySubcategory,
};
