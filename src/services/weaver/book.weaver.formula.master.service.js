const httpStatus = require('http-status');
const { WeaverFormulaMaster } = require('../../models');
const ApiError = require('../../utils/ApiError');


const createWeaverFormulaMaster = async (reqBody, user) => {
  if (!user) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'User authentication required'
    );
  }

  const weaverId = user.weaverId || user._id;
  const weaverEmail = user.email;

  if (!weaverId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Weaver ID not found'
    );
  }

  if (!weaverEmail) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Weaver email not found'
    );
  }

  if (!reqBody.name || !String(reqBody.name).trim()) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Formula name is required'
    );
  }

  const existingFormula = await WeaverFormulaMaster.findOne({
    weaverId,
    name: String(reqBody.name).trim(),
  });

  if (existingFormula) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Formula name already exists'
    );
  }

  const formulaData = {
    ...reqBody,
    name: String(reqBody.name).trim(),
    weaverId,
    weaverEmail,
  };

  return WeaverFormulaMaster.create(formulaData);
};

const queryWeaverFormulaMaster = async (filter, options) => {
  return WeaverFormulaMaster.paginate(filter, options);
};

const getWeaverFormulaMasterById = async (id) => {
  const formula = await WeaverFormulaMaster.findById(id);

  if (!formula) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Formula Master not found'
    );
  }

  return formula;
};

