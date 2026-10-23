const httpStatus = require('http-status');

const { WeaverSalesPurchaseBookMaster } = require('../../models');

const ApiError = require('../../utils/ApiError');

const createWeaverSalesPurchaseBookMaster = async (reqBody) => {
  return WeaverSalesPurchaseBookMaster.create(reqBody);
};

const queryWeaverSalesPurchaseBookMaster = async (filter, options) => {
  const books = await WeaverSalesPurchaseBookMaster.paginate(filter, options);

  return books;
};

const getWeaverSalesPurchaseBookMasterById = async (id) => {
  const book = await WeaverSalesPurchaseBookMaster.findById(id);

  if (!book) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sales & Purchase Book not found');
  }

  return book;
};

const searchWeaverSalesPurchaseBookMaster = async (searchBody) => {
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
        acType: {
          $regex: searchRegex,
        },
      },
      {
        bookType: {
          $regex: searchRegex,
        },
      },
      {
        purchaseAccountName: {
          $regex: searchRegex,
        },
      },
      {
        salesAccountName: {
          $regex: searchRegex,
        },
      },
      {
        orderType: {
          $regex: searchRegex,
        },
      },
      {
        itemStockType: {
          $regex: searchRegex,
        },
      },
      {
        formula: {
          $regex: searchRegex,
        },
      },
      {
        taxType: {
          $regex: searchRegex,
        },
      },
      {
        typeOfGoods: {
          $regex: searchRegex,
        },
      },
      {
        weaverEmail: {
          $regex: searchRegex,
        },
      },
    ];

    // Search Book No if keyword is numeric
    if (!Number.isNaN(Number(searchKeyword))) {
      filter.$or.push({
        bookNo: Number(searchKeyword),
      });
    }
  }

  const options = {
    sortBy,
    limit,
    page,
  };

  return WeaverSalesPurchaseBookMaster.paginate(filter, options);
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

    const acType = String(book.acType || book.Ac_Type || book.AC_Type || '').trim();

    const bookNoValue = book.bookNo ?? book.Book_No ?? book.BookNo;

    const bookType = String(book.bookType || book.Book_Type || book.BookType || '').trim();

    const purchaseAccountName = String(
      book.purchaseAccountName || book.Purchase_Account || book.PurchaseAccount || ''
    ).trim();

    const salesAccountName = String(book.salesAccountName || book.Sales_Account || book.SalesAccount || '').trim();

    // ==========================================
    // BOOK TYPE VALIDATION
    // ==========================================

    if (!bookType) {
      errors.push({
        row: rowNumber,
        error: 'Book type is required',
      });

      return;
    }

    let bookNo;

    if (bookNoValue !== undefined && bookNoValue !== null && String(bookNoValue).trim() !== '') {
      bookNo = Number(bookNoValue);

      if (Number.isNaN(bookNo)) {
        errors.push({
          row: rowNumber,
          error: 'Book number must be a valid number',
        });

        return;
      }
    }

    validRecords.push({
      acType,
      bookNo,
      bookType,
      purchaseAccountName,
      salesAccountName,
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
    const key = record.bookNo !== undefined ? String(record.bookNo) : record.bookType.trim().toLowerCase();

    if (duplicateBooks.has(key)) {
      errors.push({
        row: index + 2,
        error: 'Duplicate book in uploaded file',
      });

      return;
    }

    duplicateBooks.add(key);
    uniqueRecords.push(record);
  });

  const existingBooks = await WeaverSalesPurchaseBookMaster.find({
    weaverId,
  }).select('bookNo bookType');

  const existingBookNumbers = new Set(
    existingBooks.filter((book) => book.bookNo !== undefined && book.bookNo !== null).map((book) => String(book.bookNo))
  );

  const recordsToInsert = [];

  uniqueRecords.forEach((record, index) => {
    if (record.bookNo !== undefined && existingBookNumbers.has(String(record.bookNo))) {
      errors.push({
        row: index + 2,
        error: 'Book number already exists',
      });

      return;
    }

    recordsToInsert.push(record);
  });

  let insertedRecords = [];

  if (recordsToInsert.length) {
    try {
      insertedRecords = await WeaverSalesPurchaseBookMaster.insertMany(recordsToInsert, {
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

const updateWeaverSalesPurchaseBookMasterById = async (id, updateBody) => {
  const book = await getWeaverSalesPurchaseBookMasterById(id);

  Object.assign(book, updateBody);

  await book.save();

  return book;
};

// ==========================================
// DELETE
// ==========================================

const deleteWeaverSalesPurchaseBookMasterById = async (id) => {
  const book = await getWeaverSalesPurchaseBookMasterById(id);

  await book.deleteOne();

  return book;
};

module.exports = {
  createWeaverSalesPurchaseBookMaster,
  queryWeaverSalesPurchaseBookMaster,
  getWeaverSalesPurchaseBookMasterById,
  searchWeaverSalesPurchaseBookMaster,
  bulkUpload,
  updateWeaverSalesPurchaseBookMasterById,
  deleteWeaverSalesPurchaseBookMasterById,
};
