const httpStatus = require('http-status');

const { WeaverCashBankBookMaster } = require('../../models');

const ApiError = require('../../utils/ApiError');

const createWeaverCashBankBookMaster = async (reqBody) => {
  return WeaverCashBankBookMaster.create(reqBody);
};

const queryWeaverCashBankBookMaster = async (filter, options) => {
  const books = await WeaverCashBankBookMaster.paginate(filter, options);

  return books;
};

const getWeaverCashBankBookMasterById = async (id) => {
  const book = await WeaverCashBankBookMaster.findById(id);

  if (!book) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cash & Bank Book not found');
  }

  return book;
};

const searchWeaverCashBankBookMaster = async (searchBody) => {
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
        type: {
          $regex: searchRegex,
        },
      },
      {
        accountName: {
          $regex: searchRegex,
        },
      },
      {
        shortName: {
          $regex: searchRegex,
        },
      },
      {
        accountNo: {
          $regex: searchRegex,
        },
      },
      {
        ifscCode: {
          $regex: searchRegex,
        },
      },
      {
        branch: {
          $regex: searchRegex,
        },
      },
      {
        chequePrint: {
          $regex: searchRegex,
        },
      },
      {
        address: {
          $regex: searchRegex,
        },
      },
      {
        weaverEmail: {
          $regex: searchRegex,
        },
      },
    ];

    // Search book number
    // if keyword is numeric
    if (!Number.isNaN(Number(searchKeyword))) {
      filter.$or.push({
        bookNo: Number(searchKeyword),
      });

      filter.$or.push({
        ccLimit: Number(searchKeyword),
      });
    }
  }

  const options = {
    sortBy,
    limit,
    page,
  };

  return WeaverCashBankBookMaster.paginate(filter, options);
};

const bulkUpload = async (bookArray = [], user) => {
  if (!Array.isArray(bookArray) || bookArray.length === 0) {
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

  bookArray.forEach((book, index) => {
    const rowNumber = index + 2;

    const type = String(book.type || book.Type || '').trim();

    const bookNoValue = book.bookNo ?? book.Book_No ?? book.BookNo;

    const accountName = String(book.accountName || book.Account_Name || book.AccountName || '').trim();

    const shortName = String(book.shortName || book.Short_Name || book.ShortName || '').trim();

    const accountNo = String(book.accountNo || book.AC_No || book.Ac_No || book.AccountNo || '').trim();

    const ifscCode = String(book.ifscCode || book.IFSC_Code || book.IFSCCode || '')
      .trim()
      .toUpperCase();

    const branch = String(book.branch || book.Branch || '').trim();

    const ccLimitValue = book.ccLimit ?? book.CC_Limit ?? book.CCLimit;

    const chequePrint = String(book.chequePrint || book.Chq_Print || book.ChequePrint || '').trim();

    const address = String(book.address || book.Address || '').trim();
    if (!type) {
      errors.push({
        row: rowNumber,
        error: 'Type is required',
      });

      return;
    }

    if (bookNoValue === undefined || bookNoValue === null || String(bookNoValue).trim() === '') {
      errors.push({
        row: rowNumber,
        error: 'Book number is required',
      });

      return;
    }

    const bookNo = Number(bookNoValue);

    if (Number.isNaN(bookNo)) {
      errors.push({
        row: rowNumber,
        error: 'Book number must be a valid number',
      });

      return;
    }

    if (!accountName) {
      errors.push({
        row: rowNumber,
        error: 'Account name is required',
      });

      return;
    }
    let ccLimit = 0;

    if (ccLimitValue !== undefined && ccLimitValue !== null && String(ccLimitValue).trim() !== '') {
      ccLimit = Number(ccLimitValue);

      if (Number.isNaN(ccLimit) || ccLimit < 0) {
        errors.push({
          row: rowNumber,
          error: 'CC limit must be a valid positive number',
        });

        return;
      }
    }

    validRecords.push({
      type,
      bookNo,
      accountName,
      shortName,
      accountNo,
      ifscCode,
      branch,
      ccLimit,
      chequePrint,
      address,
      weaverId,
      weaverEmail,
    });
  });

  if (!validRecords.length) {
    return {
      message: 'No valid records found',
      totalRecords: bookArray.length,
      successCount: 0,
      failedCount: errors.length,
      errors,
      data: [],
    };
  }

  const uniqueRecords = [];
  const duplicateBooks = new Set();

  validRecords.forEach((record, index) => {
    const key = String(record.bookNo);

    if (duplicateBooks.has(key)) {
      errors.push({
        row: index + 2,
        bookNo: record.bookNo,
        error: 'Duplicate book number in uploaded file',
      });

      return;
    }

    duplicateBooks.add(key);

    uniqueRecords.push(record);
  });

  const existingBooks = await WeaverCashBankBookMaster.find({
    weaverId,
    bookNo: {
      $in: uniqueRecords.map((record) => record.bookNo),
    },
  }).select('bookNo');

  const existingBookNumbers = new Set(existingBooks.map((book) => String(book.bookNo)));

  const recordsToInsert = [];

  uniqueRecords.forEach((record, index) => {
    if (existingBookNumbers.has(String(record.bookNo))) {
      errors.push({
        row: index + 2,
        bookNo: record.bookNo,
        error: 'Book number already exists',
      });

      return;
    }

    recordsToInsert.push(record);
  });

  let insertedRecords = [];

  if (recordsToInsert.length) {
    try {
      insertedRecords = await WeaverCashBankBookMaster.insertMany(recordsToInsert, {
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
    totalRecords: bookArray.length,
    successCount: insertedRecords.length,
    failedCount: errors.length,
    errors,
    data: insertedRecords,
  };
};

const updateWeaverCashBankBookMasterById = async (id, updateBody) => {
  const book = await getWeaverCashBankBookMasterById(id);

  Object.assign(book, updateBody);

  await book.save();

  return book;
};

const deleteWeaverCashBankBookMasterById = async (id) => {
  const book = await getWeaverCashBankBookMasterById(id);

  await book.deleteOne();

  return book;
};

module.exports = {
  createWeaverCashBankBookMaster,
  queryWeaverCashBankBookMaster,
  getWeaverCashBankBookMasterById,
  searchWeaverCashBankBookMaster,
  bulkUpload,
  updateWeaverCashBankBookMasterById,
  deleteWeaverCashBankBookMasterById,
};
