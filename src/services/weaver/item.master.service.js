const httpStatus = require('http-status');

const { WeaverItemMaster } = require('../../models');

const ApiError = require('../../utils/ApiError');

/**
 * Create Weaver Item Master
 *
 * @param {Object} reqBody
 * @returns {Promise<WeaverItemMaster>}
 */
const createWeaverItemMaster = async (reqBody) => {
  return WeaverItemMaster.create(reqBody);
};

/**
 * Query Weaver Item Masters
 *
 * @param {Object} filter
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const queryWeaverItemMaster = async (filter, options) => {
  return WeaverItemMaster.paginate(filter, options);
};

/**
 * Get Weaver Item Master by ID
 *
 * @param {ObjectId} id
 * @returns {Promise<WeaverItemMaster>}
 */
const getWeaverItemMasterById = async (id) => {
  const item = await WeaverItemMaster.findById(id);

  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Item Master not found');
  }

  return item;
};

/**
 * Search Weaver Item Masters
 *
 * Searches:
 * - itemCode
 * - name
 * - shortName
 * - hsnCode
 * - hsnCode2
 * - groupName
 * - subGroupName
 * - itemTypeName
 * - itemStockTypeName
 * - weaverEmail
 *
 * Search is restricted to Weaver.
 *
 * @param {Object} searchBody
 * @returns {Promise<QueryResult>}
 */
const searchWeaverItemMaster = async (searchBody) => {
  const { weaverId, keyword = '', sortBy, limit, page } = searchBody;

  if (!weaverId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'weaverId is required');
  }

  const filter = {
    weaverId,
  };

  const searchKeyword = String(keyword).trim();

  if (searchKeyword) {
    const escapedKeyword = searchKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const searchRegex = new RegExp(escapedKeyword, 'i');

    filter.$or = [
      {
        itemCode: {
          $regex: searchRegex,
        },
      },
      {
        name: {
          $regex: searchRegex,
        },
      },
      {
        shortName: {
          $regex: searchRegex,
        },
      },
      {
        hsnCode: {
          $regex: searchRegex,
        },
      },
      {
        hsnCode2: {
          $regex: searchRegex,
        },
      },
      {
        groupName: {
          $regex: searchRegex,
        },
      },
      {
        subGroupName: {
          $regex: searchRegex,
        },
      },
      {
        itemTypeName: {
          $regex: searchRegex,
        },
      },
      {
        itemStockTypeName: {
          $regex: searchRegex,
        },
      },
      {
        weaverEmail: {
          $regex: searchRegex,
        },
      },
    ];
  }

  const options = {
    sortBy,
    limit,
    page,
  };

  return WeaverItemMaster.paginate(filter, options);
};

/**
 * Bulk Upload Weaver Item Masters
 *
 * CSV columns:
 *
 * itemCode,
 * name,
 * shortName,
 * hsnCode,
 * hsnCode2,
 * gstCalculation,
 * sgstPercentage,
 * cgstPercentage,
 * igstPercentage,
 * cessPercentage,
 * unitOfMeasure,
 * printUom,
 * hsnGstr1Uqc,
 * hsnGstr1Description,
 * isServiceJob,
 * groupId,
 * groupName,
 * subGroupId,
 * subGroupName,
 * itemTypeId,
 * itemTypeName,
 * itemStockTypeId,
 * itemStockTypeName,
 * denierCut,
 * ratePerMtr,
 * avgPerMtr,
 * itemWeight,
 * ratePerPick,
 * avgPerPick,
 * purchaseRate,
 * salesRate,
 * costingRate,
 * openingStockNos,
 * openingQuantity,
 * openingAmount,
 * knittingMeters,
 * recipeConsumption,
 * cataloguePhoto,
 * isActive,
 * addRate
 *
 * @param {Array<Object>} itemArray
 * @param {Object} user
 * @returns {Promise<Object>}
 */