const searchWeaverFormulaMaster = async (searchBody) => {
  const {
    weaverId,
    keyword = '',
    sortBy,
    limit,
    page,
  } = searchBody;

  if (!weaverId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'weaverId is required'
    );
  }

  const filter = {
    weaverId,
  };

  const searchKeyword = String(keyword).trim();

  if (searchKeyword) {
    const escapedKeyword = searchKeyword.replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&'
    );

    const searchRegex = new RegExp(
      escapedKeyword,
      'i'
    );

    filter.$or = [
      {
        name: {
          $regex: searchRegex,
        },
      },
      {
        formula: {
          $regex: searchRegex,
        },
      },
      {
        remarks: {
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

  return WeaverFormulaMaster.paginate(
    filter,
    options
  );
};

const bulkUpload = async (
  formulaArray = [],
  user
) => {
  if (
    !Array.isArray(formulaArray) ||
    formulaArray.length === 0
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Missing or empty CSV data'
    );
  }

  if (!user) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'User authentication required'
    );
  }

  const weaverId = user.weaverId || user._id;
  const weaverEmail = user.email;

  if (!weaverId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Weaver ID not found'
    );
  }

  if (!weaverEmail) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Weaver email not found'
    );
  }

  const validRecords = [];
  const errors = [];

  formulaArray.forEach((formula, index) => {
    const rowNumber = index + 2;

    const name = String(
      formula.name ||
        formula.Name ||
        ''
    ).trim();

    const formulaValue = String(
      formula.formula ||
        formula.Formula ||
        ''
    ).trim();

    const remarks = String(
      formula.remarks ||
        formula.Remarks ||
        ''
    ).trim();

    if (!name) {
      errors.push({
        row: rowNumber,
        error: 'Formula name is required',
      });

      return;
    }

    validRecords.push({
      name,
      formula: formulaValue,
      remarks,

      taka: {
        enabled:
          String(
            formula.takaEnabled ||
              formula.Taka_Enabled ||
              ''
          ).toLowerCase() === 'true',
        value: String(
          formula.takaValue ||
            formula.Taka_Value ||
            ''
        ).trim(),
      },

      pcs: {
        enabled:
          String(
            formula.pcsEnabled ||
              formula.Pcs_Enabled ||
              ''
          ).toLowerCase() === 'true',
        value: String(
          formula.pcsValue ||
            formula.Pcs_Value ||
            ''
        ).trim(),
      },

      weight: {
        enabled:
          String(
            formula.weightEnabled ||
              formula.Weight_Enabled ||
              ''
          ).toLowerCase() === 'true',
        value: String(
          formula.weightValue ||
            formula.Weight_Value ||
            ''
        ).trim(),
      },

      meters: {
        enabled:
          String(
            formula.metersEnabled ||
              formula.Meters_Enabled ||
              ''
          ).toLowerCase() === 'true',
        value: String(
          formula.metersValue ||
            formula.Meters_Value ||
            ''
        ).trim(),
      },

      bundle: {
        enabled:
          String(
            formula.bundleEnabled ||
              formula.Bundle_Enabled ||
              ''
          ).toLowerCase() === 'true',
        value: String(
          formula.bundleValue ||
            formula.Bundle_Value ||
            ''
        ).trim(),
      },

      carton: {
        enabled:
          String(
            formula.cartonEnabled ||
              formula.Carton_Enabled ||
              ''
          ).toLowerCase() === 'true',
        value: String(
          formula.cartonValue ||
            formula.Carton_Value ||
            ''
        ).trim(),
      },

      cops: {
        enabled:
          String(
            formula.copsEnabled ||
              formula.Cops_Enabled ||
              ''
          ).toLowerCase() === 'true',
        value: String(
          formula.copsValue ||
            formula.Cops_Value ||
            ''
        ).trim(),
      },

      con: {
        enabled:
          String(
            formula.conEnabled ||
              formula.Con_Enabled ||
              ''
          ).toLowerCase() === 'true',
        value: String(
          formula.conValue ||
            formula.Con_Value ||
            ''
        ).trim(),
      },

      bag: {
        enabled:
          String(
            formula.bagEnabled ||
              formula.Bag_Enabled ||
              ''
          ).toLowerCase() === 'true',
        value: String(
          formula.bagValue ||
            formula.Bag_Value ||
            ''
        ).trim(),
      },

      denier: {
        enabled:
          String(
            formula.denierEnabled ||
              formula.Denier_Enabled ||
              ''
          ).toLowerCase() === 'true',
        value: String(
          formula.denierValue ||
            formula.Denier_Value ||
            ''
        ).trim(),
      },

      beam: {
        enabled:
          String(
            formula.beamEnabled ||
              formula.Beam_Enabled ||
              ''
          ).toLowerCase() === 'true',
        value: String(
          formula.beamValue ||
            formula.Beam_Value ||
            ''
        ).trim(),
      },

      ends: {
        enabled:
          String(
            formula.endsEnabled ||
              formula.Ends_Enabled ||
              ''
          ).toLowerCase() === 'true',
        value: String(
          formula.endsValue ||
            formula.Ends_Value ||
            ''
        ).trim(),
      },

      creel: {
        enabled:
          String(
            formula.creelEnabled ||
              formula.Creel_Enabled ||
              ''
          ).toLowerCase() === 'true',
        value: String(
          formula.creelValue ||
            formula.Creel_Value ||
            ''
        ).trim(),
      },

      palate: {
        enabled:
          String(
            formula.palateEnabled ||
              formula.Palate_Enabled ||
              ''
          ).toLowerCase() === 'true',
        value: String(
          formula.palateValue ||
            formula.Palate_Value ||
            ''
        ).trim(),
      },

      cut: {
        enabled:
          String(
            formula.cutEnabled ||
              formula.Cut_Enabled ||
              ''
          ).toLowerCase() === 'true',
        value: String(
          formula.cutValue ||
            formula.Cut_Value ||
            ''
        ).trim(),
      },

      qnty: {
        enabled:
          String(
            formula.qntyEnabled ||
              formula.Qnty_Enabled ||
              ''
          ).toLowerCase() === 'true',
        value: String(
          formula.qntyValue ||
            formula.Qnty_Value ||
            ''
        ).trim(),
      },

      pano: {
        enabled:
          String(
            formula.panoEnabled ||
              formula.Pano_Enabled ||
              ''
          ).toLowerCase() === 'true',
        value: String(
          formula.panoValue ||
            formula.Pano_Value ||
            ''
        ).trim(),
      },

      box18: {
        enabled:
          String(
            formula.box18Enabled ||
              formula.Box_18_Enabled ||
              ''
          ).toLowerCase() === 'true',
        value: String(
          formula.box18Value ||
            formula.Box_18_Value ||
            ''
        ).trim(),
      },

      box19: {
        enabled:
          String(
            formula.box19Enabled ||
              formula.Box_19_Enabled ||
              ''
          ).toLowerCase() === 'true',
        value: String(
          formula.box19Value ||
            formula.Box_19_Value ||
            ''
        ).trim(),
      },

      box20: {
        enabled:
          String(
            formula.box20Enabled ||
              formula.Box_20_Enabled ||
              ''
          ).toLowerCase() === 'true',
        value: String(
          formula.box20Value ||
            formula.Box_20_Value ||
            ''
        ).trim(),
      },

      weaverId,
      weaverEmail,
    });
  });

  if (!validRecords.length) {
    return {
      message: 'No valid records found',
      totalRecords: formulaArray.length,
      successCount: 0,
      failedCount: errors.length,
      errors,
      data: [],
    };
  }

  const uniqueRecords = [];
  const duplicateNames = new Set();

  validRecords.forEach((record, index) => {
    const nameKey = record.name
      .trim()
      .toLowerCase();

    if (duplicateNames.has(nameKey)) {
      errors.push({
        row: index + 2,
        name: record.name,
        error:
          'Duplicate formula name in uploaded file',
      });

      return;
    }

    duplicateNames.add(nameKey);
    uniqueRecords.push(record);
  });

  const existingFormulas =
    await WeaverFormulaMaster.find({
      weaverId,
    }).select('name');

  const existingNames = new Set(
    existingFormulas.map((formula) =>
      formula.name.trim().toLowerCase()
    )
  );

  const recordsToInsert = [];

  uniqueRecords.forEach((record, index) => {
    const nameKey = record.name
      .trim()
      .toLowerCase();

    if (existingNames.has(nameKey)) {
      errors.push({
        row: index + 2,
        name: record.name,
        error: 'Formula already exists',
      });

      return;
    }

    recordsToInsert.push(record);
  });


  let insertedRecords = [];

  if (recordsToInsert.length) {
    try {
      insertedRecords =
        await WeaverFormulaMaster.insertMany(
          recordsToInsert,
          {
            ordered: false,
          }
        );
    } catch (error) {
      if (
        error.writeErrors &&
        error.writeErrors.length
      ) {
        error.writeErrors.forEach(
          (writeError) => {
            errors.push({
              row: writeError.index + 2,
              error:
                writeError.errmsg ||
                'Failed to insert record',
            });
          }
        );

        insertedRecords =
          error.insertedDocs || [];
      } else {
        throw error;
      }
    }
  }

  return {
    message:
      'Bulk upload completed successfully',

    totalRecords: formulaArray.length,

    successCount:
      insertedRecords.length,

    failedCount: errors.length,

    errors,

    data: insertedRecords,
  };
};

const updateWeaverFormulaMasterById = async (
  id,
  updateBody
) => {
  const formula =
    await getWeaverFormulaMasterById(id);

  Object.assign(formula, updateBody);

  await formula.save();

  return formula;
};

const deleteWeaverFormulaMasterById = async (
  id
) => {
  const formula =
    await getWeaverFormulaMasterById(id);

  await formula.deleteOne();

  return formula;
};

module.exports = {
  createWeaverFormulaMaster,
  queryWeaverFormulaMaster,
  getWeaverFormulaMasterById,
  searchWeaverFormulaMaster,
  bulkUpload,
  updateWeaverFormulaMasterById,
  deleteWeaverFormulaMasterById,
};