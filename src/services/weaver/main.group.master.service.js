const httpStatus = require('http-status');

const { WeaverMainGroupMaster } = require('../../models');

const ApiError = require('../../utils/ApiError');


const createWeaverMainGroupMaster = async (reqBody) => {
  return WeaverMainGroupMaster.create(reqBody);
};


const queryWeaverMainGroupMaster = async (filter, options) => {
  const groups = await WeaverMainGroupMaster.paginate(filter, options);

  return groups;
};

const getWeaverMainGroupMasterById = async (id) => {
  const group = await WeaverMainGroupMaster.findById(id);

  if (!group) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Main Group Master not found');
  }

  return group;
};

const searchWeaverMainGroupMaster = async (searchBody) => {
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
        mainGroupCode: {
          $regex: searchRegex,
        },
      },
      {
        mainGroupName: {
          $regex: searchRegex,
        },
      },
      {
        headCategory: {
          $regex: searchRegex,
        },
      },
      {
        debitCredit: {
          $regex: searchRegex,
        },
      },
      {
        remark: {
          $regex: searchRegex,
        },
      },
      {
        weaverEmail: {
          $regex: searchRegex,
        },
      },
    ];

    // Search positionCode if keyword is numeric
    if (!Number.isNaN(Number(searchKeyword))) {
      filter.$or.push({
        positionCode: Number(searchKeyword),
      });
    }
  }

  const options = {
    sortBy,
    limit,
    page,
  };

  return WeaverMainGroupMaster.paginate(filter, options);
};

const bulkUpload = async (groupArray = [], user) => {
  if (!Array.isArray(groupArray) || groupArray.length === 0) {
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

  groupArray.forEach((group, index) => {
    const rowNumber = index + 2;

    const mainGroupCode = String(
      group.mainGroupCode || group.Main_Group_Code || group.Ac_Group_Code || group.AcGroupCode || ''
    ).trim();

    const mainGroupName = String(
      group.mainGroupName || group.Main_Group_Name || group.Ac_Group_Name || group.AcGroupName || ''
    ).trim();

    const headCategory = String(group.headCategory || group.Head_Category || group.HeadCategory || '').trim();

    const debitCredit = String(group.debitCredit || group.Debit_Credit || group.DebitCredit || '').trim();

    const positionCodeValue = group.positionCode ?? group.Position_Code ?? group.PositionCode;

    const remark = String(group.remark || group.Remark || '').trim();


    if (!mainGroupName) {
      errors.push({
        row: rowNumber,
        name: '',
        error: 'Main group name is required',
      });

      return;
    }

    let positionCode = 0;

    if (positionCodeValue !== undefined && positionCodeValue !== null && String(positionCodeValue).trim() !== '') {
      positionCode = Number(positionCodeValue);

      if (Number.isNaN(positionCode)) {
        errors.push({
          row: rowNumber,
          name: mainGroupName,
          error: 'Position code must be a valid number',
        });

        return;
      }
    }

    validRecords.push({
      mainGroupCode,
      mainGroupName,
      headCategory,
      debitCredit,
      positionCode,
      remark,
      weaverId,
      weaverEmail,
    });
  });


  if (!validRecords.length) {
    return {
      message: 'No valid records found',
      totalRecords: groupArray.length,
      successCount: 0,
      failedCount: errors.length,
      errors,
      data: [],
    };
  }

  const uniqueRecords = [];
  const duplicateNames = new Set();

  validRecords.forEach((record, index) => {
    const nameKey = record.mainGroupName.trim().toLowerCase();

    if (duplicateNames.has(nameKey)) {
      errors.push({
        row: index + 2,
        name: record.mainGroupName,
        error: 'Duplicate main group name in uploaded file',
      });

      return;
    }

    duplicateNames.add(nameKey);

    uniqueRecords.push(record);
  });


  const existingGroups = await WeaverMainGroupMaster.find({
    weaverId,
  }).select('mainGroupName');

  const existingNames = new Set(existingGroups.map((group) => group.mainGroupName.trim().toLowerCase()));

  const recordsToInsert = [];

  uniqueRecords.forEach((record, index) => {
    const nameKey = record.mainGroupName.trim().toLowerCase();

    if (existingNames.has(nameKey)) {
      errors.push({
        row: index + 2,
        name: record.mainGroupName,
        error: 'Main group already exists',
      });

      return;
    }

    recordsToInsert.push(record);
  });

  let insertedRecords = [];

  if (recordsToInsert.length) {
    try {
      insertedRecords = await WeaverMainGroupMaster.insertMany(recordsToInsert, {
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
    totalRecords: groupArray.length,
    successCount: insertedRecords.length,
    failedCount: errors.length,
    errors,
    data: insertedRecords,
  };
};

const updateWeaverMainGroupMasterById = async (id, updateBody) => {
  const group = await getWeaverMainGroupMasterById(id);

  Object.assign(group, updateBody);

  await group.save();

  return group;
};

const deleteWeaverMainGroupMasterById = async (id) => {
  const group = await getWeaverMainGroupMasterById(id);

  await group.deleteOne();

  return group;
};

module.exports = {
  createWeaverMainGroupMaster,
  queryWeaverMainGroupMaster,
  getWeaverMainGroupMasterById,
  searchWeaverMainGroupMaster,
  bulkUpload,
  updateWeaverMainGroupMasterById,
  deleteWeaverMainGroupMasterById,
};
