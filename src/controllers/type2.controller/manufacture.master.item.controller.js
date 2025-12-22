const httpStatus = require("http-status");
const catchAsync = require("../../utils/catchAsync");
const pick = require("../../utils/pick");
const { manufactureItemService } = require("../../services");

const createItem = catchAsync(async (req, res) => {
  const item = await manufactureItemService.createItem(req.body);
  res.status(httpStatus.CREATED).send({ success: true, data: item });
});

const getItems = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["categoryId", "subcategoryId", "itemName", "isActive"]);
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
  const updated = await manufactureItemService.updateItemById(req.params.id, req.body);
  res.send({ success: true, data: updated });
});

const deleteItemById = catchAsync(async (req, res) => {
  await manufactureItemService.deleteItemById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createItem,
  getItems,
  getItemById,
  updateItemById,
  deleteItemById,
};