const bulkUpload = async (itemArray = [], user) => {
  if (!Array.isArray(itemArray) || itemArray.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Missing or empty CSV data');
  }

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User authentication required');
  }

  const weaverId = user.weaverId || user._id;

  const weaverEmail = user.email;

  if (!weaverId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Weaver ID not found');
  }

  if (!weaverEmail) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Weaver email not found');
  }

  const validRecords = [];
  const errors = [];

  /**
   * Convert value to number
   */
  const toNumber = (value, defaultValue = 0) => {
    if (value === undefined || value === null || String(value).trim() === '') {
      return defaultValue;
    }

    const numberValue = Number(value);

    return Number.isNaN(numberValue) ? null : numberValue;
  };

  itemArray.forEach((item, index) => {
    const rowNumber = index + 2;

    const name = String(item.name || item.Name || '').trim();

    const itemCode = String(item.itemCode || item.Item_Code || item.ItemCode || '').trim();

    if (!name) {
      errors.push({
        row: rowNumber,
        name: '',
        error: 'Name is required',
      });

      return;
    }

    /**
     * Numeric fields
     */
    const sgstPercentage = toNumber(item.sgstPercentage ?? item.SGST_Percentage ?? item.SGST);

    const cgstPercentage = toNumber(item.cgstPercentage ?? item.CGST_Percentage ?? item.CGST);

    const igstPercentage = toNumber(item.igstPercentage ?? item.IGST_Percentage ?? item.IGST);

    const cessPercentage = toNumber(item.cessPercentage ?? item.Cess_Percentage ?? item.Cess);

    const denierCut = toNumber(item.denierCut ?? item.Denier_Cut);

    const ratePerMtr = toNumber(item.ratePerMtr ?? item.Rate_Per_Mtr);

    const avgPerMtr = toNumber(item.avgPerMtr ?? item.Avg_Per_Mtr);

    const itemWeight = toNumber(item.itemWeight ?? item.Item_Wt);

    const ratePerPick = toNumber(item.ratePerPick ?? item.Rate_Per_Pick);

    const avgPerPick = toNumber(item.avgPerPick ?? item.Avg_Per_Pick);

    const purchaseRate = toNumber(item.purchaseRate ?? item.Purchase_Rate);

    const salesRate = toNumber(item.salesRate ?? item.Sales_Rate);

    const costingRate = toNumber(item.costingRate ?? item.Costing_Rate);

    const openingStockNos = toNumber(item.openingStockNos ?? item.Op_Stock_Nos);

    const openingQuantity = toNumber(item.openingQuantity ?? item.Op_Quantity);

    const openingAmount = toNumber(item.openingAmount ?? item.Op_Amount);

    const knittingMeters = toNumber(item.knittingMeters ?? item.Knitting_Meters);

    const numericFields = [
      {
        name: 'SGST percentage',
        value: sgstPercentage,
      },
      {
        name: 'CGST percentage',
        value: cgstPercentage,
      },
      {
        name: 'IGST percentage',
        value: igstPercentage,
      },
      {
        name: 'Cess percentage',
        value: cessPercentage,
      },
      {
        name: 'Denier/Cut',
        value: denierCut,
      },
      {
        name: 'Rate Per Mtr',
        value: ratePerMtr,
      },
      {
        name: 'Avg Per Mtr',
        value: avgPerMtr,
      },
      {
        name: 'Item Weight',
        value: itemWeight,
      },
      {
        name: 'Rate Per Pick',
        value: ratePerPick,
      },
      {
        name: 'Avg Per Pick',
        value: avgPerPick,
      },
      {
        name: 'Purchase Rate',
        value: purchaseRate,
      },
      {
        name: 'Sales Rate',
        value: salesRate,
      },
      {
        name: 'Costing Rate',
        value: costingRate,
      },
      {
        name: 'Opening Stock Nos',
        value: openingStockNos,
      },
      {
        name: 'Opening Quantity',
        value: openingQuantity,
      },
      {
        name: 'Opening Amount',
        value: openingAmount,
      },
      {
        name: 'Knitting Meters',
        value: knittingMeters,
      },
    ];

    const invalidNumber = numericFields.find((field) => field.value === null);

    if (invalidNumber) {
      errors.push({
        row: rowNumber,
        name,
        error: `${invalidNumber.name} must be a valid number`,
      });

      return;
    }

    validRecords.push({
      itemCode,
      name,

      shortName: String(item.shortName || item.Short_Name || '').trim(),

      hsnCode: String(item.hsnCode || item.HSN_Code || '').trim(),

      hsnCode2: String(item.hsnCode2 || item.HSN_Code_2 || '').trim(),

      gstCalculation: String(item.gstCalculation || item.GST_Calc || '').trim(),

      sgstPercentage,
      cgstPercentage,
      igstPercentage,
      cessPercentage,

      unitOfMeasure: String(item.unitOfMeasure || item.Unit_Of_Measure || '').trim(),

      printUom: String(item.printUom || item.Print_UOM || '').trim(),

      hsnGstr1Uqc: String(item.hsnGstr1Uqc || item.HSN_GSTR1_UQC || '').trim(),

      hsnGstr1Description: String(item.hsnGstr1Description || item.HSN_GSTR1_Desc || '').trim(),

      isServiceJob:
        String(item.isServiceJob || item.Is_Service_Job || 'false').toLowerCase() === 'yes' ||
        String(item.isServiceJob || item.Is_Service_Job || 'false').toLowerCase() === 'true',

      groupId: item.groupId || item.Group_Id || undefined,

      groupName: String(item.groupName || item.Group_Name || '').trim(),

      subGroupId: item.subGroupId || item.Sub_Group_Id || undefined,

      subGroupName: String(item.subGroupName || item.Sub_Group_Name || '').trim(),

      itemTypeId: item.itemTypeId || item.Item_Type_Id || undefined,

      itemTypeName: String(item.itemTypeName || item.Item_Type || '').trim(),

      itemStockTypeId: item.itemStockTypeId || item.Item_Stock_Type_Id || undefined,

      itemStockTypeName: String(item.itemStockTypeName || item.Item_Stock_Type || '').trim(),

      denierCut,
      ratePerMtr,
      avgPerMtr,
      itemWeight,
      ratePerPick,
      avgPerPick,
      purchaseRate,
      salesRate,
      costingRate,
      openingStockNos,
      openingQuantity,
      openingAmount,
      knittingMeters,

      recipeConsumption: String(item.recipeConsumption || item.Recipe_Cons || '').trim(),

      cataloguePhoto: String(item.cataloguePhoto || item.Catalogue_Photo || '').trim(),

      isActive: !(
        String(item.isActive || item.Active || 'yes').toLowerCase() === 'no' ||
        String(item.isActive || item.Active || 'true').toLowerCase() === 'false'
      ),

      addRate:
        String(item.addRate || item.Add_Rate || 'no').toLowerCase() === 'yes' ||
        String(item.addRate || item.Add_Rate || 'false').toLowerCase() === 'true',

      weaverId,
      weaverEmail,
    });
  });

  /**
   * No valid records
   */
  if (!validRecords.length) {
    return {
      message: 'No valid records found',

      totalRecords: itemArray.length,

      successCount: 0,

      failedCount: errors.length,

      errors,

      data: [],
    };
  }

  /**
   * Remove duplicate item names
   * from uploaded CSV.
   */
  const uniqueRecords = [];
  const duplicateNames = new Set();

  validRecords.forEach((record, index) => {
    const nameKey = record.name.trim().toLowerCase();

    if (duplicateNames.has(nameKey)) {
      errors.push({
        row: index + 2,
        name: record.name,
        error: 'Duplicate item name in uploaded file',
      });

      return;
    }

    duplicateNames.add(nameKey);

    uniqueRecords.push(record);
  });

  /**
   * Check existing items
   * for this Weaver.
   */
  const existingItems = await WeaverItemMaster.find({
    weaverId,
  }).select('name itemCode');

  const existingNames = new Set(existingItems.map((item) => item.name.trim().toLowerCase()));

  const existingCodes = new Set(
    existingItems.filter((item) => item.itemCode).map((item) => item.itemCode.trim().toLowerCase())
  );

  /**
   * Remove existing records
   */
  const recordsToInsert = [];

  uniqueRecords.forEach((record, index) => {
    const nameKey = record.name.trim().toLowerCase();

    const codeKey = record.itemCode.trim().toLowerCase();

    if (existingNames.has(nameKey)) {
      errors.push({
        row: index + 2,
        name: record.name,
        error: 'Item already exists',
      });

      return;
    }

    if (codeKey && existingCodes.has(codeKey)) {
      errors.push({
        row: index + 2,
        name: record.name,
        error: 'Item code already exists',
      });

      return;
    }

    recordsToInsert.push(record);
  });

  /**
   * Insert valid records
   */
  let insertedRecords = [];

  if (recordsToInsert.length) {
    try {
      insertedRecords = await WeaverItemMaster.insertMany(recordsToInsert, {
        ordered: false,
      });
    } catch (error) {
      if (error.writeErrors && error.writeErrors.length) {
        error.writeErrors.forEach((writeError) => {
          errors.push({
            row: writeError.index + 2,

            error: writeError.errmsg || 'Failed to insert record',
          });
        });

        insertedRecords = error.insertedDocs || [];
      } else {
        throw error;
      }
    }
  }

  return {
    message: 'Bulk upload completed successfully',

    totalRecords: itemArray.length,

    successCount: insertedRecords.length,

    failedCount: errors.length,

    errors,

    data: insertedRecords,
  };
};

/**
 * Update Weaver Item Master by ID
 *
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<WeaverItemMaster>}
 */
const updateWeaverItemMasterById = async (id, updateBody) => {
  const item = await getWeaverItemMasterById(id);

  Object.assign(item, updateBody);

  await item.save();

  return item;
};

/**
 * Delete Weaver Item Master by ID
 *
 * @param {ObjectId} id
 * @returns {Promise<WeaverItemMaster>}
 */
const deleteWeaverItemMasterById = async (id) => {
  const item = await getWeaverItemMasterById(id);

  await item.deleteOne();

  return item;
};

module.exports = {
  createWeaverItemMaster,
  queryWeaverItemMaster,
  getWeaverItemMasterById,
  searchWeaverItemMaster,
  bulkUpload,
  updateWeaverItemMasterById,
  deleteWeaverItemMasterById,
};
