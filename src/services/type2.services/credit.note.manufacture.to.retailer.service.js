const httpStatus = require('http-status');
const { MtoRCreditNote, Retailer, Manufacture, MtoRWallet } = require('../../models');
const ApiError = require('../../utils/ApiError');

/**
 * Bulk upload HSN GST records (allowing duplicates)
 * @param {Array<Object>} dataArray
 * @returns {Promise<Array<HsnGst>>}
 */
const bulkUploadMtoRCreditNote = async (dataArray) => {
  const results = await MtoRCreditNote.insertMany(dataArray, { ordered: false });
  return results;
};
/**
 * Create a MtoRCreditNote with unique creditNoteNumber per manufacturer
 * AND update MtoRWallet (credit entry)
 * @param {Object} reqBody
 * @returns {Promise<MtoRCreditNote>}
 */
const createMtoRCreditNote = async (reqBody) => {
  const { manufacturerEmail, retailerEmail, totalCreditAmount } = reqBody;

  if (!manufacturerEmail) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "'manufacturerEmail' is required to generate credit note number."
    );
  }

  if (!retailerEmail) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "'retailerEmail' is required to update wallet."
    );
  }

  if (!totalCreditAmount || totalCreditAmount <= 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "'totalCreditAmount' must be a positive number to create a credit note."
    );
  }

  // 1️⃣ Get last credit note for this manufacturer to generate next number
  const lastCreditNote = await MtoRCreditNote.findOne({ manufacturerEmail })
    .sort({ creditNoteNumber: -1 }) // highest number first
    .lean();

  let nextNumber = 1;
  if (lastCreditNote && lastCreditNote.creditNoteNumber) {
    nextNumber = lastCreditNote.creditNoteNumber + 1;
  }

  reqBody.creditNoteNumber = nextNumber;

  // 2️⃣ Create the credit note
  const creditNote = await MtoRCreditNote.create(reqBody);

  // 3️⃣ Fetch / Create Wallet entry for (manufacturerEmail + retailerEmail)
  let wallet = await MtoRWallet.findOne({
    manufacturerEmail: creditNote.manufacturerEmail,
    retailerEmail: creditNote.retailerEmail,
  });

  // If wallet not exists -> create new wallet
  if (!wallet) {
    wallet = await MtoRWallet.create({
      manufacturerEmail: creditNote.manufacturerEmail,
      retailerEmail: creditNote.retailerEmail,
      balance: 0,
      totalCredited: 0,
      totalDebited: 0,
      currency: 'INR',
      transactions: [],
    });
  } else {
    // 3️⃣.a Recalculate balance, totalCredited, totalDebited from existing transactions
    let recomputedBalance = 0;
    let recomputedTotalCredited = 0;
    let recomputedTotalDebited = 0;

    if (Array.isArray(wallet.transactions) && wallet.transactions.length > 0) {
      wallet.transactions.forEach((tx) => {
        if (tx.type === 'credit') {
          recomputedBalance += tx.amount;
          recomputedTotalCredited += tx.amount;
        } else if (tx.type === 'debit') {
          recomputedBalance -= tx.amount;
          recomputedTotalDebited += tx.amount;
        }
      });
    }

    // overwrite with recomputed safe values
    wallet.balance = recomputedBalance;
    wallet.totalCredited = recomputedTotalCredited;
    wallet.totalDebited = recomputedTotalDebited;
  }

  const creditAmount = creditNote.totalCreditAmount;
  const newBalance = wallet.balance + creditAmount;

  // 🧾 Build description including invoiceNumber + returnOrderNumber
  let description = `Credit Note #${creditNote.creditNoteNumber} generated`;

  const inv = creditNote.invoiceNumber;
  const ret = creditNote.returnOrderNumber;

  if (inv && ret) {
    description = `Credit Note #${creditNote.creditNoteNumber} generated for Return Order #${ret} against Invoice #${inv}`;
  } else if (ret) {
    description = `Credit Note #${creditNote.creditNoteNumber} generated for Return Order #${ret}`;
  } else if (inv) {
    description = `Credit Note #${creditNote.creditNoteNumber} generated against Invoice #${inv}`;
  }

  // 4️⃣ Build transaction object according to your schema
  const transaction = {
    type: 'credit',
    amount: creditAmount,
    balanceAfter: newBalance,
    creditNoteNumber: creditNote.creditNoteNumber,
    creditInvoiceNumber: creditNote.invoiceNumber || null,
    debitInvoiceNumber: null,
    description,
    createdAt: new Date(),
  };

  // 5️⃣ Push transaction and update wallet numbers
  wallet.transactions.push(transaction);
  wallet.balance = newBalance;
  wallet.totalCredited += creditAmount;

  await wallet.save();

  return creditNote;
};


