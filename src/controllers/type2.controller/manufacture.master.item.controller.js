const httpStatus = require("http-status");
const catchAsync = require("../../utils/catchAsync");
const pick = require("../../utils/pick");
const { manufactureItemService } = require("../../services");

// // Convert uploaded file arrays to string URLs
// const normalizePhotos = (body) => {
//   if (body.photo1 && Array.isArray(body.photo1)) {
//     body.photo1 = body.photo1[0]; // Take 1st uploaded file
//   }
//   if (body.photo2 && Array.isArray(body.photo2)) {
//     body.photo2 = body.photo2[0];
//   }
//   return body;
// };

// const createItem = catchAsync(async (req, res) => {
//   const normalizedBody = normalizePhotos(req.body);
//   const item = await manufactureItemService.createItem(normalizedBody);
//   res.status(httpStatus.CREATED).send({ success: true, data: item });
// });
// Convert uploaded file arrays to string URLs
// const normalizePhotos = (body) => {
//   if (body.photo1 && Array.isArray(body.photo1)) {
//     body.photo1 = body.photo1[0];
//   }
//   if (body.photo2 && Array.isArray(body.photo2)) {
//     body.photo2 = body.photo2[0];
//   }
//   return body;
// };

// const createItem = catchAsync(async (req, res) => {

//   // 🔥 IMPORTANT FIX: Convert string JSON → object
//   if (req.body.vendorDetails && typeof req.body.vendorDetails === "string") {
//     try {
//       req.body.vendorDetails = JSON.parse(req.body.vendorDetails);
//     } catch (e) {
//       return res.status(400).send({ message: "Invalid vendorDetails JSON format" });
//     }
//   }

//   if (req.body.warehouseDetails && typeof req.body.warehouseDetails === "string") {
//     try {
//       req.body.warehouseDetails = JSON.parse(req.body.warehouseDetails);
//     } catch (e) {
//       return res.status(400).send({ message: "Invalid warehouseDetails JSON format" });
//     }
//   }

//   // 📷 Fix image arrays
//   const normalizedBody = normalizePhotos(req.body);

//   // Save to DB
//   const item = await manufactureItemService.createItem(normalizedBody);

//   res.status(httpStatus.CREATED).send({ success: true, data: item });
// });
const normalizePhotos = (body) => {
  if (Array.isArray(body.photo1)) body.photo1 = body.photo1[0];
  if (Array.isArray(body.photo2)) body.photo2 = body.photo2[0];
  return body;
};

const parseIfString = (value) => {
  if (!value) return value;
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  }
  return value;
};

const createItem = catchAsync(async (req, res) => {
  req.body.vendorDetails = parseIfString(req.body.vendorDetails);
  req.body.warehouseDetails = parseIfString(req.body.warehouseDetails);

  const normalizedBody = normalizePhotos(req.body);

  const item = await manufactureItemService.createItem(normalizedBody);

  if (!item) {
    return res.status(500).send({
      success: false,
      message: "Item creation failed",
    });
  }

  res.status(httpStatus.CREATED).send({
    success: true,
    data: item,
  });
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

// const updateItemById = catchAsync(async (req, res) => {
//   const normalizedBody = normalizePhotos(req.body);
//   const updated = await manufactureItemService.updateItemById(
//     req.params.id,
//     normalizedBody
//   );

//   res.send({ success: true, data: updated });
// });
const updateItemById = catchAsync(async (req, res) => {

  if (req.body.vendorDetails && typeof req.body.vendorDetails === "string") {
    req.body.vendorDetails = JSON.parse(req.body.vendorDetails);
  }

  if (req.body.warehouseDetails && typeof req.body.warehouseDetails === "string") {
    req.body.warehouseDetails = JSON.parse(req.body.warehouseDetails);
  }

  const normalizedBody = normalizePhotos(req.body);

  const updated = await manufactureItemService.updateItemById(req.params.id, normalizedBody);

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