/**
 * Query for MtoRCreditNote
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryMtoRCreditNote = async (filter, options) => {
  const mtoRCreditNote = await MtoRCreditNote.paginate(filter, options);
  return mtoRCreditNote;
};

const groupMtoRCreditNote = async (query) => {
  const { retailerEmail, manufacturerEmail, used, page = 1, limit = 10 } = query;

  if (!retailerEmail && !manufacturerEmail) {
    throw new Error("Either retailerEmail or manufacturerEmail must be provided");
  }

  if (used !== "true" && used !== "false") {
    throw new Error("Query parameter 'used' must be 'true' or 'false'");
  }

  const usedBool = used === "true";
  const matchStage = retailerEmail
    ? { retailerEmail, used: usedBool }
    : { manufacturerEmail, used: usedBool };
  const groupByField = retailerEmail ? "$manufacturerEmail" : "$retailerEmail";

  const skip = (Number(page) - 1) * Number(limit);

  // ✅ Aggregation to group & summarize
  const pipeline = [
    { $match: matchStage },
    {
      $group: {
        _id: groupByField,
        totalCreditNotes: { $sum: 1 },
        totalCreditAmount: { $sum: "$totalCreditAmount" },
      },
    },
    { $sort: { _id: 1 } },
    { $skip: skip },
    { $limit: Number(limit) },
  ];

  const grouped = await MtoRCreditNote.aggregate(pipeline);
  const totalCount = await MtoRCreditNote.aggregate([
    { $match: matchStage },
    { $group: { _id: groupByField } },
    { $count: "count" },
  ]);

  const total = totalCount[0]?.count || 0;

  // ✅ Enrich grouped data with basic profile info
  const enriched = await Promise.all(
    grouped.map(async (group) => {
      const groupKeyEmail = group._id;

      let manufacturerData = null;
      let retailerData = null;

      if (retailerEmail) {
        // grouped by manufacturerEmail
        manufacturerData = await Manufacture.findOne(
          { email: groupKeyEmail },
          { fullName: 1, email: 1, companyName: 1, mobileNumber: 1, _id: 0 }
        ).lean();
        retailerData = await Retailer.findOne(
          { email: retailerEmail },
          { fullName: 1, email: 1, companyName: 1, mobileNumber: 1, _id: 0 }
        ).lean();
      } else {
        // grouped by retailerEmail
        retailerData = await Retailer.findOne(
          { email: groupKeyEmail },
          { fullName: 1, email: 1, companyName: 1, mobileNumber: 1, _id: 0 }
        ).lean();
        manufacturerData = await Manufacture.findOne(
          { email: manufacturerEmail },
          { fullName: 1, email: 1, companyName: 1, mobileNumber: 1, _id: 0 }
        ).lean();
      }

      return {
        groupKey: group._id,
        used: usedBool,
        totalCreditNotes: group.totalCreditNotes,
        totalCreditAmount: group.totalCreditAmount,
        manufacturer: manufacturerData || null,
        retailer: retailerData || null,
      };
    })
  );

  return {
    page: Number(page),
    limit: Number(limit),
    totalCount: total,
    totalPages: Math.ceil(total / limit),
    data: enriched,
  };
};
/**
 * Get MtoRCreditNote by id
 * @param {ObjectId} id
 * @returns {Promise<MtoRCreditNote>}
 */
const getMtoRCreditNoteById = async (id) => {
  return MtoRCreditNote.findById(id);
};

/**
 * Update MtoRCreditNote by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<MtoRCreditNote>}
 */
const updateMtoRCreditNoteById = async (id, updateBody) => {
  const mtoRCreditNote = await getMtoRCreditNoteById(id);
  if (!mtoRCreditNote) {
    throw new ApiError(httpStatus.NOT_FOUND, 'mtoRCreditNote not found');
  }
  Object.assign(mtoRCreditNote, updateBody);
  await mtoRCreditNote.save();
  return mtoRCreditNote;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<MtoRCreditNote>}
 */
const deleteMtoRCreditNoteById = async (id) => {
  const mtoRCreditNote = await getMtoRCreditNoteById(id);
  if (!mtoRCreditNote) {
    throw new ApiError(httpStatus.NOT_FOUND, 'mtoRCreditNote not found');
  }
  await mtoRCreditNote.remove();
  return mtoRCreditNote;
};

const bulkUpdateCreditNotes = async (creditNotes) => {
  if (!Array.isArray(creditNotes) || creditNotes.length === 0) {
    throw new Error('Invalid request: creditNotes array required');
  }

  const ids = creditNotes.map((note) => note.id);

  const bulkOps = creditNotes.map((note) => ({
    updateOne: {
      filter: { _id: note.id },
      update: {
        $set: {
          used: note.used,
          usedInInvoiceId: note.usedInInvoiceId || null,
          usedInInvoiceNumber: note.usedInInvoiceNumber || null,
          usedAt: note.used ? note.usedAt || new Date() : null,
        },
      },
    },
  }));

  // Perform bulk update
  await MtoRCreditNote.bulkWrite(bulkOps, { ordered: false });

  // Fetch updated documents
  const updatedDocs = await MtoRCreditNote.find({ _id: { $in: ids } });

  return updatedDocs;
};

module.exports = {
  createMtoRCreditNote,
  queryMtoRCreditNote,
  getMtoRCreditNoteById,
  updateMtoRCreditNoteById,
  deleteMtoRCreditNoteById,
  bulkUploadMtoRCreditNote,
  groupMtoRCreditNote,
  bulkUpdateCreditNotes,
};
